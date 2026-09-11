#!/usr/bin/env python3
"""Synchronize one numbered essay's article body without rebuilding its page shell.

The old full-page generator predates the current navigation, metadata, visual
inventory, contribution guidance, and path layout. This wrapper uses the
repository-owned Markdown body renderer, preserves page-only figure attributes,
and replaces the bounded `<div class="article-body">` region.
"""

from __future__ import annotations

import argparse
import re
import sys

from render_blog_markdown import parse_frontmatter, render_body
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
def figures_by_source(body: str) -> dict[str, str]:
    figures: dict[str, str] = {}
    for match in re.finditer(r"<figure\b[\s\S]*?</figure>", body):
        figure = match.group(0)
        image = re.search(r'<img\b[^>]*\bsrc="([^"]+)"', figure)
        if not image:
            continue
        source = image.group(1)
        if source in figures:
            raise RuntimeError(f"duplicate figure image source in article body: {source}")
        figures[source] = figure
    return figures


def preserve_figure_shells(rendered: str, current: str) -> str:
    """Keep page-only figure attributes while accepting Markdown text updates."""
    preserved = figures_by_source(current)
    seen: set[str] = set()

    def replace(match: re.Match[str]) -> str:
        figure = match.group(0)
        image = re.search(r'<img\b[^>]*\bsrc="([^"]+)"', figure)
        if not image:
            return figure
        source = image.group(1)
        if source not in preserved:
            return figure
        seen.add(source)
        existing = preserved[source]

        rendered_image = re.search(r"<img\b[^>]*>", figure)
        rendered_alt = re.search(r'\balt="([^"]*)"', rendered_image.group(0)) if rendered_image else None
        if rendered_alt:
            existing, count = re.subn(
                r'(<img\b[^>]*\balt=")[^"]*(")',
                lambda current_match: current_match.group(1) + rendered_alt.group(1) + current_match.group(2),
                existing,
                count=1,
            )
            if count != 1:
                raise RuntimeError(f"existing figure has no alt attribute: {source}")

        rendered_caption = re.search(r"<figcaption\b[^>]*>([\s\S]*?)</figcaption>", figure)
        if rendered_caption:
            existing, count = re.subn(
                r"(<figcaption\b[^>]*>)[\s\S]*?(</figcaption>)",
                lambda current_match: current_match.group(1) + rendered_caption.group(1) + current_match.group(2),
                existing,
                count=1,
            )
            if count != 1:
                raise RuntimeError(f"existing figure has no caption: {source}")
        return existing

    result = re.sub(r"<figure\b[\s\S]*?</figure>", replace, rendered)
    missing = sorted(set(preserved) - seen)
    if missing:
        raise RuntimeError(f"rendered Markdown dropped existing figure(s): {', '.join(missing)}")
    return result


def bounded_body(html: str) -> tuple[str, str, str, str]:
    start_match = re.search(r'(?m)^([ \t]*)<div class="article-body">\n', html)
    if not start_match:
        raise RuntimeError("article-body start marker not found")
    shell_indent = start_match.group(1)
    content_start = start_match.end()
    end_match = re.search(
        rf'\n{re.escape(shell_indent)}</div>\n\n{re.escape(shell_indent)}(?:<!-- Comments \(Giscus\) -->|<div class="article-comments")',
        html[content_start:],
    )
    if not end_match:
        raise RuntimeError("article-body end marker not found")
    end = content_start + end_match.start()
    return html[:content_start], html[content_start:end], html[end:], shell_indent + "    "


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("markdown", type=Path)
    parser.add_argument("html", type=Path)
    parser.add_argument("--check", action="store_true", help="report drift without writing")
    args = parser.parse_args()

    markdown = args.markdown.resolve()
    html_file = args.html.resolve()
    if ROOT not in markdown.parents or ROOT not in html_file.parents:
        raise SystemExit("both files must be inside the website repository")
    if not re.fullmatch(r"b[1-9]", markdown.parent.name):
        raise SystemExit("this synchronizer is limited to numbered B1-B9 essays")
    if markdown.with_suffix(".html") != html_file:
        raise SystemExit("Markdown and HTML basenames must match")

    metadata, source_body = parse_frontmatter(markdown.read_text())
    new_body = render_body(source_body, input_md_dir=str(markdown.parent))

    current_html = html_file.read_text()
    before, current_body, after, content_indent = bounded_body(current_html)
    new_body = preserve_figure_shells(new_body, current_body)
    updated = before + content_indent + new_body + after
    version = metadata.get("version")
    if version:
        updated, count = re.subn(r"<!-- Version: v[^ ]+ -->", f"<!-- Version: {version} -->", updated, count=1)
        if count != 1:
            raise RuntimeError("page version marker not found")

    if updated == current_html:
        print(f"in sync: {html_file.relative_to(ROOT)}")
        return 0
    if args.check:
        print(f"out of sync: {html_file.relative_to(ROOT)}")
        return 1
    html_file.write_text(updated)
    print(f"updated: {html_file.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
