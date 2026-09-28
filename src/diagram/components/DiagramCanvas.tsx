import React from "react";
import type {DiagramLayout} from "../types";
import {diagramTheme} from "../theme/diagramTheme";
import {SystemNode} from "./SystemNode";

const toPath = (points: {x: number; y: number}[]) => {
  if (points.length === 0) return "";
  return points.slice(1).reduce((d, p) => `${d} L ${p.x} ${p.y}`, `M ${points[0].x} ${points[0].y}`);
};

export const DiagramCanvas: React.FC<{layout: DiagramLayout; width: number; height: number}> = ({layout, width, height}) => {
  const padding = 56;
  const scale = Math.min((width - padding * 2) / layout.width, (height - padding * 2) / layout.height, 1.22);
  const offsetX = (width - layout.width * scale) / 2;
  const offsetY = (height - layout.height * scale) / 2;

  return (
    <div style={{position: "relative", width, height, overflow: "hidden"}}>
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
            <marker id="diagram-arrow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={diagramTheme.edge} />
            </marker>
          </defs>
          {layout.edges.map((edge) => {
            const d = toPath(edge.points);
            if (!d) return null;
            const midpoint = edge.points[Math.floor(edge.points.length / 2)];
            return (
              <g key={edge.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={diagramTheme.edge}
                  strokeWidth={4}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  markerEnd="url(#diagram-arrow)"
                />
                {edge.label && midpoint ? (
                  <g transform={`translate(${midpoint.x}, ${midpoint.y})`}>
                    <rect x={-48} y={-18} width={96} height={32} rx={12} fill={diagramTheme.background} stroke={diagramTheme.border} strokeWidth={1.5} />
                    <text x={0} y={4} fill={diagramTheme.mutedText} fontSize={13} fontWeight={700} textAnchor="middle">
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
