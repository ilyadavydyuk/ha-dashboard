"use client";

import { useEntities } from "@/hooks/useEntities";
import { EntityCard } from "@/components/entity-card";

export default function Home() {
  const { entities, connected } = useEntities();

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
