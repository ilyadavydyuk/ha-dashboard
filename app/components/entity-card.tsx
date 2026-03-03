"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { type HassEntity } from "home-assistant-js-websocket";

interface EntityCardProps {
  entity: HassEntity;
  onToggle?: (entity_id: string) => void;
}

function getDomain(entity_id: string) {
  return entity_id.split(".")[0];
}

function getIcon(domain: string) {
  switch (domain) {
    case "light":
      return "💡";
    case "switch":
      return "🔌";
    case "sensor":
      return "📊";
    case "climate":
      return "🌡️";
    case "binary_sensor":
      return "⚡";
    case "media_player":
      return "📺";
    default:
      return "🏠";
  }
}

export function EntityCard({ entity, onToggle }: EntityCardProps) {
  const domain = getDomain(entity.entity_id);
  const name = entity.attributes.friendly_name || entity.entity_id;
  const isActive = entity.state === "on";

  const renderContent = () => {
    switch (domain) {
      case "light":
      case "switch":
        return (
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-sm text-muted-foreground">{name}</p>
              <p className="text-lg font-semibold text-foreground">
                {isActive ? "Включён" : "Выключен"}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggle?.(entity.entity_id)}
            />
          </div>
        );

      case "sensor":
        return (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{name}</p>
            <p className="text-2xl font-bold text-foreground">
              {entity.state}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {entity.attributes.unit_of_measurement || ""}
              </span>
            </p>
          </div>
        );

      case "climate":
        return (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{name}</p>
            <p className="text-2xl font-bold text-foreground">
              {entity.attributes.current_temperature ?? entity.state}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                °C
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Целевая: {entity.attributes.temperature ?? "—"}°C
            </p>
          </div>
        );

      default:
        return (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{name}</p>
            <p className="text-lg font-semibold text-foreground">
              {entity.state}
            </p>
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isActive && "border-primary bg-primary/10",
      )}
    >
      <CardContent className="p-4">
        <div className="text-2xl">{getIcon(domain)}</div>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
