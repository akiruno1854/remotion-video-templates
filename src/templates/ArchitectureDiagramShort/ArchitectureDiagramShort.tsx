import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

export type ArchitectureNode = {
  id: string;
  label: string;
  type: "actor" | "server" | "service" | "database" | "queue" | "cache" | "model" | "storage";
  x: number;
  y: number;
};

export type ArchitectureEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type ArchitectureStep = {
  start: number;
  end: number;
  headline: string;
  caption: string;
  highlightNodes: string[];
  highlightEdges: string[];
};

export type ArchitectureDiagramShortProps = {
  title: string;
  subtitle?: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  steps: ArchitectureStep[];
};

const fps = 30;
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const iconFor = (type: ArchitectureNode["type"]) => {
  switch (type) {
    case "actor": return "USER";
    case "server": return "SERVER";
    case "service": return "SERVICE";
    case "database": return "DB";
    case "queue": return "QUEUE";
    case "cache": return "CACHE";
    case "model": return "LLM";
    case "storage": return "STORE";
  }
};

const NodeCard: React.FC<{
  node: ArchitectureNode;
  active: boolean;
  visible: boolean;
}> = ({node, active, visible}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 18], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: 230,
        minHeight: 128,
        padding: "18px 18px 20px",
        borderRadius: 24,
        border: `3px solid ${active ? "#67E8F9" : "#334155"}`,
        background: active ? "rgba(14,116,144,.32)" : "rgba(15,23,42,.9)",
        boxShadow: active ? "0 0 42px rgba(103,232,249,.27)" : "0 12px 36px rgba(0,0,0,.2)",
        color: "white",
        opacity: visible ? p : 0.16,
        transform: active ? "scale(1.04)" : "scale(1)",
      }}
    >
      <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 1.8, color: active ? "#67E8F9" : "#94A3B8"}}>
        {iconFor(node.type)}
      </div>
      <div style={{fontSize: 34, fontWeight: 900, lineHeight: 1.08, marginTop: 12}}>{node.label}</div>
    </div>
  );
};

