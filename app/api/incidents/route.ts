import { NextRequest, NextResponse } from "next/server";
import { getAllIncidents } from "@/lib/data";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const incidents = getAllIncidents();
  const format = new URL(request.url).searchParams.get("format") ?? "json";

  if (format === "csv") {
    const header = [
      "id",
      "tier",
      "date",
      "time",
      "operator",
      "city",
      "road_type",
      "scenario_primary",
      "scenario_secondary",
      "severity",
      "urgency",
      "vehicles_affected",
      "injuries",
      "fatalities",
      "source_url",
    ];
    const esc = (v: unknown): string => {
      if (v == null) return "";
      const s = String(v).replace(/"/g, '""').replace(/\n/g, " ");
      return `"${s}"`;
    };
    const rows = incidents.map((i) =>
      [
        i.id,
        i.tier ?? 1,
        i.date,
        i.time ?? "",
        i.operator,
        i.location?.city ?? "",
        i.location?.road_type ?? "",
        i.scenario?.primary ?? "",
        (i.scenario?.secondary ?? []).join("+"),
        i.severity,
        i.urgency ?? "",
        i.impact?.vehicles_affected ?? "",
        i.impact?.injuries ?? "",
        i.impact?.fatalities ?? "",
        i.sources?.[0]?.url ?? "",
      ].map(esc).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="roam-incidents.csv"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // JSON (default)
  return NextResponse.json(
    {
      meta: {
        count: incidents.length,
        tier1_count: incidents.filter((i) => (i.tier ?? 1) === 1).length,
        tier2_count: incidents.filter((i) => i.tier === 2).length,
        license: "Apache-2.0",
        source: "https://roam-explorer.autozyx.com",
        citation: "Zhang, Y. (2026). ROAM: Remote Operations & Anomaly Management for L4 Autonomous Mobility Remote Operations. https://roam.autozyx.com",
        generated_at: new Date().toISOString(),
      },
      incidents,
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
