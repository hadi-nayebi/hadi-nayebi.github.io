#!/usr/bin/env python3
"""Generate audio-ready transcripts from blog .md files.

The TTS pipeline (OpenAI tts-1-hd, voice=onyx) reads the transcript verbatim,
so the transcript must be written for the EAR, not the eye. This tool strips
markdown structure and applies pronunciation guards for terms that TTS-1
mispronounces or drops entirely (acronyms, snake_case identifiers, footer-anchor
markers, bracketed prefixes).

Usage:
    python3 tools/generate_blog_transcript.py <input.md> <output.transcript.md>

See blog/CLAUDE.md "Audio Transcript Rules" for the rationale and full guard
list. When adding a new blog with new acronyms or identifiers, extend
PRONUNCIATION_GUARDS below.
"""

import argparse
import datetime as dt
import re
import sys
from pathlib import Path


# Pronunciation guards: (regex pattern, replacement).
# Applied AFTER markdown stripping, BEFORE writing the transcript.
# OpenAI tts-1-hd does not support SSML, so we munge the text instead.
PRONUNCIATION_GUARDS: list[tuple[str, str]] = [
    # ── Acronyms ──────────────────────────────────────────────────────────
    # OPEVC: 5-letter compound. TTS-1 drops it or reads garbage. Letter-spaced
    # form forces initialism pronunciation ("Oh Pee Ee Vee See").
    (r"\bOPEVC\b", "O P E V C"),

    # ── snake_case plugin names ───────────────────────────────────────────
    # TTS reads `plugin_integrity` as either "plugin underscore integrity"
    # or "plugin... integrity" with an awkward pause. Hyphenation reads as
    # a natural compound noun.
    (r"\bplugin_integrity\b", "plugin-integrity"),
    (r"\bbrain_guard\b", "brain-guard"),
    (r"\bjob_core\b", "job-core"),
    (r"\binteraction_summary\b", "interaction-summary"),
    (r"\bquestion_discipline\b", "question-discipline"),
    (r"\bphasic_system\b", "phasic-system"),

    # ── Footer anchors ───────────────────────────────────────────────────
    # `---Ob---` reads as "dash dash dash Ob dash dash dash" — terrible.
    # Replace with the phrase a listener actually needs.
    (r"---Ob---", "the OBSERVE footer"),
    (r"---Pl---", "the PLAN footer"),
    (r"---Ex---", "the EXECUTE footer"),
    (r"---Ve---", "the VERIFY footer"),

    # ── Bracketed ceremonial prefixes ─────────────────────────────────────
    # Brackets are silent in TTS but the ALLCAPS-HYPHENATED content tends
    # to fail like an acronym. Strip brackets; preserve hyphens for natural
    # compound reading.
    (r"\[PLUGIN-LOCK\]",     "plugin-lock"),
    (r"\[JOB-COMPLETE\]",    "job-complete"),
    (r"\[TEST-LOCK\]",       "test-lock"),
    (r"\[PLAN-COMPLETE\]",   "plan-complete"),
    (r"\[POINT-BOOST\]",     "point-boost"),
    (r"\[WAITING\]",         "waiting"),
    (r"\[GMODE\]",           "G mode"),
    (r"\[KNOWLEDGE\]",       "knowledge"),
    (r"\[VOICE-UPDATE\]",    "voice-update"),
    (r"\[AGENT-UPDATE\]",    "agent-update"),
    (r"\[PENDING-JOB\]",     "pending-job"),
    (r"\[DURABLE\]",         "durable"),
    (r"\[EPHEMERAL\]",       "ephemeral"),

    # ── Angle-bracket placeholders ────────────────────────────────────────
    # `<plugin_name>` etc. in inline-code examples. TTS reads "less than
    # plugin name greater than" — pure noise.
    (r"<plugin_name>",  "the plugin name"),
    (r"<plugin_dir>",   "the plugin directory"),
    (r"<id>",           ""),
    (r"<name>",         ""),
    (r"<text>",         ""),

    # ── Cleanup pass ─────────────────────────────────────────────────────
    # After dropping placeholders inside paths (e.g. `.claude/plugins/<name>/`
    # → `.claude/plugins//`), collapse the empty path segment so TTS doesn't
    # read "slash slash".
    (r"//+", "/"),
]