const ArrowLayer: React.FC<{
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  activeEdges: string[];
}> = ({nodes, edges, activeEdges}) => {
  const center = (id: string) => {
    const n = nodes.find((x) => x.id === id)!;
    return {x: n.x + 115, y: n.y + 64};
  };
  return (
    <svg width="1080" height="1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <defs>
        <marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L12,6 L0,12 z" fill="#67E8F9" />
        </marker>
        <marker id="arrow-muted" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L12,6 L0,12 z" fill="#475569" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = center(e.from);
        const b = center(e.to);
        const active = activeEdges.includes(e.id);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const startX = a.x + ux * 125;
        const startY = a.y + uy * 72;
        const endX = b.x - ux * 130;
        const endY = b.y - uy * 72;
        const mx = (startX + endX) / 2;
        const my = (startY + endY) / 2;
        return (
          <g key={e.id}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={active ? "#67E8F9" : "#475569"}
              strokeWidth={active ? 8 : 4}
              markerEnd={active ? "url(#arrow)" : "url(#arrow-muted)"}
              opacity={active ? 1 : 0.45}
            />
            {e.label ? (
              <text x={mx} y={my - 12} textAnchor="middle" fill={active ? "#CFFAFE" : "#94A3B8"} fontSize="24" fontWeight="700">
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

export const ragArchitectureSample: ArchitectureDiagramShortProps = {
  title: "RAGはどう動く？",
  subtitle: "検索してから生成する",
  nodes: [
    {id: "user", label: "User", type: "actor", x: 80, y: 470},
    {id: "api", label: "API Server", type: "server", x: 425, y: 470},
    {id: "llm", label: "LLM", type: "model", x: 770, y: 470},
    {id: "retriever", label: "Retriever", type: "service", x: 260, y: 850},
    {id: "vectordb", label: "Vector DB", type: "database", x: 620, y: 850},
  ],
  edges: [
    {id: "user-api", from: "user", to: "api", label: "query"},
    {id: "api-retriever", from: "api", to: "retriever", label: "search"},
    {id: "retriever-vectordb", from: "retriever", to: "vectordb", label: "top-k"},
    {id: "vectordb-api", from: "vectordb", to: "api", label: "context"},
    {id: "api-llm", from: "api", to: "llm", label: "prompt + context"},
  ],
  steps: [
    {start: 0, end: 10, headline: "1. Userが質問", caption: "まずAPI ServerへQueryを送る", highlightNodes: ["user", "api"], highlightEdges: ["user-api"]},
    {start: 10, end: 24, headline: "2. 関連情報を検索", caption: "RetrieverがVector DBからTop-kを取得", highlightNodes: ["api", "retriever", "vectordb"], highlightEdges: ["api-retriever", "retriever-vectordb"]},
    {start: 24, end: 40, headline: "3. Contextを戻す", caption: "検索結果をAPI側へ戻してPromptに追加", highlightNodes: ["vectordb", "api"], highlightEdges: ["vectordb-api"]},
    {start: 40, end: 54, headline: "4. LLMが回答生成", caption: "Promptと検索結果をまとめてLLMへ送る", highlightNodes: ["api", "llm"], highlightEdges: ["api-llm"]},
    {start: 54, end: 60, headline: "RAG = Retrieval + Generation", caption: "外部情報を検索してから生成する", highlightNodes: ["user", "api", "retriever", "vectordb", "llm"], highlightEdges: ["user-api", "api-retriever", "retriever-vectordb", "vectordb-api", "api-llm"]},
  ],
};

export const ArchitectureDiagramShort: React.FC<ArchitectureDiagramShortProps> = (props) => {
  const frame = useCurrentFrame();
  const sec = frame / fps;
  const stepIndex = Math.max(0, props.steps.findIndex((s) => sec >= s.start && sec < s.end));
  const step = props.steps[stepIndex] ?? props.steps[props.steps.length - 1];
  const localFrame = frame - step.start * fps;
  const captionOpacity = interpolate(localFrame, [0, 14], [0, 1], clamp);

  const revealedNodes = new Set<string>();
  const revealedEdges = new Set<string>();
  props.steps.slice(0, stepIndex + 1).forEach((s) => {
    s.highlightNodes.forEach((id) => revealedNodes.add(id));
    s.highlightEdges.forEach((id) => revealedEdges.add(id));
  });

  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 8%, #0F2942 0%, #07111E 43%, #020617 100%)", fontFamily: "Arial, 'Noto Sans JP', sans-serif", color: "white"}}>
      <div style={{position: "absolute", top: 72, left: 72, right: 72}}>
        <div style={{fontSize: 28, color: "#67E8F9", fontWeight: 900, letterSpacing: 2}}>SYSTEM DESIGN SHORT</div>
        <div style={{fontSize: 68, fontWeight: 900, lineHeight: 1.05, marginTop: 14}}>{props.title}</div>
        {props.subtitle ? <div style={{fontSize: 30, color: "#94A3B8", marginTop: 10}}>{props.subtitle}</div> : null}
      </div>

      <div style={{position: "absolute", top: 330, left: 72, fontSize: 32, fontWeight: 900, color: "#CFFAFE", opacity: captionOpacity}}>{step.headline}</div>
      <div style={{position: "absolute", top: 330, right: 72, fontSize: 24, fontWeight: 800, color: "#64748B"}}>{stepIndex + 1} / {props.steps.length}</div>

      <ArrowLayer nodes={props.nodes} edges={props.edges.filter((e) => revealedEdges.has(e.id))} activeEdges={step.highlightEdges} />
      {props.nodes.map((node) => (
        <NodeCard key={node.id} node={node} active={step.highlightNodes.includes(node.id)} visible={revealedNodes.has(node.id)} />
      ))}

      <div style={{position: "absolute", left: 72, right: 72, bottom: 120, padding: "28px 34px", borderRadius: 26, background: "rgba(15,23,42,.88)", border: "2px solid #334155", fontSize: 34, fontWeight: 800, lineHeight: 1.35, opacity: captionOpacity}}>
        {step.caption}
      </div>
    </AbsoluteFill>
  );
};
