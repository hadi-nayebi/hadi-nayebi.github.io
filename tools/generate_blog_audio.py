#!/usr/bin/env python3
"""
Generate blog narration audio from a transcript using OpenAI TTS.

Usage:
    python3 tools/generate_blog_audio.py <transcript_path> <output_mp3_path> [--voice VOICE] [--model MODEL]

Reads OPENAI_API_KEY from /home/hadinayebi/.secrets/api-keys.env.

Splits the transcript into chunks under the TTS character limit, generates each
chunk, then concatenates them into a single mp3 with ffmpeg.
"""

import argparse
import os
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

SECRETS_FILE = Path("/home/hadinayebi/.secrets/api-keys.env")
TTS_CHAR_LIMIT = 4000  # OpenAI hard limit is 4096; leave headroom
TTS_MAX_ATTEMPTS = 4
TTS_BACKOFF_SECONDS = 5


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


def load_api_key() -> str:
    if not SECRETS_FILE.exists():
        sys.exit(f"Secrets file not found: {SECRETS_FILE}")
    for line in SECRETS_FILE.read_text().splitlines():
        m = re.match(r'^\s*export\s+OPENAI_API_KEY\s*=\s*"([^"]+)"\s*$', line)
        if m:
            return m.group(1)
    sys.exit("OPENAI_API_KEY not found in secrets file")


def chunk_transcript(text: str, limit: int = TTS_CHAR_LIMIT) -> list[str]:
    """Split on paragraph boundaries; each chunk <= limit chars."""
    paragraphs = [p for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for p in paragraphs:
        p = p.strip()
        # +2 for the joining "\n\n"
        addition = len(p) + (2 if current else 0)
        if current_len + addition > limit and current:
            chunks.append("\n\n".join(current))
            current = [p]
            current_len = len(p)
        else:
            current.append(p)
            current_len += addition
    if current:
        chunks.append("\n\n".join(current))
    return chunks


def synthesize(client, text: str, voice: str, model: str, out_path: Path) -> None:
    last_exc: Exception | None = None
    for attempt in range(1, TTS_MAX_ATTEMPTS + 1):
        try:
            with client.audio.speech.with_streaming_response.create(
                model=model,
                voice=voice,
                input=text,
                response_format="mp3",
            ) as resp:
                resp.stream_to_file(str(out_path))
            return
        except Exception as exc:
            last_exc = exc
            if attempt == TTS_MAX_ATTEMPTS:
                break
            wait = TTS_BACKOFF_SECONDS * (2 ** (attempt - 1))
            print(f"    attempt {attempt}/{TTS_MAX_ATTEMPTS} failed ({type(exc).__name__}): {exc}; retrying in {wait}s")
            time.sleep(wait)
    raise last_exc  # type: ignore[misc]


def concat_mp3s(parts: list[Path], output: Path) -> None:
    """Concatenate mp3 files using ffmpeg's concat demuxer."""
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        for p in parts:
            f.write(f"file '{p.resolve()}'\n")
        listfile = Path(f.name)
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-f", "concat", "-safe", "0",
                "-i", str(listfile),
                "-c", "copy",
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
    ap.add_argument("--voice", default="onyx",
                    help="alloy|ash|ballad|coral|echo|fable|nova|onyx|sage|shimmer")
    ap.add_argument("--model", default="tts-1-hd",
                    help="tts-1 | tts-1-hd | gpt-4o-mini-tts")
    args = ap.parse_args()

    if not args.transcript.exists():
        sys.exit(f"Transcript not found: {args.transcript}")
    args.output.parent.mkdir(parents=True, exist_ok=True)

    raw = args.transcript.read_text()
    frontmatter, body = parse_transcript(raw)

    # Cost gate: TTS is not cheap (~$0.75-$1 per 35-min essay on tts-1-hd).
    # The transcript must be explicitly marked `final: true` before we spend.
    final_flag = frontmatter.get("final", "").lower()
    if final_flag != "true":
        sys.exit(
            f"\nTranscript is not marked final.\n"
            f"  File:  {args.transcript}\n"
            f"  Flag:  final = {final_flag or '(missing)'}\n\n"
            f"Audio generation costs real money. To proceed, edit the transcript\n"
            f"frontmatter and set `final: true`, then rerun this command.\n"
        )

    api_key = load_api_key()
    text = strip_html_comments(body)
    chunks = chunk_transcript(text)
    print(f"Transcript: {len(text):,} chars -> {len(chunks)} chunks "
          f"(voice={args.voice}, model={args.model})")

    from openai import OpenAI
    client = OpenAI(api_key=api_key)

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        parts: list[Path] = []
        for i, chunk in enumerate(chunks, 1):
            part_path = tmp / f"part_{i:02d}.mp3"
            print(f"  [{i}/{len(chunks)}] generating {len(chunk):,} chars...")
            synthesize(client, chunk, args.voice, args.model, part_path)
            parts.append(part_path)

        if len(parts) == 1:
            parts[0].rename(args.output)
        else:
            print(f"  concatenating -> {args.output}")
            concat_mp3s(parts, args.output)

    size_mb = args.output.stat().st_size / 1024 / 1024
    print(f"Wrote {args.output} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
