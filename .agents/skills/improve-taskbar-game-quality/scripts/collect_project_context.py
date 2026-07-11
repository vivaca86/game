#!/usr/bin/env python3
"""Print a concise, read-only quality context for taskbar-game work."""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*$")
FENCE_RE = re.compile(r"^\s{0,3}(`{3,}|~{3,})")
ENTRY_RE = re.compile(r"\bEntry\s+\d+\b", re.IGNORECASE)


@dataclass(frozen=True)
class Section:
    level: int
    title: str
    text: str


def read_utf8(path: Path) -> str:
    try:
        return path.read_bytes().decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise ValueError(f"invalid UTF-8 at byte {error.start}") from error


def split_sections(text: str) -> list[Section]:
    lines = text.splitlines()
    starts: list[tuple[int, int, str]] = []
    fence_character: str | None = None
    fence_length = 0
    for index, line in enumerate(lines):
        fence = FENCE_RE.match(line)
        if fence:
            token = fence.group(1)
            if fence_character is None:
                fence_character = token[0]
                fence_length = len(token)
            elif token[0] == fence_character and len(token) >= fence_length:
                fence_character = None
                fence_length = 0
            continue
        if fence_character is not None:
            continue
        match = HEADING_RE.match(line)
        if match:
            starts.append((index, len(match.group(1)), match.group(2).strip()))

    sections: list[Section] = []
    for position, (start, level, title) in enumerate(starts):
        end = len(lines)
        for next_start, next_level, _ in starts[position + 1 :]:
            if next_level <= level:
                end = next_start
                break
        sections.append(Section(level, title, "\n".join(lines[start:end]).strip()))
    return sections


def normalize_title(title: str) -> str:
    normalized = unicodedata.normalize("NFKC", title)
    without_number = re.sub(r"^\d+(?:\.\d+)*\.?\s*", "", normalized)
    return " ".join(without_number.casefold().split())


def find_section(text: str, wanted: str) -> str | None:
    target = normalize_title(wanted)
    for section in split_sections(text):
        if normalize_title(section.title) == target:
            return section.text
    return None


def top_level_sections(text: str, level: int = 2) -> list[Section]:
    return [section for section in split_sections(text) if section.level == level]


def conversation_entry_sections(text: str) -> list[Section]:
    return [section for section in split_sections(text) if ENTRY_RE.search(section.title)]


def locate_project_root(explicit: Path | None) -> Path | None:
    if explicit is not None:
        candidate = explicit.expanduser().resolve()
        return candidate if (candidate / "PROJECT_RULES.md").is_file() else None

    seeds = [Path.cwd().resolve(), Path(__file__).resolve()]
    seen: set[Path] = set()
    for seed in seeds:
        candidates: Iterable[Path] = [seed, *seed.parents]
        for candidate in candidates:
            if candidate in seen:
                continue
            seen.add(candidate)
            if (candidate / "PROJECT_RULES.md").is_file() and (candidate / "AGENTS.md").is_file():
                return candidate
    return None


def append_named_sections(
    output: list[str], path: Path, titles: list[str], errors: list[str]
) -> None:
    if not path.is_file():
        message = f"MISSING FILE: {path}"
        output.append(message)
        errors.append(message)
        return

    try:
        text = read_utf8(path)
    except (OSError, ValueError) as error:
        message = f"INCOMPLETE FILE {path}: {error}"
        output.append(message)
        errors.append(message)
        return
    output.append(f"\n# {path.name}")
    for title in titles:
        section = find_section(text, title)
        if section is None:
            message = f"MISSING SECTION in {path.name}: {title}"
            output.append(message)
            errors.append(message)
        else:
            output.append(f"\n{section}")


def append_recent_sections(
    output: list[str],
    path: Path,
    count: int,
    label: str,
    errors: list[str],
    conversation_entries: bool = False,
) -> None:
    if not path.is_file():
        message = f"MISSING FILE: {path}"
        output.append(message)
        errors.append(message)
        return
    try:
        text = read_utf8(path)
    except (OSError, ValueError) as error:
        message = f"INCOMPLETE FILE {path}: {error}"
        output.append(message)
        errors.append(message)
        return
    sections = conversation_entry_sections(text) if conversation_entries else top_level_sections(text)
    output.append(f"\n# {label}: latest {min(count, len(sections))}")
    for section in sections[-count:]:
        output.append(f"\n{section.text}")


def build_context(root: Path, recent_entries: int, recent_workarounds: int) -> tuple[str, list[str]]:
    output = ["# Compact taskbar-game quality context", f"Project root: {root}"]
    errors: list[str] = []

    append_named_sections(
        output,
        root / "PROJECT_RULES.md",
        [
            "Image Quality Has Priority Over Porting Convenience",
            "Sprite Animation Continuity Gate",
            "Generated Character Interaction Art Gate",
            "Core Experience And Game Loop",
            "Feature Decision Gate",
        ],
        errors,
    )
    append_named_sections(
        output,
        root / "docs" / "recovery-audit.md",
        [
            "현재 판정",
            "다시 사용하지 않을 경로",
            "채택한 복구 원칙",
            "현재 검증 공백",
        ],
        errors,
    )

    current_issues = root / "docs" / "current-issues-and-plan.md"
    if current_issues.is_file():
        try:
            output.append(f"\n# {current_issues.name}\n\n{read_utf8(current_issues).strip()}")
        except (OSError, ValueError) as error:
            message = f"INCOMPLETE FILE {current_issues}: {error}"
            output.append(message)
            errors.append(message)
    else:
        message = f"MISSING FILE: {current_issues}"
        output.append(message)
        errors.append(message)

    append_recent_sections(
        output,
        root / "docs" / "workaround-ledger.md",
        recent_workarounds,
        "Recent verified workarounds",
        errors,
    )
    append_recent_sections(
        output,
        root / "docs" / "conversation-log.md",
        recent_entries,
        "Recent conversation entries",
        errors,
        conversation_entries=True,
    )
    return "\n".join(output).rstrip() + "\n", errors


def run_self_test() -> None:
    sample = """# Root

### 2.1 Alpha Gate
Keep this.

#### Detail
Keep detail.

```text
## Entry 999
Ignore fenced heading.
```

### Beta Gate
Keep beta.

## Later
Stop.
"""
    sections = split_sections(sample)
    assert len(sections) == 5
    alpha = find_section(sample, "Alpha Gate")
    assert alpha is not None and "Keep detail." in alpha and "Keep beta." not in alpha
    assert find_section(sample, "2.1 Alpha Gate") == alpha
    assert [item.title for item in top_level_sections(sample)] == ["Later"]
    entries = conversation_entry_sections("### Entry 1\nOld.\n\n## 2026 — Entry 2\nNew.\n")
    assert [item.title for item in entries] == ["Entry 1", "2026 — Entry 2"]
    print("SELF-TEST PASSED")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", type=Path, help="Explicit repository root")
    parser.add_argument("--recent-entries", type=int, default=3)
    parser.add_argument("--recent-workarounds", type=int, default=5)
    parser.add_argument("--self-test", action="store_true")
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="backslashreplace")
    args = parse_args()
    if args.self_test:
        run_self_test()
        return 0
    if args.recent_entries < 1 or args.recent_workarounds < 1:
        print("Recent-section counts must be positive.", file=sys.stderr)
        return 2

    root = locate_project_root(args.project_root)
    if root is None:
        print("Could not locate a project root containing AGENTS.md and PROJECT_RULES.md.", file=sys.stderr)
        return 2

    context, errors = build_context(root, args.recent_entries, args.recent_workarounds)
    print(context, end="")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
