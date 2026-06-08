"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Incident } from "@/lib/types";
import { geocode } from "@/lib/geocoding";
import { useI18n } from "@/lib/i18n";
import { SEVERITY_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { localizeCity } from "@/lib/localized-incident";

interface ClusterBubble {
  city: string;
  lat: number;
  lng: number;
  count: number;
  byOperator: Record<string, number>;
  bySeverity: Record<string, number>;
  topIncidents: Incident[];
}

export default function IncidentMap({ incidents, compact = false }: { incidents: Incident[]; compact?: boolean }) {
  const { lang } = useI18n();
  const zh = lang === "zh";

  const clusters = useMemo<ClusterBubble[]>(() => {
    const byCity = new Map<string, { incs: Incident[]; coord: [number, number] }>();
    for (const inc of incidents) {
      const cityRaw = inc.location?.city;
      if (!cityRaw) continue;
      const coord = geocode(cityRaw);
      if (!coord) continue;
      if (!byCity.has(cityRaw)) byCity.set(cityRaw, { incs: [], coord });
      byCity.get(cityRaw)!.incs.push(inc);
    }

    return Array.from(byCity.entries()).map(([city, data]) => {
      const byOperator: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};
      for (const inc of data.incs) {
        byOperator[inc.operator] = (byOperator[inc.operator] || 0) + 1;
        bySeverity[inc.severity] = (bySeverity[inc.severity] || 0) + 1;
      }
      const topIncidents = [...data.incs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      return {
        city,
        lat: data.coord[0],
        lng: data.coord[1],
        count: data.incs.length,
        byOperator,
        bySeverity,
        topIncidents,
      };
    });
  }, [incidents]);

  const geocoded = clusters.reduce((s, c) => s + c.count, 0);

  const clusterColor = (c: ClusterBubble) => {
    if (c.bySeverity["S4"]) return "#c85a3a";
    if (c.bySeverity["S3"]) return "#ef4444";
    if (c.bySeverity["S2"]) return "#f59e0b";
    if (c.bySeverity["S1"]) return "#3b82f6";
    return "#9ca3af";
  };

  const radius = (count: number) => Math.min(35, Math.max(8, Math.sqrt(count) * 4));

  if (compact) {
    return (
      <MapContainer
        center={[37.5, -122]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clusters.map((c) => (
          <CircleMarker
            key={c.city}
            center={[c.lat, c.lng]}
            radius={radius(c.count)}
            pathOptions={{
              fillColor: clusterColor(c),
              color: clusterColor(c),
              weight: 1,
              fillOpacity: 0.5,
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-semibold">
                  {zh ? localizeCity(c.city, true) : c.city.replace(", USA", "")}
                </p>
                <p>{zh ? `${c.count} 条事件` : `${c.count} incidents`}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--muted)] mb-3">
        {zh
          ? `已定位 ${geocoded} / ${incidents.length} 条事件到 ${clusters.length} 个城市。点击气泡查看详情。`
          : `${geocoded} of ${incidents.length} incidents geocoded to ${clusters.length} cities. Click bubbles to explore.`}
      </p>
      <div className="h-[600px] rounded-xl border border-[var(--border)] overflow-hidden">
        <MapContainer
          center={[37.5, -122]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clusters.map((c) => (
            <CircleMarker
              key={c.city}
              center={[c.lat, c.lng]}
              radius={radius(c.count)}
              pathOptions={{
                fillColor: clusterColor(c),
                color: clusterColor(c),
                weight: 1,
                fillOpacity: 0.5,
              }}
            >
              <Popup>
                <div className="text-xs" style={{ minWidth: "220px" }}>
                  <p className="font-semibold text-sm mb-1">
                    {zh ? localizeCity(c.city, true) : c.city.replace(", USA", "")}
                  </p>
                  <p className="mb-2">
                    {zh ? "事件总数：" : "Incidents: "}
                    <strong>{c.count}</strong>
                  </p>
                  <p className="mb-2">
                    {Object.entries(c.bySeverity)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([sev, n]) => (
                        <span
                          key={sev}
                          className={`inline-block mr-1 px-1.5 py-0.5 rounded text-[10px] ${SEVERITY_CONFIG[sev]?.bg || "bg-gray-100"} ${SEVERITY_CONFIG[sev]?.color || ""}`}
                        >
                          {sev}:{n}
                        </span>
                      ))}
                  </p>
                  <p className="mb-2 text-[var(--muted)]">
                    {Object.entries(c.byOperator)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([op, n]) => `${op} (${n})`)
                      .join(" · ")}
                  </p>
                  <p className="font-medium mt-2">{zh ? "最近：" : "Recent: "}</p>
                  {c.topIncidents.slice(0, 3).map((inc) => (
                    <div key={inc.id}>
                      <Link href={`/incidents/${inc.id}`} className="text-[var(--accent)] hover:underline">
                        {inc.id}
                      </Link>{" "}
                      <span className="text-[var(--muted)]">({inc.date})</span>
                    </div>
                  ))}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-3 text-xs text-[var(--muted)] flex flex-wrap gap-3">
        <span>{zh ? "气泡大小 = 事件数量" : "Bubble size = incident count"}</span>
        <span>{zh ? "颜色 = 最严重等级" : "Color = highest severity"}</span>
      </div>
    </div>
  );
}
