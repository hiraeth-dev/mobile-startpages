#!/usr/bin/env python3
"""
Sync Themes Script:
Reads theme definitions from Hiraeth (../hiraeth/static/style.css)
and synchronizes them directly into mobile-startpages (style.css, app.js, index.html).
"""

import os
import re

HIRAETH_CSS = os.path.abspath(os.path.join(os.path.dirname(__file__), "../hiraeth/static/style.css"))
MOBILE_DIR = os.path.dirname(os.path.abspath(__file__))
MOBILE_CSS = os.path.join(MOBILE_DIR, "style.css")
MOBILE_APP = os.path.join(MOBILE_DIR, "app.js")
MOBILE_HTML = os.path.join(MOBILE_DIR, "index.html")

CAT_PALETTES = {
    "kanagawa": {
        "cat-head": "#D9A78B",
        "cat-body": "#A67A61",
        "cat-tail": "#547875",
        "cat-ear": "#F2BEA0",
        "cat-paw": "#313C47",
        "cat-whiskers": "#D9D1BA",
        "cat-z": "#F2BEA0"
    },
    "miasma": {
        "cat-head": "#78824b",
        "cat-body": "#5f683b",
        "cat-tail": "#383838",
        "cat-ear": "#d7c483",
        "cat-paw": "#43492a",
        "cat-whiskers": "#c2c2b0",
        "cat-z": "#d7c483"
    },
    "solitude": {
        "cat-head": "#798186",
        "cat-body": "#5d6367",
        "cat-tail": "#232a2e",
        "cat-ear": "#a8adb0",
        "cat-paw": "#2f353b",
        "cat-whiskers": "#cacccc",
        "cat-z": "#de6145"
    },
    "gruvbox": {
        "cat-head": "#e78a4e",
        "cat-body": "#d88145",
        "cat-tail": "#45403d",
        "cat-ear": "#d8a657",
        "cat-paw": "#45403d",
        "cat-whiskers": "#d4be98",
        "cat-z": "#d8a657"
    }
}

def sync():
    if not os.path.exists(HIRAETH_CSS):
        print(f"Error: Hiraeth stylesheet not found at {HIRAETH_CSS}")
        return

    with open(HIRAETH_CSS, "r", encoding="utf-8") as f:
        hiraeth_content = f.read()

    # Extract all theme blocks
    theme_pattern = re.compile(r'\[data-theme="([^"]+)"\]\s*\{([^}]+)\}', re.MULTILINE)
    matches = theme_pattern.findall(hiraeth_content)

    themes = {}
    for name, body in matches:
        if name not in themes:  # keep first full definition
            vars_dict = {}
            for line in body.strip().split("\n"):
                line = line.strip()
                if line.startswith("--"):
                    k, v = line.split(":", 1)
                    vars_dict[k.strip()] = v.rstrip(";").strip()
            themes[name] = vars_dict

    theme_order = ["kanagawa", "miasma", "solitude", "gruvbox"]
    valid_themes = [t for t in theme_order if t in themes]
    for t in themes:
        if t not in valid_themes:
            valid_themes.append(t)

    print(f"Found {len(valid_themes)} themes in Hiraeth: {', '.join(valid_themes)}")

    # Build new theme CSS block
    css_blocks = []
    for i, t in enumerate(valid_themes):
        v = themes[t]
        cat = CAT_PALETTES.get(t, {
            "cat-head": v.get("--accent", "#ffffff"),
            "cat-body": v.get("--accent-dim", "#cccccc"),
            "cat-tail": v.get("--bg-panel-alt", "#333333"),
            "cat-ear": v.get("--accent-bright", "#ffffff"),
            "cat-paw": v.get("--border", "#555555"),
            "cat-whiskers": v.get("--fg", "#ffffff"),
            "cat-z": v.get("--accent-bright", "#ffffff")
        })

        selector = f':root,\n[data-theme="{t}"]' if i == 0 else f'[data-theme="{t}"]'
        lines = [f"{selector} {{"]
        lines.append(f"  --bg: {v.get('--bg', '#1A2026')};")
        lines.append(f"  --bg-panel: {v.get('--bg-panel', '#20272E')};")
        lines.append(f"  --bg-panel-alt: {v.get('--bg-panel-alt', '#313C47')};")
        lines.append(f"  --border: {v.get('--border', '#313C47')};")
        lines.append(f"  --border-strong: {v.get('--border-strong', '#D9A78B')};")
        lines.append(f"  --fg: {v.get('--fg', '#D9D1BA')};")
        lines.append(f"  --fg-dim: {v.get('--fg-dim', '#9E9783')};")
        lines.append(f"  --fg-muted: {v.get('--fg-muted', '#667858')};")
        lines.append(f"  --accent: {v.get('--accent', '#D9A78B')};")
        lines.append(f"  --accent-bright: {v.get('--accent-bright', '#F2BEA0')};")
        lines.append(f"  --accent-soft: {v.get('--accent-soft', '#7794A6')};")
        lines.append(f"  --grid-fade: {v.get('--grid-fade', v.get('--bg', '#1A2026'))};")
        lines.append(f"  --grid-line: {v.get('--grid-line', 'rgba(217, 167, 139, 0.08)')};")
        lines.append(f"  --grid-dot: {v.get('--grid-dot', 'rgba(217, 167, 139, 0.28)')};")
        for ck, cv in cat.items():
            lines.append(f"  --{ck}: {cv};")
        lines.append("  --font-mono: 'Maple Mono NF', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;")
        lines.append("}")
        css_blocks.append("\n".join(lines))

    new_themes_css = "\n\n".join(css_blocks)

    # Replace in mobile style.css
    with open(MOBILE_CSS, "r", encoding="utf-8") as f:
        mob_css = f.read()

    start_marker = "/* ── 1. Kanagawa"
    end_marker = "/* ── Reset & Screen Lock ── */"

    idx_start = mob_css.find(start_marker)
    idx_end = mob_css.find(end_marker)
    if idx_start != -1 and idx_end != -1:
        updated_css = mob_css[:idx_start] + new_themes_css + "\n\n" + mob_css[idx_end:]
        with open(MOBILE_CSS, "w", encoding="utf-8") as f:
            f.write(updated_css)
        print("Updated style.css with latest Hiraeth themes!")
    else:
        print("Warning: Could not match theme markers in mobile style.css")

    # Update app.js THEMES and THEME_COLORS
    theme_colors_map = {t: themes[t].get("--bg", "#1A2026") for t in valid_themes}
    theme_colors_str = ",\n    ".join([f"{t}: '{theme_colors_map[t]}'" for t in valid_themes])

    with open(MOBILE_APP, "r", encoding="utf-8") as f:
        app_content = f.read()

    app_content = re.sub(
        r"const THEMES = \[[^\]]+\];",
        f"const THEMES = {repr(valid_themes)};",
        app_content
    )
    app_content = re.sub(
        r"const THEME_COLORS = \{[^}]+\};",
        f"const THEME_COLORS = {{\n    {theme_colors_str}\n  }};",
        app_content
    )
    with open(MOBILE_APP, "w", encoding="utf-8") as f:
        f.write(app_content)
    print("Updated app.js with latest Hiraeth theme lists & background colors!")

if __name__ == "__main__":
    sync()
