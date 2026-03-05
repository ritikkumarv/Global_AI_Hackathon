"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
}

export default function Header() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/Chicago",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/v1/weather")
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => {});
  }, []);

  return (
    <header className="bg-montgomery-darker border-b border-montgomery-gold/20 px-6 py-3 flex items-center justify-between z-50 relative">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-montgomery-gold/20 border-2 border-montgomery-gold flex items-center justify-center">
          <span className="text-montgomery-gold text-lg font-bold">M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient">MontgomeryAI</h1>
          <p className="text-xs text-gray-400">Smart City Dashboard</p>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300">LIVE</span>
        </div>

        {weather && (
          <div className="flex items-center gap-4 text-gray-300">
            <span>🌡️ {weather.temperature}°F</span>
            <span>{weather.description}</span>
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.wind_speed} mph</span>
          </div>
        )}
      </div>

      {/* Time & Location */}
      <div className="text-right">
        <p className="text-montgomery-gold font-mono text-lg font-semibold">
          {time}
        </p>
        <p className="text-xs text-gray-400">Montgomery, AL (CST)</p>
      </div>
    </header>
  );
}
