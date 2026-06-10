"use client";

import { URGENCY_CONFIG } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function UrgencyBadge({ urgency }: { urgency: string }) {
  const { lang } = useI18n();
  const config = URGENCY_CONFIG[urgency] ?? URGENCY_CONFIG.U0;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
      {urgency} &middot; {lang === "zh" ? config.cn : config.label}
    </span>
  );
}
