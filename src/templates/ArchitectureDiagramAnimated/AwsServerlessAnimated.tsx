import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {awsServerlessLayout} from "../../diagram/generated/awsServerlessLayout";
import type {DiagramLayout, LayoutEdge} from "../../diagram/types";
import {diagramTheme} from "../../diagram/theme/diagramTheme";
import {diagramFontFamily} from "../../diagram/theme/typography";
import {SystemNode} from "../../diagram/components/SystemNode";

const layout = awsServerlessLayout as unknown as DiagramLayout;

const steps = [
  {
    start: 0,
    end: 180,
    headline: "APIの入口で受ける",
    caption: "HTTPリクエストをAPI Gatewayが受け取る",
    visibleNodes: ["user", "apigw"],
    visibleEdges: ["e-user-apigw"],
    highlightNodes: ["user", "apigw"],
    highlightEdges: ["e-user-apigw"],
  },
  {
    start: 180,
    end: 360,
    headline: "Lambdaを呼び出す",
    caption: "API GatewayからLambdaへ処理を渡す",
    visibleNodes: ["user", "apigw", "lambda"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda"],
    highlightNodes: ["apigw", "lambda"],
    highlightEdges: ["e-apigw-lambda"],
  },
  {
    start: 360,
    end: 570,
    headline: "ロジックを実行する",
    caption: "Lambdaで認証・変換・業務処理を実行",
    visibleNodes: ["user", "apigw", "lambda"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda"],
    highlightNodes: ["lambda"],
    highlightEdges: [],
  },
  {
    start: 570,
    end: 780,
    headline: "DynamoDBを読み書きする",
    caption: "必要なデータを取得・保存する",
    visibleNodes: ["user", "apigw", "lambda", "dynamodb"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda", "e-lambda-dynamodb"],
    highlightNodes: ["lambda", "dynamodb"],
    highlightEdges: ["e-lambda-dynamodb"],
  },
  {
    start: 780,
    end: 1080,
    headline: "基本のサーバーレスAPI",
    caption: "API Gateway → Lambda → DynamoDB",
    visibleNodes: ["user", "apigw", "lambda", "dynamodb"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda", "e-lambda-dynamodb"],
    highlightNodes: ["user", "apigw", "lambda", "dynamodb"],
    highlightEdges: ["e-user-apigw", "e-apigw-lambda", "e-lambda-dynamodb"],
  },
] as const;

const nodeRevealFrame: Record<string, number> = {
  user: 16,
  apigw: 38,
  lambda: 200,
  dynamodb: 590,
};

const edgeRevealFrame: Record<string, number> = {
  "e-user-apigw": 65,
  "e-apigw-lambda": 225,
  "e-lambda-dynamodb": 615,
};

const trimEnd = (points: {x: number; y: number}[], gap = 18) => {
  if (points.length < 2) return points;
  const next = points.map((point) => ({...point}));
  const last = next[next.length - 1];
  const prev = next[next.length - 2];
  const dx = last.x - prev.x;
  const dy = last.y - prev.y;
  const length = Math.hypot(dx, dy);
  if (length <= gap) return next;
  last.x -= (dx / length) * gap;
  last.y -= (dy / length) * gap;
  return next;
};

const toPath = (points: {x: number; y: number}[]) => {
  if (points.length === 0) return "";
  return points.slice(1).reduce((d, p) => `${d} L ${p.x} ${p.y}`, `M ${points[0].x} ${points[0].y}`);
};

const edgeLength = (points: {x: number; y: number}[]) => points.slice(1).reduce((sum, point, index) => {
  const prev = points[index];
  return sum + Math.hypot(point.x - prev.x, point.y - prev.y);
}, 0);

const labelWidth = (label: string) => Math.max(74, Math.min(158, 40 + label.length * 12));

export const AwsServerlessAnimated: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const foundStep = steps.findIndex((s) => frame >= s.start && frame < s.end);
  const currentStepIndex = foundStep === -1 ? steps.length - 1 : foundStep;
  const step = steps[currentStepIndex];

  const width = 940;
  const height = 1210;
  const padding = 36;
  const fitScale = Math.min((width - padding * 2) / layout.width, (height - padding * 2) / layout.height, 1.5);
  const scale = Math.min(fitScale * 1.10, 1.5);
  const offsetX = (width - layout.width * scale) / 2;
  const offsetY = (height - layout.height * scale) / 2;

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 3%, #0D2A3C 0%, ${diagramTheme.background} 44%, #040A12 100%)`, color: diagramTheme.text, fontFamily: diagramFontFamily, padding: "58px 70px 48px", boxSizing: "border-box"}}>
      <div style={{fontSize: 19, fontWeight: 900, color: diagramTheme.accent, letterSpacing: 2}}>AWS SERVERLESS</div>
      <div style={{fontSize: 54, fontWeight: 900, marginTop: 8, lineHeight: 1.1}}>API Gateway + Lambda + DynamoDB</div>
      <div style={{fontSize: 23, color: diagramTheme.mutedText, marginTop: 8}}>サーバーレスAPIの流れ</div>

      <div style={{marginTop: 26, display: "flex", alignItems: "center", gap: 14}}>
        <div style={{fontSize: 15, color: diagramTheme.faintText, fontWeight: 800, letterSpacing: 1.1}}>STEP {currentStepIndex + 1} / {steps.length}</div>
        <div style={{height: 5, flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden"}}>
          <div style={{height: "100%", width: `${((currentStepIndex + 1) / steps.length) * 100}%`, background: diagramTheme.edgeStrong, borderRadius: 999}} />
        </div>
      </div>

      <div style={{fontSize: 42, fontWeight: 850, marginTop: 16, minHeight: 52, lineHeight: 1.2}}>{step.headline}</div>

      <div style={{marginTop: 20, height: 1240, borderRadius: 30, border: `1.5px solid ${diagramTheme.border}`, background: "linear-gradient(180deg, rgba(14,29,45,0.82), rgba(7,17,31,0.90))", boxShadow: diagramTheme.shadow, overflow: "hidden", position: "relative"}}>
        <div style={{position: "absolute", left: 0, top: 12, width, height}}>
          <div style={{position: "absolute", left: offsetX, top: offsetY, width: layout.width, height: layout.height, transform: `scale(${scale})`, transformOrigin: "top left"}}>
            <svg style={{position: "absolute", inset: 0, overflow: "visible"}} width={layout.width} height={layout.height}>
              <defs>
                <marker id="animated-arrow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth={diagramTheme.arrowSize + 0.5} markerHeight={diagramTheme.arrowSize + 0.5} orient="auto">
                  <path d="M 0 1.4 L 9 5 L 0 8.6 z" fill={diagramTheme.edgeStrong} />
                </marker>
              </defs>
              {layout.edges.map((edge: LayoutEdge) => {
                if (!step.visibleEdges.includes(edge.id as never)) return null;
                const visiblePoints = trimEnd(edge.points, 20);
                const d = toPath(visiblePoints);
                if (!d) return null;
                const revealStart = edgeRevealFrame[edge.id] ?? 0;
                const progress = interpolate(frame, [revealStart, revealStart + 32], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
                const length = Math.max(1, edgeLength(visiblePoints));
                const highlighted = step.highlightEdges.includes(edge.id as never);
                const midpoint = visiblePoints[Math.floor(visiblePoints.length / 2)];
                const labelOpacity = interpolate(frame, [revealStart + 18, revealStart + 34], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
                const lw = edge.label ? labelWidth(edge.label) : 0;
                return (
                  <g key={edge.id} opacity={highlighted ? 1 : 0.38}>
                    <path d={d} fill="none" stroke={highlighted ? diagramTheme.edgeStrong : diagramTheme.edge} strokeWidth={highlighted ? 4 : 3} strokeLinejoin="round" strokeLinecap="round" markerEnd={progress > 0.96 ? "url(#animated-arrow)" : undefined} strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
                    {edge.label && midpoint ? (
                      <g transform={`translate(${midpoint.x}, ${midpoint.y})`} opacity={labelOpacity}>
                        <rect x={-lw / 2} y={-18} width={lw} height={32} rx={10} fill={diagramTheme.edgeLabelBg} stroke={diagramTheme.border} strokeWidth={1.2} />
                        <text x={0} y={4} fill={diagramTheme.mutedText} fontFamily={diagramFontFamily} fontSize={13.5} fontWeight={700} textAnchor="middle">{edge.label}</text>
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {layout.nodes.map((node) => {
              if (!step.visibleNodes.includes(node.id as never)) return null;
              const revealStart = nodeRevealFrame[node.id] ?? 0;
              const opacity = interpolate(frame, [revealStart, revealStart + 18], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
              const y = interpolate(frame, [revealStart, revealStart + 18], [10, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
              const highlighted = step.highlightNodes.includes(node.id as never);
              return (
                <div key={node.id} style={{position: "absolute", inset: 0, opacity: opacity * (highlighted ? 1 : 0.46), transform: `translateY(${y}px)`, filter: highlighted ? `drop-shadow(0 0 18px ${diagramTheme.edgeStrong}55)` : "none"}}>
                  <SystemNode node={node} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{marginTop: 20, borderRadius: 22, border: `1px solid ${diagramTheme.border}`, background: "rgba(14,29,45,0.72)", padding: "18px 24px", fontSize: 25, lineHeight: 1.4, color: diagramTheme.mutedText, minHeight: 76, display: "flex", alignItems: "center"}}>
        <span style={{display: "inline-block", flex: "0 0 auto", width: 9, height: 9, borderRadius: 999, background: diagramTheme.edgeStrong, marginRight: 14, boxShadow: `0 0 16px ${diagramTheme.edgeStrong}`}} />
        {step.caption}
      </div>
    </AbsoluteFill>
  );
};
