"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import PageTransition from "@/components/UI/PageTransition";
import LiveBadge from "@/components/UI/LiveBadge";
import DataFooter from "@/components/UI/DataFooter";
import { StatSkeleton } from "@/components/UI/Skeletons";
import ErrorState from "@/components/UI/ErrorState";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Dynamic Map
function InfraMapInner() {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") import("leaflet").then(l => setL(l.default));
  }, []);

  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: [32.3792, -86.3077], zoom: 12 });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OSM &copy; CARTO", subdomains: "abcd", maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    // Fetch infrastructure-related points
    Promise.all([
      fetch(`${API}/map/points/transportation`).then(r => r.json()),
      fetch(`${API}/map/points/city_services`).then(r => r.json()),
    ]).then(([transport, services]) => {
      [...transport, ...services].forEach(p => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:10px;height:10px;background:${p.color};border:2px solid white;border-radius:50%;box-shadow:0 0 8px ${p.color};"></div>`,
          iconSize: [10, 10], iconAnchor: [5, 5],
        });
        L.marker([p.lat, p.lon], { icon }).addTo(map)
          .bindPopup(`<div style="font-family:Inter;"><b style="color:white;">${p.name}</b><br/><span style="font-size:11px;color:#94a3b8;">${p.description?.substring(0, 80)}...</span></div>`);
      });
    }).catch(() => {});

    return () => { map.remove(); mapRef.current = null; };
  }, [L]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: 280 }} />;
}

const InfraMap = dynamic(() => Promise.resolve(InfraMapInner), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-mgm-card flex items-center justify-center" style={{ minHeight: 280 }}><div className="w-8 h-8 border-4 border-mgm-accent/30 border-t-mgm-accent rounded-full animate-spin" /></div>,
});

