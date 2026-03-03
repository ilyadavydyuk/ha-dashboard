"use client";

import { useState, useEffect } from "react";
import { useEntities } from "@/hooks/useEntities";
import { EntityCard } from "@/components/entity-card";
import { EntityPicker } from "@/components/entity-picker";
import { loadConfig, saveConfig, type CardConfig } from "@/lib/config";

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
  }, []);

  const { entities, connected } = useEntities(saved ? token : "");

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

  if (!saved) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
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
    <main className="min-h-screen bg-background p-6">
      {/* Шапка */}
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

      {/* Карточки */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-lg mb-2">Дашборд пустой</p>
          <p className="text-sm">Нажми «+ Добавить» чтобы добавить карточку</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const entity = entities[card.entity_id];
            return (
              <div key={card.id} className="relative">
                <EntityCard
                  entity={entity}
                  onToggle={(entity_id) => {
                    // callService будем добавлять следующим шагом
                    console.log("toggle", entity_id);
                  }}
                />
                {editMode && (
                  <button
                    onClick={() => removeCard(card.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Модалка выбора */}
      <EntityPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        entities={entities}
        onSelect={addCard}
      />
    </main>
  );
}
