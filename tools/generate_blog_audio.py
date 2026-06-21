#!/usr/bin/env python3
"""
Blog narration audio generator.

RETIRED BACKEND (2026-06-21): the paid OpenAI TTS backend is retired. We no
longer spend on paid audio generation. Blog audio will be produced in Hadi's
own cloned voice (F5-TTS) once voice-clone training is complete; that engine
will plug into the same transcript-parsing / chunking / ffmpeg-concat machinery
preserved below.

Until the cloned-voice backend is wired in, this tool intentionally REFUSES to
generate audio — running it prints the retirement notice and exits non-zero so
no pipeline mistakes a no-op for success. The reusable, engine-agnostic helpers
(`parse_transcript`, `strip_html_comments`, `chunk_transcript`, `make_silence`,
`concat_mp3s`) stay intact for the cloned-voice generator to import.

Usage (once the cloned-voice backend lands):
    python3 tools/generate_blog_audio.py <transcript_path> <output_mp3_path>
"""

import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

TTS_CHAR_LIMIT = 4000  # leave headroom under typical engine per-call limits

# Inter-paragraph silence inserted at concat time. Many TTS engines ignore
# newlines inside a single call, so paragraphs run together without a breath.
# We chunk per paragraph and stitch a real silence file between them at ffmpeg
# time — deterministic pause length, no text artifacts. Tweak if pacing feels off.
PARAGRAPH_SILENCE_SECONDS = 0.45


def strip_html_comments(text: str) -> str:
    """Remove HTML comment blocks (e.g. <!-- IMAGE PLACEHOLDER ... -->) from a markdown body."""
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)


def parse_transcript(text: str) -> tuple[dict[str, str], str]:
    """Split a transcript into (frontmatter dict, body).

    The frontmatter is a `---`-fenced YAML-ish block at the very top.
    Recognized keys: final (bool), source_md (str), generated_at (str).
    Returns ({}, original_text) if no frontmatter is found.
    """
    m = re.match(r"^---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not m:
        return {}, text
    fm: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            fm[k.strip()] = v.strip()
    body = text[m.end():]
    return fm, body


def chunk_transcript(text: str, limit: int = TTS_CHAR_LIMIT) -> list[str]:
    """Split on paragraph boundaries — one paragraph per chunk.

    Splitting per paragraph lets us insert a real silence file between each
    rendered part at concat time, so the narration pauses at paragraph breaks
    instead of reading the whole essay as one continuous stream.

    If a single paragraph exceeds the char limit, fall back to splitting it on
    sentence boundaries.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    for p in paragraphs:
        if len(p) <= limit:
            chunks.append(p)
            continue
        sentences = re.split(r"(?<=[.!?])\s+", p)
        buf: list[str] = []
        buf_len = 0
        for s in sentences:
            add = len(s) + (1 if buf else 0)
            if buf_len + add > limit and buf:
                chunks.append(" ".join(buf))
                buf = [s]
                buf_len = len(s)
            else:
                buf.append(s)
                buf_len += add
        if buf:
            chunks.append(" ".join(buf))
    return chunks


def make_silence(duration: float, out_path: Path) -> None:
    """Generate a silent mp3 of the given duration using ffmpeg's anullsrc."""
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "lavfi",
            "-i", "anullsrc=channel_layout=mono:sample_rate=24000",
            "-t", str(duration),
            "-c:a", "libmp3lame", "-b:a", "32k",
            str(out_path),
        ],
        check=True,
    )


def concat_mp3s(parts: list[Path], output: Path, silence_path: Path | None = None) -> None:
    """Concatenate mp3 files using ffmpeg's concat demuxer.

    If `silence_path` is given, insert that silence file between every pair of
    `parts` — used to add a deterministic pause at every paragraph boundary.
    """
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        for i, p in enumerate(parts):
            if i > 0 and silence_path is not None:
                f.write(f"file '{silence_path.resolve()}'\n")
            f.write(f"file '{p.resolve()}'\n")
        listfile = Path(f.name)
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-f", "concat", "-safe", "0",
                "-i", str(listfile),
                "-c:a", "libmp3lame", "-b:a", "64k",
                str(output),
            ],
            check=True,
        )
    finally:
        listfile.unlink(missing_ok=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("transcript", type=Path)
    ap.add_argument("output", type=Path)
    ap.parse_args()

    sys.exit(
        "\nBlog audio generation is RETIRED (no paid TTS).\n\n"
        "The paid OpenAI backend has been removed. Blog narration will be\n"
        "generated in Hadi's cloned voice (F5-TTS) once voice-clone training\n"
        "is complete. No audio is produced until that backend is wired into\n"
        "the engine-agnostic helpers in this module.\n"
    )


if __name__ == "__main__":
    main()
