import React from "react";
import {ragSystemLayout} from "../../diagram/generated/ragSystemLayout";
import type {DiagramLayout} from "../../diagram/types";
import {DiagramStillFrame} from "./DiagramStillFrame";

export const RagSystemStill: React.FC = () => (
  <DiagramStillFrame
    layout={ragSystemLayout as unknown as DiagramLayout}
    title="RAGシステムの全体構成"
    subtitle="文書登録と検索生成を1枚で見る"
    eyebrow="RAG SYSTEM"
  />
);
