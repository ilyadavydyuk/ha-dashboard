"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type WidgetType } from "@/lib/config";

const AVAILABLE_WIDGETS: {
  type: WidgetType;
  label: string;
  description: string;
  preview: string;
}[] = [
  {
    type: "clock-digital",
    label: "Цифровые часы",
    description: "Время и дата в цифровом формате",
    preview: "17:01",
  },
  {
    type: "clock-analog",
    label: "Аналоговые часы",
    description: "Классический циферблат со стрелками",
    preview: "◔",
  },
];

interface WidgetPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: WidgetType) => void;
}

export function WidgetPicker({ open, onClose, onSelect }: WidgetPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Добавить виджет</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          {AVAILABLE_WIDGETS.map((w) => (
            <button
              key={w.type}
              onClick={() => {
                onSelect(w.type);
                onClose();
              }}
              className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-2xl font-bold text-foreground shrink-0">
                {w.preview}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{w.label}</p>
                <p className="text-xs text-muted-foreground">{w.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
