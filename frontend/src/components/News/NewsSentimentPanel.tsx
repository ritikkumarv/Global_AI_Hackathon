"use client";

import { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  scraped_via: string;
  category: string;
}

interface SentimentData {
  overall: string;
  breakdown: { positive: number; neutral: number; negative: number };
  percentages: { positive: number; neutral: number; negative: number };
  items: SentimentItem[];
  method: string;
  category_sentiment: Record<string, { positive: number; neutral: number; negative: number }>;
}

interface SentimentItem {
  title: string;
  sentiment: string;
  confidence: number;
  reason: string;
  category: string;
}

const SENTIMENT_COLORS = {
  positive: { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  neutral: { bg: "bg-yellow-500/20", text: "text-yellow-400", dot: "bg-yellow-400" },
  negative: { bg: "bg-red-500/20", text: "text-red-400", dot: "bg-red-400" },
};

const CATEGORY_EMOJI: Record<string, string> = {
  public_safety: "🛡️",
  public_health: "❤️",
  transportation: "🚗",
  recreation_culture: "🌲",
  planning_development: "📈",
  city_services: "🏛️",
  general_information: "ℹ️",
  historical_markers: "📍",
};

export default function NewsSentimentPanel() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"news" | "sentiment" | "alerts">("news");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/news").then((r) => r.json()).catch(() => ({ articles: [] })),
      fetch("/api/v1/sentiment").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/alerts").then((r) => r.json()).catch(() => ({ alerts: [] })),
    ]).then(([newsData, sentimentData, alertsData]) => {
      setNews(newsData.articles || []);
      setSentiment(sentimentData);
      setAlerts(alertsData.alerts || []);
      setLoading(false);
    });
  }, []);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
      if (diffH < 1) return "Just now";
      if (diffH < 24) return `${diffH}h ago`;
      return `${Math.floor(diffH / 24)}d ago`;
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-montgomery-gold/30 border-t-montgomery-gold rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-montgomery-gold/20">
        {[
          { key: "news", label: "Live News", icon: "📰", count: news.length },
          { key: "sentiment", label: "Sentiment", icon: "📊" },
          { key: "alerts", label: "Alerts", icon: "⚡", count: alerts.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "text-montgomery-gold border-b-2 border-montgomery-gold bg-montgomery-gold/5"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 text-[10px] bg-montgomery-gold/20 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* NEWS TAB */}
        {activeTab === "news" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Scraped via Bright Data
              </span>
            </div>
            {news.map((article, i) => {
              const sentItem = sentiment?.items?.find((s) => s.title === article.title);
              const sentColor = sentItem
                ? SENTIMENT_COLORS[sentItem.sentiment as keyof typeof SENTIMENT_COLORS]
                : null;

              return (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-montgomery-card/50 hover:bg-montgomery-card transition group cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">
                      {CATEGORY_EMOJI[article.category] || "📌"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white group-hover:text-montgomery-gold transition line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-500">
                          {article.source}
                        </span>
                        <span className="text-[10px] text-gray-600">•</span>
                        <span className="text-[10px] text-gray-500">
                          {formatTime(article.published_at)}
                        </span>
                        {sentColor && (
                          <>
                            <span className="text-[10px] text-gray-600">•</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${sentColor.bg} ${sentColor.text}`}
                            >
                              {sentItem?.sentiment}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* SENTIMENT TAB */}
        {activeTab === "sentiment" && sentiment && (
          <>
            {/* Overall Gauge */}
            <div className="p-4 rounded-lg bg-montgomery-card/70 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                City Sentiment Overview
              </p>
              <div className="flex justify-center gap-6 mb-3">
                {(["positive", "neutral", "negative"] as const).map((s) => {
                  const color = SENTIMENT_COLORS[s];
                  const pct = sentiment.percentages[s] || 0;
                  return (
                    <div key={s} className="text-center">
                      <div
                        className={`w-14 h-14 rounded-full ${color.bg} flex items-center justify-center mx-auto mb-1`}
                      >
                        <span className={`text-lg font-bold ${color.text}`}>
                          {pct}%
                        </span>
                      </div>
                      <p className={`text-[10px] ${color.text} capitalize`}>{s}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-500">
                Analysis: {sentiment.method}
              </p>
            </div>

            {/* Per-Category Sentiment */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                By Category
              </p>
              {Object.entries(sentiment.category_sentiment || {}).map(
                ([cat, counts]) => {
                  const total =
                    (counts.positive || 0) +
                    (counts.neutral || 0) +
                    (counts.negative || 0);
                  if (total === 0) return null;
                  return (
                    <div
                      key={cat}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-montgomery-card/30"
                    >
                      <span>{CATEGORY_EMOJI[cat] || "📌"}</span>
                      <span className="text-xs text-gray-300 flex-1 truncate">
                        {cat.replace("_", " ")}
                      </span>
                      <div className="flex gap-1">
                        {counts.positive > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            +{counts.positive}
                          </span>
                        )}
                        {counts.neutral > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                            ~{counts.neutral}
                          </span>
                        )}
                        {counts.negative > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                            -{counts.negative}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Individual Items */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Per Article Analysis
              </p>
              {sentiment.items.map((item, i) => {
                const color =
                  SENTIMENT_COLORS[
                    item.sentiment as keyof typeof SENTIMENT_COLORS
                  ] || SENTIMENT_COLORS.neutral;
                return (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-montgomery-card/30 mb-1.5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                      <span
                        className={`text-[10px] ${color.text} uppercase font-medium`}
                      >
                        {item.sentiment} ({Math.round(item.confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && (
          <>
            {alerts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm text-gray-400">
                  No active alerts for Montgomery
                </p>
              </div>
            )}
            {alerts.map((alert, i) => {
              const severityColors: Record<string, string> = {
                alert: "border-red-500/50 bg-red-500/10",
                warning: "border-yellow-500/50 bg-yellow-500/10",
                info: "border-blue-500/50 bg-blue-500/10",
              };
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-l-4 ${
                    severityColors[alert.severity] || severityColors.info
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {alert.severity === "alert"
                        ? "🔴"
                        : alert.severity === "warning"
                        ? "🟡"
                        : "🔵"}
                    </span>
                    <h4 className="text-sm font-medium text-white">
                      {alert.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 ml-6">
                    <span className="text-[10px] text-gray-500">
                      {alert.source}
                    </span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-montgomery-gold/10 flex items-center justify-between">
        <span className="text-[10px] text-gray-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Powered by Bright Data
        </span>
        <span className="text-[10px] text-gray-600">
          {news.length > 0 ? news[0].scraped_via : ""}
        </span>
      </div>
    </div>
  );
}
