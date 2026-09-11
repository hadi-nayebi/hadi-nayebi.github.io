#!/usr/bin/env python3
"""Validate source lock, curation boundaries, and chunk integrity for narration."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path


BANNED = (
    "ref:",
    "Target asset:",
    "Target video:",
    "Concept:",
    "Style:",
    "Previous:",
    "Next:",
    "http://",
    "https://",
    "<figure",
    "<img",
    "<!--",
)


def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def fail(message: str) -> None:
    raise SystemExit(f"Narration validation failed: {message}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("transcript", type=Path)
    args = parser.parse_args()
    root = Path.cwd()
    document = json.loads(args.transcript.read_text(encoding="utf-8"))
    source_path = root / document["source"]
    if not source_path.is_file():
        fail(f"missing source {document['source']}")
    source = source_path.read_text(encoding="utf-8")
    if digest(source) != document["source_sha256"]:
        fail("canonical source hash changed")
    if document.get("content_lock", {}).get("status") != "approved":
        fail("source content lock is not approved")
    if document.get("voice_review") != "pending":
        fail("pilot must remain pending until Hadi reviews the audio")

    records = []
    for path in (root / "docs/narration-source-review/reviews").glob("*.json"):
        record = json.loads(path.read_text(encoding="utf-8"))
        if record.get("path") == document["source"]:
            records.append((path, record))
    if len(records) != 1:
        fail(f"expected one source-review record, found {len(records)}")
    review_path, review = records[0]
    if review.get("source_sha256") != document["source_sha256"]:
        fail(f"source hash differs from {review_path}")
    if review.get("review", {}).get("hadi_content_lock") != "approved":
        fail(f"Hadi content lock is not recorded in {review_path}")

    chunks = document.get("chunks", [])
    if not chunks:
        fail("no chunks")
    ids = set()
    aliases = set()
    for expected, chunk in enumerate(chunks, start=1):
        if chunk.get("sequence") != expected:
            fail(f"non-contiguous sequence at {chunk.get('id')}")
        if chunk.get("id") in ids:
            fail(f"duplicate chunk ID {chunk.get('id')}")
        ids.add(chunk.get("id"))
        text = str(chunk.get("text", "")).strip()
        tts_text = str(chunk.get("tts_text", "")).strip()
        if not text or not tts_text:
            fail(f"empty text at {chunk.get('id')}")
        if len(text) > 360:
            fail(f"chunk {chunk.get('id')} exceeds 360 characters")
        if digest(text) != chunk.get("text_sha256"):
            fail(f"text hash mismatch at {chunk.get('id')}")
        for marker in BANNED:
            if marker.lower() in text.lower() or marker.lower() in tts_text.lower():
                fail(f"unspoken marker {marker!r} leaked into {chunk.get('id')}")
        if re.search(r"/home/|[0-9a-f]{40}", text, re.I):
            fail(f"private path or revision-like evidence leaked into {chunk.get('id')}")
        aliases.update(chunk.get("pronunciations", []))
        for check in chunk.get("pronunciation_checks", []):
            if not check.get("term") or not check.get("asr_accept"):
                fail(f"incomplete contextual pronunciation check at {chunk.get('id')}")
            if not re.search(
                rf"(?<!\w){re.escape(check['term'])}(?!\w)",
                text,
                re.I,
            ):
                fail(f"contextual pronunciation term is absent at {chunk.get('id')}")

    lexicon = document.get("pronunciation_lexicon", {})
    if aliases != set(lexicon):
        fail("pronunciation lexicon does not exactly match applied aliases")
    print(
        f"Narration transcript passed: {args.transcript} "
        f"({len(chunks)} chunks, {len(aliases)} pronunciation aliases)"
    )


if __name__ == "__main__":
    main()
