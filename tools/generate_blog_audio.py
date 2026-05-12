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

# Inter-paragraph silence inserted at concat time. `tts-1-hd` ignores newlines
# inside a single API call, so paragraphs run together without a breath. We chunk
# per paragraph and stitch a real silence file between them at ffmpeg time —
# deterministic pause length, no text artifacts. Tweak here if pacing feels off.
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


def load_api_key() -> str:
    if not SECRETS_FILE.exists():
        sys.exit(f"Secrets file not found: {SECRETS_FILE}")
    for line in SECRETS_FILE.read_text().splitlines():
        m = re.match(r'^\s*export\s+OPENAI_API_KEY\s*=\s*"([^"]+)"\s*$', line)
        if m:
            return m.group(1)
    sys.exit("OPENAI_API_KEY not found in secrets file")


def chunk_transcript(text: str, limit: int = TTS_CHAR_LIMIT) -> list[str]:
    """Split on paragraph boundaries — one paragraph per chunk.

    Earlier versions packed many paragraphs into a single API call to minimise
    round-trips, but that meant the model never paused at paragraph boundaries
    (tts-1-hd reads each call as one continuous stream). Splitting per paragraph
    lets us insert a real silence file between each rendered part at concat time.

    Cost is per-character, so chunking finer does not change spend; it only
    trades a few minutes of extra latency for clean paragraph pauses.

    If a single paragraph somehow exceeds the API char limit, fall back to
    splitting it on sentence boundaries.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    for p in paragraphs:
        if len(p) <= limit:
            chunks.append(p)
            continue
        # Rare fallback: split a too-long paragraph into sentence groups.
        # Within these splits we do NOT insert silence — those splits are mid-paragraph.
        # We mark them by joining with a single space so the concat layer can
        # tell paragraph-boundaries apart from sentence-boundaries (see main()).
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


def make_silence(duration: float, out_path: Path) -> None:
    """Generate a silent mp3 of the given duration using ffmpeg's anullsrc.

    Output codec params (mono, 24 kHz, mp3) match what OpenAI tts-1-hd emits,
    so the concat demuxer can stream-copy without re-encoding.
    """
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "lavfi",
            "-i", f"anullsrc=channel_layout=mono:sample_rate=24000",
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
        # Re-encode at concat time so any minor codec-param drift between the
        # TTS output and the silence stub gets harmonised. Cheap; the final
        # file is short and libmp3lame is fast.
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
            part_path = tmp / f"part_{i:03d}.mp3"
            print(f"  [{i}/{len(chunks)}] generating {len(chunk):,} chars...")
            synthesize(client, chunk, args.voice, args.model, part_path)
            parts.append(part_path)

        # Generate the silence stub used between paragraph parts.
        silence_path = tmp / "silence.mp3"
        make_silence(PARAGRAPH_SILENCE_SECONDS, silence_path)
        print(f"  concatenating {len(parts)} parts with {PARAGRAPH_SILENCE_SECONDS}s "
              f"silence between -> {args.output}")
        concat_mp3s(parts, args.output, silence_path=silence_path)

    size_mb = args.output.stat().st_size / 1024 / 1024
    print(f"Wrote {args.output} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
