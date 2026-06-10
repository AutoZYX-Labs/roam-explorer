"use client";

import { SEVERITY_CONFIG } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function SeverityBadge({ severity }: { severity: string }) {
  const { lang } = useI18n();
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.S0;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
      {severity} &middot; {lang === "zh" ? config.cn : config.label}
    </span>
  );
}
