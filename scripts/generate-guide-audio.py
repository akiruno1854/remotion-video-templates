#!/usr/bin/env python3
import json
import os
import struct
import subprocess
import tempfile
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(ROOT, "narration", "aws-serverless.json")
OUT_DIR = os.path.join(ROOT, "public", "audio")
OUT = os.path.join(OUT_DIR, "aws-serverless-guide.wav")
RATE = 22050

with open(SPEC, "r", encoding="utf-8") as f:
    spec = json.load(f)

os.makedirs(OUT_DIR, exist_ok=True)
length_sec = int(spec["durationSec"])
mix = [0] * (length_sec * RATE)

with tempfile.TemporaryDirectory() as tmp:
    for index, segment in enumerate(spec["segments"], start=1):
        wav_path = os.path.join(tmp, f"segment-{index}.wav")
        subprocess.run([
            "espeak", "-s", "145", "-a", "155", "-w", wav_path, segment["guideEn"]
        ], check=True)
        with wave.open(wav_path, "rb") as w:
            if (w.getframerate(), w.getnchannels(), w.getsampwidth()) != (RATE, 1, 2):
                raise RuntimeError("Unexpected espeak WAV format")
            raw = w.readframes(w.getnframes())
            samples = struct.unpack("<" + "h" * (len(raw) // 2), raw)
        start = int((float(segment["startSec"]) + 0.45) * RATE)
        for j, sample in enumerate(samples):
            pos = start + j
            if pos >= len(mix):
                break
            mix[pos] = sample

with wave.open(OUT, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(RATE)
    w.writeframes(struct.pack("<" + "h" * len(mix), *mix))

print(f"Generated {OUT} ({length_sec}s guide track)")
