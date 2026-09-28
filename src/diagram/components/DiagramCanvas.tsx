import React from "react";
import type {DiagramLayout} from "../types";
import {diagramTheme} from "../theme/diagramTheme";
import {diagramFontFamily} from "../theme/typography";
import {SystemNode} from "./SystemNode";

const toPath = (points: {x: number; y: number}[]) => {
  if (points.length === 0) return "";
  return points.slice(1).reduce((d, p) => `${d} L ${p.x} ${p.y}`, `M ${points[0].x} ${points[0].y}`);
};

const labelWidth = (label: string) => Math.max(64, Math.min(132, 34 + label.length * 12));

export const DiagramCanvas: React.FC<{layout: DiagramLayout; width: number; height: number}> = ({layout, width, height}) => {
  const padding = 78;
  const scale = Math.min((width - padding * 2) / layout.width, (height - padding * 2) / layout.height, 1.28);
  const offsetX = (width - layout.width * scale) / 2;
  const offsetY = (height - layout.height * scale) / 2;

  return (
    <div style={{position: "relative", width, height, overflow: "hidden", fontFamily: diagramFontFamily}}>
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: layout.width,
          height: layout.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <svg style={{position: "absolute", inset: 0, overflow: "visible"}} width={layout.width} height={layout.height}>
          <defs>
            <marker id="diagram-arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth={diagramTheme.arrowSize} markerHeight={diagramTheme.arrowSize} orient="auto">
              <path d="M 0 1.4 L 9 5 L 0 8.6 z" fill={diagramTheme.edgeStrong} />
            </marker>
          </defs>
          {layout.edges.map((edge) => {
            const d = toPath(edge.points);
            if (!d) return null;
            const midpoint = edge.points[Math.floor(edge.points.length / 2)];
            const widthForLabel = edge.label ? labelWidth(edge.label) : 0;
            return (
              <g key={edge.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={diagramTheme.edge}
                  strokeWidth={diagramTheme.edgeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  markerEnd="url(#diagram-arrow)"
                />
                {edge.label && midpoint ? (
                  <g transform={`translate(${midpoint.x}, ${midpoint.y})`}>
                    <rect x={-widthForLabel / 2} y={-17} width={widthForLabel} height={30} rx={10} fill={diagramTheme.edgeLabelBg} stroke={diagramTheme.border} strokeWidth={1.2} />
                    <text x={0} y={3} fill={diagramTheme.mutedText} fontFamily={diagramFontFamily} fontSize={12.5} fontWeight={700} textAnchor="middle">
                      {edge.label}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>

        {layout.nodes.map((node) => <SystemNode key={node.id} node={node} />)}
      </div>
    </div>
  );
};
