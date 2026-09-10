#!/usr/bin/env python3
"""Render Hadosh Academy's canonical Markdown article bodies.

This module is intentionally self-contained and standard-library only. It
supports the repository's bounded Markdown conventions: flat frontmatter,
reference markers, image placeholders, raw-HTML blocks, code, headings, lists,
blockquotes, inline images, links, and emphasis. Page shells are owned by the
existing HTML files and are never generated here.
"""

import html
import re

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Split YAML frontmatter from body. Returns (meta_dict, body_string).

    Parses a minimal subset of YAML: bare key: value pairs, double-quoted
    strings, and inline list syntax [a, b, c]. Does not handle nested YAML,
    multi-line values, or anchors — the blog frontmatter is intentionally flat.
    """
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
        # Strip surrounding double-quotes (YAML bare string vs quoted string).
        if v.startswith('"') and v.endswith('"'):
            v = v[1:-1]
        # Parse inline list syntax [a, b, c] into a Python list.
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip() for x in v[1:-1].split(",") if x.strip()]
        meta[k.strip()] = v
    return meta, body


# ---------------------------------------------------------------------------
# SENTINEL SYSTEM
# ---------------------------------------------------------------------------
# Sentinels used while transforming so we don't double-process content.
#
# WHY SENTINELS: inline_format() applies bold/italic/link regexes to prose text.
# If a ref-tag quote contains asterisks, or a code span contains backticks, the
# formatter would corrupt them. The sentinel pipeline extracts these regions
# before any formatting and restores the rendered HTML at the very end.
#
# Null-byte prefix (\x00) ensures sentinels cannot appear in any valid .md source
# (null bytes are illegal in UTF-8 text files). The suffix \x00 lets the restore
# regex distinguish "REF0" from "REF10" unambiguously using \d+ lazy matching.
_REF_SENTINEL_PREFIX = "\x00REF\x00"
_IMG_SENTINEL_PREFIX = "\x00IMG\x00"
_CODE_SENTINEL_PREFIX = "\x00CODE\x00"
_FENCED_SENTINEL_PREFIX = "\x00FENCED\x00"
_RAWHTML_SENTINEL_PREFIX = "\x00RAWHTML\x00"


# ---------------------------------------------------------------------------
# EXTRACTION FUNCTIONS
# Each extract_* function removes a content region from the text and replaces
# it with a sentinel, returning (modified_text, rendered_list). restore_sentinels()
# swaps all sentinels back at the end of render_body().
# ---------------------------------------------------------------------------

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
            caption_html = format_inline_richtext(caption) if caption else ""
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
        caption_html = format_inline_richtext(caption)

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


def extract_raw_html_blocks(text: str) -> tuple[str, list[str]]:
    """Pull `<!-- RAW_HTML ... -->` comment blocks out and pass their contents through
    VERBATIM — no markdown transforms, no entity escaping, no <p> wrapping.

    The generator normally has no raw-HTML passthrough: a literal HTML snippet typed
    into the .md body falls into the default paragraph branch, gets wrapped in <p>, and
    inline_format() mangles it (asterisks become emphasis, [text](url) becomes a link,
    etc.). This block lets the .md author drop hand-written HTML — e.g. a glassy call-to-
    action button under a figure — and have it survive regeneration unchanged.

    Shape (the inner HTML is whatever sits between the markers):

        <!-- RAW_HTML -->
        <div class="explore-cta"><a href="explore/x.html" class="btn ...">Explore</a></div>
        <!-- /RAW_HTML -->

    Mirrors the IMAGE PLACEHOLDER comment convention so the raw block is invisible to
    GitHub's .md source view (it's an HTML comment) yet renders as real HTML in output.
    """
    blocks: list[str] = []
    pattern = re.compile(
        r"<!--\s*RAW_HTML\s*-->\s*(.*?)\s*<!--\s*/RAW_HTML\s*-->",
        re.DOTALL,
    )

    def repl(m: re.Match) -> str:
        blocks.append(m.group(1).strip())
        return f"{_RAWHTML_SENTINEL_PREFIX}{len(blocks)-1}\x00"

    return pattern.sub(repl, text), blocks


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


# ---------------------------------------------------------------------------
# INLINE FORMATTER
# ---------------------------------------------------------------------------

def inline_format(text: str) -> str:
    """Apply inline markdown transforms to a chunk of text that does NOT contain
    refs, code, or image placeholders (those are sentinel-protected upstream).

    Transform order matters:
      1. Bold (**) before italic (*) — avoids the single-star regex greedily
         consuming one leg of a double-star pair.
      2. Links before angle-bracket escapes — [text](url) must match the raw
         string before any entity substitution would alter its characters.
      3. Em-dash and curly-quote substitutions last — purely typographic,
         safe to run after structural markup is in place.
    """
    # Bold first (matches **...** before single * italics).
    text = re.sub(r"\*\*([^*]+?)\*\*", r"<strong>\1</strong>", text)
    # Italic: avoid mid-word underscores; require surrounding non-asterisks.
    text = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<em>\1</em>", text)
    # Links [text](url) or [text](url "title") — write before generic angle-bracket
    # escapes. The URL may itself contain balanced parentheses (e.g. a Wikipedia
    # disambiguation link, /CLI_(computing)); the `(?:\(...\)...)*` arm consumes one
    # level of balanced parens so the closing markdown ')' is not matched early. An
    # optional markdown title in double-quotes becomes an HTML title= attribute.
    #
    # The built href is stashed in a null-byte sentinel and restored verbatim at the
    # end of this function, so the typographic substitutions below (em-dash, curly
    # quote) cannot corrupt URL characters — an em-dash or apostrophe IN the URL path
    # would otherwise be turned into &mdash;/&rsquo; and break the link. Link TEXT and
    # the title attribute stay in the stream (display text — entity substitution there
    # is correct and matches the rest of the prose).
    _hrefs: list[str] = []

    def _build_link(m: "re.Match") -> str:
        label, url, title = m.group(1), m.group(2), m.group(3)
        _hrefs.append(url)
        href = f"\x00HREF\x00{len(_hrefs) - 1}\x00"
        if title:
            return f'<a href="{href}" title="{html.escape(title)}">{label}</a>'
        return f'<a href="{href}">{label}</a>'

    text = re.sub(
        r'\[([^\]]+?)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)(?:\s+"([^"]*)")?\)',
        _build_link,
        text,
    )
    # Typographic substitutions — em-dash + curly quotes. Safe now: hrefs are sentinels.
    text = text.replace(" -- ", " &mdash; ")
    # The unicode em-dash present in the .md → HTML entity for consistency with prior posts.
    text = text.replace("—", "&mdash;")
    # Curly quotes: rough heuristic on apostrophes that follow a letter.
    text = re.sub(r"([A-Za-z])'([A-Za-z])", r"\1&rsquo;\2", text)
    text = re.sub(r"([A-Za-z])'\b", r"\1&rsquo;", text)
    # Restore protected hrefs verbatim (after all typographic passes).
    for _i, _u in enumerate(_hrefs):
        text = text.replace(f"\x00HREF\x00{_i}\x00", _u)
    return text


def heading_slug(text: str) -> str:
    """GitHub-style anchor slug from a heading's raw markdown text: strip inline
    HTML/markdown, lowercase, drop punctuation, collapse whitespace to single hyphens.
    Emitting these as <h2>/<h3> ids lets in-essay and cross-essay `#fragment` links
    resolve (e.g. '## The Digital Cortex' -> id='the-digital-cortex'). Without ids,
    every such anchor link is dead.
    """
    s = re.sub(r"<[^>]+>", "", text)                 # strip any inline HTML
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)    # markdown link -> its visible text
    s = re.sub(r"[*`_]", "", s)                       # strip emphasis/code marks
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)                # drop remaining punctuation
    s = re.sub(r"\s+", "-", s.strip())
    return s


def _unique_heading_id(text: str, seen: set) -> str:
    """heading_slug() plus per-document de-duplication (GitHub appends -1, -2, ...)."""
    base = heading_slug(text)
    slug = base
    n = 1
    while slug in seen:
        slug = f"{base}-{n}"
        n += 1
    seen.add(slug)
    return slug


def format_inline_richtext(text: str) -> str:
    """Render a short standalone inline string (an image caption) the way body prose is
    rendered. Body paragraphs convert `code` spans via the sentinel pipeline BEFORE
    inline_format runs; a caption only ever went through inline_format, which does not
    handle backticks — so a `code` span in a caption leaked into the figcaption verbatim.
    Here we protect code spans (escaped, like the body), run inline_format, then restore
    them as <code>. For a caption with no backticks this is identical to inline_format.
    """
    text, code_spans = extract_inline_code(text)
    text = inline_format(text)
    for i, c in enumerate(code_spans):
        text = text.replace(f"{_CODE_SENTINEL_PREFIX}{i}\x00", f"<code>{c}</code>")
    return text


# ---------------------------------------------------------------------------
# SENTINEL RESTORE
# ---------------------------------------------------------------------------

def restore_sentinels(
    text: str,
    refs: list[str],
    images: list[str],
    code_spans: list[str],
    fenced: list[str],
    raw_html: list[str] | None = None,
) -> str:
    """Replace each sentinel with its rendered HTML, then return.

    Restore order mirrors the reverse of extraction: raw HTML first so its
    verbatim content is never re-processed, then refs, images, fenced blocks,
    and finally inline code spans. Code spans are last because their rendered
    <code> tags should not trigger any further regex matching.
    """
    raw_html = raw_html or []
    def restore_ref(m: re.Match) -> str:
        return refs[int(m.group(1))]
    def restore_img(m: re.Match) -> str:
        return images[int(m.group(1))]
    def restore_raw_html(m: re.Match) -> str:
        # Verbatim passthrough — the author's HTML, untouched.
        return raw_html[int(m.group(1))]
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
    text = re.sub(_RAWHTML_SENTINEL_PREFIX + r"(\d+)\x00", restore_raw_html, text)
    text = re.sub(_FENCED_SENTINEL_PREFIX + r"(\d+)\x00", restore_fenced, text)
    text = re.sub(_CODE_SENTINEL_PREFIX + r"(\d+)\x00", restore_code, text)
    return text


# ---------------------------------------------------------------------------
# BODY RENDERER
# ---------------------------------------------------------------------------

def render_body(body: str, input_md_dir: str = "") -> str:
    """Convert blog markdown body to HTML article-body innerHTML.

    Pipeline:
      1. Extract image placeholders, raw-HTML blocks, refs, fenced code, inline code
         (each replaced with a sentinel so later transforms cannot corrupt them).
      2. Split the sentinel-riddled text into blank-line-delimited blocks.
      3. Classify each block and emit the appropriate HTML element.
      4. Restore sentinels to produce the final HTML string.

    Block classification order matters: sentinel blocks must be checked before
    structural blocks (headings, lists) to avoid misclassifying a sentinel that
    happens to start a line as, for example, a heading marker.
    """
    # Private editorial anchors belong to the canonical Markdown and claim map,
    # never to the public projection. Removing only this bounded marker form also
    # keeps a marker before a heading from changing the block's classification.
    body = re.sub(r"<!--\s*block:\s*[a-z0-9][a-z0-9-]{1,79}\s*-->\s*", "", body)

    # 1. Pull out image placeholders (HTML comment blocks).
    body, images = extract_image_placeholders(body, input_md_dir=input_md_dir)
    # 1b. Pull out raw-HTML passthrough blocks (<!-- RAW_HTML --> ... <!-- /RAW_HTML -->)
    #     BEFORE refs/code/inline so the author's HTML is never transformed or escaped.
    body, raw_html = extract_raw_html_blocks(body)
    # 2. Pull out refs.
    body, refs = extract_refs(body)
    # 3. Pull out fenced code blocks (```...```) BEFORE inline-code extraction.
    body, fenced = extract_fenced_code_blocks(body)
    # 4. Pull out inline code spans.
    body, code_spans = extract_inline_code(body)

    # Now process by blocks (blank-line-delimited paragraphs / elements).
    blocks = re.split(r"\n\s*\n", body)
    output: list[str] = []
    seen_heading_ids: set = set()  # per-document anchor-id de-duplication

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
        # Raw-HTML sentinel block — pass through verbatim (restore_sentinels swaps
        # in the author's untouched HTML, no <p> wrapping, no inline_format).
        if block.startswith(_RAWHTML_SENTINEL_PREFIX):
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
            _htext = block[3:].strip()
            _hid = _unique_heading_id(_htext, seen_heading_ids)
            output.append(f'<h2 id="{_hid}">{inline_format(_htext)}</h2>')
            continue
        if block.startswith("### "):
            _htext = block[4:].strip()
            _hid = _unique_heading_id(_htext, seen_heading_ids)
            output.append(f'<h3 id="{_hid}">{inline_format(_htext)}</h3>')
            continue
        # Unordered list — block where EVERY non-blank line starts with "- " or "* ".
        # Require at least one actual bullet so a standalone ref-sentinel block
        # (the post-list trailing ref-tag paragraph pattern) does not get classified
        # as a single-item list.
        non_blank_lines = [ln for ln in block.splitlines() if ln.strip()]
        if non_blank_lines and all(re.match(r"^\s*[-*]\s+", ln) for ln in non_blank_lines):
            # re.split on the bullet marker produces an empty first element ("" before
            # the first bullet) — the `if item.strip()` guard filters it out.
            items = re.split(r"\n\s*[-*]\s+", "\n" + block.strip())
            li_html = "".join(
                f"\n                            <li>{inline_format(item.strip())}</li>"
                for item in items if item.strip()
            )
            output.append(f"<ul>{li_html}\n                        </ul>")
            continue
        # Blockquote — lines prefixed with "> "
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
                format_inline_richtext(m.group(3).strip()) if img_caption_match else alt
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
    rendered = restore_sentinels(rendered, refs, images, code_spans, fenced, raw_html)
    return rendered
