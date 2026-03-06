"use client";

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

function getIcon(domain: string, isActive: boolean) {
  switch (domain) {
    case "light":
      return isActive ? "💡" : "🔆";
    case "switch":
      return "⚡";
    case "sensor":
      return "📡";
    case "climate":
      return "🌡️";
    case "binary_sensor":
      return "🔔";
    case "media_player":
      return "🎵";
    default:
      return "◎";
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
  const isToggleable = domain === "light" || domain === "switch";

  return (
    <div
      onClick={isToggleable ? () => onToggle?.(entity.entity_id) : undefined}
      className={cn(
        "relative h-full rounded-2xl p-4 transition-all duration-300 overflow-hidden group",
        "glass",
        isToggleable && "cursor-pointer",
        isActive && "glow-active",
        isActive ? "border-blue-500/30" : "border-white/8",
        isLarge ? "p-5" : "p-4",
      )}
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)"
          : "rgba(255,255,255,0.04)",
      }}
    >
      {/* Фоновое свечение для активных */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.3), transparent 70%)",
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Верхняя часть — иконка */}
        <div
          className={cn(
            "rounded-xl flex items-center justify-center w-fit",
            isActive ? "text-blue-400" : "text-white/40",
            isLarge ? "text-3xl mb-3" : "text-xl mb-2",
          )}
        >
          {getIcon(domain, isActive)}
        </div>

        {/* Нижняя часть — контент */}
        {domain === "light" || domain === "switch" ? (
          <div className="flex items-end justify-between">
            <div>
              <p
                className={cn(
                  "text-white/50 leading-tight",
                  isLarge ? "text-sm mb-1" : "text-xs mb-0.5",
                )}
              >
                {name}
              </p>
              <p
                className={cn(
                  "font-semibold leading-tight",
                  isActive ? "text-white" : "text-white/40",
                  isLarge ? "text-xl" : "text-sm",
                )}
              >
                {isActive ? "Вкл" : "Выкл"}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggle?.(entity.entity_id)}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
            />
          </div>
        ) : domain === "sensor" ? (
          <div>
            <p
              className={cn(
                "text-white/50 leading-tight mb-1",
                isLarge ? "text-sm" : "text-xs",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-bold text-white leading-none",
                isLarge ? "text-4xl" : "text-xl",
              )}
            >
              {entity.state}
              <span
                className={cn(
                  "font-normal text-white/40 ml-1",
                  isLarge ? "text-lg" : "text-xs",
                )}
              >
                {entity.attributes.unit_of_measurement || ""}
              </span>
            </p>
          </div>
        ) : domain === "climate" ? (
          <div>
            <p
              className={cn(
                "text-white/50 leading-tight mb-1",
                isLarge ? "text-sm" : "text-xs",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-bold text-white leading-none",
                isLarge ? "text-4xl" : "text-xl",
              )}
            >
              {entity.attributes.current_temperature ?? entity.state}
              <span
                className={cn(
                  "font-normal text-white/40 ml-1",
                  isLarge ? "text-lg" : "text-xs",
                )}
              >
                °C
              </span>
            </p>
            {isLarge && (
              <p className="text-xs text-white/30 mt-1">
                Цель: {entity.attributes.temperature ?? "—"}°C
              </p>
            )}
          </div>
        ) : (
          <div>
            <p
              className={cn(
                "text-white/50 leading-tight mb-1",
                isLarge ? "text-sm" : "text-xs",
              )}
            >
              {name}
            </p>
            <p
              className={cn(
                "font-semibold text-white",
                isLarge ? "text-xl" : "text-sm",
              )}
            >
              {entity.state}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
