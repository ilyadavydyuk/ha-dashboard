"use client";

import { useState, useEffect } from "react";
import { useEntities } from "@/hooks/useEntities";
import { EntityCard } from "@/components/entity-card";

export default function Home() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem("ha_token") || "";
    setToken(tok);
    setSaved(!!tok);
  }, []);

  const { entities, connected } = useEntities(saved ? token : "");

  if (!saved) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-4">Настройка</h1>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">
                Long-lived токен
              </label>
              <input
                className="w-full mt-1 bg-muted text-foreground rounded px-3 py-2 text-sm border border-border"
                placeholder="eyJ0eXAi..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary text-primary-foreground rounded px-3 py-2 text-sm font-medium"
              onClick={() => {
                localStorage.setItem("ha_token", token);
                setSaved(true);
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">HA Dashboard</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {connected ? "Connected" : "Connecting..."}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.values(entities)
          .slice(0, 12)
          .map((entity) => (
            <EntityCard
              key={entity.entity_id}
              name={entity.attributes.friendly_name || entity.entity_id}
              state={entity.state}
              active={entity.state === "on"}
            />
          ))}
      </div>
    </main>
  );
}
