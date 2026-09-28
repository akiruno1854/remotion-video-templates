import React from "react";
import { Composition } from "remotion";

import {
  LogoIntro,
  logoIntroSchema,
  logoIntroDefaultProps,
} from "./templates/LogoIntro/LogoIntro";
import {
  LowerThirds,
  lowerThirdsSchema,
  lowerThirdsDefaultProps,
  lowerThirdsCalculateMetadata,
} from "./templates/LowerThirds/LowerThirds";
import {
  KineticText,
  kineticTextSchema,
  kineticTextDefaultProps,
  kineticTextCalculateMetadata,
} from "./templates/KineticText/KineticText";
import {
  BarChartRace,
  barChartRaceSchema,
  barChartRaceDefaultProps,
  barChartRaceCalculateMetadata,
} from "./templates/ChartVideo/BarChartRace";
import {
  LineChart,
  lineChartSchema,
  lineChartDefaultProps,
  lineChartCalculateMetadata,
} from "./templates/ChartVideo/LineChart";
import {
  CaptionedShort,
  captionedShortSchema,
  captionedShortDefaultProps,
  captionedShortCalculateMetadata,
} from "./templates/CaptionedShort/CaptionedShort";
import {
  PromoTemplate,
  promoTemplateSchema,
  promoTemplateDefaultProps,
  promoTemplateCalculateMetadata,
} from "./templates/PromoTemplate/PromoTemplate";
import {VllmDiagramShort} from "./templates/VllmDiagramShort/VllmDiagramShort";
import {
  ArchitectureDiagramShort,
  ragArchitectureSample,
} from "./templates/ArchitectureDiagramShort/ArchitectureDiagramShort";
import {ArchitectureDiagramStill} from "./templates/ArchitectureDiagramStill/ArchitectureDiagramStill";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LogoIntro"
        component={LogoIntro}
        schema={logoIntroSchema}
        defaultProps={logoIntroDefaultProps}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="LowerThirds"
        component={LowerThirds}
        schema={lowerThirdsSchema}
        defaultProps={lowerThirdsDefaultProps}
        calculateMetadata={lowerThirdsCalculateMetadata}
        durationInFrames={294}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="KineticText"
        component={KineticText}
        schema={kineticTextSchema}
        defaultProps={kineticTextDefaultProps}
        calculateMetadata={kineticTextCalculateMetadata}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BarChartRace"
        component={BarChartRace}
        schema={barChartRaceSchema}
        defaultProps={barChartRaceDefaultProps}
        calculateMetadata={barChartRaceCalculateMetadata}
        durationInFrames={288}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="LineChartDraw"
        component={LineChart}
        schema={lineChartSchema}
        defaultProps={lineChartDefaultProps}
        calculateMetadata={lineChartCalculateMetadata}
        durationInFrames={193}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="CaptionedShort"
        component={CaptionedShort}
        schema={captionedShortSchema}
        defaultProps={captionedShortDefaultProps}
        calculateMetadata={captionedShortCalculateMetadata}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="VllmDiagramShort"
        component={VllmDiagramShort}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="ArchitectureDiagramShort"
        component={ArchitectureDiagramShort}
        defaultProps={ragArchitectureSample}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="ArchitectureDiagramStill"
        component={ArchitectureDiagramStill}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="PromoTemplate"
        component={PromoTemplate}
        schema={promoTemplateSchema}
        defaultProps={promoTemplateDefaultProps}
        calculateMetadata={promoTemplateCalculateMetadata}
        durationInFrames={340}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
