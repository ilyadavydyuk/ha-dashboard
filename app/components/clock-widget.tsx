"use client";

import { useState, useEffect } from "react";

type ClockType = "digital" | "analog";

interface ClockWidgetProps {
  type?: ClockType;
}

export function ClockWidget({ type = "digital" }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (type === "analog") {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;
    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = hours * 30 + minutes * 0.5;

    const hand = (
      deg: number,
      length: number,
      width: number,
      color: string,
    ) => {
      const angle = (deg - 90) * (Math.PI / 180);
      return (
        <line
          x1="50"
          y1="50"
          x2={50 + length * Math.cos(angle)}
          y2={50 + length * Math.sin(angle)}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
        />
      );
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={50 + 38 * Math.cos(angle)}
                y1={50 + 38 * Math.sin(angle)}
                x2={50 + 44 * Math.cos(angle)}
                y2={50 + 44 * Math.sin(angle)}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          {hand(hourDeg, 24, 3.5, "rgba(255,255,255,0.9)")}
          {hand(minuteDeg, 34, 2.5, "rgba(255,255,255,0.9)")}
          {hand(secondDeg, 38, 1.5, "#3b82f6")}
          <circle cx="50" cy="50" r="3" fill="#3b82f6" />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            {time.toLocaleDateString("ru-RU", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.95)",
          lineHeight: 1,
          fontFamily: "Outfit, sans-serif",
          letterSpacing: "-1px",
        }}
      >
        {time.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 400,
        }}
      >
        {time.toLocaleDateString("ru-RU", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>
    </div>
  );
}
