"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const WALLPAPERS = [
  { id: "night-stars", label: "Звёзды", url: "./wallpapers/1.jpg" },
  { id: "mountains", label: "Горы", url: "./wallpapers/2.jpg" },
];

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function SettingsPanel({ open, onClose, onReset }: SettingsProps) {
  const [token, setToken] = useState(
    () => localStorage.getItem("ha_token") || "",
  );
  const [wallpaper, setWallpaper] = useState(
    () => localStorage.getItem("ha_wallpaper") || "",
  );

  const saveToken = () => {
    localStorage.setItem("ha_token", token);
    window.location.reload();
  };

  const resetDashboard = () => {
    if (confirm("Сбросить дашборд? Все карточки будут удалены.")) {
      onReset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Настройки</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Токен */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Long-lived токен
            </label>
            <textarea
              className="w-full bg-muted text-foreground rounded px-3 py-2 text-xs border border-border resize-none h-24"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              onClick={saveToken}
              className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
            >
              Сохранить токен
            </button>
          </div>

          {/* Обои */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Обои</label>
            <div className="grid grid-cols-2 gap-2">
              {WALLPAPERS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    localStorage.setItem("ha_wallpaper", w.url);
                    setWallpaper(w.url);
                    window.location.reload();
                  }}
                  className={`relative rounded-md overflow-hidden h-16 border-2 transition-colors ${
                    wallpaper === w.url
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={w.url}
                    className="w-full h-full object-cover"
                    alt={w.label}
                  />
                  <span className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/50 py-0.5 text-center">
                    {w.label}
                  </span>
                </button>
              ))}
            </div>
            {wallpaper && (
              <button
                onClick={() => {
                  localStorage.removeItem("ha_wallpaper");
                  setWallpaper("");
                  window.location.reload();
                }}
                className="text-sm px-3 py-1.5 rounded-md border border-border text-muted-foreground"
              >
                Убрать обои
              </button>
            )}
          </div>

          {/* Сброс */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <label className="text-sm font-medium text-foreground">
              Опасная зона
            </label>
            <button
              onClick={resetDashboard}
              className="text-sm px-3 py-1.5 rounded-md bg-destructive text-white"
            >
              Сбросить дашборд
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
