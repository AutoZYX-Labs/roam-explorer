import { getAllIncidents } from "./data";
import { TAXONOMY, KPIS, LAYER_CONFIG } from "./constants";

export function buildSystemContext(): string {
  const incidents = getAllIncidents();

  const incidentSummaries = incidents
    .map(
      (inc) =>
        `[${inc.id}] ${inc.date} | ${inc.operator} | ${inc.location.city} | ${inc.severity}${inc.urgency ? "/" + inc.urgency : ""} | Scenario: ${inc.scenario.primary}${inc.scenario.secondary?.length ? "+" + inc.scenario.secondary.join("+") : ""}
EN: ${inc.description.trim().substring(0, 300)}
CN: ${inc.description_cn?.trim().substring(0, 300) || "(no Chinese translation)"}${inc.root_cause ? `\nRoot cause (EN): ${inc.root_cause.description}\nRoot cause (CN): ${inc.root_cause.description_cn || "(no Chinese)"}` : ""}${inc.systemic_issues?.length ? "\nSystemic (EN): " + inc.systemic_issues.join("; ") : ""}${inc.systemic_issues_cn?.length ? "\nSystemic (CN): " + inc.systemic_issues_cn.join("; ") : ""}`
    )
    .join("\n\n");

  const taxonomySummary = TAXONOMY.map(
    (cat) =>
      `## ${cat.code}. ${cat.name_en} (${cat.name_cn})\n${cat.description}\n${cat.subScenarios
        .map(
          (s) =>
            `- ${s.id}: ${s.name_en} (${s.name_cn}) — Layer ${s.primaryLayer}${s.escalationLayer ? " → L" + s.escalationLayer : ""}: ${s.description}`
        )
        .join("\n")}`
  ).join("\n\n");

  const layerSummary = Object.entries(LAYER_CONFIG)
    .map(
      ([n, c]) =>
        `Layer ${n}: ${c.name} (${c.cn}) — Target: ${c.target}, Latency: ${c.latency}`
    )
    .join("\n");

  const kpiSummary = KPIS.map(
    (k) => `KPI ${k.number}: ${k.name} — ${k.definition} Target: ${k.target}`
  ).join("\n");

  return `You are ROAM Explorer's AI assistant — an expert on L4 remote operations incidents and safety.

CRITICAL LANGUAGE RULE:
- If the user asks in Chinese, respond ENTIRELY in Chinese. Use the CN fields from the database.
- If the user asks in English, respond ENTIRELY in English. Use the EN fields from the database.
- Never mix languages in a single response.

You answer questions based ONLY on the ROAM database below. If the answer is not in the data, say so honestly.
Be concise, cite incident IDs (e.g. ROAM-2026-001) when relevant, and use the scenario taxonomy codes (e.g. C5, B1).

## THREE-LAYER ARCHITECTURE
${layerSummary}

## SCENARIO TAXONOMY (6 categories, 27 sub-scenarios)
${taxonomySummary}

## KPI DEFINITIONS
${kpiSummary}

## INCIDENT DATABASE (${incidents.length} records, bilingual EN/CN)
${incidentSummaries}`;
}
