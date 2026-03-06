"use client";

import { useState, useEffect } from "react";
import { useEntities } from "@/hooks/useEntities";
import { DashboardSection } from "@/components/dashboard-section";
import { Sidebar } from "@/components/sidebar";
import { SettingsPanel } from "@/components/settings";
import {
  loadConfig,
  saveConfig,
  type TabConfig,
  type SectionConfig,
  type DashboardConfig,
  type WidgetType,
} from "@/lib/config";

export default function Home() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<DashboardConfig>({
    tabs: [],
    widgets: [],
  });
  const [activeTabId, setActiveTabId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem("ha_token") || "";
    setToken(tok);
    setSaved(!!tok);

    const cfg = loadConfig();
    setConfig(cfg);
    if (cfg.tabs.length > 0) setActiveTabId(cfg.tabs[0].id);

    const w = localStorage.getItem("ha_wallpaper") || "";
    if (w) {
      document.body.style.backgroundImage = `url(${w})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }, []);

  const { entities, connected, toggle } = useEntities(saved ? token : "");

  const activeTab = config.tabs.find((t) => t.id === activeTabId);

  const addTab = () => {
    const newTab: TabConfig = {
      id: crypto.randomUUID(),
      title: "Новая",
      icon: "📋",
      sections: [],
    };
    const newConfig = { ...config, tabs: [...config.tabs, newTab] };
    setConfig(newConfig);
    saveConfig(newConfig);
    setActiveTabId(newTab.id);
  };

  const updateTab = (updated: TabConfig) => {
    const newConfig = {
      ...config,
      tabs: config.tabs.map((t) => (t.id === updated.id ? updated : t)),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const addSection = () => {
    if (!activeTab) return;
    const newSection: SectionConfig = {
      id: crypto.randomUUID(),
      title: "Новая секция",
      cards: [],
    };
    updateTab({ ...activeTab, sections: [...activeTab.sections, newSection] });
  };

  const updateSection = (section: SectionConfig) => {
    if (!activeTab) return;
    updateTab({
      ...activeTab,
      sections: activeTab.sections.map((s) =>
        s.id === section.id ? section : s,
      ),
    });
  };

  const deleteSection = (id: string) => {
    if (!activeTab) return;
    updateTab({
      ...activeTab,
      sections: activeTab.sections.filter((s) => s.id !== id),
    });
  };

  const addWidget = (type: WidgetType) => {
    const newConfig = {
      ...config,
      widgets: [...config.widgets, { id: crypto.randomUUID(), type }],
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const removeWidget = (id: string) => {
    const newConfig = {
      ...config,
      widgets: config.widgets.filter((w) => w.id !== id),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  if (!saved && process.env.NODE_ENV !== "development") {
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
    <div className="flex min-h-screen">
      {/* Сайдбар */}
      <Sidebar
        tabs={config.tabs}
        activeTabId={activeTabId}
        editMode={editMode}
        widgets={config.widgets}
        onTabSelect={setActiveTabId}
        onAddTab={addTab}
        onSettingsClick={() => setSettingsOpen(true)}
        onAddWidget={addWidget}
        onRemoveWidget={removeWidget}
      />

      {/* Основной контент */}
      <main className="flex-1 bg-background/60 backdrop-blur-sm p-6 overflow-auto">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {activeTab && editMode ? (
              <div className="flex items-center gap-2">
                <input
                  className="text-2xl font-bold bg-transparent border-b border-border text-foreground focus:outline-none focus:border-primary"
                  value={activeTab.title}
                  onChange={(e) =>
                    updateTab({ ...activeTab, title: e.target.value })
                  }
                />
                <input
                  className="text-2xl bg-transparent border-b border-border text-foreground focus:outline-none focus:border-primary w-12 text-center"
                  value={activeTab.icon}
                  onChange={(e) =>
                    updateTab({ ...activeTab, icon: e.target.value })
                  }
                  placeholder="🏠"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab
                  ? `${activeTab.icon} ${activeTab.title}`
                  : "HA Dashboard"}
              </h1>
            )}
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

        {/* Контент вкладки */}
        {config.tabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="text-lg mb-2">Нет вкладок</p>
            <p className="text-sm">
              Нажми «Изменить» — в сайдбаре появится кнопка «+ Вкладка»
            </p>
          </div>
        ) : !activeTab ? null : activeTab.sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="text-lg mb-2">Вкладка пустая</p>
            <p className="text-sm">Нажми «+ Секция» чтобы добавить секцию</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeTab.sections.map((section) => (
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

      {/* Настройки */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={() => {
          const empty: DashboardConfig = { tabs: [], widgets: [] };
          setConfig(empty);
          saveConfig(empty);
          setActiveTabId("");
        }}
      />
    </div>
  );
}
