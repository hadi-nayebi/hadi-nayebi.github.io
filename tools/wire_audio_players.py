#!/usr/bin/env python3
"""Wire the draft-narration audio player into every blog essay that has a
.transcript.md, just above <div class="article-body">. Idempotent: skips any
essay already carrying an audio-guide figure. The mp3 src is the per-essay
slug under the essay's own audio/ dir (audio/<slug>.draft.mp3) — matching the
06_1 gold-standard wiring. mp3 binaries are gitignored + generated separately.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "blog"

FIGURE = '''                    <figure class="audio-guide" aria-label="Draft narration of this essay" style="margin:1.5rem 0;padding:1rem 1.25rem;border:1px solid rgba(139,92,246,0.35);border-radius:14px;background:rgba(99,102,241,0.06);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
                        <figcaption style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;font-size:0.85rem;font-weight:600;letter-spacing:0.01em;color:#a5b4fc;">
                            <span aria-hidden="true">&#128264;</span>
                            <span>Draft narration &mdash; free voice. Final studio version coming.</span>
                        </figcaption>
                        <audio controls preload="none" src="audio/{slug}.draft.mp3" style="width:100%;">
                            Your browser does not support the audio element.
                            <a href="audio/{slug}.draft.mp3" style="color:#a5b4fc;">Download the draft narration (MP3)</a>.
                        </audio>
                    </figure>

'''

ANCHOR = '                    <div class="article-body">'


def essay_htmls():
    for tx in sorted(BLOG.rglob("*.transcript.md")):
        html = tx.with_name(tx.name.replace(".transcript.md", ".html"))
        if html.exists():
            yield html


def wire(html: Path) -> str:
    text = html.read_text(encoding="utf-8")
    if "audio-guide" in text:
        return "skip-already-wired"
    if ANCHOR not in text:
        return "skip-no-anchor"
    slug = html.name[:-5]  # strip .html
    block = FIGURE.format(slug=slug)
    # insert before the FIRST article-body anchor only
    new = text.replace(ANCHOR, block + ANCHOR, 1)
    html.write_text(new, encoding="utf-8")
    return "wired"


def main():
    results = {"wired": [], "skip-already-wired": [], "skip-no-anchor": []}
    for html in essay_htmls():
        r = wire(html)
        results[r].append(str(html.relative_to(ROOT)))
    for k, v in results.items():
        print(f"{k}: {len(v)}")
        for p in v:
            print(f"  {p}")


if __name__ == "__main__":
    main()
