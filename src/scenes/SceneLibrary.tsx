import React from "react";
import {AbsoluteFill} from "remotion";
import {diagramTheme} from "../diagram/theme/diagramTheme";
import {diagramFontFamily} from "../diagram/theme/typography";

type FrameProps = {eyebrow: string; title: string; subtitle: string; children: React.ReactNode};

const SceneFrame: React.FC<FrameProps> = ({eyebrow, title, subtitle, children}) => (
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
    <div style={{fontSize: 58, fontWeight: 900, marginTop: 12, letterSpacing: -1.2, lineHeight: 1.12}}>{title}</div>
    <div style={{fontSize: 24, color: diagramTheme.mutedText, marginTop: 12, fontWeight: 500}}>{subtitle}</div>
    <div
      style={{
        marginTop: 44,
        flex: 1,
        borderRadius: 30,
        border: `1.5px solid ${diagramTheme.border}`,
        background: "linear-gradient(180deg, rgba(14,29,45,0.80) 0%, rgba(7,17,31,0.86) 100%)",
        boxShadow: diagramTheme.shadow,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

export type TerminalLine = {kind: "command" | "output" | "comment"; text: string};
export type TerminalPanelProps = {title: string; lines: TerminalLine[]; highlightLines?: number[]};

export const TerminalPanel: React.FC<TerminalPanelProps> = ({title, lines, highlightLines = []}) => (
  <div style={{height: "100%", padding: 34, boxSizing: "border-box"}}>
    <div style={{height: "100%", borderRadius: 22, background: "#06101A", border: `1.5px solid ${diagramTheme.borderStrong}`, overflow: "hidden"}}>
      <div style={{height: 68, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", background: "#102235", borderBottom: `1px solid ${diagramTheme.border}`}}>
        <span style={{width: 14, height: 14, borderRadius: 999, background: "#FF5F57"}} />
        <span style={{width: 14, height: 14, borderRadius: 999, background: "#FEBC2E"}} />
        <span style={{width: 14, height: 14, borderRadius: 999, background: "#28C840"}} />
        <span style={{marginLeft: 14, color: diagramTheme.mutedText, fontSize: 18, fontWeight: 700}}>{title}</span>
      </div>
      <div style={{padding: "30px 30px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 26, lineHeight: 1.62}}>
        {lines.map((line, i) => {
          const highlighted = highlightLines.includes(i);
          const color = line.kind === "command" ? diagramTheme.edgeStrong : line.kind === "comment" ? diagramTheme.faintText : "#DCE7F1";
          return (
            <div key={i} style={{display: "flex", gap: 12, padding: "7px 12px", margin: "2px 0", borderRadius: 10, background: highlighted ? "rgba(34,211,238,0.10)" : "transparent", border: highlighted ? "1px solid rgba(34,211,238,0.28)" : "1px solid transparent"}}>
              <span style={{width: 26, color: line.kind === "command" ? diagramTheme.dataAccent : diagramTheme.faintText}}>{line.kind === "command" ? "$" : ""}</span>
              <span style={{color, whiteSpace: "pre-wrap"}}>{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export type TreeItem = {path: string; kind: "folder" | "file"; depth: number};
export type DirectoryTreeProps = {root: string; items: TreeItem[]; highlightPaths?: string[]};

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({root, items, highlightPaths = []}) => (
  <div style={{height: "100%", padding: "46px 54px", boxSizing: "border-box"}}>
    <div style={{fontSize: 30, fontWeight: 800, marginBottom: 24}}>📁 {root}</div>
    <div style={{display: "flex", flexDirection: "column", gap: 10}}>
      {items.map((item, i) => {
        const active = highlightPaths.includes(item.path);
        const parts = item.path.split("/").filter(Boolean);
        const label = parts[parts.length - 1] ?? item.path;
        return (
          <div key={`${item.path}-${i}`} style={{display: "flex", alignItems: "center", marginLeft: item.depth * 46, minHeight: 54, borderRadius: 14, padding: "0 16px", background: active ? "rgba(82,214,199,0.12)" : "transparent", border: active ? `1px solid ${diagramTheme.accent}` : "1px solid transparent"}}>
            <div style={{width: 44, color: active ? diagramTheme.accent : diagramTheme.faintText, fontSize: 22}}>{item.kind === "folder" ? "▾" : "│"}</div>
            <div style={{width: 40, fontSize: 24}}>{item.kind === "folder" ? "📁" : "📄"}</div>
            <div style={{fontSize: 27, fontWeight: active ? 800 : 600, color: active ? diagramTheme.text : "#D7E1EB"}}>{label}{item.kind === "folder" ? "/" : ""}</div>
          </div>
        );
      })}
    </div>
  </div>
);

export type GitBranch = {name: string; y: number; color: string; commits: number[]};
export type GitTreeProps = {branches: GitBranch[]};

export const GitTree: React.FC<GitTreeProps> = ({branches}) => {
  const xFor = (n: number) => 130 + n * 115;
  return (
    <div style={{height: "100%", padding: "52px 36px", boxSizing: "border-box", position: "relative"}}>
      <svg width="100%" height="100%" viewBox="0 0 900 1180" style={{overflow: "visible"}}>
        {branches.map((branch, idx) => {
          const first = Math.min(...branch.commits);
          const last = Math.max(...branch.commits);
          const baseY = branch.y;
          const parentY = idx === 0 ? baseY : branches[0].y;
          return (
            <g key={branch.name}>
              {idx > 0 ? <path d={`M ${xFor(first)} ${parentY} C ${xFor(first)+35} ${parentY}, ${xFor(first)-35} ${baseY}, ${xFor(first)+25} ${baseY}`} fill="none" stroke={branch.color} strokeWidth="5" /> : null}
              <line x1={xFor(first)} y1={baseY} x2={xFor(last)} y2={baseY} stroke={branch.color} strokeWidth="5" />
              {branch.commits.map((c) => <circle key={c} cx={xFor(c)} cy={baseY} r="16" fill={diagramTheme.canvas} stroke={branch.color} strokeWidth="6" />)}
              <rect x="20" y={baseY-24} width="150" height="48" rx="14" fill={branch.color} opacity="0.18" stroke={branch.color} strokeWidth="2" />
              <text x="95" y={baseY+8} textAnchor="middle" fill="#F7FAFC" fontSize="20" fontWeight="800">{branch.name}</text>
            </g>
          );
        })}
        <path d={`M ${xFor(7)} ${branches[1].y} C ${xFor(7)+55} ${branches[1].y}, ${xFor(8)-45} ${branches[0].y}, ${xFor(8)} ${branches[0].y}`} fill="none" stroke={diagramTheme.dataAccent} strokeWidth="5" />
        <rect x={xFor(7)+18} y={branches[1].y-95} width="145" height="48" rx="14" fill="rgba(100,216,165,0.14)" stroke={diagramTheme.dataAccent} strokeWidth="2" />
        <text x={xFor(7)+90} y={branches[1].y-63} textAnchor="middle" fill={diagramTheme.dataAccent} fontSize="20" fontWeight="800">merge</text>
      </svg>
    </div>
  );
};

export type MetricCard = {label: string; value: string; delta: string; points: number[]};
export type MetricDashboardProps = {cards: MetricCard[]};

const Sparkline: React.FC<{points: number[]}> = ({points}) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max-min);
  const poly = points.map((p, i) => `${i*(150/(points.length-1))},${55-((p-min)/range)*44}`).join(" ");
  return <svg width="150" height="60"><polyline points={poly} fill="none" stroke={diagramTheme.edgeStrong} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

export const MetricDashboard: React.FC<MetricDashboardProps> = ({cards}) => (
  <div style={{height: "100%", padding: 34, boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22}}>
    {cards.map((card, i) => (
      <div key={card.label} style={{borderRadius: 22, border: `1.5px solid ${diagramTheme.border}`, background: "rgba(16,34,53,0.88)", padding: "30px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div>
          <div style={{fontSize: 20, color: diagramTheme.mutedText, fontWeight: 700}}>{card.label}</div>
          <div style={{fontSize: 52, marginTop: 12, fontWeight: 900}}>{card.value}</div>
          <div style={{fontSize: 22, marginTop: 6, color: i === 2 ? "#FCA5A5" : diagramTheme.dataAccent, fontWeight: 800}}>{card.delta}</div>
        </div>
        <Sparkline points={card.points} />
      </div>
    ))}
  </div>
);

export type ComparisonTableProps = {columns: string[]; rows: string[][]; highlight?: {row: number; column: number}};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({columns, rows, highlight}) => (
  <div style={{height: "100%", padding: "42px 36px", boxSizing: "border-box"}}>
    <div style={{display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, borderRadius: 20, overflow: "hidden", border: `1.5px solid ${diagramTheme.borderStrong}`}}>
      {columns.map((col) => <div key={col} style={{padding: "24px 18px", background: "#173A61", fontSize: 23, fontWeight: 900, textAlign: "center", borderRight: `1px solid ${diagramTheme.borderStrong}`}}>{col}</div>)}
      {rows.flatMap((row, r) => row.map((cell, c) => {
        const active = highlight?.row === r && highlight?.column === c;
        return <div key={`${r}-${c}`} style={{minHeight: 120, padding: "22px 18px", display: "flex", alignItems: "center", justifyContent: c === 0 ? "flex-start" : "center", textAlign: c === 0 ? "left" : "center", fontSize: 22, fontWeight: c === 0 ? 800 : 600, lineHeight: 1.45, background: active ? "rgba(82,214,199,0.14)" : r % 2 === 0 ? "rgba(16,34,53,0.72)" : "rgba(10,22,37,0.72)", color: active ? diagramTheme.accent : diagramTheme.text, borderTop: `1px solid ${diagramTheme.border}`, borderRight: `1px solid ${diagramTheme.border}`}}>{cell}</div>;
      }))}
    </div>
  </div>
);

export const TerminalPanelStill: React.FC = () => (
  <SceneFrame eyebrow="SCENE LIBRARY / TERMINAL" title="ターミナル画面" subtitle="コマンドと実行結果を、動画内でそのまま説明素材にする">
    <TerminalPanel title="Git workflow" highlightLines={[0, 3]} lines={[
      {kind: "command", text: "git switch -c feature/login"},
      {kind: "output", text: "Switched to a new branch 'feature/login'"},
      {kind: "comment", text: "# 実装後にコミット"},
      {kind: "command", text: "git add . && git commit -m 'Add login'"},
      {kind: "output", text: "[feature/login a1b2c3d] Add login"},
      {kind: "command", text: "git push -u origin feature/login"},
    ]} />
  </SceneFrame>
);

export const DirectoryTreeStill: React.FC = () => (
  <SceneFrame eyebrow="SCENE LIBRARY / TREE" title="ディレクトリツリー" subtitle="リポジトリやアプリケーションの構成を短時間で見せる">
    <DirectoryTree root="my-app/" highlightPaths={["src/api/"]} items={[
      {path: "src/", kind: "folder", depth: 0},
      {path: "src/components/", kind: "folder", depth: 1},
      {path: "src/components/Button.tsx", kind: "file", depth: 2},
      {path: "src/api/", kind: "folder", depth: 1},
      {path: "src/api/client.ts", kind: "file", depth: 2},
      {path: "infra/", kind: "folder", depth: 0},
      {path: "infra/main.tf", kind: "file", depth: 1},
      {path: "package.json", kind: "file", depth: 0},
      {path: "README.md", kind: "file", depth: 0},
    ]} />
  </SceneFrame>
);

export const GitTreeStill: React.FC = () => (
  <SceneFrame eyebrow="SCENE LIBRARY / GIT" title="Gitブランチ図" subtitle="branch・commit・mergeを線とノードで直感的に説明する">
    <GitTree branches={[
      {name: "main", y: 260, color: "#38BDF8", commits: [0, 2, 4, 6, 8]},
      {name: "feature", y: 520, color: "#34D399", commits: [2, 3, 4, 5, 7]},
      {name: "bugfix", y: 780, color: "#FB7185", commits: [4, 5, 6]},
    ]} />
  </SceneFrame>
);

export const MetricDashboardStill: React.FC = () => (
  <SceneFrame eyebrow="SCENE LIBRARY / METRICS" title="メトリクスダッシュボード" subtitle="性能・障害・改善前後を数値と小さなチャートで見せる">
    <MetricDashboard cards={[
      {label: "Requests / min", value: "12,480", delta: "+12%", points: [10,14,12,20,22,27,24,31,35]},
      {label: "Latency p95", value: "240ms", delta: "-8%", points: [38,35,40,31,29,26,24,22,20]},
      {label: "Error Rate", value: "0.8%", delta: "+0.2%", points: [8,10,9,12,16,13,20,18,24]},
      {label: "CPU Usage", value: "72%", delta: "+15%", points: [20,22,31,28,40,49,55,63,72]},
    ]} />
  </SceneFrame>
);

export const ComparisonTableStill: React.FC = () => (
  <SceneFrame eyebrow="SCENE LIBRARY / TABLE" title="比較表" subtitle="技術や設計選択肢の違いを1枚で整理する">
    <ComparisonTable columns={["項目", "RAG", "Fine-tuning"]} rows={[
      ["目的", "外部知識を検索して回答", "モデルの振る舞いを調整"],
      ["情報更新", "データ更新で対応しやすい", "再学習が必要"],
      ["コスト", "検索基盤が必要", "学習コストが発生"],
      ["向いている用途", "社内文書・最新情報", "形式・口調・専門タスク"],
    ]} highlight={{row: 1, column: 1}} />
  </SceneFrame>
);
