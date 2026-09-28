import React from "react";
import {awsServerlessLayout} from "../../diagram/generated/awsServerlessLayout";
import type {DiagramLayout} from "../../diagram/types";
import {DiagramStillFrame} from "./DiagramStillFrame";

export const AwsServerlessStill: React.FC = () => (
  <DiagramStillFrame
    layout={awsServerlessLayout as unknown as DiagramLayout}
    title="API Gateway + Lambda + DynamoDB"
    subtitle="サーバーレスなAPI処理の基本フロー"
    eyebrow="AWS SERVERLESS"
  />
);
