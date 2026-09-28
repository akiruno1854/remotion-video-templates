export type DiagramNodeType =
  | "actor"
  | "server"
  | "service"
  | "database"
  | "queue"
  | "cache"
  | "model"
  | "storage"
  | "cpu"
  | "gpu"
  | "gateway";

export type DiagramNode = {
  id: string;
  label: string;
  subtitle?: string;
  type: DiagramNodeType;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type DiagramSpec = {
  title: string;
  subtitle?: string;
  direction?: "RIGHT" | "DOWN";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export type Point = {x: number; y: number};

export type LayoutNode = DiagramNode & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutEdge = DiagramEdge & {
  points: Point[];
};

export type DiagramLayout = {
  width: number;
  height: number;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
};
