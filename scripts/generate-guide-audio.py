#!/usr/bin/env python3
import audioop
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
START_SILENCE_SEC = 0.6
PIPER_BIN = os.environ.get("PIPER_PLUS_BIN", os.path.join(ROOT, "piper", "bin", "piper"))
MODEL = os.environ.get("PIPER_PLUS_MODEL", "tsukuyomi")

with open(SPEC, "r", encoding="utf-8") as f:
    spec = json.load(f)

os.makedirs(OUT_DIR, exist_ok=True)
length_sec = int(spec["durationSec"])

# Generate the entire narration in a single TTS pass so sentence boundaries and
# prosody are handled as one continuous utterance instead of stitching 5 clips.
full_text = " ".join(segment["ja"] for segment in spec["segments"])

with tempfile.TemporaryDirectory() as tmp:
    narration_wav = os.path.join(tmp, "continuous-narration.wav")
    subprocess.run([
        PIPER_BIN,
        full_text,
        "--model", MODEL,
        "--noise-scale", "0.45",
        "--length-scale", "1.08",
        "--output_file", narration_wav,
    ], check=True)

    with wave.open(narration_wav, "rb") as w:
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

track = [0] * (length_sec * RATE)
start = int(START_SILENCE_SEC * RATE)
for i, sample in enumerate(samples):
    pos = start + i
    if pos >= len(track):
        break
    track[pos] = sample

with wave.open(OUT, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(RATE)
    w.writeframes(struct.pack("<" + "h" * len(track), *track))

narration_sec = len(samples) / RATE
print(
    f"Generated {OUT} ({length_sec}s track, {narration_sec:.2f}s continuous Japanese narration, "
    f"start_silence={START_SILENCE_SEC}s, noise_scale=0.45, length_scale=1.08, model={MODEL})"
)
