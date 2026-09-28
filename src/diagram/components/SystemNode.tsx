import React from "react";
import type {LayoutNode} from "../types";
import {diagramTheme} from "../theme/diagramTheme";
import {diagramFontFamily} from "../theme/typography";

const typeLabel: Record<string, string> = {
  actor: "USER",
  server: "SERVER",
  service: "SERVICE",
  compute: "COMPUTE",
  database: "DATA",
  queue: "QUEUE",
  cache: "CACHE",
  model: "MODEL",
  storage: "STORAGE",
  document: "DOCUMENT",
  cpu: "CPU",
  gpu: "GPU",
  gateway: "GATEWAY",
};

const badgeText = (type: string) => {
  switch (type) {
    case "actor": return "U";
    case "database": return "DB";
    case "model": return "AI";
    case "queue": return "Q";
    case "cache": return "C";
    case "gateway": return "GW";
    case "compute": return "λ";
    case "document": return "DOC";
    case "storage": return "ST";
    case "gpu": return "GPU";
    case "cpu": return "CPU";
    default: return "SVC";
  }
};

const paletteFor = (type: string) => {
  if (type === "database" || type === "storage") {
    return {background: diagramTheme.nodeData, accent: diagramTheme.dataAccent};
  }
  if (type === "model") {
    return {background: diagramTheme.nodeModel, accent: diagramTheme.modelAccent};
  }
  if (type === "actor") {
    return {background: diagramTheme.nodeActor, accent: diagramTheme.edgeStrong};
  }
  if (type === "compute") {
    return {background: diagramTheme.nodeService, accent: "#F59E0B"};
  }
  if (type === "gateway") {
    return {background: diagramTheme.nodeService, accent: "#A78BFA"};
  }
  if (type === "document") {
    return {background: diagramTheme.nodeService, accent: "#60A5FA"};
  }
  return {background: diagramTheme.nodeService, accent: diagramTheme.accent};
};

export const SystemNode: React.FC<{node: LayoutNode}> = ({node}) => {
  const palette = paletteFor(node.type);
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
        border: `1.5px solid ${diagramTheme.borderStrong}`,
        background: palette.background,
        boxShadow: diagramTheme.shadow,
        display: "flex",
        alignItems: "center",
        padding: "20px 22px",
        gap: 16,
        fontFamily: diagramFontFamily,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          border: `1.5px solid ${palette.accent}`,
          background: "rgba(7,17,31,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.accent,
          fontSize: badgeText(node.type).length > 2 ? 12 : 17,
          fontWeight: 900,
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        {badgeText(node.type)}
      </div>
      <div style={{minWidth: 0}}>
        <div style={{fontSize: 13, color: palette.accent, fontWeight: 700, letterSpacing: 1.1}}>
          {typeLabel[node.type] ?? node.type.toUpperCase()}
        </div>
        <div style={{fontSize: 24, color: diagramTheme.text, fontWeight: 700, marginTop: 4, lineHeight: 1.18}}>
          {node.label}
        </div>
        {node.subtitle ? (
          <div style={{fontSize: 14, color: diagramTheme.mutedText, marginTop: 7, lineHeight: 1.4, fontWeight: 500}}>
            {node.subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
