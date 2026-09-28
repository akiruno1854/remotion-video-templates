import React from "react";
import type {LayoutNode} from "../types";
import {diagramTheme} from "../theme/diagramTheme";

const typeLabel: Record<string, string> = {
  actor: "USER",
  server: "SERVER",
  service: "SERVICE",
  database: "DATABASE",
  queue: "QUEUE",
  cache: "CACHE",
  model: "MODEL",
  storage: "STORAGE",
  cpu: "CPU",
  gpu: "GPU",
  gateway: "GATEWAY",
};

const iconFor = (type: string) => {
  switch (type) {
    case "database": return "DB";
    case "model": return "AI";
    case "actor": return "U";
    case "queue": return "Q";
    case "cache": return "C";
    case "gpu": return "GPU";
    case "cpu": return "CPU";
    default: return "▣";
  }
};

export const SystemNode: React.FC<{node: LayoutNode}> = ({node}) => {
  const isAccent = node.type === "model" || node.type === "database";
  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        boxSizing: "border-box",
        borderRadius: diagramTheme.cornerRadius,
        border: `2px solid ${isAccent ? diagramTheme.accent : diagramTheme.border}`,
        background: isAccent ? "#0C2632" : diagramTheme.panel,
        boxShadow: diagramTheme.shadow,
        display: "flex",
        alignItems: "center",
        padding: "20px 22px",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: node.type === "database" ? 16 : 14,
          border: `2px solid ${isAccent ? diagramTheme.accentStrong : diagramTheme.border}`,
          background: diagramTheme.panelMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isAccent ? diagramTheme.accentStrong : diagramTheme.mutedText,
          fontSize: iconFor(node.type).length > 2 ? 13 : 18,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {iconFor(node.type)}
      </div>
      <div style={{minWidth: 0}}>
        <div style={{fontSize: 14, color: diagramTheme.mutedText, fontWeight: 800, letterSpacing: 1.3}}>
          {typeLabel[node.type] ?? node.type.toUpperCase()}
        </div>
        <div style={{fontSize: 24, color: diagramTheme.text, fontWeight: 800, marginTop: 4, lineHeight: 1.15}}>
          {node.label}
        </div>
        {node.subtitle ? (
          <div style={{fontSize: 15, color: diagramTheme.mutedText, marginTop: 7, lineHeight: 1.25}}>
            {node.subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
