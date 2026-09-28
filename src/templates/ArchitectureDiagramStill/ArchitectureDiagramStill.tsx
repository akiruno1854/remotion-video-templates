import React from "react";
import {AbsoluteFill} from "remotion";
import {DiagramCanvas} from "../../diagram/components/DiagramCanvas";
import {ragLayout} from "../../diagram/generated/ragLayout";
import type {DiagramLayout} from "../../diagram/types";
import {diagramTheme} from "../../diagram/theme/diagramTheme";

export const ArchitectureDiagramStill: React.FC = () => {
  const layout = ragLayout as unknown as DiagramLayout;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 8%, #0D2A3C 0%, ${diagramTheme.background} 46%, #030812 100%)`,
        color: diagramTheme.text,
        fontFamily: 'Arial, "Noto Sans JP", sans-serif',
        padding: "76px 70px 64px",
        boxSizing: "border-box",
      }}
    >
      <div style={{fontSize: 22, fontWeight: 900, color: diagramTheme.accent, letterSpacing: 2}}>SYSTEM DESIGN</div>
      <div style={{fontSize: 58, fontWeight: 900, marginTop: 10, letterSpacing: -1.4}}>RAG Architecture</div>
      <div style={{fontSize: 25, color: diagramTheme.mutedText, marginTop: 10}}>検索 → 文脈取得 → LLM生成の流れを1枚で見る</div>

      <div
        style={{
          marginTop: 48,
          height: 1280,
          borderRadius: 34,
          border: `1.5px solid ${diagramTheme.border}`,
          background: "rgba(5, 17, 31, 0.74)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.30)",
          overflow: "hidden",
        }}
      >
        <DiagramCanvas layout={layout} width={940} height={1280} />
      </div>

      <div style={{display: "flex", gap: 18, marginTop: 34, alignItems: "center"}}>
        <div style={{padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${diagramTheme.border}`, color: diagramTheme.mutedText, fontSize: 18, fontWeight: 800}}>Auto Layout: ELK</div>
        <div style={{fontSize: 20, color: diagramTheme.mutedText}}>ノード座標・矢印経路を手置きしない構成</div>
      </div>
    </AbsoluteFill>
  );
};
