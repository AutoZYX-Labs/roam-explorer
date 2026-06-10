"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Incident } from "@/lib/types";
import IncidentCard from "@/components/incident-card";

export interface MonthlyReport {
  month: string;
  title: { zh: string; en: string };
  publishedAt: string;
  incidentCount: number;
  previousIncidentCount: number;
  operators: { name: string; count: number }[];
  severities: { name: string; count: number }[];
  scenarios: { code: string; count: number; label: { zh: string; en: string } }[];
  keyIncidents: Incident[];
  insight: { zh: string; en: string };
}

const severityLabel: Record<string, { zh: string; en: string }> = {
  S0: { zh: "未遂", en: "Near-miss" },
  S1: { zh: "轻微", en: "Minor" },
  S2: { zh: "中等", en: "Moderate" },
  S3: { zh: "严重", en: "Severe" },
  S4: { zh: "致命", en: "Critical" },
};

function formatDate(date: string, zh: boolean) {
  if (zh) {
    const [year, month, day] = date.split("-");
    return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function deltaText(current: number, previous: number, zh: boolean) {
  const delta = current - previous;
  if (delta === 0) return zh ? "与上期持平" : "Flat vs previous issue";
  if (delta > 0) return zh ? `较上期增加 ${delta} 起` : `Up ${delta} vs previous issue`;
  return zh ? `较上期减少 ${Math.abs(delta)} 起` : `Down ${Math.abs(delta)} vs previous issue`;
}

function topOperatorText(report: MonthlyReport, zh: boolean) {
  const topCount = report.operators[0]?.count ?? 0;
  const names = report.operators
    .filter((operator) => operator.count === topCount)
    .map((operator) => operator.name);

  if (!names.length) return zh ? "暂无新增公开记录" : "No new public records";
  if (names.length === 1) return zh ? `最高频：${names[0]}` : `Top: ${names[0]}`;
  return zh ? `并列最高：${names.join("、")}` : `Tied: ${names.join(", ")}`;
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="border-t border-[var(--border)] pt-4">
      <p className="text-2xl font-semibold text-[var(--accent)]">{value}</p>
      <p className="text-sm text-[var(--text)] mt-1">{label}</p>
      {sub && <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}

function RankedList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { name: string; count: number }[];
  empty: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--muted)] truncate">{item.name}</span>
              <span className="font-medium text-[var(--text)]">{item.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">{empty}</p>
      )}
    </div>
  );
}

export default function ReportsContent({
  reports,
  latestDataDate,
  totalIncidents,
}: {
  reports: MonthlyReport[];
  latestDataDate: string | null;
  totalIncidents: number;
}) {
  const { lang } = useI18n();
  const zh = lang === "zh";
  const latest = reports[0];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">
          {zh ? "ROAM 月度报告" : "ROAM Monthly Reports"}
        </h1>
        <p className="text-[var(--muted)] leading-relaxed">
          {zh
            ? "基于 ROAM 事件库自动生成的月度运营异常简报，覆盖新增事件、严重度结构、运营商分布、场景变化和重点案例。"
            : "Auto-generated monthly briefings from the ROAM incident database, covering new records, severity mix, operator distribution, scenario shifts, and key cases."}
        </p>
      </div>

      {latest && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-[var(--card-shadow)] mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-[var(--accent)] font-medium mb-2">
                {zh ? "最新已发布" : "Latest issue"}
              </p>
              <h2 className="text-2xl mb-2">{zh ? latest.title.zh : latest.title.en}</h2>
              <p className="text-sm text-[var(--muted)]">
                {zh ? "发布日期" : "Published"}: {formatDate(latest.publishedAt, zh)}
              </p>
            </div>
            <Link
              href="/subscribe"
              className="inline-flex justify-center rounded-lg bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 no-underline"
            >
              {zh ? "订阅后续月报" : "Subscribe"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <Metric
              label={zh ? "本期新增记录" : "New records"}
              value={latest.incidentCount}
              sub={deltaText(latest.incidentCount, latest.previousIncidentCount, zh)}
            />
            <Metric
              label={zh ? "涉及运营商" : "Operators covered"}
              value={latest.operators.length}
              sub={topOperatorText(latest, zh)}
            />
            <Metric
              label={zh ? "最高频场景" : "Top scenario"}
              value={latest.scenarios[0]?.code ?? "-"}
              sub={latest.scenarios[0] ? (zh ? latest.scenarios[0].label.zh : latest.scenarios[0].label.en) : undefined}
            />
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-white/50 px-4 py-3 mb-6">
            <p className="text-sm leading-relaxed text-[var(--text)]">
              {zh ? latest.insight.zh : latest.insight.en}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RankedList
              title={zh ? "运营商分布" : "Operator distribution"}
              items={latest.operators}
              empty={zh ? "本期暂无新增记录" : "No new records"}
            />
            <RankedList
              title={zh ? "严重度结构" : "Severity mix"}
              items={latest.severities.map((item) => ({
                name: `${item.name} · ${severityLabel[item.name]?.[zh ? "zh" : "en"] ?? item.name}`,
                count: item.count,
              }))}
              empty={zh ? "本期暂无新增记录" : "No new records"}
            />
            <RankedList
              title={zh ? "场景分布" : "Scenario mix"}
              items={latest.scenarios.map((item) => ({
                name: `${item.code} · ${zh ? item.label.zh : item.label.en}`,
                count: item.count,
              }))}
              empty={zh ? "本期暂无新增记录" : "No new records"}
            />
          </div>
        </section>
      )}

      {latest?.keyIncidents.length ? (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">{zh ? "本期重点事件" : "Key incidents"}</h2>
            <Link href="/incidents" className="text-sm text-[var(--accent)] hover:underline no-underline">
              {zh ? "查看事件库 →" : "View database →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latest.keyIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-10">
        <h2 className="text-xl mb-4">{zh ? "月报归档" : "Report archive"}</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <article
              key={report.month}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-5 py-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">
                    {zh ? report.title.zh : report.title.en}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {zh ? "发布" : "Published"} {formatDate(report.publishedAt, zh)} ·{" "}
                    {zh ? `${report.incidentCount} 起新增记录` : `${report.incidentCount} new record(s)`}
                  </p>
                </div>
                <p className="text-sm text-[var(--muted)] md:text-right">
                  {report.scenarios[0]
                    ? `${report.scenarios[0].code} · ${zh ? report.scenarios[0].label.zh : report.scenarios[0].label.en}`
                    : zh
                      ? "暂无新增公开记录"
                      : "No new public records"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
        <h2 className="text-xl mb-3">{zh ? "数据口径" : "Data notes"}</h2>
        <ul className="list-disc list-inside text-sm space-y-2 text-[var(--muted)]">
          <li>
            {zh
              ? `当前事件库共 ${totalIncidents} 条结构化记录。`
              : `The current incident database contains ${totalIncidents} structured records.`}
          </li>
          {latestDataDate && (
            <li>
              {zh
                ? `最近一条公开记录日期为 ${formatDate(latestDataDate, zh)}。`
                : `The latest public record date is ${formatDate(latestDataDate, zh)}.`}
            </li>
          )}
          <li>
            {zh
              ? "DMV、NHTSA、运营商披露和新闻报道存在公开滞后，月报反映的是 ROAM 已收录数据，不等同于真实世界全量事件。"
              : "DMV, NHTSA, operator disclosures, and news reports can lag; reports reflect ROAM-ingested records, not the complete real-world event population."}
          </li>
        </ul>
      </section>
    </div>
  );
}
