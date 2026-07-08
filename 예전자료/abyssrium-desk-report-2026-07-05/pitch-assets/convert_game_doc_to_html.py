from __future__ import annotations

import html
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SRC = ROOT / "Abyssrium_Desk_game_content_doc.md"
OUT = ROOT / "Abyssrium_Desk_game_content_doc.html"


def inline(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def split_table_row(line: str) -> list[str]:
    line = line.strip().strip("|")
    return [cell.strip() for cell in line.split("|")]


def is_table_separator(line: str) -> bool:
    cells = split_table_row(line)
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell or "") for cell in cells)


def render_markdown(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    list_mode: str | None = None

    def close_list() -> None:
        nonlocal list_mode
        if list_mode:
            out.append(f"</{list_mode}>")
            list_mode = None

    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()

        if not line.strip():
            close_list()
            i += 1
            continue

        if line.startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            close_list()
            header = split_table_row(line)
            rows: list[list[str]] = []
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(split_table_row(lines[i]))
                i += 1
            out.append("<table>")
            out.append("<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in header) + "</tr></thead>")
            out.append("<tbody>")
            for row in rows:
                cells = row + [""] * (len(header) - len(row))
                out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells[: len(header)]) + "</tr>")
            out.append("</tbody></table>")
            continue

        heading = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading:
            close_list()
            level = len(heading.group(1))
            out.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
            i += 1
            continue

        bullet = re.match(r"^\s*-\s+(.+)$", line)
        if bullet:
            if list_mode != "ul":
                close_list()
                out.append("<ul>")
                list_mode = "ul"
            out.append(f"<li>{inline(bullet.group(1))}</li>")
            i += 1
            continue

        number = re.match(r"^\s*\d+\.\s+(.+)$", line)
        if number:
            if list_mode != "ol":
                close_list()
                out.append("<ol>")
                list_mode = "ol"
            out.append(f"<li>{inline(number.group(1))}</li>")
            i += 1
            continue

        close_list()
        out.append(f"<p>{inline(line.strip())}</p>")
        i += 1

    close_list()
    return "\n".join(out)


def main() -> None:
    body = render_markdown(SRC.read_text(encoding="utf-8"))
    document = f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Abyssrium Desk Game Content Doc</title>
  <style>
    @page {{ size: A4; margin: 22mm 20mm; }}
    body {{
      font-family: "Malgun Gothic", "Segoe UI", Arial, sans-serif;
      color: #101820;
      line-height: 1.58;
      font-size: 10.8pt;
    }}
    h1 {{
      font-size: 24pt;
      margin: 0 0 18pt;
      color: #063348;
    }}
    h2 {{
      font-size: 17pt;
      margin: 24pt 0 8pt;
      padding-top: 6pt;
      border-top: 1.2pt solid #d7e6ec;
      color: #07536d;
    }}
    h3 {{
      font-size: 13.5pt;
      margin: 16pt 0 6pt;
      color: #0a6a82;
    }}
    h4 {{
      font-size: 11.5pt;
      margin: 12pt 0 4pt;
      color: #19313a;
    }}
    p {{ margin: 0 0 7pt; }}
    ul, ol {{ margin-top: 0; margin-bottom: 8pt; }}
    li {{ margin-bottom: 3pt; }}
    strong {{ color: #063348; }}
    code {{
      font-family: Consolas, "Courier New", monospace;
      background: #eef7fa;
      padding: 1pt 3pt;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0 12pt;
      font-size: 9.4pt;
    }}
    th {{
      background: #0b3b4f;
      color: #ffffff;
      text-align: left;
      padding: 6pt;
      border: 1pt solid #0b3b4f;
    }}
    td {{
      padding: 6pt;
      border: 1pt solid #cbdde4;
      vertical-align: top;
    }}
  </style>
</head>
<body>
{body}
</body>
</html>
"""
    OUT.write_text(document, encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
