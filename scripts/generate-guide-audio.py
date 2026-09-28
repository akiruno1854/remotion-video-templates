#!/usr/bin/env python3
import audioop
import json
import os
import struct
import subprocess
import sys
import tempfile
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(ROOT, "narration", "aws-serverless.json")
OUT_DIR = os.path.join(ROOT, "public", "audio")
OUT = os.path.join(OUT_DIR, "aws-serverless-guide.wav")
RATE = 22050
MODEL = os.environ.get("PIPER_PLUS_MODEL", "tsukuyomi")

with open(SPEC, "r", encoding="utf-8") as f:
    spec = json.load(f)

os.makedirs(OUT_DIR, exist_ok=True)
length_sec = int(spec["durationSec"])
mix = [0] * (length_sec * RATE)

with tempfile.TemporaryDirectory() as tmp:
    for index, segment in enumerate(spec["segments"], start=1):
        wav_path = os.path.join(tmp, f"segment-{index}.wav")
        subprocess.run([
            sys.executable, "-m", "piper_plus",
            "--model", MODEL,
            "--text", segment["ja"],
            "--noise-scale", "0.5",
            "--output_file", wav_path,
        ], check=True)

        with wave.open(wav_path, "rb") as w:
            channels = w.getnchannels()
            width = w.getsampwidth()
            rate = w.getframerate()
            raw = w.readframes(w.getnframes())

        if width != 2:
            raw = audioop.lin2lin(raw, width, 2)
            width = 2
        if channels == 2:
            raw = audioop.tomono(raw, width, 0.5, 0.5)
            channels = 1
        elif channels != 1:
            raise RuntimeError(f"Unsupported channel count: {channels}")
        if rate != RATE:
            raw, _ = audioop.ratecv(raw, width, channels, rate, RATE, None)

        samples = struct.unpack("<" + "h" * (len(raw) // 2), raw)
        start = int((float(segment["startSec"]) + 0.35) * RATE)
        for j, sample in enumerate(samples):
            pos = start + j
            if pos >= len(mix):
                break
            mixed = mix[pos] + sample
            mix[pos] = max(-32768, min(32767, mixed))

with wave.open(OUT, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(RATE)
    w.writeframes(struct.pack("<" + "h" * len(mix), *mix))

print(f"Generated {OUT} ({length_sec}s Japanese piper-plus track, model={MODEL})")
