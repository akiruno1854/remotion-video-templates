import type {DiagramSpec} from "../types";

export const ragDiagramSpec: DiagramSpec = {
  title: "RAG Architecture",
  subtitle: "検索してから生成する基本構成",
  direction: "DOWN",
  nodes: [
    {id: "user", label: "User", subtitle: "質問を送信", type: "actor"},
    {id: "api", label: "API Server", subtitle: "Query orchestration", type: "server"},
    {id: "retriever", label: "Retriever", subtitle: "関連文書を検索", type: "service"},
    {id: "vector", label: "Vector DB", subtitle: "Embedding index", type: "database"},
    {id: "llm", label: "LLM", subtitle: "Query + Context", type: "model"}
  ],
  edges: [
    {id: "e-user-api", source: "user", target: "api", label: "query"},
    {id: "e-api-ret", source: "api", target: "retriever", label: "search"},
    {id: "e-ret-vector", source: "retriever", target: "vector", label: "retrieve"},
    {id: "e-vector-llm", source: "vector", target: "llm", label: "context"}
  ]
};
