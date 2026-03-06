"use client";

import { useState, useEffect } from "react";
import { useEntities } from "@/hooks/useEntities";
import { DashboardSection } from "@/components/dashboard-section";
import {
  loadConfig,
  saveConfig,
  type SectionConfig,
  type DashboardConfig,
} from "@/lib/config";
import { SettingsPanel } from "@/components/settings";

export default function Home() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<DashboardConfig>({ sections: [] });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem("ha_token") || "";
    setToken(tok);
    setSaved(!!tok);
    setConfig(loadConfig());

    const w = localStorage.getItem("ha_wallpaper") || "";
    if (w) {
      document.body.style.backgroundImage = `url(${w})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }, []);

  const { entities, connected, toggle } = useEntities(saved ? token : "");

  const addSection = () => {
    const newConfig: DashboardConfig = {
      sections: [
        ...config.sections,
        { id: crypto.randomUUID(), title: "Новая секция", cards: [] },
      ],
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const updateSection = (updated: SectionConfig) => {
    const newConfig: DashboardConfig = {
      sections: config.sections.map((s) => (s.id === updated.id ? updated : s)),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const deleteSection = (id: string) => {
    const newConfig: DashboardConfig = {
      sections: config.sections.filter((s) => s.id !== id),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  if (!saved) {
    return (
      <main className="min-h-screen bg-background/80 backdrop-blur p-6 flex items-center justify-center">
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
    <main className="min-h-screen bg-background/60 backdrop-blur-sm p-6">
      {/* Шапка */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-2">
          <SettingsPanel
            onReset={() => {
              const empty: DashboardConfig = { sections: [] };
              setConfig(empty);
              saveConfig(empty);
            }}
          />
          <button
            onClick={() => setEditMode(!editMode)}
            className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
              editMode
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {editMode ? "Готово" : "Изменить"}
          </button>
          {editMode && (
            <button
              onClick={addSection}
              className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
            >
              + Секция
            </button>
          )}
        </div>
      </div>

      {/* Секции */}
      {config.sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-lg mb-2">Дашборд пустой</p>
          <p className="text-sm">Нажми «Изменить» → «+ Секция» чтобы начать</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {config.sections.map((section) => (
            <DashboardSection
              key={section.id}
              section={section}
              entities={entities}
              editMode={editMode}
              onToggle={toggle}
              onUpdate={updateSection}
              onDelete={() => deleteSection(section.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
