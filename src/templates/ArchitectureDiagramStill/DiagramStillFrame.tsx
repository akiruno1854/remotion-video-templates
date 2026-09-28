import React from "react";
import {AbsoluteFill} from "remotion";
import {DiagramCanvas} from "../../diagram/components/DiagramCanvas";
import type {DiagramLayout} from "../../diagram/types";
import {diagramTheme} from "../../diagram/theme/diagramTheme";
import {diagramFontFamily} from "../../diagram/theme/typography";

export const DiagramStillFrame: React.FC<{
  layout: DiagramLayout;
  title: string;
  subtitle: string;
  eyebrow?: string;
  footer?: string;
}> = ({layout, title, subtitle, eyebrow = "SYSTEM DESIGN", footer = "Auto layout by ELK"}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 4%, #0D2A3C 0%, ${diagramTheme.background} 42%, #040A12 100%)`,
        color: diagramTheme.text,
        fontFamily: diagramFontFamily,
        padding: "72px 70px 58px",
        boxSizing: "border-box",
      }}
    >
      <div style={{fontSize: 20, fontWeight: 900, color: diagramTheme.accent, letterSpacing: 2.2}}>{eyebrow}</div>
      <div style={{fontSize: 54, fontWeight: 900, marginTop: 12, letterSpacing: -1.2, lineHeight: 1.14}}>{title}</div>
      <div style={{fontSize: 24, color: diagramTheme.mutedText, marginTop: 12, fontWeight: 500}}>{subtitle}</div>

      <div
        style={{
          marginTop: 44,
          height: 1360,
          borderRadius: 30,
          border: `1.5px solid ${diagramTheme.border}`,
          background: `linear-gradient(180deg, rgba(14,29,45,0.80) 0%, rgba(7,17,31,0.86) 100%)`,
          boxShadow: "0 28px 90px rgba(0,0,0,0.32)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{position: "absolute", top: 26, left: 30, right: 30, display: "flex", justifyContent: "space-between", color: diagramTheme.faintText, fontSize: 15, fontWeight: 700, letterSpacing: 0.8}}>
          <span>REQUEST / DATA FLOW</span>
          <span>{footer}</span>
        </div>
        <div style={{position: "absolute", top: 62, left: 0, right: 0, bottom: 0}}>
          <DiagramCanvas layout={layout} width={940} height={1298} />
        </div>
      </div>

      <div style={{marginTop: 30, display: "flex", alignItems: "center", gap: 14, color: diagramTheme.mutedText, fontSize: 19, fontWeight: 500}}>
        <span style={{width: 9, height: 9, borderRadius: 999, background: diagramTheme.edgeStrong, boxShadow: `0 0 18px ${diagramTheme.edgeStrong}`}} />
        共通ノード・共通矢印・共通タイポグラフィで統一
      </div>
    </AbsoluteFill>
  );
};
