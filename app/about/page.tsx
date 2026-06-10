"use client";

import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { lang } = useI18n();
  const zh = lang === "zh";

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl mb-4">
        {zh ? "关于 ROAM 与方法论" : "About ROAM & Methodology"}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {zh
          ? "ROAM（Remote Operations & Anomaly Management）是一个面向 L4 Robotaxi 远程运营异常的开源知识体系，由张玉新（吉林大学汽车工程学院副教授）发起，2026 年 4 月公开。"
          : "ROAM (Remote Operations & Anomaly Management) is an open-source knowledge framework for L4 robotaxi remote operations anomalies, initiated by Prof. Zhang Yuxin (Jilin University) and released publicly in April 2026."}
      </p>

      <section className="mb-10">
        <h2 className="text-xl mb-3">
          {zh ? "数据分层（Tier）说明" : "Data Tier Methodology"}
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <p className="font-semibold mb-1">
              {zh ? "Tier 1 — 精选案例（Curated）" : "Tier 1 — Curated"}
            </p>
            <p className="text-[var(--muted)]">
              {zh
                ? "高影响力的标志性事件，由团队人工分析，包含完整的场景分类、严重度/紧急度评估、根因分析、系统性问题、监管影响和中英文双语内容。"
                : "Landmark events manually curated with full scenario classification, severity/urgency rating, root cause analysis, systemic issues, regulatory response, and bilingual EN/CN content."}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <p className="font-semibold mb-1">
              {zh ? "Tier 2 — DMV 自动导入" : "Tier 2 — DMV Auto-Imported"}
            </p>
            <p className="text-[var(--muted)]">
              {zh
                ? "从加州 DMV 自动驾驶车辆碰撞报告（Form OL 316）批量提取，覆盖 2019-2026 年。使用文本解析 + 场景自动分类，保留原始 PDF 链接可追溯。已过滤处于手动/常规驾驶模式的报告；当前数量以事件库实时统计为准。"
                : "Bulk-imported from California DMV Autonomous Vehicle Collision Reports (Form OL 316), 2019-2026. Text parsing + rule-based scenario classification with full traceability to the original PDF. Manual/conventional mode reports are filtered out; current counts are shown in the incident database."}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 opacity-70">
            <p className="font-semibold mb-1">
              {zh ? "Tier 3 — 聚合统计（规划中）" : "Tier 3 — Aggregate Statistics (Planned)"}
            </p>
            <p className="text-[var(--muted)]">
              {zh
                ? "运营商年度 Disengagement 报告、车队总里程、接管次数等聚合数据，以图表形式呈现而非单条事件。"
                : "Operator annual disengagement reports, fleet mileage, takeover frequency — presented as aggregate charts rather than individual incidents."}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-3">
          {zh ? "场景分类体系" : "Scenario Taxonomy"}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)] mb-3">
          {zh
            ? "ROAM 分类体系包含 6 大类、27 个子场景，与现有分类体系（如 ISO 34502、NHTSA SGO）的差异在于："
            : "ROAM's taxonomy covers 6 categories and 27 sub-scenarios. Key differences from existing taxonomies (ISO 34502, NHTSA SGO):"}
        </p>
        <ul className="list-disc list-inside text-sm space-y-1.5 text-[var(--muted)]">
          <li>
            {zh
              ? "以\u300c远程运营响应层级\u300d为核心组织维度（Layer 1/2/3），而非单纯按技术故障类型分"
              : "Organized by \u201cremote operations response layer\u201d (L1/L2/L3), not just by technical failure type"}
          </li>
          <li>
            {zh
              ? "包含乘客端异常（F 类）和系统级故障（A 类），是当前其他分类体系的盲区"
              : "Includes passenger-side issues (F) and system-wide failures (A), which are blind spots in existing taxonomies"}
          </li>
          <li>
            {zh
              ? "每个场景都有推荐响应层级和典型处理流程，可直接作为运营 SOP 基础"
              : "Each scenario has a recommended response layer and typical handling procedure, directly usable as an operations SOP baseline"}
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-3">
          {zh ? "数据来源与可追溯性" : "Data Sources & Traceability"}
        </h2>
        <ul className="list-disc list-inside text-sm space-y-1.5 text-[var(--muted)]">
          <li>
            {zh ? "加州 DMV 自动驾驶碰撞报告数据库（973 份 PDF，2014-2026）" : "California DMV AV Collision Reports (973 PDFs, 2014-2026)"}
            {" — "}
            <a
              href="https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/autonomous-vehicle-collision-reports/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              dmv.ca.gov
            </a>
          </li>
          <li>
            {zh ? "18 个国际中英文新闻源（每日 02:00 UTC 自动爬取）" : "18 international news sources (EN+CN), daily crawl at 02:00 UTC"}
          </li>
          <li>
            {zh ? "NHTSA SGO（联邦报告，规划中）" : "NHTSA Standing General Order reports (planned)"}
          </li>
          <li>
            {zh ? "社区贡献（通过 GitHub PR 提交）" : "Community contributions (via GitHub PRs)"}
          </li>
        </ul>
        <p className="text-sm text-[var(--muted)] mt-3">
          {zh
            ? "每条事件记录都在 sources 字段保留原始来源 URL，可回溯到一手材料。"
            : "Every record preserves original source URLs in the sources field for full traceability."}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-3">
          {zh ? "局限性" : "Limitations"}
        </h2>
        <ul className="list-disc list-inside text-sm space-y-1.5 text-[var(--muted)]">
          <li>
            {zh
              ? "Tier 2 场景分类基于自然语言规则，不如人工判读精确。准确率约 85%，边缘案例需人工复核。"
              : "Tier 2 scenario classification uses regex rules on narrative text. Accuracy ~85%; edge cases may need manual review."}
          </li>
          <li>
            {zh
              ? "DMV 数据仅覆盖加州。中国运营商（萝卜快跑、小马智行）数据目前主要依赖新闻报道。"
              : "DMV data is California-only. Data on Chinese operators (Apollo, Pony.ai) currently relies on news reporting."}
          </li>
          <li>
            {zh
              ? "DMV 报告存在时间滞后（通常事故后 10 天内提交，但公开延迟可达数周）。"
              : "DMV reports have reporting latency (typically filed within 10 days of incident, but public release may lag by weeks)."}
          </li>
          <li>
            {zh
              ? "严重度评级基于运营商叙述，可能存在自我报告偏差。"
              : "Severity ratings are derived from operator narratives, which may carry self-report bias."}
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-3">
          {zh ? "如何引用" : "How to Cite"}
        </h2>
        <pre className="rounded-lg bg-[var(--badge-bg)] p-4 text-xs overflow-x-auto font-mono">
{`@misc{zhang2026roam,
  title={ROAM: Remote Operations & Anomaly Management
         for L4 Robotaxi Fleets},
  author={Zhang, Yuxin},
  year={2026},
  howpublished={\\url{https://roam.autozyx.com}},
  note={Open-source framework with a continuously updated
        incident database, scenario taxonomy,
        three-layer architecture}
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl mb-3">
          {zh ? "贡献与反馈" : "Contribute & Feedback"}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {zh ? (
            <>
              欢迎通过{" "}
              <a href="https://github.com/AutoZYX/ROAM" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                GitHub
              </a>
              {" "}提交新事件、修正分类、改进方法论。学术合作请联系{" "}
              <a href="mailto:zhangyuxin@jlu.edu.cn" className="text-[var(--accent)] hover:underline">
                zhangyuxin@jlu.edu.cn
              </a>
              。
            </>
          ) : (
            <>
              Submit new incidents, corrections, or methodology improvements via{" "}
              <a href="https://github.com/AutoZYX/ROAM" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                GitHub
              </a>
              . For academic collaboration, email{" "}
              <a href="mailto:zhangyuxin@jlu.edu.cn" className="text-[var(--accent)] hover:underline">
                zhangyuxin@jlu.edu.cn
              </a>
              .
            </>
          )}
        </p>
      </section>
    </div>
  );
}
