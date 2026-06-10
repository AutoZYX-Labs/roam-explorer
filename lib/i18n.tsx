"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "zh";

const DEFAULT_LANG: Lang = "zh";
const LANG_STORAGE_KEY = "roam-lang-v2";
const LEGACY_LANG_STORAGE_KEY = "roam-lang";

const translations = {
  // Nav — 与 roam.autozyx.com 一致
  "nav.dashboard": { en: "Dashboard", zh: "仪表盘" },
  "nav.incidents": { en: "Incidents", zh: "事件库" },
  "nav.taxonomy": { en: "Taxonomy", zh: "场景分类" },
  "nav.architecture": { en: "Architecture", zh: "参考架构" },
  "nav.kpis": { en: "KPIs", zh: "评估基准" },
  "nav.ask": { en: "Ask ROAM", zh: "智能问答" },
  "nav.about": { en: "About", zh: "关于" },
  "nav.operators": { en: "Operators", zh: "运营商" },
  "nav.map": { en: "Map", zh: "地图" },
  "nav.reports": { en: "Reports", zh: "月报" },
  "nav.framework": { en: "Framework", zh: "理论框架" },
  "fw.title": { en: "ROAM Framework", zh: "ROAM 理论框架" },
  "fw.desc": {
    en: "The theoretical foundation: scenario taxonomy, three-layer reference architecture, and 8 KPIs for evaluating L4 remote operations platforms.",
    zh: "ROAM 的理论基础：场景分类体系、三层参考架构、8 个评估 KPI。",
  },
  "fw.tab.taxonomy": { en: "Taxonomy", zh: "场景分类" },
  "fw.tab.architecture": { en: "Architecture", zh: "参考架构" },
  "fw.tab.kpis": { en: "KPIs", zh: "评估基准" },
  "fw.tab.standards": { en: "Standards Alignment", zh: "标准对齐" },

  // Dashboard
  "dash.title": { en: "ROAM Explorer", zh: "ROAM 交互式探索" },
  "dash.desc": {
    en: "Open-source incident database, scenario taxonomy & reference architecture for L4 remote operations.",
    zh: "开源事件数据库、场景分类体系与参考架构，面向 L4 自动驾驶远程运营。",
  },
  "dash.totalIncidents": { en: "Incidents", zh: "事件记录" },
  "dash.operators": { en: "Operators", zh: "运营商" },
  "dash.scenarioTypes": { en: "Scenario Types", zh: "场景类型" },
  "dash.coverage": { en: "Coverage", zh: "覆盖范围" },
  "dash.years": { en: "years", zh: "年" },
  "dash.recent": { en: "Recent Incidents", zh: "近期事件" },
  "dash.viewAll": { en: "View all", zh: "查看全部" },

  // Charts
  "chart.severity": { en: "Severity Distribution", zh: "严重度分布" },
  "chart.timeline": { en: "Incidents by Year", zh: "年度事件趋势" },
  "chart.operator": { en: "Incidents by Operator", zh: "运营商事件对比" },
  "chart.scenario": { en: "Incidents by Scenario Category", zh: "场景类别分布" },

  // Incidents page
  "inc.title": { en: "Incidents", zh: "事件库" },
  "inc.desc": {
    en: "All documented L4 remote-operations anomalies in the ROAM database.",
    zh: "ROAM 数据库中所有已记录的 L4 远程运营异常事件。",
  },
  "inc.search": { en: "Search incidents...", zh: "搜索事件..." },
  "inc.allOperators": { en: "All Operators", zh: "全部运营商" },
  "inc.allSeverity": { en: "All Severity", zh: "全部严重度" },
  "inc.allCategories": { en: "All Categories", zh: "全部类别" },
  "inc.allYears": { en: "All Years", zh: "全部年份" },
  "inc.found": { en: "incidents found", zh: "条事件" },
  "inc.noMatch": { en: "No incidents match the current filters.", zh: "没有符合当前筛选条件的事件。" },
  "inc.back": { en: "All Incidents", zh: "返回事件列表" },

  // Incident detail
  "detail.location": { en: "LOCATION", zh: "地点" },
  "detail.description": { en: "DESCRIPTION", zh: "事件描述" },
  "detail.impact": { en: "IMPACT", zh: "影响" },
  "detail.vehicles": { en: "Vehicles", zh: "车辆数" },
  "detail.duration": { en: "Duration", zh: "持续时间" },
  "detail.injuries": { en: "Injuries", zh: "受伤" },
  "detail.fatalities": { en: "Fatalities", zh: "死亡" },
  "detail.traffic": { en: "Traffic disruption", zh: "交通影响" },
  "detail.emergency": { en: "EMERGENCY RESPONSE", zh: "应急响应" },
  "detail.sos": { en: "SOS Button", zh: "SOS 按钮" },
  "detail.customerService": { en: "Customer Service", zh: "客服响应" },
  "detail.remoteIntervention": { en: "Remote Intervention", zh: "远程干预" },
  "detail.onSite": { en: "On-Site Response", zh: "现场处置" },
  "detail.resolution": { en: "Resolution", zh: "解决方式" },
  "detail.rootCause": { en: "ROOT CAUSE", zh: "根本原因" },
  "detail.confirmed": { en: "Confirmed", zh: "已确认" },
  "detail.unconfirmed": { en: "Unconfirmed / Under investigation", zh: "未确认 / 调查中" },
  "detail.systemic": { en: "SYSTEMIC ISSUES", zh: "系统性问题" },
  "detail.regulatory": { en: "REGULATORY ACTION", zh: "监管行动" },
  "detail.sources": { en: "SOURCES", zh: "信息来源" },

  // Taxonomy — 与 roam.autozyx.com "场景分类" 一致
  "tax.title": { en: "Scenario Taxonomy", zh: "场景分类体系" },
  "tax.desc": {
    en: "6 categories, 27 sub-scenarios classifying known L4 remote-operations anomalies. Each maps to a recommended response layer (1/2/3).",
    zh: "6大类、27个子场景，覆盖已知 L4 远程运营异常。每个场景映射到推荐的响应层级（1/2/3）。",
  },
  "tax.incident": { en: "incident", zh: "条事件" },
  "tax.incidents": { en: "incidents", zh: "条事件" },
  "tax.back": { en: "All Scenarios", zh: "返回场景列表" },
  "tax.category": { en: "Category", zh: "类别" },
  "tax.primaryLayer": { en: "Primary Layer", zh: "主响应层" },
  "tax.escalation": { en: "Escalation", zh: "升级层" },
  "tax.related": { en: "Related Incidents", zh: "关联事件" },
  "tax.noIncidents": { en: "No incidents documented for this scenario yet.", zh: "该场景暂无事件记录。" },

  // Architecture — 与 roam.autozyx.com "参考架构：三层决策模型" 一致
  "arch.title": { en: "Reference Architecture", zh: "参考架构：三层决策模型" },
  "arch.desc": {
    en: "Three-layer decision model for handling L4 remote-operations anomalies. Core principle: AI handles routine anomalies autonomously; humans handle the exceptions.",
    zh: "L4 远程运营异常三层决策模型。核心原则：AI 自主处理常规异常，人类处理例外情况。",
  },
  "arch.latency": { en: "Latency", zh: "响应时间" },
  "arch.humanRole": { en: "Human role", zh: "人员角色" },
  "arch.none": { en: "None", zh: "无需人工" },
  "arch.confirm": { en: "Confirm / Override", zh: "审核确认/覆盖" },
  "arch.direct": { en: "Direct control", zh: "直接控制" },
  "arch.mapping": { en: "Scenario-to-Layer Mapping", zh: "场景-层级映射表" },
  "arch.scenario": { en: "Scenario", zh: "场景" },
  "arch.primary": { en: "Primary", zh: "主层" },
  "arch.escHeader": { en: "Escalation", zh: "升级层" },
  "arch.matrix": { en: "Urgency-Severity Matrix", zh: "紧急度-严重度矩阵" },

  // KPIs — 与 roam.autozyx.com "评估基准" 一致
  "kpi.title": { en: "KPI Definitions", zh: "评估基准：KPI 定义" },
  "kpi.desc": {
    en: "8 key performance indicators for evaluating L4 remote operations platforms. Measurable, comparable across operators, and actionable.",
    zh: "8个关键绩效指标，用于评估 L4 远程运营平台。可量化、可跨运营商对比、可执行。",
  },
  "kpi.category": { en: "Category", zh: "类别" },
  "kpi.target": { en: "Target", zh: "目标值" },
  "kpi.stretch": { en: "Stretch", zh: "挑战值" },

  // Ask ROAM
  "ask.title": { en: "Ask ROAM", zh: "智能问答" },
  "ask.desc": {
    en: "Ask questions about L4 remote-operations incidents, scenarios, architecture, and KPIs. Powered by Claude with the full ROAM database as context.",
    zh: "向 ROAM 数据库提问：事件、场景分类、架构、KPI。基于 Claude AI，以完整数据库为上下文。",
  },
  "ask.try": { en: "Try one of these questions:", zh: "试试这些问题：" },
  "ask.placeholder": { en: "Ask about L4 remote-operations incidents...", zh: "输入你的问题..." },
  "ask.button": { en: "Ask", zh: "提问" },
  "ask.thinking": { en: "Thinking...", zh: "思考中..." },
  "ask.clear": { en: "New chat", zh: "新对话" },

  // Registration
  "reg.title": { en: "Sign up to use Ask ROAM", zh: "注册使用智能问答" },
  "reg.desc": {
    en: "Leave your work email and organization to access AI-powered search across the ROAM incident database. Free, no password needed.",
    zh: "请留下您的工作邮箱与所在单位即可使用 AI 搜索 ROAM 事件数据库。免费，无需密码。",
  },
  "reg.email": { en: "Work email", zh: "工作邮箱" },
  "reg.company": { en: "Organization / Company", zh: "所在单位 / 公司" },
  "reg.submit": { en: "Get access", zh: "获取访问权限" },
  "reg.email_invalid": { en: "Please enter a valid work email", zh: "请输入有效的工作邮箱" },
  "reg.company_required": { en: "Please enter your organization", zh: "请填写所在单位" },
  "reg.privacy": {
    en: "We only use your info for contact. No spam.",
    zh: "信息仅用于联系，不会对外分享。",
  },

  // Footer — 与 roam.autozyx.com 底部一致
  "footer.desc": { en: "Remote Operations & Anomaly Management", zh: "远程运营与异常管理" },
  "footer.open": { en: "Open-source L4 remote-operations incident database", zh: "开源 L4 远程运营事件数据库" },

  // Common
  "common.min": { en: "min", zh: "分钟" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => translations[key]?.[DEFAULT_LANG] ?? key,
});

function getInitialLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
  const legacySaved = localStorage.getItem(LEGACY_LANG_STORAGE_KEY) as Lang | null;
  if (saved === "zh" || saved === "en") return saved;
  if (legacySaved === "zh") return "zh";
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_STORAGE_KEY, l);
    localStorage.setItem(LEGACY_LANG_STORAGE_KEY, l);
  };

  const t = (key: TranslationKey) => translations[key]?.[lang] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="px-2 py-1 rounded-md text-xs font-medium border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
      title={lang === "en" ? "切换中文" : "Switch to English"}
    >
      {lang === "en" ? "中文" : "EN"}
    </button>
  );
}
