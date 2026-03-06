"use client";

import { useState, useEffect } from "react";
import { useEntities } from "@/hooks/useEntities";
import { EntityCard } from "@/components/entity-card";
import { EntityPicker } from "@/components/entity-picker";
import { loadConfig, saveConfig, type CardConfig } from "@/lib/config";
import { SettingsPanel } from "@/components/settings";
import { cn } from "@/lib/utils";

export default function Home() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [cards, setCards] = useState<CardConfig[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem("ha_token") || "";
    setToken(tok);
    setSaved(!!tok);
    setCards(loadConfig().cards);

    const w = localStorage.getItem("ha_wallpaper") || "";
    if (w) {
      document.body.style.backgroundImage = `url(${w})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }, []);

  const { entities, connected, toggle } = useEntities(saved ? token : "");

  const addCard = (entity_id: string) => {
    const newCards = [...cards, { id: crypto.randomUUID(), entity_id }];
    setCards(newCards);
    saveConfig({ cards: newCards });
  };

  const removeCard = (id: string) => {
    const newCards = cards.filter((c) => c.id !== id);
    setCards(newCards);
    saveConfig({ cards: newCards });
  };

  const toggleSize = (id: string) => {
    const newCards: CardConfig[] = cards.map((c) =>
      c.id === id
        ? {
            ...c,
            size: (c.size === "large"
              ? "small"
              : "large") as CardConfig["size"],
          }
        : c,
    );
    setCards(newCards);
    saveConfig({ cards: newCards });
  };

  if (!saved) {
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
    <main className="min-h-screen bg-background/60 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">HA Dashboard</h1>
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
          <SettingsPanel
            onReset={() => {
              saveConfig({ cards: [] });
              setCards([]);
            }}
          />
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
          <button
            onClick={() => setPickerOpen(true)}
            className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
          >
            + Добавить
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-lg mb-2">Дашборд пустой</p>
          <p className="text-sm">Нажми «+ Добавить» чтобы добавить карточку</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const entity = entities[card.entity_id];
            if (!entity) return null;
            const isLarge = card.size === "large";
            return (
              <div
                key={card.id}
                className={cn(
                  "relative",
                  isLarge ? "col-span-2 row-span-2" : "col-span-1",
                )}
              >
                <EntityCard
                  entity={entity}
                  size={card.size}
                  onToggle={toggle}
                />
                {editMode && (
                  <>
                    <button
                      onClick={() => toggleSize(card.id)}
                      className="absolute -top-2 -left-2 w-6 h-6 bg-muted border border-border text-foreground rounded-full text-xs flex items-center justify-center"
                    >
                      {isLarge ? "↙" : "↗"}
                    </button>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EntityPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        entities={entities}
        onSelect={addCard}
      />
    </main>
  );
}
