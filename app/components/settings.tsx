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

interface SettingsProps {
  onReset: () => void;
}

export function SettingsPanel({ onReset }: SettingsProps) {
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

  const saveWallpaper = () => {
    localStorage.setItem("ha_wallpaper", wallpaper);
    window.location.reload();
  };

  const resetDashboard = () => {
    if (confirm("Сбросить дашборд? Все карточки будут удалены.")) {
      onReset();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={16} />
        </button>
      </SheetTrigger>
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
            <p className="text-xs text-muted-foreground">URL изображения</p>
            <input
              className="w-full bg-muted text-foreground rounded px-3 py-2 text-sm border border-border"
              placeholder="https://..."
              value={wallpaper}
              onChange={(e) => setWallpaper(e.target.value)}
            />
            <button
              onClick={saveWallpaper}
              className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
            >
              Применить
            </button>
            {wallpaper && (
              <button
                onClick={() => {
                  setWallpaper("");
                  localStorage.removeItem("ha_wallpaper");
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
