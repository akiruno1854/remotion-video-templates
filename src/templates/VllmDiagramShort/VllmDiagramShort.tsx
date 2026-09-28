import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

const fps = 30;

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const reveal = (frame: number, startSec: number, endSec = startSec + 0.7) =>
  interpolate(frame, [startSec * fps, endSec * fps], [0, 1], clamp);

const pulse = (frame: number, startSec: number) => {
  const local = Math.max(0, frame - startSec * fps);
  return 1 + Math.sin(local / 8) * 0.025;
};

const Box: React.FC<{
  label: string;
  sub?: string;
  top: number;
  start: number;
  accent?: boolean;
}> = ({label, sub, top, start, accent}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 110,
        width: 860,
        padding: "34px 42px",
        borderRadius: 28,
        border: `3px solid ${accent ? "#55D6FF" : "#334155"}`,
        background: accent ? "rgba(20, 85, 110, 0.36)" : "rgba(15, 23, 42, 0.88)",
        boxShadow: accent ? "0 0 48px rgba(85,214,255,0.22)" : "0 18px 50px rgba(0,0,0,0.25)",
        color: "white",
        opacity: p,
        transform: `translateY(${(1 - p) * 28}px) scale(${accent ? pulse(frame, start) : 1})`,
      }}
    >
      <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1}}>{label}</div>
      {sub ? <div style={{fontSize: 31, marginTop: 10, color: "#A5B4FC"}}>{sub}</div> : null}
    </div>
  );
};

const Arrow: React.FC<{top: number; start: number}> = ({top, start}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, start, start + 0.5);
  return (
    <div style={{position: "absolute", top, left: 500, width: 80, height: 120, opacity: p}}>
      <div style={{position: "absolute", left: 36, top: 0, width: 8, height: 78, borderRadius: 8, background: "#55D6FF", transform: `scaleY(${p})`, transformOrigin: "top"}} />
      <div style={{position: "absolute", left: 19, top: 64, width: 42, height: 42, borderRight: "8px solid #55D6FF", borderBottom: "8px solid #55D6FF", transform: "rotate(45deg)"}} />
    </div>
  );
};

const SectionLabel: React.FC<{text: string; start: number}> = ({text, start}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, start, start + 0.35);
  return (
    <div style={{position: "absolute", right: 76, top: 150, opacity: p, color: "#67E8F9", fontSize: 27, fontWeight: 800, letterSpacing: 2}}>
      {text}
    </div>
  );
};

export const VllmDiagramShort: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / fps;
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], clamp);

  const scene = sec < 8 ? "1 / 5" : sec < 20 ? "2 / 5" : sec < 34 ? "3 / 5" : sec < 50 ? "4 / 5" : "5 / 5";

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 10%, #102A43 0%, #08111F 42%, #030712 100%)",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "white",
      }}
    >
      <div style={{position: "absolute", top: 86, left: 72, right: 72, opacity: titleOpacity}}>
        <div style={{fontSize: 30, color: "#67E8F9", fontWeight: 800, letterSpacing: 2}}>SYSTEM DESIGN SHORT</div>
        <div style={{fontSize: 68, fontWeight: 900, lineHeight: 1.06, marginTop: 16}}>vLLMはなぜ<br/>Servingが速い？</div>
      </div>

      <SectionLabel text={scene} start={0} />

      <Box label="複数Requestを受信" sub="同時に多くの生成リクエスト" top={390} start={0.4} />
      <Arrow top={600} start={7.3} />
      <Box label="PagedAttention" sub="KV Cacheをページ単位で効率管理" top={720} start={8.0} accent={sec >= 8 && sec < 20} />
      <Arrow top={930} start={19.1} />
      <Box label="Continuous Batching" sub="完了した枠へ次のRequestを継続投入" top={1050} start={20.0} accent={sec >= 20 && sec < 34} />
      <Arrow top={1260} start={33.0} />
      <Box label="GPUを効率利用" sub="待ち時間と空き枠を減らす" top={1380} start={34.0} accent={sec >= 34 && sec < 50} />

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 95,
          opacity: reveal(frame, 50, 50.8),
          transform: `scale(${reveal(frame, 50, 50.8) * 0.04 + 0.96})`,
          borderRadius: 32,
          padding: "32px 40px",
          textAlign: "center",
          background: "linear-gradient(90deg, #0EA5E9, #22D3EE)",
          color: "#03111C",
          fontSize: 48,
          fontWeight: 900,
          boxShadow: "0 0 60px rgba(34,211,238,0.32)",
        }}
      >
        高Throughput Serving
      </div>

      <div style={{position: "absolute", left: 72, bottom: 30, color: "#64748B", fontSize: 22}}>PagedAttention + Continuous Batching</div>
    </AbsoluteFill>
  );
};
