#!/usr/bin/env python3
"""Generate blog post HTML from a blog .md draft.

Pragmatic markdown converter tuned for this blog's specific patterns:
- YAML frontmatter (title, date, slug, read_time, tags, og_image)
- Ref-tag inline format: *[ref: slug | path | quote]*  →  <sup class="ref-marker" title="...">&#9432;</sup>
- HTML comment image placeholders: <!-- IMAGE PLACEHOLDER: ... -->  →  <aside class="image-placeholder">
- Standard markdown: ## h2, ### h3, **bold**, *italic*, `code`, [link](url), --- hr
- Lists: - item lines clustered into <ul>/<li>
- Em-dash discipline: -- → &mdash;, single ASCII curly-apostrophe substitution for typography
- Sidebar: list every existing blog post (newest first), mark the current one active

Usage:
    python3 tools/generate_blog_html.py <input.md> <output.html>

Run from the website repo root (so blog/ resolves correctly).
"""

import argparse
import html
import re
import sys
from pathlib import Path

# All published + drafting blog posts in newest-first order.
# Each entry is (slug_without_extension, title, date, read_time, audience_tag, tags).
# Update when a new post is added. The active post is auto-detected from the input slug.
SIDEBAR_POSTS = [
    ("08_1-apprentice-to-architect-foundation", "Essay 8.1 — Apprentice to Architect Foundation", "May 2026", "5 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("08_2-job-maturation-stages",       "Essay 8.2 — The Stages of Job Maturation",         "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation", "Jobs"]),
    ("08_3-brain-after-three-months",    "Essay 8.3 — What Lives in the Brain After Three Months", "May 2026", "6 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation", "Knowledge"]),
    ("08_4-soft-hard-migration",         "Essay 8.4 — Soft → Hard Migration",               "May 2026", "6 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation", "Patterns"]),
    ("08_5-enforced-vs-discipline",      "Essay 8.5 — What's Enforced vs What's Discipline", "May 2026", "4 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("08_6-apprentice-journeyman-architect", "Essay 8.6 — The Maturation Arc — Apprentice, Journeyman, Architect",               "May 2026", "8 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("08_7-brain-stops-growing",         "Essay 8.7 — The Brain Stops Growing in Size",      "May 2026", "5 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("08_8-safe-self-modification",      "Essay 8.8 — A System That Safely Modifies Itself", "May 2026", "5 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("08_9-the-seed-is-yours",           "Essay 8.9 — The Seed Is Yours",                    "May 2026", "5 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("07_1-plugin-kit-foundation",       "Essay 7.1 — Plugin Kit Foundation",               "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_2-skeleton-claudemd-hooks-scripts", "Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts", "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_3-dual-voice-architecture",     "Essay 7.3 — The Dual Voice Architecture",         "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_4-data-json-hidden-state",      "Essay 7.4 — data.json — The Hidden State",         "May 2026", "4 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_5-docs-and-historian",          "Essay 7.5 — docs/ and the Historian",             "May 2026", "4 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_6-agents-and-80-20-budget",     "Essay 7.6 — agents/ and the 80/20 Dispatch Budget", "May 2026", "4 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_7-smaller-organs-and-wiring",   "Essay 7.7 — Smaller Organs and Brain-Root Wiring", "May 2026", "4 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_8-lock-ceremony",               "Essay 7.8 — The Lock Ceremony",                   "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("07_9-creating-a-new-plugin",       "Essay 7.9 — Building a New Plugin",               "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent", "Plugin Kit"]),
    ("06_1-phasic-foundation",           "Essay 6.1 — Phasic Foundation",                   "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_2-discipline-and-map",          "Essay 6.2 — The Discipline and the Map",          "May 2026", "11 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_3-observe",                     "Essay 6.3 — OBSERVE — Read Wide, Write Once",      "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_4-plan",                        "Essay 6.4 — PLAN — Decide, Then Lock",             "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_5-execute",                     "Essay 6.5 — EXECUTE — Build, in Scope, in Steps",  "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_6-verify",                      "Essay 6.6 — VERIFY — Independent Eyes",            "May 2026", "9 min read",  "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Phases"]),
    ("06_7-condense",                    "Essay 6.7 — CONDENSE — The Cognitive Organ",      "May 2026", "11 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "CONDENSE"]),
    ("06_8-inverse-multiplier",         "Essay 6.8 — The Inverse Multiplier",              "May 2026", "11 min read", "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Multiplier"]),
    ("06_9-gmode",                       "Essay 6.9 — GMODE — The Off-Cycle Lane",           "May 2026", "8 min read",  "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "GMODE"]),
    ("06_10-plan-state-machine",         "Essay 6.10 — The Plan-State Machine — Long-Horizon Memory",             "May 2026", "8 min read",  "Power Users &amp; Architects", ["Architecture", "Seed Agent", "OPEVC", "Plan File", "Long-Horizon"]),
    ("05_1-the-two-layer-foundation",    "Essay 5.1 — The Two-Layer Foundation",            "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_2-plugin-integrity",            "Essay 5.2 — Plugin Edit Safety — plugin_integrity",                  "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_3-brain-guard",                 "Essay 5.3 — Context Window Discipline — brain_guard",           "May 2026", "8 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_4-job-core",                    "Essay 5.4 — Job Lifecycle — job_core",                       "May 2026", "7 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_5-interaction-summary",         "Essay 5.5 — Mega-Prompt Compression — interaction_summary",             "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_6-question-discipline",         "Essay 5.6 — Structured Questions — question_discipline",                "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_7-claude-md-hierarchy",         "Essay 5.7 — The CLAUDE.md Hierarchy",             "May 2026", "12 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_8-historian-ratchet",           "Essay 5.8 — The Historian Ratchet",               "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_9-customization-guardrail",     "Essay 5.9 — The Customization Guardrail",         "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("03_1-the-folder-is-alive",         "The Folder Is Alive",                   "May 2026",      "17 min read",  "Professionals", ["Vision", "Seed Agent", "Future of Work"]),
    ("04-the-language-of-agents",        "The Language of Agents",                "March 2026",    "18 min read",  "Professionals", ["Agents", "AI", "Vocabulary"]),
    ("03-your-brain-was-never-built-for-this", "Your Brain Was Never Built for This", "March 2026", "16 min read", "Professionals", ["Agents", "AI", "Society", "Evolution"]),
    ("02-we-could-have-had-agi",         "We Could Have Had AGI By Now",          "February 2026", "20 min read",  "Professionals", ["Agents", "AI", "Architecture", "AGI"]),
    ("01-llms-are-not-the-agents",       "LLMs Are Not the Agents",               "February 2026", "17 min read",  "Professionals", ["Agents", "AI", "Fundamentals"]),
]

AUDIENCE_TITLE = {
    "Professionals": "For lawyers, consultants, PMs, researchers — no coding required",
    "Power Users &amp; Architects": "Semi-technical to architect-level — Tier 2 to Tier 3",
}

# Slug-to-subdir mapping. When a mini-series is moved into its own subdir,
# add an entry here. Empty string means "blog/ root, no subdir".
# 2026-05-18: B5 → blog/b5/, B7 → blog/b7/, B8 → blog/b8/.
# 2026-05-19: B6 → blog/b6/.
SLUG_SUBDIR_PREFIXES = {
    "05_": "b5",
    "06_": "b6",
    "07_": "b7",
    "08_": "b8",
}

def get_slug_subdir(slug: str) -> str:
    """Return subdir for a slug (e.g., '05_X' → 'b5'), or '' for root blog/."""
    for prefix, sub in SLUG_SUBDIR_PREFIXES.items():
        if slug.startswith(prefix):
            return sub
    return ""

def slug_to_href(target_slug: str, from_subdir: str) -> str:
    """Compute relative href from a page in from_subdir to target_slug's .html.

    from_subdir='' means blog/ root; from_subdir='b5' means blog/b5/.
    Target's location is determined by SLUG_SUBDIR_PREFIXES lookup.
    """
    target_sub = get_slug_subdir(target_slug)
    if target_sub == from_subdir:
        return f"{target_slug}.html"            # same dir
    if from_subdir and not target_sub:
        return f"../{target_slug}.html"         # subdir → root
    if not from_subdir and target_sub:
        return f"{target_sub}/{target_slug}.html"  # root → subdir
    # Both in different subdirs (future case when B6 etc. also move).
    return f"../{target_sub}/{target_slug}.html"

# Canonical reading order across the series. Sidebar prev/next derives from this list,
# NOT from SIDEBAR_POSTS (which is publication-descending and conflates 3.1's late-publish
# date with reading order). Update this list whenever a new essay slots into the sequence.
READING_ORDER = [
    "01-llms-are-not-the-agents",
    "02-we-could-have-had-agi",
    "03-your-brain-was-never-built-for-this",
    "03_1-the-folder-is-alive",
    "04-the-language-of-agents",
    "05_1-the-two-layer-foundation",
    "05_2-plugin-integrity",
    "05_3-brain-guard",
    "05_4-job-core",
    "05_5-interaction-summary",
    "05_6-question-discipline",
    "05_7-claude-md-hierarchy",
    "05_8-historian-ratchet",
    "05_9-customization-guardrail",
    "06_1-phasic-foundation",
    "06_2-discipline-and-map",
    "06_3-observe",
    "06_4-plan",
    "06_5-execute",
    "06_6-verify",
    "06_7-condense",
    "06_8-inverse-multiplier",
    "06_9-gmode",
    "06_10-plan-state-machine",
    "07_1-plugin-kit-foundation",
    "07_2-skeleton-claudemd-hooks-scripts",
    "07_3-dual-voice-architecture",
    "07_4-data-json-hidden-state",
    "07_5-docs-and-historian",
    "07_6-agents-and-80-20-budget",
    "07_7-smaller-organs-and-wiring",
    "07_8-lock-ceremony",
    "07_9-creating-a-new-plugin",
    "08_1-apprentice-to-architect-foundation",
    "08_2-job-maturation-stages",
    "08_3-brain-after-three-months",
    "08_4-soft-hard-migration",
    "08_5-enforced-vs-discipline",
    "08_6-apprentice-journeyman-architect",
    "08_7-brain-stops-growing",
    "08_8-safe-self-modification",
    "08_9-the-seed-is-yours",
]


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Split YAML frontmatter from body. Returns (meta_dict, body_string)."""
    m = re.match(r"^---\n(.*?)\n---\n(.*)", content, flags=re.DOTALL)
    if not m:
        raise SystemExit("ERROR: no YAML frontmatter found at top of .md file")
    yaml_block, body = m.group(1), m.group(2)
    meta = {}
    for line in yaml_block.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        v = v.strip()
        if v.startswith('"') and v.endswith('"'):
            v = v[1:-1]
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip() for x in v[1:-1].split(",") if x.strip()]
        meta[k.strip()] = v
    return meta, body


# Sentinels used while transforming so we don't double-process content.
_REF_SENTINEL_PREFIX = "\x00REF\x00"
_IMG_SENTINEL_PREFIX = "\x00IMG\x00"
_CODE_SENTINEL_PREFIX = "\x00CODE\x00"
_FENCED_SENTINEL_PREFIX = "\x00FENCED\x00"


def extract_refs(text: str) -> tuple[str, list[str]]:
    """Pull every *[ref: ...]* token out of the prose and replace each with a sentinel.
    Returns the text with sentinels in place plus the list of rendered ref HTML strings.

    Doing the extraction first protects the ref payload from later italic and entity
    transforms — a literal asterisk inside a ref's quote would otherwise re-trigger emphasis.
    """
    refs: list[str] = []
    # Use a lazy `.*?` plus a positive lookahead for `]*` so refs containing `]`
    # inside the quote field (e.g. `[PLUGIN-LOCK]`) still match. DOTALL lets the
    # ref span newlines when the .md wraps long quotes.
    pattern = re.compile(r"\*\[ref:(.*?)\]\*", re.DOTALL)

    def repl(m: re.Match) -> str:
        body = m.group(1).strip()
        # Compose tooltip text. Preserve the format "ref: slug | path | quote".
        tooltip = "ref: " + body.replace("\n", " ")
        # Collapse runs of whitespace introduced by line-wrapping in the .md.
        tooltip = re.sub(r"\s+", " ", tooltip).strip()
        # HTML-escape the title attribute (quotes + angle brackets + ampersand).
        safe = html.escape(tooltip, quote=True)
        rendered = f'<sup class="ref-marker" title="{safe}">&#9432;</sup>'
        refs.append(rendered)
        return f"{_REF_SENTINEL_PREFIX}{len(refs)-1}\x00"
    return pattern.sub(repl, text), refs


def extract_image_placeholders(text: str, input_md_dir: str = "") -> tuple[str, list[str]]:
    """input_md_dir: directory containing the input .md file (e.g., 'blog/b5').
    Used to resolve ASSET paths relative to .md file location. Empty means
    fall back to legacy project-root resolution.

    """
    global _input_md_dir
    _input_md_dir = input_md_dir
    return _extract_image_placeholders_impl(text)

_input_md_dir = ""

def _extract_image_placeholders_impl(text: str) -> tuple[str, list[str]]:
    """Pull <!-- IMAGE PLACEHOLDER: ... --> blocks out and render as <aside>."""
    images: list[str] = []
    pattern = re.compile(r"<!--\s*IMAGE PLACEHOLDER:(.*?)-->", re.DOTALL)

    def repl(m: re.Match) -> str:
        block = m.group(1).strip()
        # Extract Concept (for the header), Caption (for the bottom), ASSET (if asset
        # has been generated and should be rendered instead of the dashed placeholder).
        concept_match = re.search(r"^\s*Concept:\s*(.+?)$", block, re.MULTILINE)
        caption_match = re.search(r'Caption\s*\([^)]*\):\s*"([^"]+)"', block)
        asset_match = re.search(r"^\s*ASSET:\s*(\S+)\s*$", block, re.MULTILINE)
        title = "Image placeholder"
        if concept_match:
            concept = concept_match.group(1).strip().rstrip(".")
            # Take the part after the em-dash if present — that's the short label.
            if "—" in concept:
                title = concept.split("—", 1)[1].strip()
            else:
                title = concept
            title = title[0].upper() + title[1:] if title else "Image"
        caption = caption_match.group(1).strip() if caption_match else ""

        # If ASSET is set AND the file actually exists on disk, render a <figure>
        # with the real image. If ASSET is set but the file doesn't exist yet, fall
        # through to the "image pending" placeholder so the page doesn't show a
        # broken image icon. Bug observed in B6.9 iter-31, 2026-05-15.
        # The asset path in the .md is relative to the .md file's own dir
        # (e.g., "../assets/images/blog/foo.png" from blog/X.md, or
        # "images/X.png" from blog/b5/X.md after the 2026-05-18 restructure).
        # Resolve against input_md_dir (threaded from main → render_body) so
        # the check works for any .md location.
        import os as _os
        asset_path_check = None
        if asset_match:
            raw_asset = asset_match.group(1).strip()
            if _input_md_dir:
                asset_path_check = _os.path.normpath(
                    _os.path.join(_input_md_dir, raw_asset)
                )
            else:
                # Legacy fallback: assume .md is at blog/X.md (one level under
                # project root). Used when extract_image_placeholders is called
                # without input_md_dir context.
                asset_path_check = _os.path.normpath(
                    _os.path.join(_os.path.dirname(__file__), "..",
                                  raw_asset.replace("../", "", 1))
                )
        if asset_match and asset_path_check and _os.path.exists(asset_path_check):
            asset_path = asset_match.group(1).strip()
            title_html = inline_format(title)
            caption_html = inline_format(caption) if caption else ""
            figure = (
                '<figure class="blog-image" style="margin: 2rem 0;">\n'
                f'                          <img src="{asset_path}" alt="{html.escape(title)}" '
                'style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 8px;">\n'
            )
            if caption_html:
                figure += (
                    '                          <figcaption style="margin-top: 0.75rem; font-size: 0.9em; line-height: 1.5; '
                    'color: rgba(255, 255, 255, 0.75); text-align: center; font-style: italic;">'
                    f'{caption_html}</figcaption>\n'
                )
            figure += '                        </figure>'
            images.append(figure)
            return f"{_IMG_SENTINEL_PREFIX}{len(images)-1}\x00"

        # Build the prompt body by stripping Concept + Caption lines and reflowing.
        lines = block.splitlines()
        prompt_lines = []
        for ln in lines:
            stripped = ln.strip()
            if stripped.startswith("Concept:"):
                continue
            if stripped.startswith("Caption (") and stripped.endswith('"'):
                continue
            prompt_lines.append(stripped)
        prompt = " ".join(p for p in prompt_lines if p)

        # Inline-format the prompt (apply basic markdown transforms — bold, code, italic).
        prompt_html = inline_format(prompt)
        title_html = inline_format(title)
        caption_html = inline_format(caption)

        # Placeholder for when the image hasn't been generated yet. The PROMPT
        # must remain visible so the operator can read it and use it to generate
        # the image. Wraps in <figure class="blog-image"> for layout consistency
        # with rendered figures, but content is the full prompt + concept + caption
        # (NOT a stripped-down "image pending" tile — that destroyed the workflow).
        # Per user 2026-05-15: "images if missing must have the prompt in place so
        # i can make them not an empty placeholder".
        aside = (
            '<figure class="blog-image image-placeholder-pending" '
            'style="margin: 2rem 0; padding: 1.25rem 1.5rem; border-radius: 8px; '
            'background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.18);">\n'
            '                          <div style="margin: 0 0 0.75rem 0; font-weight: 600; '
            'font-size: 0.8em; letter-spacing: 0.06em; text-transform: uppercase; '
            'color: rgba(255,255,255,0.6);">'
            f'Image pending &mdash; {title_html}</div>\n'
            '                          <div style="margin: 0 0 0.75rem 0; font-size: 0.88em; '
            'line-height: 1.55; color: rgba(255,255,255,0.78);">'
            f'<em>Prompt:</em> {prompt_html}</div>\n'
            '                          <figcaption style="margin-top: 0.75rem; font-size: 0.88em; '
            'line-height: 1.5; color: rgba(255,255,255,0.7); font-style: italic;">'
            f'{caption_html}</figcaption>\n'
            '                        </figure>'
        )
        images.append(aside)
        return f"{_IMG_SENTINEL_PREFIX}{len(images)-1}\x00"
    return pattern.sub(repl, text), images


def extract_fenced_code_blocks(text: str) -> tuple[str, list[str]]:
    """Pull triple-backtick fenced code blocks out BEFORE inline-code extraction.

    Multi-line fenced blocks (```...```) interact badly with the inline-code regex
    `([^`]+?)`, which spans newlines for content and would otherwise match backticks
    across fence boundaries — eating subsequent inline-code spans as if they were
    part of one giant code span. The result before this fix: null-byte sentinels
    left unrestored in B5.7's body (the file reports as `data` not HTML).

    Extracting fenced blocks first protects them: the fence-and-content is replaced
    with a single sentinel, and inline-code extraction sees only prose text.
    """
    blocks: list[str] = []

    def repl(m: re.Match) -> str:
        # Group 1 is the content between the opening and closing fence lines.
        # html.escape so < > & in the code render as literal text inside <pre><code>.
        blocks.append(html.escape(m.group(1)))
        return f"{_FENCED_SENTINEL_PREFIX}{len(blocks)-1}\x00"

    # Pattern: ``` (optional language hint on same line) \n content \n ```
    # DOTALL lets `.` match newlines inside the content; non-greedy stops at first
    # closing fence rather than spanning multiple fenced blocks.
    pattern = re.compile(r"```[^\n]*\n(.*?)\n```", re.DOTALL)
    return pattern.sub(repl, text), blocks


def extract_inline_code(text: str) -> tuple[str, list[str]]:
    """Pull `code` spans out before any other inline transformation runs against them.

    Must run AFTER extract_fenced_code_blocks — see that function's docstring."""
    code_spans: list[str] = []

    def repl(m: re.Match) -> str:
        code_spans.append(html.escape(m.group(1)))
        return f"{_CODE_SENTINEL_PREFIX}{len(code_spans)-1}\x00"
    return re.sub(r"`([^`]+?)`", repl, text), code_spans


def inline_format(text: str) -> str:
    """Apply inline markdown transforms to a chunk of text that does NOT contain
    refs, code, or image placeholders (those are sentinel-protected upstream)."""
    # Bold first (matches **...** before single * italics).
    text = re.sub(r"\*\*([^*]+?)\*\*", r"<strong>\1</strong>", text)
    # Italic: avoid mid-word underscores; require surrounding non-asterisks.
    text = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<em>\1</em>", text)
    # Links [text](url) — write before generic angle-bracket escapes.
    text = re.sub(r"\[([^\]]+?)\]\(([^)]+?)\)", r'<a href="\2">\1</a>', text)
    # Typographic substitutions — em-dash + curly quotes.
    text = text.replace(" -- ", " &mdash; ")
    # The unicode em-dash present in the .md → HTML entity for consistency with prior posts.
    text = text.replace("—", "&mdash;")
    # Curly quotes: rough heuristic on apostrophes that follow a letter.
    text = re.sub(r"([A-Za-z])'([A-Za-z])", r"\1&rsquo;\2", text)
    text = re.sub(r"([A-Za-z])'\b", r"\1&rsquo;", text)
    return text


def restore_sentinels(
    text: str,
    refs: list[str],
    images: list[str],
    code_spans: list[str],
    fenced: list[str],
) -> str:
    """Replace each sentinel with its rendered HTML, then return."""
    def restore_ref(m: re.Match) -> str:
        return refs[int(m.group(1))]
    def restore_img(m: re.Match) -> str:
        return images[int(m.group(1))]
    def restore_code(m: re.Match) -> str:
        return f"<code>{code_spans[int(m.group(1))]}</code>"
    def restore_fenced(m: re.Match) -> str:
        # white-space: pre-wrap + overflow-wrap: break-word lets long lines (e.g.,
        # state-machine arrow flows) wrap inside the article column instead of
        # overflowing horizontally. Fix per B6.10 width issue 2026-05-16.
        return (
            f'<pre style="white-space: pre-wrap; overflow-wrap: break-word; '
            f'max-width: 100%; padding: 1rem; background: rgba(255,255,255,0.04); '
            f'border-radius: 6px; font-size: 0.88em; line-height: 1.5;">'
            f'<code>{fenced[int(m.group(1))]}</code></pre>'
        )
    text = re.sub(_REF_SENTINEL_PREFIX + r"(\d+)\x00", restore_ref, text)
    text = re.sub(_IMG_SENTINEL_PREFIX + r"(\d+)\x00", restore_img, text)
    text = re.sub(_FENCED_SENTINEL_PREFIX + r"(\d+)\x00", restore_fenced, text)
    text = re.sub(_CODE_SENTINEL_PREFIX + r"(\d+)\x00", restore_code, text)
    return text


def render_body(body: str, input_md_dir: str = "") -> str:
    """Convert blog markdown body to HTML article-body innerHTML."""
    # 1. Pull out image placeholders (HTML comment blocks).
    body, images = extract_image_placeholders(body, input_md_dir=input_md_dir)
    # 2. Pull out refs.
    body, refs = extract_refs(body)
    # 3. Pull out fenced code blocks (```...```) BEFORE inline-code extraction.
    body, fenced = extract_fenced_code_blocks(body)
    # 4. Pull out inline code spans.
    body, code_spans = extract_inline_code(body)

    # Now process by blocks.
    blocks = re.split(r"\n\s*\n", body)
    output: list[str] = []

    for block in blocks:
        # Strip leading/trailing whitespace from the block before any check.
        # Without this, blocks with a leading newline (e.g., body starts with
        # "\n# Title") fail the heading startswith check, fall through to
        # paragraph rendering, and produce duplicate-h1 paragraphs like
        # "<p> # Title</p>" below the template's own <h1>. Bug present across
        # all 19 essays (B5.1-B5.9 + B6.1-B6.10) until iter-30, 2026-05-15.
        block = block.strip()
        if not block:
            continue
        # Image-placeholder sentinel block — pass through verbatim.
        if block.startswith(_IMG_SENTINEL_PREFIX):
            output.append(block)
            continue
        # Fenced-code sentinel block — pass through verbatim (restore_sentinels
        # turns it into <pre><code>...</code></pre>).
        if block.startswith(_FENCED_SENTINEL_PREFIX):
            output.append(block)
            continue
        # HR
        if re.fullmatch(r"-{3,}", block):
            output.append("<hr>")
            continue
        # Headings
        # SUPPRESS body's "# Title" — the template already emits <h1> from frontmatter.
        # Without suppression: two <h1>s on the same page (one from template, one from body).
        if block.startswith("# "):
            continue
        if block.startswith("## "):
            output.append(f"<h2>{inline_format(block[3:].strip())}</h2>")
            continue
        if block.startswith("### "):
            output.append(f"<h3>{inline_format(block[4:].strip())}</h3>")
            continue
        # Unordered list — block where EVERY non-blank line starts with "- " or "* ".
        # Require at least one actual bullet so a standalone ref-sentinel block
        # (the post-list trailing ref-tag paragraph pattern) does not get classified
        # as a single-item list.
        non_blank_lines = [ln for ln in block.splitlines() if ln.strip()]
        if non_blank_lines and all(re.match(r"^\s*[-*]\s+", ln) for ln in non_blank_lines):
            items = re.split(r"\n\s*[-*]\s+", "\n" + block.strip())
            li_html = "".join(
                f"\n                            <li>{inline_format(item.strip())}</li>"
                for item in items if item.strip()
            )
            output.append(f"<ul>{li_html}\n                        </ul>")
            continue
        # Blockquote
        if block.lstrip().startswith("> "):
            inner = "\n".join(re.sub(r"^>\s?", "", ln) for ln in block.splitlines())
            output.append(f"<blockquote><p>{inline_format(inner.strip())}</p></blockquote>")
            continue
        # Inline image block — emit <figure>, not <p><a>.
        # Without this, render_body's default-paragraph fallback wrapped images in <p>
        # and inline_format treated `!` as text and `[...](...)` as a link — the bug
        # that broke B6.1's opevc-cycle-blackboard.png display 2026-05-15.
        # Two shapes supported:
        #   1. Single line ![alt](url) — figcaption uses alt text.
        #   2. ![alt](url) + immediately-following *italic caption* line (no blank line
        #      between). Figcaption uses the italic caption; alt remains the screen-
        #      reader description. Pattern present across Part-1 essays (01 + 03_1) —
        #      they author images with a separate italic caption line, which falls
        #      under the same block as the image until separated by a blank line.
        img_caption_match = re.fullmatch(
            r"!\[([^\]]*?)\]\(([^)]+?)\)\n\*(.+?)\*", block.strip(), re.DOTALL
        )
        img_only_match = None if img_caption_match else re.fullmatch(
            r"!\[([^\]]*?)\]\(([^)]+?)\)", block.strip()
        )
        if img_caption_match or img_only_match:
            m = img_caption_match or img_only_match
            alt = html.escape(m.group(1))
            src = m.group(2)
            caption_html = (
                inline_format(m.group(3).strip()) if img_caption_match else alt
            )
            output.append(
                f'<figure class="blog-image" style="margin: 2rem 0;">\n'
                f'                          <img src="{src}" alt="{alt}" '
                f'style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 8px;">\n'
                f'                          <figcaption style="text-align: center; font-style: italic; '
                f'margin-top: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem;">{caption_html}</figcaption>\n'
                f'                        </figure>'
            )
            continue
        # Default: paragraph. Collapse internal newlines into single space.
        para_text = " ".join(ln.strip() for ln in block.splitlines())
        output.append(f"<p>{inline_format(para_text)}</p>")

    rendered = "\n\n                        ".join(output)
    rendered = restore_sentinels(rendered, refs, images, code_spans, fenced)
    return rendered


def _post_by_slug(slug: str) -> tuple | None:
    """Look up a SIDEBAR_POSTS row by slug. Returns the full tuple or None."""
    return next((row for row in SIDEBAR_POSTS if row[0] == slug), None)


def _render_card(post: tuple, kind: str, from_subdir: str = "") -> str:
    """Render a single sidebar card. kind ∈ {'previous', 'active', 'next'}.

    from_subdir is the subdir the rendered HTML lives in (e.g., 'b5' for
    blog/b5/X.html). Used by slug_to_href to compute correct prev/next link
    paths that may need to cross from subdir to root (e.g., B5 → B6).
    """
    slug, title, date, read_time, audience, tags = post
    date_html = html.escape(date) if "&" not in date else date
    rt_html = html.escape(read_time) if "&" not in read_time else read_time
    meta_line = f"{date_html} &bull; {rt_html}" if read_time != "TBD" else date_html
    audience_tip = AUDIENCE_TITLE.get(audience, "")
    active_indent = " " * 32
    inactive_indent = " " * 36
    active_tags = ("\n" + active_indent).join(
        f'<span class="tag tag-sm">{html.escape(t)}</span>' for t in tags
    )
    inactive_tags = ("\n" + inactive_indent).join(
        f'<span class="tag tag-sm">{html.escape(t)}</span>' for t in tags
    )
    if kind == "active":
        return (
            '                        <div class="article-card active">\n'
            '                            <div class="article-card-tags">\n'
            f'                                <span class="tag tag-sm tag-audience" title="{audience_tip}">{audience}</span>\n'
            f'                                {active_tags}\n'
            '                            </div>\n'
            '                            <div class="sidebar-card-position">You are here</div>\n'
            f'                            <h3>{html.escape(title)}</h3>\n'
            f'                            <div class="date">{meta_line}</div>\n'
            '                        </div>'
        )
    # previous / next get an arrow header above the title
    arrow_label = "&larr; Previous in series" if kind == "previous" else "Next in series &rarr;"
    href = slug_to_href(slug, from_subdir)
    return (
        f'                        <a href="{href}" class="article-card-link">\n'
        '                            <div class="article-card">\n'
        '                                <div class="article-card-tags">\n'
        f'                                    <span class="tag tag-sm tag-audience" title="{audience_tip}">{audience}</span>\n'
        f'                                    {inactive_tags}\n'
        '                                </div>\n'
        f'                                <div class="sidebar-card-position">{arrow_label}</div>\n'
        f'                                <h3>{html.escape(title)}</h3>\n'
        f'                                <div class="date">{meta_line}</div>\n'
        '                            </div>\n'
        '                        </a>'
    )


def render_sidebar(active_slug: str, from_subdir: str = "") -> str:
    """Render the sidebar as 3-5 cards: previous in series, current, next in series, plus an
    'All essays' link back to the blog index. Reading order comes from READING_ORDER (not
    from SIDEBAR_POSTS, which is publication-descending). When the active essay is first or
    last in READING_ORDER, the corresponding boundary card is omitted.

    from_subdir: subdir the rendered HTML lives in (e.g., 'b5' for blog/b5/X.html).
    Propagated to _render_card so cross-subdir prev/next links resolve correctly.
    """
    out: list[str] = []
    try:
        idx = READING_ORDER.index(active_slug)
    except ValueError:
        # Slug not in reading order — fall back to active-only (shouldn't happen in practice).
        active_post = _post_by_slug(active_slug)
        if active_post is None:
            return ""
        return _render_card(active_post, "active", from_subdir)

    prev_slug = READING_ORDER[idx - 1] if idx > 0 else None
    next_slug = READING_ORDER[idx + 1] if idx < len(READING_ORDER) - 1 else None

    if prev_slug:
        prev_post = _post_by_slug(prev_slug)
        if prev_post is not None:
            out.append(_render_card(prev_post, "previous", from_subdir))

    active_post = _post_by_slug(active_slug)
    if active_post is not None:
        out.append(_render_card(active_post, "active", from_subdir))

    if next_slug:
        next_post = _post_by_slug(next_slug)
        if next_post is not None:
            out.append(_render_card(next_post, "next", from_subdir))

    # "All essays" link back to the blog index — always present.
    # Uses absolute /blog.html so it works from any depth.
    out.append(
        '                        <a href="/blog.html" class="article-card-link sidebar-all-essays-link">\n'
        '                            <div class="article-card sidebar-all-essays">\n'
        '                                <h3>All essays &rarr;</h3>\n'
        '                                <div class="date">Browse the full series</div>\n'
        '                            </div>\n'
        '                        </a>'
    )

    return "\n".join(out)


def build_html(meta: dict, body_html: str, sidebar_html: str, version_stamp: str = "20260518", subdir: str = "") -> str:
    """Build full HTML page. subdir is the subdir under blog/ (e.g., 'b5' for blog/b5/X.html);
    empty string means output goes directly to blog/X.html. Computes depth_prefix for
    site-root nav/css/js links, builds canonical URL with subdir segment, and passes
    subdir to render_sidebar so cross-subdir prev/next links resolve."""
    title = meta["title"]
    slug = meta["slug"]
    full_slug = slug if slug.endswith(".html") else slug
    # The .md uses "slug" without the NN- prefix; map it back to the filename prefix.
    filename_slug_match = next((s for s, *_ in SIDEBAR_POSTS if s.endswith(slug)), None)
    if not filename_slug_match:
        raise SystemExit(f"ERROR: slug '{slug}' not found in SIDEBAR_POSTS — add it before running.")
    filename_slug = filename_slug_match
    # Depth-aware prefix for site-root links (css/js/index/blog/etc.).
    # blog/X.html → '../' ; blog/b5/X.html → '../../'
    depth_prefix = "../" * (1 + (subdir.count("/") + 1 if subdir else 0))
    date = meta.get("date", "May 2026")
    read_time = meta.get("read_time", "TBD")
    rt_display = read_time if read_time != "TBD" else "TBD min read"
    tags_raw = meta.get("tags", [])
    if isinstance(tags_raw, str):
        tags_raw = [t.strip() for t in tags_raw.split(",")]
    audience = meta.get("audience", "Power Users &amp; Architects")
    audience_tip = AUDIENCE_TITLE.get(audience, "")
    og_image = meta.get("og_image", "assets/images/blog/seed-agent-default.png")
    if not og_image.startswith("http"):
        og_image_url = f"https://hadi-nayebi.github.io/{og_image}"
    else:
        og_image_url = og_image
    # Canonical URL includes subdir segment when essay lives there.
    canonical_path = f"blog/{subdir}/{filename_slug}.html" if subdir else f"blog/{filename_slug}.html"
    canonical = f"https://hadi-nayebi.github.io/{canonical_path}"
    # Description: try frontmatter `description`, fall back to a one-liner.
    description = meta.get("description", title + " — Hadosh Academy seed agent essay.")

    # Tag HTML for article meta and JSON-LD.
    tag_meta_html = "\n                            ".join(
        f'<span class="tag">{html.escape(t)}</span>' for t in tags_raw
    )
    # Audio convention: use the FRONTMATTER slug (no NN- prefix) so B7+B8 match
    # the B5/B6 pattern (e.g. "the-plugin-kit.mp3" not "07-the-plugin-kit.mp3").
    # When the operator generates the audio later, the file path matches the ref.
    audio_filename = meta["slug"] + ".mp3"
    # Audio convention: per-subdir audio/ directory when in a series subdir; root
    # ../assets/audio/ when at blog/ root. Allows full series compartmentalization.
    if subdir:
        audio_src = f"audio/{audio_filename}"
        audio_check_relpath = ("..", "blog", subdir, "audio", audio_filename)
    else:
        audio_src = f"../assets/audio/{audio_filename}"
        audio_check_relpath = ("..", "assets", "audio", audio_filename)
    # Hide the audio block when the mp3 doesn't exist yet (broken audio player UX
    # otherwise — clicking play surfaces a 404). User gates TTS spend per Rule 12;
    # until the mp3 lands, render an "audio pending" badge instead of a broken player.
    import os
    audio_path_check = os.path.join(os.path.dirname(__file__), *audio_check_relpath)
    audio_exists = os.path.exists(audio_path_check)
    if audio_exists:
        audio_block = (
            '<div class="article-audio">\n'
            '                        <audio controls preload="none">\n'
            f'                            <source src="{audio_src}" type="audio/mpeg">\n'
            '                            Your browser does not support the audio element.\n'
            '                        </audio>\n'
            f'                        <span class="audio-label">Listen to this article ({html.escape(rt_display)})</span>\n'
            '                    </div>'
        )
    else:
        audio_block = (
            '<div class="article-audio" style="opacity: 0.55;">\n'
            f'                        <span class="audio-label" style="font-style: italic;">Audio narration pending — written-only essay ({html.escape(rt_display)} read).</span>\n'
            '                    </div>'
        )

    result = f"""<!DOCTYPE html>
<!-- Version: v0.1.0 -->
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title)} | Hadosh Academy</title>
    <meta name="description" content="{html.escape(description)}">
    <meta name="author" content="Hadi Nayebi">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
    <link rel="canonical" href="{canonical}">
    <meta property="og:title" content="{html.escape(title)} | Hadosh Academy">
    <meta property="og:description" content="{html.escape(description)}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="{og_image_url}">
    <meta property="og:site_name" content="Hadosh Academy">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{html.escape(title)} | Hadosh Academy">
    <meta name="twitter:description" content="{html.escape(description)}">
    <meta name="twitter:image" content="{og_image_url}">
    <link rel="alternate" type="application/rss+xml" title="Hadosh Academy Blog" href="/feed.xml">
    <link rel="stylesheet" href="../css/styles.css?v={version_stamp}">
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@graph": [
            {{
                "@type": "BlogPosting",
                "headline": "{html.escape(title)}",
                "datePublished": "2026-05-13",
                "dateModified": "2026-05-13",
                "author": {{
                    "@type": "Person",
                    "name": "Hadi Nayebi",
                    "url": "https://hadi-nayebi.github.io/about.html"
                }},
                "publisher": {{ "@id": "https://hadi-nayebi.github.io/#organization" }},
                "description": "{html.escape(description)}",
                "image": "{og_image_url}",
                "mainEntityOfPage": "{canonical}"
            }},
            {{
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hadi-nayebi.github.io/" }},
                    {{ "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://hadi-nayebi.github.io/blog.html" }},
                    {{ "@type": "ListItem", "position": 3, "name": "{html.escape(title)}", "item": "{canonical}" }}
                ]
            }}
        ]
    }}
    </script>
</head>

<body>
    <header id="site-header">
        <div class="container">
            <nav>
                <a href="../index.html" class="logo">Hadosh Academy</a>
                <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                    <span class="nav-toggle-bar"></span>
                    <span class="nav-toggle-bar"></span>
                    <span class="nav-toggle-bar"></span>
                </button>
                <div class="nav-links">
                    <a href="../index.html">Home</a>
                    <a href="../start-here.html">Start Here</a>
                    <a href="../blog.html" class="active" aria-current="page">Blog</a>
                    <a href="../agents.html">Agents</a>
                    <a href="../about.html">About</a>
                    <a href="../contact.html">Contact</a>
                </div>
            </nav>
        </div>
    </header>

    <main class="page-content">
        <section class="container">
            <div class="blog-layout">
                <!-- Main Article -->
                <div class="article-content">
                    <a href="../blog.html" class="blog-back-link">&larr; Back to Blog</a>

                    <h1>{html.escape(title)}</h1>
                    <div class="article-meta">
                        <span>{html.escape(date)}</span>
                        <span>&bull;</span>
                        <span>{html.escape(rt_display)}</span>
                        <div class="article-meta-tags">
                            <span class="tag tag-audience" title="{audience_tip}">{audience}</span>
                            {tag_meta_html}
                        </div>
                    </div>
                    <div class="article-authors">
                        By Hadi Nayebi &amp; Claude Opus 4.7
                    </div>

                    {audio_block}

                    <div class="article-body">

                        {body_html}

                    </div>

                    <!-- Comments (Giscus) -->
                    <div class="article-comments">
                        <h2>Comments</h2>
                        <script src="https://giscus.app/client.js"
                            data-repo="hadi-nayebi/hadi-nayebi.github.io"
                            data-repo-id="R_kgDOHL_tnQ"
                            data-category="General"
                            data-category-id="DIC_kwDOHL_tnc4C3cRQ"
                            data-mapping="pathname"
                            data-strict="0"
                            data-reactions-enabled="1"
                            data-emit-metadata="0"
                            data-input-position="top"
                            data-theme="dark"
                            data-lang="en"
                            data-loading="lazy"
                            crossorigin="anonymous"
                            async>
                        </script>
                    </div>

                </div>

                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-title">Latest Articles</div>
                    <div>
{sidebar_html}
                    </div>
                </aside>
            </div>
        </section>
    </main>

    <footer id="site-footer">
        <div class="container">
            <p>&copy; <span id="copyright-year">2026</span> Hadosh Academy. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/theme-manager.js?v={version_stamp}"></script>
    <script src="../js/components.js?v={version_stamp}"></script>
</body>

</html>
"""
    # When essay lives in a subdir (e.g., blog/b5/X.html), rewrite the default
    # ../ template paths to the deeper depth_prefix. Use EXPLICIT path matches
    # to avoid touching sidebar prev/next card hrefs that legitimately use ../
    # (e.g., sidebar prev card href="../04-the-language-of-agents.html" from
    # blog/b5/ to blog/ root — that ../ is correct and must not be deepened).
    if subdir:
        for path in ("index.html", "start-here.html", "blog.html", "agents.html", "about.html", "contact.html"):
            result = result.replace(f'href="../{path}"', f'href="{depth_prefix}{path}"')
        result = result.replace('href="../css/', f'href="{depth_prefix}css/')
        result = result.replace('src="../js/', f'src="{depth_prefix}js/')
        # Inline body images that point at ../assets/ from blog/ root must
        # deepen for subdir essays — without this, an inline ![alt](../assets/X.png)
        # in blog/b6/06_1.md emits <img src="../assets/X.png"> which resolves to
        # blog/assets/X.png (404). Discovered 2026-05-19 via B6.1 broken render.
        result = result.replace('src="../assets/', f'src="{depth_prefix}assets/')
        # Note: audio src is already correctly built into audio_src var above
        # and does NOT use ../ form when subdir is set (see audio block).
    return result


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input_md", type=Path)
    ap.add_argument("output_html", type=Path)
    ap.add_argument("--version", default="20260518", help="cache-bust query stamp (default 20260518)")
    args = ap.parse_args(argv)

    md_text = args.input_md.read_text()
    meta, body = parse_frontmatter(md_text)
    import os as _os
    input_md_dir = str(args.input_md.parent)
    body_html = render_body(body, input_md_dir=input_md_dir)

    # Determine active slug for sidebar. SIDEBAR_POSTS keys are filename slugs (NN-name).
    # The .md frontmatter slug omits the prefix, so we match by suffix.
    fm_slug = meta["slug"]
    active = next((s for s, *_ in SIDEBAR_POSTS if s.endswith(fm_slug)), None)
    if not active:
        raise SystemExit(f"ERROR: frontmatter slug '{fm_slug}' not found in SIDEBAR_POSTS list.")

    # Autodetect subdir from output path. Expected layouts:
    #   blog/X.html       → subdir = ""    (depth 1: ../)
    #   blog/b5/X.html    → subdir = "b5"  (depth 2: ../../)
    # Any deeper layout falls back to empty (operator can pass --subdir
    # explicitly if a non-standard path is needed).
    output_parts = args.output_html.parts
    if len(output_parts) >= 3 and output_parts[-3] == "blog":
        detected_subdir = output_parts[-2]
    else:
        detected_subdir = ""
    if detected_subdir:
        print(f"  [subdir-mode] output at blog/{detected_subdir}/ — using depth-aware paths")

    sidebar_html = render_sidebar(active, from_subdir=detected_subdir)
    full_html = build_html(meta, body_html, sidebar_html, version_stamp=args.version, subdir=detected_subdir)
    args.output_html.write_text(full_html)
    print(f"Wrote {args.output_html}: {len(full_html):,} chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
