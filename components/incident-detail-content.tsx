"use client";

import type { Incident } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import SeverityBadge from "./severity-badge";
import UrgencyBadge from "./urgency-badge";
import ScenarioTag from "./scenario-tag";
import Link from "next/link";
import { generateGbImmediateReport } from "@/lib/gb-report";
import {
  getEmergencyResponseDisplay,
  getImpactDisplay,
  getIncidentDescription,
  getIncidentTitle,
  getLocationParts,
  getContributorDisplay,
  getSourceTitle,
} from "@/lib/localized-incident";

export default function IncidentDetailContent({
  incident,
}: {
  incident: Incident;
}) {
  const { t, lang } = useI18n();
  const zh = lang === "zh";

  const section = "mb-6";
  const sectionTitle =
    "text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-2";

  const desc = getIncidentDescription(incident, zh);
  const location = getLocationParts(incident.location, zh);
  const impactDisplay = getImpactDisplay(incident.impact, zh);
  const emergencyDisplay = getEmergencyResponseDisplay(
    incident.emergency_response,
    zh,
  );

  const rootCategory = zh && incident.root_cause?.category_cn
    ? incident.root_cause.category_cn
    : zh && incident.root_cause?.category
      ? "根因类别待人工中文校核"
      : incident.root_cause?.category;

  const rootDesc = zh && incident.root_cause?.description_cn
    ? incident.root_cause.description_cn
    : zh && incident.root_cause?.description
      ? "根因描述尚未完成人工中文校核；可切换到 EN 查看英文原文。"
      : incident.root_cause?.description;

  const systemicList = zh
    ? incident.systemic_issues_cn?.length
      ? incident.systemic_issues_cn
      : incident.systemic_issues?.length
        ? ["系统性问题尚未完成人工中文校核；可切换到 EN 查看英文原文。"]
        : undefined
    : incident.systemic_issues;

  const regAction = zh && incident.regulatory_action_cn
    ? incident.regulatory_action_cn.trim()
    : zh && incident.regulatory_action
      ? "监管行动尚未完成人工中文校核；可切换到 EN 查看英文原文。"
      : incident.regulatory_action?.trim();

  function downloadGbReport() {
    const md = generateGbImmediateReport(incident);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${incident.id}-GB-T-immediate-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <Link
          href="/incidents"
          className="text-sm text-[var(--accent)] hover:underline no-underline"
        >
          &larr; {t("inc.back")}
        </Link>
        <button
          onClick={downloadGbReport}
          className="text-xs rounded-lg border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--card-bg)] px-3 py-1.5 cursor-pointer transition-colors"
          title={zh ? "下载符合 GB/T 附录 C 格式的立即报告模板" : "Download GB/T Appendix C immediate-report template"}
        >
          📄 {zh ? "导出 GB/T 立即报告" : "Export GB/T Report"}
        </button>
      </div>

      <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-mono text-[var(--muted)]">
              {incident.id}
            </span>
            <h1 className="text-2xl mt-1">
              {getIncidentTitle(incident, zh)}
            </h1>
          </div>
          <div className="text-right text-sm text-[var(--muted)]">
            <div>{incident.date}</div>
            {incident.time && <div>{incident.time}</div>}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <SeverityBadge severity={incident.severity} />
          {incident.urgency && <UrgencyBadge urgency={incident.urgency} />}
          <ScenarioTag code={incident.scenario.primary} />
          {incident.scenario.secondary?.map((s) => (
            <ScenarioTag key={s} code={s} />
          ))}
        </div>

        {/* Location */}
        <div className={section}>
          <h3 className={sectionTitle}>{t("detail.location")}</h3>
          <p className="text-sm">
            {location.city}
            {location.roadType && ` \u2014 ${location.roadType}`}
          </p>
          {location.specific && (
            <p className="text-sm text-[var(--muted)]">
              {location.specific}
            </p>
          )}
        </div>

        {/* Description */}
        <div className={section}>
          <h3 className={sectionTitle}>{t("detail.description")}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{desc}</p>
        </div>

        {/* Impact */}
        {incident.impact && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.impact")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {incident.impact.vehicles_affected != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.vehicles")}</p>
                  <p className="font-semibold">{incident.impact.vehicles_affected}</p>
                </div>
              )}
              {incident.impact.duration_minutes != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.duration")}</p>
                  <p className="font-semibold">{incident.impact.duration_minutes} {t("common.min")}</p>
                </div>
              )}
              {incident.impact.injuries != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.injuries")}</p>
                  <p className="font-semibold">{incident.impact.injuries}</p>
                </div>
              )}
              {incident.impact.fatalities != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.fatalities")}</p>
                  <p className="font-semibold">{incident.impact.fatalities}</p>
                </div>
              )}
            </div>
            {impactDisplay.trafficDisruption && (
              <p className="text-sm mt-2 text-[var(--muted)]">
                {t("detail.traffic")}: {impactDisplay.trafficDisruption}
              </p>
            )}
          </div>
        )}

        {/* Emergency Response */}
        {incident.emergency_response && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.emergency")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {emergencyDisplay.sosButton && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.sos")}: </span>
                  {emergencyDisplay.sosButton}
                </div>
              )}
              {emergencyDisplay.customerService && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.customerService")}: </span>
                  {emergencyDisplay.customerService}
                </div>
              )}
              {emergencyDisplay.remoteIntervention && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.remoteIntervention")}: </span>
                  {emergencyDisplay.remoteIntervention}
                </div>
              )}
              {emergencyDisplay.onSiteResponse && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.onSite")}: </span>
                  {emergencyDisplay.onSiteResponse}
                </div>
              )}
            </div>
            {emergencyDisplay.resolutionMethod && (
              <p className="text-sm mt-2">
                <span className="text-[var(--muted)]">{t("detail.resolution")}: </span>
                {emergencyDisplay.resolutionMethod}
              </p>
            )}
          </div>
        )}

        {/* Root Cause */}
        {incident.root_cause && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.rootCause")}</h3>
            <p className="text-sm font-medium">{rootCategory}</p>
            <p className="text-sm text-[var(--muted)] mt-1">{rootDesc}</p>
            <p className="text-xs mt-1">
              {incident.root_cause.confirmed
                ? `\u2705 ${t("detail.confirmed")}`
                : `\u26a0\ufe0f ${t("detail.unconfirmed")}`}
            </p>
          </div>
        )}

        {/* Systemic Issues */}
        {systemicList && systemicList.length > 0 && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.systemic")}</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-[var(--muted)]">
              {systemicList.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Regulatory Action */}
        {regAction && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.regulatory")}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{regAction}</p>
          </div>
        )}

        {/* Sources */}
        {incident.sources && incident.sources.length > 0 && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.sources")}</h3>
            <ul className="space-y-1">
              {incident.sources.map((src, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    {getSourceTitle(src, zh)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] flex flex-wrap gap-4">
          {incident.contributor && <span>{zh ? "贡献者" : "Contributor"}: {getContributorDisplay(incident.contributor, zh)}</span>}
          {incident.last_updated && <span>{zh ? "更新时间" : "Updated"}: {incident.last_updated}</span>}
        </div>
      </div>
    </div>
  );
}
