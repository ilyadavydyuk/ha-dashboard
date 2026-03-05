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
  const [uploading, setUploading] = useState(false);

  const saveToken = () => {
    localStorage.setItem("ha_token", token);
    window.location.reload();
  };

  const uploadWallpaper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("./api/wallpaper", {
      method: "POST",
      body: formData,
    });
    const { url } = await res.json();
    localStorage.setItem("ha_wallpaper", url);
    setWallpaper(url);
    setUploading(false);
    window.location.reload();
  };

  const removeWallpaper = async () => {
    await fetch("./api/wallpaper", { method: "DELETE" });
    localStorage.removeItem("ha_wallpaper");
    setWallpaper("");
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
            {wallpaper && (
              <img
                src={wallpaper}
                className="w-full h-24 object-cover rounded-md"
                alt="wallpaper preview"
              />
            )}
            <label
              className={`text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-center cursor-pointer ${uploading ? "opacity-50" : ""}`}
            >
              {uploading ? "Загрузка..." : "Загрузить картинку"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadWallpaper}
                disabled={uploading}
              />
            </label>
            {wallpaper && (
              <button
                onClick={removeWallpaper}
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
