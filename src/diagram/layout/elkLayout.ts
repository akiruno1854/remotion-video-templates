import ELK from "elkjs/lib/elk.bundled.js";
import {diagramTheme} from "../theme/diagramTheme";
import type {DiagramLayout, DiagramSpec, LayoutEdge, LayoutNode, Point} from "../types";

const elk = new ELK();

const nodeSize = (type: string) => {
  if (type === "database" || type === "model") {
    return {width: 250, height: 126};
  }
  if (type === "actor") {
    return {width: 210, height: 108};
  }
  return {width: diagramTheme.nodeWidth, height: diagramTheme.nodeHeight};
};

export const layoutDiagram = async (spec: DiagramSpec): Promise<DiagramLayout> => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": spec.direction ?? "RIGHT",
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.spacing.nodeNode": String(diagramTheme.nodeGap),
      "elk.layered.spacing.nodeNodeBetweenLayers": String(diagramTheme.layerGap),
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      "elk.padding": "[top=40,left=40,bottom=40,right=40]",
    },
    children: spec.nodes.map((node) => ({
      id: node.id,
      ...nodeSize(node.type),
    })),
    edges: spec.edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  // ELK augments the input graph with geometry (x/y/width/height and routed edge sections).
  // Its generic TS return type preserves the narrower input edge shape, so normalize here.
  const laidOut: any = await elk.layout(graph as any);

  const nodeById = new Map(spec.nodes.map((n) => [n.id, n]));
  const edgeById = new Map(spec.edges.map((e) => [e.id, e]));

  const nodes: LayoutNode[] = (laidOut.children ?? []).map((node: any) => {
    const original = nodeById.get(node.id);
    if (!original) {
      throw new Error(`Unknown node returned by ELK: ${node.id}`);
    }
    return {
      ...original,
      x: node.x ?? 0,
      y: node.y ?? 0,
      width: node.width ?? diagramTheme.nodeWidth,
      height: node.height ?? diagramTheme.nodeHeight,
    };
  });

  const edges: LayoutEdge[] = (laidOut.edges ?? []).map((edge: any) => {
    const original = edgeById.get(edge.id);
    if (!original) {
      throw new Error(`Unknown edge returned by ELK: ${edge.id}`);
    }
    const section = edge.sections?.[0];
    const points: Point[] = section
      ? [section.startPoint, ...(section.bendPoints ?? []), section.endPoint].map((p: any) => ({x: p.x, y: p.y}))
      : [];

    return {...original, points};
  });

  return {
    width: laidOut.width ?? 1,
    height: laidOut.height ?? 1,
    nodes,
    edges,
  };
};
