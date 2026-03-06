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

export type DashboardConfig = {
  sections: SectionConfig[];
};

const DEFAULT_CONFIG: DashboardConfig = {
  sections: [],
};

export function loadConfig(): DashboardConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem("ha_dashboard_config");
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    // Миграция старого формата (cards -> sections)
    if (parsed.cards && !parsed.sections) {
      return {
        sections:
          parsed.cards.length > 0
            ? [
                {
                  id: crypto.randomUUID(),
                  title: "Главная",
                  cards: parsed.cards,
                },
              ]
            : [],
      };
    }
    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: DashboardConfig): void {
  localStorage.setItem("ha_dashboard_config", JSON.stringify(config));
}