export default function InfrastructurePage() {
  const [transportData, setTransportData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [recData, setRecData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      fetch(`${API}/datasets/transportation`).then(r => r.json()).then(d => { setTransportData(d.data || []); }).catch(() => {}),
      fetch(`${API}/datasets/city_services`).then(r => r.json()).then(d => { setServicesData(d.data || []); }).catch(() => {}),
      fetch(`${API}/datasets/recreation_culture`).then(r => r.json()).then(d => { setRecData(d.data || []); }).catch(() => {}),
    ]).then(() => setLoading(false)).catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const mats = transportData.find(d => d.name?.includes("Transit"));
  const traffic = transportData.find(d => d.name?.includes("Traffic"));
  const parks = recData.find(d => d.total_parks);

  const statCards = [
    {
      icon: "⚡", label: "Power Grid Load", value: "72%", sub: "↘ 2.4% vs avg",
      subColor: "text-mgm-success", progress: 72, progressColor: "bg-mgm-accent",
    },
    {
      icon: "💧", label: "Water Supply Quality", value: "98% Optimal", sub: "Normal",
      subColor: "text-mgm-success", progress: 98, progressColor: "bg-mgm-info",
    },
    {
      icon: "🚌", label: "Public Transit Status", value: `${mats?.daily_ridership?.toLocaleString() || "94.2%"} On-Time`,
      sub: "Minor Delay", subColor: "text-mgm-danger", progress: 94, progressColor: "bg-mgm-danger",
    },
    {
      icon: "🌳", label: "Park Occupancy", value: `${parks?.total_parks || 67}`,
      sub: "parks • Real-time sensor data", subColor: "text-mgm-success", progress: 65, progressColor: "bg-mgm-success",
    },
  ];

  // Transit feed items
  const transitFeed = [
    { route: "Route 14 - Madison Ave", dest: "To Downtown Terminal", time: "2 min", status: "ON-TIME", statusColor: "text-mgm-success" },
    { route: "Route 8 - Mobile Hwy", dest: "To Maxwell AFB", time: "7 min", status: "DELAYED", statusColor: "text-mgm-danger" },
    { route: "Downtown Shuttle", dest: "Loop Service", time: "12 min", status: "ON-TIME", statusColor: "text-mgm-success" },
  ];

  // Parks data
  const parksList = [
    { name: "Wright Brothers Park", event: "Historical Aviation Meetup", date: "Today @ 4:00 PM", icon: "🏞️" },
    { name: "Cooters Pond", event: "Fishing Tournament Prep", date: `Sat, Mar 8`, icon: "🎣" },
    { name: "Blount Cultural Park", event: "Shakespeare Festival Intro", date: `Sun, Mar 16`, icon: "🎭" },
  ];

  // Maintenance items
  const maintenance = [
    { name: "Carter Hill Rd Closure", desc: "Resurfacing in progress. Expected completion: Mar 15.", status: "ACTIVE", statusColor: "text-mgm-danger bg-mgm-danger/15" },
    { name: "Water Pipe Repair", desc: "Route maintenance on 5th St junction. No outages reported.", status: "SCHEDULED", statusColor: "text-mgm-warning bg-mgm-warning/15" },
    { name: "HVAC Update - City Hall", desc: "Energy efficiency upgrades to central system.", status: "COMPLETED", statusColor: "text-mgm-success bg-mgm-success/15" },
  ];

  return (
    <PageTransition>
    <div className="min-h-screen bg-mgm-bg">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-mgm-border gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-white">Infrastructure & Public Spaces</h1>
          <span className="badge badge-success">● SYSTEMS NOMINAL</span>
          <LiveBadge compact />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-mgm-card border border-mgm-border rounded-lg text-xs text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.5"/></svg>
          March 5, 2026
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-5">
        {error && <ErrorState message="Failed to load infrastructure data" onRetry={fetchData} />}

        {/* Stat Cards */}
        {loading ? <StatSkeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className={`text-[10px] font-semibold ${s.subColor}`}>{s.sub}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-white mb-2">{s.value}</p>
              <div className="progress-bar">
                <div className={`progress-bar-fill ${s.progressColor}`} style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Map */}
        <div className="mgm-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-mgm-border">
            <div>
              <h2 className="text-sm font-bold text-white">City Utilities & Assets Map</h2>
              <p className="text-xs text-slate-500">Interactive live view of Montgomery infrastructure</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-mgm-card-hover border border-mgm-border rounded-lg text-slate-400 hover:text-white transition">Filters</button>
              <button className="px-3 py-1.5 text-xs bg-mgm-accent text-white rounded-lg hover:bg-mgm-accent-dark transition">Expand Map</button>
            </div>
          </div>
          <div className="h-[320px]">
            <InfraMap />
          </div>
        </div>

        {/* Bottom 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Real-time Transit Feed */}
          <div className="mgm-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🚌</span>
              <h3 className="text-sm font-bold text-white">Real-time Transit Feed</h3>
            </div>
            <div className="space-y-3">
              {transitFeed.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-mgm-border/50 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-white">{t.route}</p>
                    <p className="text-[10px] text-slate-500">{t.dest}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-mgm-accent">{t.time}</p>
                    <p className={`text-[10px] font-semibold ${t.statusColor}`}>{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs text-mgm-accent font-semibold hover:underline">
              VIEW ALL ROUTES
            </button>
          </div>

          {/* Parks & Recreation */}
          <div className="mgm-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🌳</span>
              <h3 className="text-sm font-bold text-white">Parks & Recreation</h3>
            </div>
            <div className="space-y-3">
              {parksList.map((p, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-mgm-border/50 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-mgm-card-hover flex items-center justify-center text-lg flex-shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.event}</p>
                    <p className="text-[10px] text-mgm-accent">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance & Repairs */}
          <div className="mgm-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🔧</span>
              <h3 className="text-sm font-bold text-white">Maintenance & Repairs</h3>
            </div>
            <div className="space-y-3">
              {maintenance.map((m, i) => (
                <div key={i} className="py-2 border-b border-mgm-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${m.status === "ACTIVE" ? "bg-mgm-danger" : m.status === "SCHEDULED" ? "bg-mgm-warning" : "bg-mgm-success"}`} />
                    <p className="text-xs font-semibold text-white">{m.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-3.5">{m.desc}</p>
                  <span className={`inline-block mt-1.5 ml-3.5 text-[9px] font-bold px-2 py-0.5 rounded ${m.statusColor}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DataFooter />
      </div>
    </div>
    </PageTransition>
  );
}
