"use client";

import { useEffect, useState } from "react";

interface Category {
  key: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

const ICON_MAP: Record<string, string> = {
  Building2: "🏛️",
  Info: "ℹ️",
  TrendingUp: "📈",
  Heart: "❤️",
  Shield: "🛡️",
  TreePine: "🌲",
  Car: "🚗",
  MapPin: "📍",
};

interface DataLayerPanelProps {
  activeLayers: Set<string>;
  onToggleLayer: (key: string) => void;
}

export default function DataLayerPanel({
  activeLayers,
  onToggleLayer,
}: DataLayerPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/v1/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-montgomery-gold mb-3 uppercase tracking-wider">
        Data Layers
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => {
          const isActive = activeLayers.has(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => onToggleLayer(cat.key)}
              className={`layer-toggle w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all ${
                isActive
                  ? "border-montgomery-gold/50 bg-montgomery-gold/10"
                  : "border-transparent bg-montgomery-card/50 hover:bg-montgomery-card"
              }`}
            >
              <span className="text-lg">{ICON_MAP[cat.icon] || "📌"}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500">{cat.count} items</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  isActive
                    ? "border-montgomery-gold bg-montgomery-gold"
                    : "border-gray-500"
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              />
            </button>
          );
        })}
      </div>

      {/* Toggle All */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => categories.forEach((c) => !activeLayers.has(c.key) && onToggleLayer(c.key))}
          className="flex-1 text-xs py-1.5 rounded-md bg-montgomery-gold/20 text-montgomery-gold hover:bg-montgomery-gold/30 transition"
        >
          Show All
        </button>
        <button
          onClick={() => categories.forEach((c) => activeLayers.has(c.key) && onToggleLayer(c.key))}
          className="flex-1 text-xs py-1.5 rounded-md bg-gray-700/50 text-gray-400 hover:bg-gray-700 transition"
        >
          Hide All
        </button>
      </div>
    </div>
  );
}
