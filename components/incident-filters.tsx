"use client";

import { useState, useMemo } from "react";
import type { Incident } from "@/lib/types";
import IncidentCard from "./incident-card";
import { useI18n } from "@/lib/i18n";
import {
  getIncidentDescription,
  getIncidentTitle,
  localizeOperator,
} from "@/lib/localized-incident";

export default function IncidentFilters({ incidents }: { incidents: Incident[] }) {
  const { t, lang } = useI18n();
  const zh = lang === "zh";
  const [search, setSearch] = useState("");
  const [operator, setOperator] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [tier, setTier] = useState<string>("1"); // default: show only curated
  const [level, setLevel] = useState<string>("");

  const operators = useMemo(() => [...new Set(incidents.map((i) => i.operator))].sort(), [incidents]);
  const years = useMemo(() => [...new Set(incidents.map((i) => i.date.substring(0, 4)))].sort(), [incidents]);

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (tier === "1" && inc.tier !== 1) return false;
      if (tier === "2" && inc.tier !== 2) return false;
      if (search) {
        const query = search.toLowerCase();
        const searchable = [
          inc.id,
          inc.description,
          inc.description_cn,
          inc.operator,
          localizeOperator(inc.operator, true),
          inc.location?.city,
          getIncidentTitle(inc, true),
          getIncidentDescription(inc, true),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      if (operator && inc.operator !== operator) return false;
      if (severity && inc.severity !== severity) return false;
      if (category && inc.scenario.primary.charAt(0) !== category) return false;
      if (year && !inc.date.startsWith(year)) return false;
      if (level && inc.driving_automation_level !== level) return false;
      return true;
    });
  }, [incidents, search, operator, severity, category, year, tier, level]);

  const selClass = "rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder={t("inc.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${selClass} flex-1 min-w-[180px]`}
        />
        <select value={operator} onChange={(e) => setOperator(e.target.value)} className={selClass}>
          <option value="">{t("inc.allOperators")}</option>
          {operators.map((o) => <option key={o} value={o}>{localizeOperator(o, zh)}</option>)}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selClass}>
          <option value="">{t("inc.allSeverity")}</option>
          {["S0", "S1", "S2", "S3", "S4"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selClass}>
          <option value="">{t("inc.allCategories")}</option>
          {["A", "B", "C", "D", "E", "F"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selClass}>
          <option value="">{t("inc.allYears")}</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className={selClass}>
          <option value="1">{lang === "zh" ? "精选案例（Tier 1）" : "Curated (Tier 1)"}</option>
          <option value="2">{lang === "zh" ? "DMV 报告（Tier 2）" : "DMV Reports (Tier 2)"}</option>
          <option value="">{lang === "zh" ? "全部层级" : "All Tiers"}</option>
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={selClass}>
          <option value="">{lang === "zh" ? "全部自动化级别" : "All Levels"}</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="L4">L4</option>
        </select>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        {filtered.length} {t("inc.found")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inc) => (
          <IncidentCard key={inc.id} incident={inc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted)] py-12">
          {t("inc.noMatch")}
        </p>
      )}
    </div>
  );
}
