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
    ("08-from-apprentice-to-architect",  "From Apprentice to Architect",          "May 2026",      "27 min read",  "Power Users &amp; Architects", ["Architecture", "Seed Agent", "Maturation"]),
    ("07-the-plugin-kit",                "The Plugin Kit",                        "May 2026",      "32 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("06-the-markov-phasic-brain",       "The Markov Phasic Brain",               "May 2026",      "40 min read",  "Power Users &amp; Architects", ["Architecture", "OPEVC", "Seed Agent"]),
    ("05_1-the-two-layer-foundation",    "The Always-On Digital Cortex — Pt 1: The Two-Layer Foundation",    "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_2-plugin-integrity",            "The Always-On Digital Cortex — Pt 2: Plugin Edit Safety",           "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_3-brain-guard",                 "The Always-On Digital Cortex — Pt 3: Context Window Discipline",    "May 2026", "8 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_4-job-core",                    "The Always-On Digital Cortex — Pt 4: Job Lifecycle",                "May 2026", "6 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_5-interaction-summary",         "The Always-On Digital Cortex — Pt 5: Cross-Session Memory",         "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_6-question-discipline",         "The Always-On Digital Cortex — Pt 6: Structured Questions",         "May 2026", "5 min read",  "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_7-claude-md-hierarchy",         "The Always-On Digital Cortex — Pt 7: The CLAUDE.md Hierarchy",      "May 2026", "12 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
    ("05_8-historian-ratchet",           "The Always-On Digital Cortex — Pt 8: The Historian Ratchet",        "May 2026", "10 min read", "Power Users &amp; Architects", ["Architecture", "Plugins", "Seed Agent"]),
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


def extract_image_placeholders(text: str) -> tuple[str, list[str]]:
    """Pull <!-- IMAGE PLACEHOLDER: ... --> blocks out and render as <aside>."""
    images: list[str] = []
    pattern = re.compile(r"<!--\s*IMAGE PLACEHOLDER:(.*?)-->", re.DOTALL)

    def repl(m: re.Match) -> str:
        block = m.group(1).strip()
        # Extract Concept (for the header), Caption (for the bottom), Prompt (everything else).
        concept_match = re.search(r"^\s*Concept:\s*(.+?)$", block, re.MULTILINE)
        caption_match = re.search(r'Caption\s*\([^)]*\):\s*"([^"]+)"', block)
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

        aside = (
            '<aside class="image-placeholder" style="border: 2px dashed rgba(99, 102, 241, 0.4); '
            'padding: 1.25rem 1.5rem; margin: 2rem 0; border-radius: 8px; background: rgba(99, 102, 241, 0.06);">\n'
            '                          <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: rgba(139, 92, 246, 0.95); '
            'font-size: 0.85em; letter-spacing: 0.05em; text-transform: uppercase;">'
            f'[Image placeholder &mdash; {title_html}]</p>\n'
            '                          <p style="margin: 0 0 0.5rem 0; font-size: 0.9em; line-height: 1.5; color: rgba(255, 255, 255, 0.75);">'
            f'<em>Prompt:</em> {prompt_html}</p>\n'
            '                          <p style="margin: 0; font-size: 0.9em; line-height: 1.5; color: rgba(255, 255, 255, 0.75);">'
            f'<em>Caption:</em> {caption_html}</p>\n'
            '                        </aside>'
        )
        images.append(aside)
        return f"{_IMG_SENTINEL_PREFIX}{len(images)-1}\x00"
    return pattern.sub(repl, text), images


def extract_inline_code(text: str) -> tuple[str, list[str]]:
    """Pull `code` spans out before any other inline transformation runs against them."""
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


def restore_sentinels(text: str, refs: list[str], images: list[str], code_spans: list[str]) -> str:
    """Replace each sentinel with its rendered HTML, then return."""
    def restore_ref(m: re.Match) -> str:
        return refs[int(m.group(1))]
    def restore_img(m: re.Match) -> str:
        return images[int(m.group(1))]
    def restore_code(m: re.Match) -> str:
        return f"<code>{code_spans[int(m.group(1))]}</code>"
    text = re.sub(_REF_SENTINEL_PREFIX + r"(\d+)\x00", restore_ref, text)
    text = re.sub(_IMG_SENTINEL_PREFIX + r"(\d+)\x00", restore_img, text)
    text = re.sub(_CODE_SENTINEL_PREFIX + r"(\d+)\x00", restore_code, text)
    return text


def render_body(body: str) -> str:
    """Convert blog markdown body to HTML article-body innerHTML."""
    # 1. Pull out image placeholders (HTML comment blocks).
    body, images = extract_image_placeholders(body)
    # 2. Pull out refs.
    body, refs = extract_refs(body)
    # 3. Pull out inline code spans.
    body, code_spans = extract_inline_code(body)

    # Now process by blocks.
    blocks = re.split(r"\n\s*\n", body)
    output: list[str] = []

    for block in blocks:
        if not block.strip():
            continue
        # Image-placeholder sentinel block — pass through verbatim.
        if block.strip().startswith(_IMG_SENTINEL_PREFIX):
            output.append(block.strip())
            continue
        # HR
        if re.fullmatch(r"-{3,}", block.strip()):
            output.append("<hr>")
            continue
        # Headings
        if block.startswith("# "):
            output.append(f"<h1>{inline_format(block[2:].strip())}</h1>")
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
        # Default: paragraph. Collapse internal newlines into single space.
        para_text = " ".join(ln.strip() for ln in block.splitlines())
        output.append(f"<p>{inline_format(para_text)}</p>")

    rendered = "\n\n                        ".join(output)
    rendered = restore_sentinels(rendered, refs, images, code_spans)
    return rendered


def render_sidebar(active_slug: str) -> str:
    """Render the sidebar — list every existing blog post, marking the active one."""
    out: list[str] = []
    for slug, title, date, read_time, audience, tags in SIDEBAR_POSTS:
        date_html = html.escape(date) if "&" not in date else date
        rt_html = html.escape(read_time) if "&" not in read_time else read_time
        meta_line = f"{date_html} &bull; {rt_html}" if read_time != "TBD" else date_html
        audience_tip = AUDIENCE_TITLE.get(audience, "")
        # Build tag HTML with per-card-type indent so non-active cards line up
        # under their `<div class="article-card-tags">` (4 extra spaces of nesting
        # because they sit inside an `<a class="article-card-link">` wrapper).
        active_indent = " " * 32
        inactive_indent = " " * 36
        active_tags = ("\n" + active_indent).join(
            f'<span class="tag tag-sm">{html.escape(t)}</span>' for t in tags
        )
        inactive_tags = ("\n" + inactive_indent).join(
            f'<span class="tag tag-sm">{html.escape(t)}</span>' for t in tags
        )
        if slug == active_slug:
            out.append(
                '                        <div class="article-card active">\n'
                '                            <div class="article-card-tags">\n'
                f'                                <span class="tag tag-sm tag-audience" title="{audience_tip}">{audience}</span>\n'
                f'                                {active_tags}\n'
                '                            </div>\n'
                f'                            <h3>{html.escape(title)}</h3>\n'
                f'                            <div class="date">{meta_line}</div>\n'
                '                        </div>'
            )
        else:
            out.append(
                f'                        <a href="{slug}.html" class="article-card-link">\n'
                '                            <div class="article-card">\n'
                '                                <div class="article-card-tags">\n'
                f'                                    <span class="tag tag-sm tag-audience" title="{audience_tip}">{audience}</span>\n'
                f'                                    {inactive_tags}\n'
                '                                </div>\n'
                f'                                <h3>{html.escape(title)}</h3>\n'
                f'                                <div class="date">{meta_line}</div>\n'
                '                            </div>\n'
                '                        </a>'
            )
    return "\n".join(out)


def build_html(meta: dict, body_html: str, sidebar_html: str, version_stamp: str = "20260513") -> str:
    title = meta["title"]
    slug = meta["slug"]
    full_slug = slug if slug.endswith(".html") else slug
    # The .md uses "slug" without the NN- prefix; map it back to the filename prefix.
    filename_slug_match = next((s for s, *_ in SIDEBAR_POSTS if s.endswith(slug)), None)
    if not filename_slug_match:
        raise SystemExit(f"ERROR: slug '{slug}' not found in SIDEBAR_POSTS — add it before running.")
    filename_slug = filename_slug_match
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
    canonical = f"https://hadi-nayebi.github.io/blog/{filename_slug}.html"
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
    audio_src = f"../assets/audio/{audio_filename}"

    return f"""<!DOCTYPE html>
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

                    <div class="article-audio">
                        <audio controls preload="none">
                            <source src="{audio_src}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        <span class="audio-label">Listen to this article ({html.escape(rt_display)})</span>
                    </div>

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


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input_md", type=Path)
    ap.add_argument("output_html", type=Path)
    ap.add_argument("--version", default="20260513", help="cache-bust query stamp (default 20260513)")
    args = ap.parse_args(argv)

    md_text = args.input_md.read_text()
    meta, body = parse_frontmatter(md_text)
    body_html = render_body(body)

    # Determine active slug for sidebar. SIDEBAR_POSTS keys are filename slugs (NN-name).
    # The .md frontmatter slug omits the prefix, so we match by suffix.
    fm_slug = meta["slug"]
    active = next((s for s, *_ in SIDEBAR_POSTS if s.endswith(fm_slug)), None)
    if not active:
        raise SystemExit(f"ERROR: frontmatter slug '{fm_slug}' not found in SIDEBAR_POSTS list.")

    sidebar_html = render_sidebar(active)
    full_html = build_html(meta, body_html, sidebar_html, version_stamp=args.version)
    args.output_html.write_text(full_html)
    print(f"Wrote {args.output_html}: {len(full_html):,} chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
