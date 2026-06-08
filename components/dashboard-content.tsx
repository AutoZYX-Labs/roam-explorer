"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n";
import type { Incident, DashboardStats } from "@/lib/types";
import StatCard from "./stat-card";
import IncidentCard from "./incident-card";
import SeverityChart from "./charts/severity-chart";
import TimelineChart from "./charts/timeline-chart";
import OperatorChart from "./charts/operator-chart";
import ScenarioChart from "./charts/scenario-chart";
import Link from "next/link";

const IncidentMap = dynamic(() => import("./incident-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-center">
      <p className="text-[var(--muted)] text-sm">地图加载中...</p>
    </div>
  ),
});

export default function DashboardContent({
  stats,
  recent,
  allIncidents,
}: {
  stats: DashboardStats;
  recent: Incident[];
  allIncidents: Incident[];
}) {
  const { t, lang } = useI18n();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">{t("dash.title")}</h1>
        <p className="text-[var(--muted)]">{t("dash.desc")}</p>
      </div>

      {/* Ask ROAM hero CTA */}
      <Link
        href="/ask"
        className="block rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/5 p-5 mb-8 hover:from-[var(--accent)]/15 hover:to-[var(--accent)]/10 transition-all no-underline group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-semibold text-[var(--text)] mb-1">
                {lang === "zh" ? "试试 Ask ROAM — AI 智能问答" : "Try Ask ROAM — AI Assistant"}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {lang === "zh"
                  ? `用自然语言查询 ${stats.totalIncidents} 条事件库、${stats.totalScenarios} 个场景分类、参考架构与 KPI。中英文均可。`
                  : `Query ${stats.totalIncidents} incidents, ${stats.totalScenarios} scenarios, architecture & KPIs in plain English or Chinese.`}
              </p>
            </div>
          </div>
          <span className="text-[var(--accent)] font-medium text-sm whitespace-nowrap group-hover:translate-x-1 transition-transform">
            {lang === "zh" ? "开始提问 →" : "Start asking →"}
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={t("dash.totalIncidents")} value={stats.totalIncidents} />
        <StatCard label={t("dash.operators")} value={stats.totalOperators} />
        <StatCard label={t("dash.scenarioTypes")} value={stats.totalScenarios} />
        <StatCard label={t("dash.coverage")} value={stats.yearRange} sub={t("dash.years")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <SeverityChart data={stats.bySeverity} />
        <TimelineChart data={stats.byYear} />
        <OperatorChart data={stats.byOperator} />
        <ScenarioChart data={stats.byCategory} />
      </div>

      {/* Map section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">{lang === "zh" ? "事件地图" : "Incident Map"}</h2>
          <Link href="/map" className="text-sm text-[var(--accent)] hover:underline no-underline">
            {lang === "zh" ? "全屏地图 →" : "Full map →"}
          </Link>
        </div>
        <div className="h-[400px] rounded-xl border border-[var(--border)] overflow-hidden">
          <IncidentMap incidents={allIncidents} compact />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">{t("dash.recent")}</h2>
        <Link href="/incidents" className="text-sm text-[var(--accent)] hover:underline no-underline">
          {t("dash.viewAll")} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recent.map((inc) => (
          <IncidentCard key={inc.id} incident={inc} />
        ))}
      </div>
    </div>
  );
}