def strip_markdown(src: str) -> str:
    """Remove markdown structure, keeping the readable body text."""
    # Frontmatter
    src = re.sub(r"^---\n.*?\n---\n", "", src, count=1, flags=re.DOTALL)
    # HTML comments (image placeholders, etc.)
    src = re.sub(r"<!--.*?-->", "", src, flags=re.DOTALL)
    # Non-narrated meta-navigation lines (series position, prev/next, companion).
    # These exist for the eye on the website footer; the ear does not need them.
    # Match each as a full italicized line (`*...*` on its own line).
    meta_patterns = [
        r"^\*Essay \d+(?:\.\d+)? of 8 in the Hadosh Academy series on agent architecture\.[^*\n]*\*\s*$",
        r"^\*Series interlude[^*\n]*\*\s*$",
        r"^\*Previous: \[[^\]]+\]\([^)]+\)[^*\n]*\*\s*$",
        r"^\*Next: \[[^\]]+\]\([^)]+\)[^*\n]*\*\s*$",
        r"^\*Companion: [^*\n]+\*\s*$",
    ]
    for pat in meta_patterns:
        src = re.sub(pat, "", src, flags=re.MULTILINE)
    # Code blocks (fenced)
    src = re.sub(r"```[^\n]*\n.*?\n```", "", src, flags=re.DOTALL)
    # Horizontal rules (`---` on its own line) — but NOT footer anchors
    # which match `---Xx---`. Footer anchors are handled by guards.
    src = re.sub(r"^---\s*$", "", src, flags=re.MULTILINE)
    # Headers — keep text, drop hash marks
    src = re.sub(r"^#+\s*(.*)$", r"\1", src, flags=re.MULTILINE)
    # Markdown links [text](url) -> text
    src = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", src)
    # Inline code `foo` -> foo
    src = re.sub(r"`([^`]+)`", r"\1", src)
    # Bold **foo** -> foo
    src = re.sub(r"\*\*([^*]+)\*\*", r"\1", src)
    # Italic *foo* -> foo
    src = re.sub(r"\*([^*\n]+)\*", r"\1", src)
    # Collapse 3+ newlines
    src = re.sub(r"\n{3,}", "\n\n", src)
    return src.strip() + "\n"


def apply_pronunciation_guards(text: str) -> tuple[str, list[tuple[str, int]]]:
    """Apply pronunciation guards. Returns (text, [(pattern, count), ...])."""
    counts: list[tuple[str, int]] = []
    for pattern, replacement in PRONUNCIATION_GUARDS:
        new_text, n = re.subn(pattern, replacement, text)
        if n:
            counts.append((pattern, n))
        text = new_text
    return text, counts


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("input", type=Path, help="Source .md file")
    ap.add_argument("output", type=Path, help="Output .transcript.md path")
    ap.add_argument("--quiet", action="store_true", help="Suppress per-guard report")
    args = ap.parse_args()

    if not args.input.exists():
        sys.exit(f"Input not found: {args.input}")

    src = args.input.read_text()
    body = strip_markdown(src)
    body, guard_counts = apply_pronunciation_guards(body)

    # Frontmatter: `final: false` is the safety gate the audio script reads.
    # Flip to `final: true` MANUALLY when the transcript is ready for TTS.
    # Regen always rewrites this to false because content changed.
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    frontmatter = (
        "---\n"
        "final: false\n"
        f"source_md: {args.input.name}\n"
        f"generated_at: {timestamp}\n"
        "---\n\n"
    )
    args.output.write_text(frontmatter + body)

    word_count = len(body.split())
    char_count = len(body)
    print(f"Wrote {args.output}: {char_count:,} chars, {word_count:,} words")
    print(f"  final: false (flip to true in the transcript frontmatter when ready for TTS)")

    if guard_counts and not args.quiet:
        print("Pronunciation guards applied:")
        for pattern, count in guard_counts:
            print(f"  {count:3d}x  {pattern}")


if __name__ == "__main__":
    main()
