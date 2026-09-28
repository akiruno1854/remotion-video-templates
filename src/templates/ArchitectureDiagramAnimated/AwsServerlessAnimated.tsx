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
    headline: "まずAPIの入口で受ける",
    caption: "ユーザーからのHTTPリクエストをAPI Gatewayが受け取る",
    visibleNodes: ["user", "apigw"],
    visibleEdges: ["e-user-apigw"],
    highlightNodes: ["user", "apigw"],
    highlightEdges: ["e-user-apigw"],
  },
  {
    start: 180,
    end: 360,
    headline: "Lambdaを呼び出す",
    caption: "API GatewayがリクエストをLambda関数へ渡す",
    visibleNodes: ["user", "apigw", "lambda"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda"],
    highlightNodes: ["apigw", "lambda"],
    highlightEdges: ["e-apigw-lambda"],
  },
  {
    start: 360,
    end: 570,
    headline: "ビジネスロジックを実行",
    caption: "Lambdaで認証・変換・業務処理などを実行する",
    visibleNodes: ["user", "apigw", "lambda"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda"],
    highlightNodes: ["lambda"],
    highlightEdges: [],
  },
  {
    start: 570,
    end: 780,
    headline: "DynamoDBを読み書きする",
    caption: "必要なデータをDynamoDBから取得し、必要なら保存する",
    visibleNodes: ["user", "apigw", "lambda", "dynamodb"],
    visibleEdges: ["e-user-apigw", "e-apigw-lambda", "e-lambda-dynamodb"],
    highlightNodes: ["lambda", "dynamodb"],
    highlightEdges: ["e-lambda-dynamodb"],
  },
  {
    start: 780,
    end: 1080,
    headline: "これが基本のサーバーレスAPI",
    caption: "API Gateway → Lambda → DynamoDB を役割ごとに分離する",
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

const toPath = (points: {x: number; y: number}[]) => {
  if (points.length === 0) return "";
  return points.slice(1).reduce((d, p) => `${d} L ${p.x} ${p.y}`, `M ${points[0].x} ${points[0].y}`);
};

const edgeLength = (edge: LayoutEdge) => edge.points.slice(1).reduce((sum, point, index) => {
  const prev = edge.points[index];
  return sum + Math.hypot(point.x - prev.x, point.y - prev.y);
}, 0);

const labelWidth = (label: string) => Math.max(70, Math.min(150, 38 + label.length * 12));

export const AwsServerlessAnimated: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentStepIndex = Math.min(steps.length - 1, steps.findIndex((s) => frame >= s.start && frame < s.end) === -1 ? steps.length - 1 : steps.findIndex((s) => frame >= s.start && frame < s.end));
  const step = steps[currentStepIndex];

  const width = 940;
  const height = 1130;
  const padding = 80;
  const scale = Math.min((width - padding * 2) / layout.width, (height - padding * 2) / layout.height, 1.28);
  const offsetX = (width - layout.width * scale) / 2;
  const offsetY = (height - layout.height * scale) / 2;

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 3%, #0D2A3C 0%, ${diagramTheme.background} 44%, #040A12 100%)`, color: diagramTheme.text, fontFamily: diagramFontFamily, padding: "70px 70px 60px", boxSizing: "border-box"}}>
      <div style={{fontSize: 18, fontWeight: 900, color: diagramTheme.accent, letterSpacing: 2}}>AWS SERVERLESS</div>
      <div style={{fontSize: 50, fontWeight: 900, marginTop: 10, lineHeight: 1.14}}>API Gateway + Lambda + DynamoDB</div>
      <div style={{fontSize: 22, color: diagramTheme.mutedText, marginTop: 10}}>サーバーレスAPIの基本フロー</div>

      <div style={{marginTop: 34, display: "flex", alignItems: "center", gap: 14}}>
        <div style={{fontSize: 14, color: diagramTheme.faintText, fontWeight: 800, letterSpacing: 1.1}}>STEP {currentStepIndex + 1} / {steps.length}</div>
        <div style={{height: 4, flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden"}}>
          <div style={{height: "100%", width: `${((currentStepIndex + 1) / steps.length) * 100}%`, background: diagramTheme.edgeStrong, borderRadius: 999}} />
        </div>
      </div>

      <div style={{fontSize: 34, fontWeight: 850, marginTop: 20, minHeight: 48}}>{step.headline}</div>

      <div style={{marginTop: 26, height: 1190, borderRadius: 30, border: `1.5px solid ${diagramTheme.border}`, background: "linear-gradient(180deg, rgba(14,29,45,0.82), rgba(7,17,31,0.90))", boxShadow: diagramTheme.shadow, overflow: "hidden", position: "relative"}}>
        <div style={{position: "absolute", left: 0, top: 30, width, height}}>
          <div style={{position: "absolute", left: offsetX, top: offsetY, width: layout.width, height: layout.height, transform: `scale(${scale})`, transformOrigin: "top left"}}>
            <svg style={{position: "absolute", inset: 0, overflow: "visible"}} width={layout.width} height={layout.height}>
              <defs>
                <marker id="animated-arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth={diagramTheme.arrowSize} markerHeight={diagramTheme.arrowSize} orient="auto">
                  <path d="M 0 1.4 L 9 5 L 0 8.6 z" fill={diagramTheme.edgeStrong} />
                </marker>
              </defs>
              {layout.edges.map((edge) => {
                if (!step.visibleEdges.includes(edge.id as never)) return null;
                const d = toPath(edge.points);
                if (!d) return null;
                const revealStart = edgeRevealFrame[edge.id] ?? 0;
                const progress = interpolate(frame, [revealStart, revealStart + 32], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
                const length = Math.max(1, edgeLength(edge));
                const highlighted = step.highlightEdges.includes(edge.id as never);
                const midpoint = edge.points[Math.floor(edge.points.length / 2)];
                const labelOpacity = interpolate(frame, [revealStart + 18, revealStart + 34], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
                const lw = edge.label ? labelWidth(edge.label) : 0;
                return (
                  <g key={edge.id} opacity={highlighted ? 1 : 0.42}>
                    <path d={d} fill="none" stroke={highlighted ? diagramTheme.edgeStrong : diagramTheme.edge} strokeWidth={highlighted ? 4 : 3} strokeLinejoin="round" strokeLinecap="round" markerEnd={progress > 0.96 ? "url(#animated-arrow)" : undefined} strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
                    {edge.label && midpoint ? (
                      <g transform={`translate(${midpoint.x}, ${midpoint.y})`} opacity={labelOpacity}>
                        <rect x={-lw / 2} y={-17} width={lw} height={30} rx={10} fill={diagramTheme.edgeLabelBg} stroke={diagramTheme.border} strokeWidth={1.2} />
                        <text x={0} y={3} fill={diagramTheme.mutedText} fontFamily={diagramFontFamily} fontSize={12.5} fontWeight={700} textAnchor="middle">{edge.label}</text>
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
              const highlighted = step.highlightNodes.includes(node.id as never);
              return (
                <div key={node.id} style={{position: "absolute", inset: 0, opacity: opacity * (highlighted ? 1 : 0.48), filter: highlighted ? `drop-shadow(0 0 16px ${diagramTheme.edgeStrong}55)` : "none"}}>
                  <SystemNode node={node} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{marginTop: 28, borderRadius: 22, border: `1px solid ${diagramTheme.border}`, background: "rgba(14,29,45,0.72)", padding: "22px 26px", fontSize: 22, lineHeight: 1.5, color: diagramTheme.mutedText, minHeight: 82, display: "flex", alignItems: "center"}}>
        <span style={{display: "inline-block", width: 8, height: 8, borderRadius: 999, background: diagramTheme.edgeStrong, marginRight: 14, boxShadow: `0 0 16px ${diagramTheme.edgeStrong}`}} />
        {step.caption}
      </div>

      <div style={{marginTop: 16, textAlign: "right", color: diagramTheme.faintText, fontSize: 14}}>30 fps • {Math.round(1080 / fps)} sec</div>
    </AbsoluteFill>
  );
};
