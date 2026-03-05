"use client";

import { useState } from "react";

interface ServiceCategory {
  key: string;
  label: string;
  icon: string;
}

interface ServiceResult {
  name: string;
  description: string;
  location: string;
  contact: string;
  hours: string;
  category: string;
  lat?: number;
  lon?: number;
}

interface FindResult {
  emergency: boolean;
  message?: string;
  query: string;
  matched_categories: { key: string; label: string; icon: string }[];
  services: ServiceResult[];
  ai_recommendation: string;
  total_results: number;
}

const QUICK_SEARCHES = [
  { icon: "🚨", label: "Report a Crime", query: "I need to report a crime" },
  { icon: "🕳️", label: "Fix a Pothole", query: "There's a pothole on my street" },
  { icon: "🏥", label: "Find a Clinic", query: "I need a health clinic nearby" },
  { icon: "🚌", label: "Bus Routes", query: "How do I take the bus?" },
  { icon: "♻️", label: "Trash Pickup", query: "When is my trash pickup day?" },
  { icon: "📋", label: "Get a Permit", query: "I need a building permit" },
  { icon: "🌳", label: "Find a Park", query: "Where are parks near me?" },
  { icon: "🐾", label: "Stray Animal", query: "There's a stray dog in my neighborhood" },
  { icon: "💧", label: "Water Bill", query: "How do I pay my water bill?" },
  { icon: "🏠", label: "Affordable Housing", query: "I need affordable housing options" },
  { icon: "🎭", label: "Events & Culture", query: "What events are happening this weekend?" },
  { icon: "📍", label: "Historical Tours", query: "Where can I take a Civil Rights tour?" },
];

interface ServiceFinderPanelProps {
  onHighlights: (highlights: { name: string; lat: number; lon: number; category: string }[]) => void;
}

export default function ServiceFinderPanel({ onHighlights }: ServiceFinderPanelProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FindResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFinder, setShowFinder] = useState(false);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setShowFinder(true);

    try {
      const res = await fetch("/api/v1/services/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!res.ok) throw new Error("Service Finder API error");
      const data = await res.json();
      setResult(data);

      // Highlight service locations on map
      const mapHighlights = data.services
        .filter((s: ServiceResult) => s.lat && s.lon)
        .map((s: ServiceResult) => ({
          name: s.name,
          lat: s.lat!,
          lon: s.lon!,
          category: s.category,
        }));
      if (mapHighlights.length > 0) {
        onHighlights(mapHighlights);
      }
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-montgomery-gold/20 flex items-center justify-between cursor-pointer"
        onClick={() => setShowFinder(!showFinder)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Service Finder
            </h3>
            <p className="text-[10px] text-gray-400">
              What do you need help with?
            </p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">
          {showFinder ? "▲" : "▼"}
        </span>
      </div>

      {showFinder && (
        <div className="p-4">
          {/* Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(query);
            }}
            className="flex gap-2 mb-4"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what you need..."
              className="flex-1 bg-montgomery-card border border-montgomery-gold/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-montgomery-gold/50 transition"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-montgomery-gold rounded-lg text-montgomery-darker font-semibold text-sm hover:bg-montgomery-gold/90 transition disabled:opacity-50"
            >
              {loading ? "..." : "Find"}
            </button>
          </form>

          {/* Quick Buttons */}
          {!result && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {QUICK_SEARCHES.map((qs) => (
                <button
                  key={qs.query}
                  onClick={() => {
                    setQuery(qs.query);
                    search(qs.query);
                  }}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-montgomery-card/50 hover:bg-montgomery-card border border-transparent hover:border-montgomery-gold/30 transition text-center"
                >
                  <span className="text-xl">{qs.icon}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">
                    {qs.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-3">
              {/* Emergency Warning */}
              {result.emergency && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-center">
                  <p className="text-2xl mb-2">🚨</p>
                  <p className="text-white font-bold text-lg">
                    {result.message}
                  </p>
                </div>
              )}

              {/* Matched Categories */}
              {result.matched_categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.matched_categories.map((cat) => (
                    <span
                      key={cat.key}
                      className="text-xs px-3 py-1 rounded-full bg-montgomery-gold/20 text-montgomery-gold"
                    >
                      {cat.icon} {cat.label}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Recommendation */}
              {result.ai_recommendation && (
                <div className="p-3 rounded-lg bg-montgomery-blue/30 border border-montgomery-gold/20">
                  <p className="text-[10px] text-montgomery-gold uppercase tracking-wider mb-1">
                    🤖 AI Recommendation
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {result.ai_recommendation}
                  </p>
                </div>
              )}

              {/* Service Results */}
              {result.services.slice(0, 5).map((service, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-montgomery-card/50 hover:bg-montgomery-card transition"
                >
                  <h4 className="text-sm font-medium text-white">
                    {service.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="mt-2 space-y-0.5">
                    {service.location && (
                      <p className="text-[11px] text-gray-500">
                        📍 {service.location}
                      </p>
                    )}
                    {service.contact && (
                      <p className="text-[11px] text-gray-500">
                        📞 {service.contact}
                      </p>
                    )}
                    {service.hours && (
                      <p className="text-[11px] text-gray-500">
                        🕐 {service.hours}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Back button */}
              <button
                onClick={() => {
                  setResult(null);
                  setQuery("");
                }}
                className="w-full text-xs py-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white transition"
              >
                ← Search Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
