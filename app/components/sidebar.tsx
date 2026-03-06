"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TabConfig,
  type WidgetConfig,
  type WidgetType,
} from "@/lib/config";
import { ClockWidget } from "@/components/clock-widget";
import { WidgetPicker } from "@/components/widget-picker";

interface SidebarProps {
  tabs: TabConfig[];
  activeTabId: string;
  editMode: boolean;
  widgets: WidgetConfig[];
  onTabSelect: (id: string) => void;
  onAddTab: () => void;
  onSettingsClick: () => void;
  onAddWidget: (type: WidgetType) => void;
  onRemoveWidget: (id: string) => void;
}

function renderWidget(widget: WidgetConfig) {
  switch (widget.type) {
    case "clock-digital":
      return <ClockWidget type="digital" />;
    case "clock-analog":
      return <ClockWidget type="analog" />;
    default:
      return null;
  }
}

export function Sidebar({
  tabs,
  activeTabId,
  editMode,
  widgets,
  onTabSelect,
  onAddTab,
  onSettingsClick,
  onAddWidget,
  onRemoveWidget,
}: SidebarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "rgba(10, 12, 20, 0.7)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Верхняя часть — виджеты */}
      <div
        style={{
          padding: "24px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {widgets.length === 0 && !editMode ? (
          <div
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "12px",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            Нет виджетов
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {widgets.map((widget) => (
              <div key={widget.id} style={{ position: "relative" }}>
                {renderWidget(widget)}
                {editMode && (
                  <button
                    onClick={() => onRemoveWidget(widget.id)}
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(239,68,68,0.9)",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={() => setPickerOpen(true)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "1px dashed rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Plus size={12} /> Виджет
              </button>
            )}
          </div>
        )}
      </div>

      {/* Навигация — вкладки */}
      <nav
        style={{
          flex: 1,
          padding: "12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          overflowY: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
                transition: "all 0.2s",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                color: isActive
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.45)",
              }}
            >
              <span style={{ fontSize: "20px", lineHeight: 1 }}>
                {tab.icon}
              </span>
              <span
                style={{ fontSize: "14px", fontWeight: isActive ? 600 : 400 }}
              >
                {tab.title}
              </span>
            </button>
          );
        })}

        {editMode && (
          <button
            onClick={onAddTab}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px dashed rgba(255,255,255,0.15)",
              background: "transparent",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            <Plus size={16} /> Вкладка
          </button>
        )}
      </nav>

      {/* Нижняя часть — настройки */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={onSettingsClick}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            transition: "all 0.2s",
          }}
        >
          <Settings size={16} /> Настройки
        </button>
      </div>

      <WidgetPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onAddWidget}
      />
    </aside>
  );
}
