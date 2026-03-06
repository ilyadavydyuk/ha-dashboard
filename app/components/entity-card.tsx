"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { type HassEntity } from "home-assistant-js-websocket";

interface EntityCardProps {
  entity: HassEntity;
  size?: "small" | "large";
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

export function EntityCard({
  entity,
  size = "small",
  onToggle,
}: EntityCardProps) {
  const domain = getDomain(entity.entity_id);
  const name = entity.attributes.friendly_name || entity.entity_id;
  const isActive = entity.state === "on";
  const isLarge = size === "large";

  const renderContent = () => {
    switch (domain) {
      case "light":
      case "switch":
        return (
          <div
            className={cn(
              "flex items-center justify-between",
              isLarge ? "mt-6" : "mt-3",
            )}
          >
            <div>
              <p
                className={cn(
                  "text-muted-foreground",
                  isLarge ? "text-base" : "text-sm",
                )}
              >
                {name}
              </p>
              <p
                className={cn(
                  "font-semibold text-foreground",
                  isLarge ? "text-2xl mt-1" : "text-lg",
                )}
              >
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
          <div className={cn(isLarge ? "mt-6" : "mt-3")}>
            <p
              className={cn(
                "text-muted-foreground",
                isLarge ? "text-base" : "text-sm",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-bold text-foreground",
                isLarge ? "text-5xl mt-2" : "text-2xl",
              )}
            >
              {entity.state}
              <span
                className={cn(
                  "font-normal text-muted-foreground ml-1",
                  isLarge ? "text-xl" : "text-sm",
                )}
              >
                {entity.attributes.unit_of_measurement || ""}
              </span>
            </p>
          </div>
        );

      case "climate":
        return (
          <div className={cn(isLarge ? "mt-6" : "mt-3")}>
            <p
              className={cn(
                "text-muted-foreground",
                isLarge ? "text-base" : "text-sm",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-bold text-foreground",
                isLarge ? "text-5xl mt-2" : "text-2xl",
              )}
            >
              {entity.attributes.current_temperature ?? entity.state}
              <span
                className={cn(
                  "font-normal text-muted-foreground ml-1",
                  isLarge ? "text-xl" : "text-sm",
                )}
              >
                °C
              </span>
            </p>
            <p
              className={cn(
                "text-muted-foreground mt-1",
                isLarge ? "text-sm" : "text-xs",
              )}
            >
              Целевая: {entity.attributes.temperature ?? "—"}°C
            </p>
          </div>
        );

      default:
        return (
          <div className={cn(isLarge ? "mt-6" : "mt-3")}>
            <p
              className={cn(
                "text-muted-foreground",
                isLarge ? "text-base" : "text-sm",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-semibold text-foreground",
                isLarge ? "text-2xl mt-1" : "text-lg",
              )}
            >
              {entity.state}
            </p>
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 h-full",
        isActive && "border-primary bg-primary/10",
      )}
    >
      <CardContent className={cn("h-full", isLarge ? "p-6" : "p-4")}>
        <div className={cn(isLarge ? "text-4xl" : "text-2xl")}>
          {getIcon(domain)}
        </div>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
