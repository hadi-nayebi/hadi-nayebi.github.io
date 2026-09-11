#!/usr/bin/env python3
"""Build an ear-first narration draft from canonical Academy content.

The output keeps reader-facing words separate from render-only pronunciation
aliases. It deliberately excludes front matter, evidence tags, visuals, source
drawers, raw URLs, code blocks, and page navigation.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from pathlib import Path


PRONUNCIATIONS = {
    "data.json": {
        "tts": "data dot json",
        "ipa": None,
        "asr_accept": ["data.json", "data dot json", "data json"],
    },
    "evolution.md": {
        "tts": "evolution dot M D",
        "ipa": None,
        "asr_accept": ["evolution.md", "evolution dot m d", "evolution m d", "evolution md"],
    },
    "OPEVC": {
        "tts": "oh pee ee vee see",
        "ipa": None,
        "asr_accept": ["OPEVC", "O P E V C"],
    },
    "jq": {
        "tts": "J Q",
        "ipa": None,
        "asr_accept": ["jq", "J Q", "jay cue"],
    },
}

CONTEXTUAL_CHECKS = (
    (
        re.compile(r"\bknowledge lives\b", re.I),
        {
            "term": "lives",
            "sense": "verb form of live",
            "ipa": "lɪvz",
            "asr_accept": ["lives"],
        },
    ),
)

RAW_HTML = re.compile(r"<!--\s*RAW_HTML\s*-->.*?<!--\s*/RAW_HTML\s*-->", re.I | re.S)
COMMENT = re.compile(r"<!--.*?-->", re.S)
REF_TAG = re.compile(r"\s*\*\[ref:\s*.*?\]\*(?=\s|$)", re.I | re.S)
FENCE = re.compile(r"```.*?```", re.S)
FIGURE = re.compile(r"<(figure|script|style|svg|aside)\b.*?</\1>", re.I | re.S)
TAG = re.compile(r"</?[A-Za-z][^>]*>")
LINK = re.compile(r"\[([^\]]+)\]\((?:[^()]|\([^)]*\))*\)")
IMAGE = re.compile(r"!\[[^\]]*\]\((?:[^()]|\([^)]*\))*\)")
SENTENCE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9\"'“])")
NAVIGATION = re.compile(
    r"^\*(?:Previous|Next|Companion|Series interlude)[^\n]*\*\s*$",
    re.I | re.M,
)


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def remove_frontmatter(source: str) -> str:
    return re.sub(r"\A---\s*\n.*?\n---\s*\n", "", source, count=1, flags=re.S)


def strip_inline(markdown: str) -> str:
    value = IMAGE.sub("", markdown)
    value = LINK.sub(r"\1", value)
    value = re.sub(r"`([^`]+)`", r"\1", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"\1", value)
    value = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"\1", value)
    value = re.sub(r"_([^_\n]+)_", r"\1", value)
    value = TAG.sub("", value)
    return html.unescape(value)


def spoken_rewrites(text: str) -> str:
    """Translate eye-oriented technical notation into equivalent spoken prose."""
    rewrites = (
        (r"\bCLI-agent\b", "command-line agent"),
        (r"\bOS-level\b", "operating-system-level"),
        (r"\bJSON-encoded\b", "Encoded as JSON"),
        (r"\bgitignored\b", "ignored by Git"),
        (r"\bmvs over\b", "moves the temporary file over"),
        (r"\bdocs/", "the docs directory"),
        (r"\bflock on a machine-local lockfile\b", "the flock command on a machine-local lockfile"),
        (r"\bvalidates with jq empty\b", "validates by running jq empty"),
    )
    for pattern, replacement in rewrites:
        text = re.sub(pattern, replacement, text)
    return re.sub(r"\s+", " ", text).strip()


def markdown_blocks(source: str) -> list[dict[str, str]]:
    body = remove_frontmatter(source)
    body = RAW_HTML.sub("\n", body)
    body = COMMENT.sub("\n", body)
    body = REF_TAG.sub("", body)
    body = FENCE.sub("\n", body)
    body = FIGURE.sub("\n", body)
    body = NAVIGATION.sub("", body)

    blocks: list[dict[str, str]] = []
    paragraph: list[str] = []
    list_items: list[str] = []
    skip_caption = False

    def flush_paragraph() -> None:
        nonlocal paragraph
        text = " ".join(part.strip() for part in paragraph if part.strip())
        text = spoken_rewrites(re.sub(r"\s+", " ", strip_inline(text)).strip())
        if text:
            blocks.append({"kind": "body", "text": text})
        paragraph = []

    def flush_list() -> None:
        nonlocal list_items
        if list_items:
            blocks.append({"kind": "list", "text": " ".join(list_items)})
        list_items = []

    for raw in body.splitlines():
        line = raw.strip()
        if skip_caption:
            if not line:
                continue
            if re.fullmatch(r"\*[^*]+\*", line):
                skip_caption = False
                continue
            skip_caption = False
        if not line:
            flush_paragraph()
            flush_list()
            continue
        if IMAGE.search(line):
            flush_paragraph()
            flush_list()
            skip_caption = True
            continue
        if re.fullmatch(r"[-*_]{3,}", line):
            flush_paragraph()
            flush_list()
            continue
        orientation = re.fullmatch(r"\*(Essay\s+\d+(?:\.\d+)?\s+—\s+.+)\*", line, re.I)
        if orientation:
            flush_paragraph()
            flush_list()
            blocks.append({"kind": "orientation", "text": strip_inline(orientation.group(1))})
            continue
        if re.match(r"^(?:Target asset|Target video|Asset):\s+", line, re.I):
            flush_paragraph()
            flush_list()
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            text = spoken_rewrites(re.sub(r"\s+", " ", strip_inline(heading.group(2))).strip())
            if text:
                blocks.append({"kind": "title" if len(heading.group(1)) == 1 else "heading", "text": text})
            continue
        bullet = re.match(r"^(?:[-*+]\s+|\d+[.)]\s+)(.+)$", line)
        if bullet:
            flush_paragraph()
            item = spoken_rewrites(re.sub(r"\s+", " ", strip_inline(bullet.group(1))).strip())
            if item:
                list_items.append(item if re.search(r"[.!?]$", item) else item + ".")
            continue
        if list_items:
            flush_list()
        paragraph.append(re.sub(r"^>\s?", "", line))

    flush_paragraph()
    flush_list()
    if blocks:
        title_key = re.sub(r"\W+", "", blocks[0]["text"]).lower()
        blocks = [
            block for index, block in enumerate(blocks)
            if index == 0
            or block["kind"] != "heading"
            or re.sub(r"\W+", "", block["text"]).lower() != title_key
        ]
        seen_orientation: set[str] = set()
        deduplicated: list[dict[str, str]] = []
        for block in blocks:
            if block["kind"] != "orientation":
                deduplicated.append(block)
                continue
            key = block["text"].casefold()
            if key not in seen_orientation:
                deduplicated.append(block)
                seen_orientation.add(key)
        blocks = deduplicated
    return blocks


def split_semantic(text: str, max_chars: int) -> list[str]:
    if len(text) <= max_chars:
        return [text]
    sentences = [part.strip() for part in SENTENCE.split(text) if part.strip()]
    output: list[str] = []
    current = ""
    for sentence in sentences:
        pieces = [sentence]
        if len(sentence) > max_chars:
            pieces = [part.strip() for part in re.split(r"(?<=[,;:])\s+", sentence) if part.strip()]
        for piece in pieces:
            candidate = f"{current} {piece}".strip()
            if current and len(candidate) > max_chars:
                output.append(current)
                current = piece
            else:
                current = candidate
    if current:
        output.append(current)
    return output


def render_aliases(text: str, active: set[str]) -> tuple[str, list[str]]:
    rendered = text
    applied: list[str] = []
    for source in sorted(active, key=len, reverse=True):
        replaced, count = re.subn(rf"(?<!\w){re.escape(source)}(?!\w)", PRONUNCIATIONS[source]["tts"], rendered)
        if count:
            applied.append(source)
            rendered = replaced
    rendered = re.sub(r"\s*[\u2014\u2013]\s*|\s+-\s+", ", ", rendered)
    rendered = re.sub(r"\s+", " ", rendered).strip()
    return rendered, applied


def build(
    source_path: Path,
    max_chars: int,
    target_wpm: int,
    approved_at: str,
    pronunciations: set[str],
) -> dict:
    source = source_path.read_text(encoding="utf-8")
    chunks: list[dict] = []
    sequence = 0
    for block in markdown_blocks(source):
        parts = split_semantic(block["text"], max_chars)
        for part_index, part in enumerate(parts):
            sequence += 1
            tts_text, applied = render_aliases(part, pronunciations)
            pronunciation_checks = [
                rule
                for pattern, rule in CONTEXTUAL_CHECKS
                if pattern.search(part)
            ]
            kind = block["kind"]
            chunks.append({
                "id": f"n{sequence:03d}",
                "sequence": sequence,
                "kind": kind,
                "text": part,
                "tts_text": tts_text,
                "pronunciations": applied,
                "pronunciation_checks": pronunciation_checks,
                "gap_after_ms": (
                    240 if part_index < len(parts) - 1
                    else 700 if kind == "title"
                    else 550 if kind in {"heading", "orientation"}
                    else 480 if kind == "list"
                    else 420
                ),
                "text_sha256": sha256_text(part),
            })
    if chunks:
        chunks[-1]["gap_after_ms"] = 900
    narration_words = sum(len(chunk["text"].split()) for chunk in chunks)
    return {
        "schema_version": "1.0.0",
        "source": source_path.as_posix(),
        "source_sha256": sha256_text(source),
        "status": "voice-review",
        "content_lock": {
            "status": "approved",
            "approved_at": approved_at,
        },
        "voice_review": "pending",
        "canonical_text_policy": "Readable published wording is retained in text; render-only aliases live in tts_text.",
        "pronunciation_policy": "Use canonical spelling by default. Add a render-only English respelling only after a bounded same-seed test proves a concrete pronunciation error. IPA is reference metadata only.",
        "audio": {
            "engine": "Qwen3-TTS voice clone",
            "model": "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
            "target_wpm": target_wpm,
            "sample_rate_hz": 24000,
            "channels": 1,
            "loudness_lufs": -16,
            "true_peak_dbtp": -1.5,
        },
        "curation": {
            "source_file_words": len(source.split()),
            "narration_words": narration_words,
            "excluded": [
                "front matter",
                "evidence annotations",
                "visual and asset-production instructions",
                "image captions",
                "code blocks",
                "raw link destinations",
                "previous and next navigation",
                "duplicate title and series footer",
            ],
        },
        "pronunciation_lexicon": {key: value for key, value in PRONUNCIATIONS.items() if any(key in chunk["pronunciations"] for chunk in chunks)},
        "chunks": chunks,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--max-chars", type=int, default=320)
    parser.add_argument("--target-wpm", type=int, default=165)
    parser.add_argument("--approved-at", required=True)
    parser.add_argument(
        "--pronunciation",
        action="append",
        default=[],
        choices=sorted(PRONUNCIATIONS),
        help="Enable one tested render-only pronunciation override; repeat as needed.",
    )
    args = parser.parse_args()
    if not 180 <= args.max_chars <= 700:
        raise SystemExit("--max-chars must be between 180 and 700")
    document = build(
        args.source,
        args.max_chars,
        args.target_wpm,
        args.approved_at,
        set(args.pronunciation),
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(document, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}: {len(document['chunks'])} semantic chunks")


if __name__ == "__main__":
    main()
