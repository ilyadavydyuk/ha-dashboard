export type CardSize = "small" | "large";

export type CardConfig = {
  id: string;
  entity_id: string;
  size?: CardSize;
};

export type DashboardConfig = {
  cards: CardConfig[];
};

const DEFAULT_CONFIG: DashboardConfig = {
  cards: [],
};

export function loadConfig(): DashboardConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem("ha_dashboard_config");
    return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: DashboardConfig): void {
  localStorage.setItem("ha_dashboard_config", JSON.stringify(config));
}
