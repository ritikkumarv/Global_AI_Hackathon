"use client";

import { useEffect, useState } from "react";

interface Stats {
  total_data_points: number;
  categories: number;
  parks: number;
  hospitals: number;
  historical_sites: number;
  bus_routes: number;
  population: number;
}

const STAT_ITEMS = [
  { key: "population", label: "Population", icon: "👥", format: (v: number) => v.toLocaleString() },
  { key: "total_data_points", label: "Data Points", icon: "📊", format: (v: number) => v.toString() },
  { key: "categories", label: "Categories", icon: "📁", format: (v: number) => v.toString() },
  { key: "parks", label: "Parks", icon: "🌳", format: (v: number) => v.toString() },
  { key: "hospitals", label: "Hospitals", icon: "🏥", format: (v: number) => v.toString() },
  { key: "historical_sites", label: "Historic Sites", icon: "🏛️", format: (v: number) => v.toString() },
  { key: "bus_routes", label: "Bus Routes", icon: "🚌", format: (v: number) => v.toString() },
];

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/v1/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex gap-3 py-3 px-4 overflow-x-auto">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-16 w-32 rounded-lg bg-montgomery-card/50 animate-pulse"
            />
          ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3 px-4 overflow-x-auto no-scrollbar">
      {STAT_ITEMS.map((item) => {
        const value = (stats as any)[item.key];
        return (
          <div
            key={item.key}
            className="stat-card flex-shrink-0 glass-card px-4 py-2.5 flex items-center gap-3 cursor-default"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-lg font-bold text-white">
                {item.format(value)}
              </p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
