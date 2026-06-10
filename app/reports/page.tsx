import ReportsContent, { type MonthlyReport } from "@/components/reports-content";
import { getAllIncidents } from "@/lib/data";
import { TAXONOMY } from "@/lib/constants";
import type { Incident } from "@/lib/types";

const MAX_REPORTS = 8;

function monthKey(date: string) {
  return date.slice(0, 7);
}

function nextMonth(month: string) {
  const [year, rawMonth] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, rawMonth, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function previousMonth(month: string) {
  const [year, rawMonth] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, rawMonth - 2, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function publishDate(month: string) {
  return `${nextMonth(month)}-01`;
}

function monthLabel(month: string, zh: boolean) {
  const [year, rawMonth] = month.split("-");
  const monthNumber = Number(rawMonth);
  if (zh) return `${year} 年 ${monthNumber} 月`;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
}

function countBy<T extends string>(items: Incident[], pick: (incident: Incident) => T) {
  return items.reduce<Record<T, number>>((acc, item) => {
    const key = pick(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function topEntries(counts: Record<string, number>, limit = 4) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function scenarioName(code: string, zh: boolean) {
  const category = TAXONOMY.find((item) =>
    item.subScenarios.some((scenario) => scenario.id === code)
  );
  const scenario = category?.subScenarios.find((item) => item.id === code);
  return scenario ? (zh ? scenario.name_cn : scenario.name_en) : code;
}

function makeInsight(reportIncidents: Incident[], previousIncidents: Incident[]) {
  const currentScenarios = topEntries(
    countBy(reportIncidents, (incident) => incident.scenario.primary),
    1
  )[0];
  const operatorCounts = topEntries(countBy(reportIncidents, (incident) => incident.operator));
  const topOperatorCount = operatorCounts[0]?.count ?? 0;
  const topOperatorNames = operatorCounts
    .filter((operator) => operator.count === topOperatorCount)
    .map((operator) => operator.name);
  const severeCount = reportIncidents.filter((incident) =>
    ["S3", "S4"].includes(incident.severity)
  ).length;
  const delta = reportIncidents.length - previousIncidents.length;

  if (!reportIncidents.length) {
    return {
      zh: "本期事件库暂无新增记录，需结合公开数据滞后判断，不能直接解释为真实运营风险下降。",
      en: "No new records were available in the incident database for this issue; public-reporting lag means this should not be read as a real-world risk decline.",
    };
  }

  if (severeCount > 0) {
    return {
      zh: `本期出现 ${severeCount} 起 S3/S4 高严重度事件，月报重点应从单车碰撞转向远程运营韧性和应急兜底。`,
      en: `${severeCount} S3/S4 high-severity incident(s) appear in this issue, shifting the focus from isolated crashes to remote-operations resilience and emergency fallback.`,
    };
  }

  if (currentScenarios) {
    const operatorPhraseZh = topOperatorNames.length
      ? topOperatorNames.join("、")
      : "头部运营商";
    const operatorPhraseEn = topOperatorNames.length
      ? topOperatorNames.join(", ")
      : "leading operators";

    return {
      zh: `本期最高频场景为“${scenarioName(currentScenarios.name, true)}”（${currentScenarios.count} 起），主要来自 ${operatorPhraseZh} 的公开记录。`,
      en: `The most frequent scenario is ${scenarioName(currentScenarios.name, false)} (${currentScenarios.count} records), mainly from public records by ${operatorPhraseEn}.`,
    };
  }

  return {
    zh: `本期较上一期${delta >= 0 ? "增加" : "减少"} ${Math.abs(delta)} 起记录，建议继续观察公开报告滞后和运营商披露口径。`,
    en: `This issue is ${Math.abs(delta)} record(s) ${delta >= 0 ? "above" : "below"} the previous issue; reporting lag and operator disclosure scope remain important caveats.`,
  };
}

function buildReport(month: string, incidents: Incident[]): MonthlyReport {
  const reportIncidents = incidents.filter((incident) => monthKey(incident.date) === month);
  const previous = incidents.filter((incident) => monthKey(incident.date) === previousMonth(month));
  const sortedBySeverity = [...reportIncidents].sort(
    (a, b) =>
      Number(b.severity.slice(1)) - Number(a.severity.slice(1)) ||
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    month,
    title: {
      zh: `${monthLabel(month, true)}月报`,
      en: `${monthLabel(month, false)} Report`,
    },
    publishedAt: publishDate(month),
    incidentCount: reportIncidents.length,
    previousIncidentCount: previous.length,
    operators: topEntries(countBy(reportIncidents, (incident) => incident.operator)),
    severities: topEntries(countBy(reportIncidents, (incident) => incident.severity), 5),
    scenarios: topEntries(
      countBy(reportIncidents, (incident) => incident.scenario.primary)
    ).map((entry) => ({
      code: entry.name,
      count: entry.count,
      label: {
        zh: scenarioName(entry.name, true),
        en: scenarioName(entry.name, false),
      },
    })),
    keyIncidents: sortedBySeverity.slice(0, 3),
    insight: makeInsight(reportIncidents, previous),
  };
}

export default function ReportsPage() {
  const incidents = getAllIncidents();
  const months = Array.from(new Set(incidents.map((incident) => monthKey(incident.date))))
    .sort()
    .reverse()
    .slice(0, MAX_REPORTS);
  const reports = months.map((month) => buildReport(month, incidents));
  const latestDate = incidents
    .map((incident) => incident.date)
    .sort()
    .at(-1);

  return (
    <ReportsContent
      reports={reports}
      latestDataDate={latestDate ?? null}
      totalIncidents={incidents.length}
    />
  );
}
