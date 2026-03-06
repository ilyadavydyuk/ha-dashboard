"use client";

import { EntityCard } from "@/components/entity-card";
import { EntityPicker } from "@/components/entity-picker";
import { cn } from "@/lib/utils";
import { type HassEntities } from "home-assistant-js-websocket";
import { type SectionConfig, type CardConfig } from "@/lib/config";
import { useState } from "react";
import { Plus, Trash2, Maximize2, Minimize2, X } from "lucide-react";

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
    onUpdate({
      ...section,
      cards: [...section.cards, { id: crypto.randomUUID(), entity_id }],
    });
  };

  const removeCard = (id: string) => {
    onUpdate({ ...section, cards: section.cards.filter((c) => c.id !== id) });
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
        "rounded-2xl p-4 transition-all duration-300",
        editMode
          ? "border border-dashed border-white/20 bg-white/2"
          : "border border-white/6 bg-white/2",
      )}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        {editMode ? (
          <input
            className="text-sm font-semibold tracking-widest uppercase bg-transparent text-white/60 focus:text-white focus:outline-none border-b border-white/20 focus:border-white/50 transition-colors pb-0.5"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          />
        ) : (
          <h2 className="text-xs font-semibold tracking-widest uppercase text-white/40">
            {section.title}
          </h2>
        )}
        {editMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Plus size={12} />
              Карточка
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Сетка */}
      {section.cards.length === 0 ? (
        <div className="h-20 flex items-center justify-center text-white/20 text-sm">
          {editMode ? "Добавь карточку →" : ""}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3" style={{ gridAutoRows: "8vw" }}>
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
                      className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/60 backdrop-blur text-white/70 rounded-lg text-xs flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                    >
                      {isLarge ? (
                        <Minimize2 size={10} />
                      ) : (
                        <Maximize2 size={10} />
                      )}
                    </button>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/80 backdrop-blur text-white rounded-lg text-xs flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                    >
                      <X size={10} />
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
