"use client";

import { useState, useMemo } from "react";
import { type HassEntities } from "home-assistant-js-websocket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EntityPickerProps {
  open: boolean;
  onClose: () => void;
  entities: HassEntities;
  onSelect: (entity_id: string) => void;
}

export function EntityPicker({
  open,
  onClose,
  entities,
  onSelect,
}: EntityPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return Object.values(entities).filter(
      (e) =>
        e.entity_id.toLowerCase().includes(q) ||
        (e.attributes.friendly_name || "").toLowerCase().includes(q),
    );
  }, [entities, search]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Добавить карточку</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Поиск сущности..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
          autoFocus
        />
        <div className="overflow-y-auto mt-2 flex flex-col gap-1">
          {filtered.map((entity) => (
            <button
              key={entity.entity_id}
              onClick={() => {
                onSelect(entity.entity_id);
                onClose();
                setSearch("");
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium text-foreground">
                {entity.attributes.friendly_name || entity.entity_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {entity.entity_id}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
