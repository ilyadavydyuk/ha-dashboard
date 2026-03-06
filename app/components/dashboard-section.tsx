"use client";

import { EntityCard } from "@/components/entity-card";
import { EntityPicker } from "@/components/entity-picker";
import { cn } from "@/lib/utils";
import { type HassEntities } from "home-assistant-js-websocket";
import { type SectionConfig, type CardConfig } from "@/lib/config";
import { useState } from "react";

interface DashboardSectionProps {
  section: SectionConfig;
  entities: HassEntities;
  editMode: boolean;
  onToggle: (entity_id: string) => void;
  onUpdate: (section: SectionConfig) => void;
  onDelete: () => void;
}

export function DashboardSection({
  section,
  entities,
  editMode,
  onToggle,
  onUpdate,
  onDelete,
}: DashboardSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const addCard = (entity_id: string) => {
    const newCards = [...section.cards, { id: crypto.randomUUID(), entity_id }];
    onUpdate({ ...section, cards: newCards });
  };

  const removeCard = (id: string) => {
    const newCards = section.cards.filter((c) => c.id !== id);
    onUpdate({ ...section, cards: newCards });
  };

  const toggleSize = (id: string) => {
    const newCards: CardConfig[] = section.cards.map((c) =>
      c.id === id
        ? {
            ...c,
            size: (c.size === "large"
              ? "small"
              : "large") as CardConfig["size"],
          }
        : c,
    );
    onUpdate({ ...section, cards: newCards });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background/40 backdrop-blur-sm p-4",
        editMode && "border-dashed border-primary/50",
      )}
    >
      {/* Заголовок секции */}
      <div className="flex items-center justify-between mb-4">
        {editMode ? (
          <input
            className="text-lg font-semibold bg-transparent border-b border-border text-foreground focus:outline-none focus:border-primary"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          />
        ) : (
          <h2 className="text-lg font-semibold text-foreground">
            {section.title}
          </h2>
        )}
        {editMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPickerOpen(true)}
              className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground"
            >
              + Карточка
            </button>
            <button
              onClick={onDelete}
              className="text-xs px-2 py-1 rounded-md bg-destructive text-white"
            >
              Удалить
            </button>
          </div>
        )}
      </div>

      {/* Сетка карточек */}
      {section.cards.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
          {editMode ? "Нажми «+ Карточка» чтобы добавить" : "Нет карточек"}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {section.cards.map((card) => {
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
                  onToggle={onToggle}
                />
                {editMode && (
                  <>
                    <button
                      onClick={() => toggleSize(card.id)}
                      className="absolute -top-2 -left-2 w-5 h-5 bg-muted border border-border text-foreground rounded-full text-xs flex items-center justify-center z-10"
                    >
                      {isLarge ? "↙" : "↗"}
                    </button>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full text-xs flex items-center justify-center z-10"
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
    </div>
  );
}
