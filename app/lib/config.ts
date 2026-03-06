export type CardSize = "small" | "large";

export type CardConfig = {
  id: string;
  entity_id: string;
  size?: CardSize;
};

export type SectionConfig = {
  id: string;
  title: string;
  cards: CardConfig[];
};

export type TabConfig = {
  id: string;
  title: string;
  icon: string;
  sections: SectionConfig[];
};

export type WidgetType = "clock-digital" | "clock-analog";

export type WidgetConfig = {
  id: string;
  type: WidgetType;
};

export type DashboardConfig = {
  tabs: TabConfig[];
  widgets: WidgetConfig[];
};

const DEFAULT_CONFIG: DashboardConfig = {
  tabs: [],
  widgets: [],
};

export function loadConfig(): DashboardConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem("ha_dashboard_config");
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);

    // Миграция: sections -> tabs
    if (parsed.sections && !parsed.tabs) {
      return {
        tabs: [
          {
            id: crypto.randomUUID(),
            title: "Главная",
            icon: "🏠",
            sections: parsed.sections,
          },
        ],
        widgets: [],
      };
    }

    // Миграция: добавь widgets если нет
    if (!parsed.widgets) parsed.widgets = [];

    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: DashboardConfig): void {
  localStorage.setItem("ha_dashboard_config", JSON.stringify(config));
}
