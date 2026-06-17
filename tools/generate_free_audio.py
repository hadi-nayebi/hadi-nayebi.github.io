#!/usr/bin/env python3
"""
Generate FREE draft blog narration audio from a transcript using the local piper
neural voice. NO paid API, NO network — free + local only.

Usage:
    python3 tools/generate_free_audio.py <transcript-or-text-file> <output.mp3>

Reads a blog .transcript.md (or any text file), strips YAML frontmatter and
light markdown to plain prose, feeds the text to piper, then converts the wav to
mp3 via ffmpeg (libmp3lame 96k). Long essays are chunked by paragraph and the
per-paragraph wavs are concatenated before the single mp3 conversion, so piper
never has to swallow one giant input.

Writes a sidecar <output>.meta.json:
    {"voice":"piper-free","draft":true,"generated_at_note":"free draft narration"}

This is the FREE counterpart to tools/generate_blog_audio.py (paid OpenAI). The
.draft.mp3 naming convention keeps these drafts from colliding with a future
paid <slug>.mp3 studio version.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# --- Free local voice ---------------------------------------------------------
# Piper binary + a neural voice model. We default to lessac-medium (a fuller,
# more natural narration voice than amy-low) and fall back to whatever .onnx the
# environment provides. Both are the same FREE voices the site's telegram
# tooling already ships.
PIPER_BIN = Path(os.path.expanduser("~/.local/bin/piper"))
PIPER_VOICE_DIR = Path(os.path.expanduser("~/.local/share/piper/voices"))
PREFERRED_VOICES = [
    "en_US-lessac-medium/en_US-lessac-medium.onnx",
    "en_US-amy-low/en_US-amy-low.onnx",
]

MP3_BITRATE = "96k"
# Piper is robust, but very long single inputs are slower and riskier. Chunk the
# essay into paragraph groups under this character budget and concat the wavs.
CHUNK_CHAR_BUDGET = 1800


def resolve_piper() -> Path:
    if not PIPER_BIN.exists():
        which = shutil.which("piper")
        if which:
            return Path(which)
        sys.exit(f"ERROR: piper binary not found at {PIPER_BIN} or on PATH.")
    return PIPER_BIN


def resolve_voice() -> Path:
    for rel in PREFERRED_VOICES:
        cand = PIPER_VOICE_DIR / rel
        if cand.exists():
            return cand
    # Fallback: first .onnx anywhere under the voices dir.
    found = sorted(PIPER_VOICE_DIR.rglob("*.onnx"))
    if found:
        return found[0]
    sys.exit(f"ERROR: no piper .onnx voice model found under {PIPER_VOICE_DIR}.")


# --- Transcript -> plain prose ------------------------------------------------
def strip_html_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)


def strip_frontmatter(text: str) -> str:
    """Drop a leading `---`-fenced YAML block if present."""
    m = re.match(r"^---\n.*?\n---\n", text, flags=re.DOTALL)
    return text[m.end():] if m else text


def markdown_to_prose(text: str) -> str:
    """Reduce light markdown to plain narration prose.

    - drop frontmatter + HTML comments
    - strip heading hashes, list bullets, blockquote markers
    - unwrap links/images to their text
    - drop emphasis/code markers
    - collapse whitespace, keep paragraph breaks
    """
    text = strip_frontmatter(text)
    text = strip_html_comments(text)

    # Images ![alt](src) -> alt ; links [text](url) -> text
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)

    lines_out = []
    for raw in text.splitlines():
        line = raw.rstrip()
        # fenced code fences -> skip the fence line itself
        if line.strip().startswith("```"):
            continue
        # headings: drop leading #'s
        line = re.sub(r"^\s{0,3}#{1,6}\s*", "", line)
        # blockquotes
        line = re.sub(r"^\s*>\s?", "", line)
        # list bullets / numbered lists -> plain sentence
        line = re.sub(r"^\s*[-*+]\s+", "", line)
        line = re.sub(r"^\s*\d+[.)]\s+", "", line)
        # horizontal rules -> blank
        if re.match(r"^\s*([-*_])\1{2,}\s*$", line):
            line = ""
        lines_out.append(line)

    text = "\n".join(lines_out)

    # inline markdown: bold/italic/code -> bare text
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"__([^_]+)__", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)

    # collapse 3+ newlines into a clean paragraph break
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_paragraphs(prose: str) -> list[str]:
    """Group paragraphs into chunks under CHUNK_CHAR_BUDGET characters."""
    paras = [p.strip() for p in re.split(r"\n\s*\n", prose) if p.strip()]
    chunks: list[str] = []
    cur = ""
    for p in paras:
        # a single paragraph longer than the budget becomes its own chunk
        if len(p) > CHUNK_CHAR_BUDGET:
            if cur:
                chunks.append(cur)
                cur = ""
            chunks.append(p)
            continue
        if cur and len(cur) + len(p) + 2 > CHUNK_CHAR_BUDGET:
            chunks.append(cur)
            cur = p
        else:
            cur = f"{cur}\n\n{p}" if cur else p
    if cur:
        chunks.append(cur)
    return chunks or [prose]


# --- Synthesis ----------------------------------------------------------------
def piper_to_wav(piper: Path, voice: Path, text: str, out_wav: Path) -> None:
    proc = subprocess.run(
        [str(piper), "-m", str(voice), "-f", str(out_wav)],
        input=text.encode("utf-8"),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0 or not out_wav.exists() or out_wav.stat().st_size == 0:
        sys.stderr.write(proc.stderr.decode("utf-8", "replace"))
        sys.exit(f"ERROR: piper failed for a chunk -> {out_wav}")


def concat_wavs(wavs: list[Path], out_wav: Path, tmpdir: Path) -> None:
    if len(wavs) == 1:
        shutil.copyfile(wavs[0], out_wav)
        return
    listfile = tmpdir / "concat.txt"
    listfile.write_text("".join(f"file '{w.as_posix()}'\n" for w in wavs))
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
         "-i", str(listfile), "-c", "copy", str(out_wav)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def wav_to_mp3(in_wav: Path, out_mp3: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(in_wav),
         "-c:a", "libmp3lame", "-b:a", MP3_BITRATE, str(out_mp3)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def write_meta(out_mp3: Path) -> Path:
    meta_path = out_mp3.with_suffix(out_mp3.suffix + ".meta.json")
    meta_path.write_text(json.dumps({
        "voice": "piper-free",
        "draft": True,
        "generated_at_note": "free draft narration",
    }, indent=2) + "\n")
    return meta_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Free local piper TTS for blog drafts.")
    ap.add_argument("source", help="transcript .md or text file")
    ap.add_argument("output", help="output .mp3 path")
    args = ap.parse_args()

    src = Path(args.source)
    out_mp3 = Path(args.output)
    if not src.exists():
        sys.exit(f"ERROR: source not found: {src}")

    piper = resolve_piper()
    voice = resolve_voice()
    print(f"piper:  {piper}")
    print(f"voice:  {voice}")

    raw = src.read_text(encoding="utf-8")
    prose = markdown_to_prose(raw)
    if not prose:
        sys.exit("ERROR: no prose left after stripping.")
    chunks = chunk_paragraphs(prose)
    print(f"prose:  {len(prose)} chars over {len(chunks)} chunk(s)")

    out_mp3.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        tmpdir = Path(td)
        wavs = []
        for i, chunk in enumerate(chunks):
            w = tmpdir / f"chunk_{i:03d}.wav"
            piper_to_wav(piper, voice, chunk, w)
            wavs.append(w)
            print(f"  chunk {i + 1}/{len(chunks)} synthesized ({len(chunk)} chars)")
        full_wav = tmpdir / "full.wav"
        concat_wavs(wavs, full_wav, tmpdir)
        wav_to_mp3(full_wav, out_mp3)

    meta = write_meta(out_mp3)
    print(f"mp3:    {out_mp3}")
    print(f"meta:   {meta}")


if __name__ == "__main__":
    main()
