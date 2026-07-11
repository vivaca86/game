# Source / Version Baseline

Date: 2026-05-26
Status: planning baseline fixed; direct installed-build proof deferred under the no-local-Steam assumption

## Purpose

This document fixes the source and version baseline for future Vampire Crawlers reference work.
It does not claim exhaustive research completion, original-game 95% similarity, or direct runtime parity.

## Current Baseline

| Item | Baseline |
| --- | --- |
| Reference game | `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors` |
| Steam app | `3265700` |
| Official Store release date | `21 Apr, 2026` |
| Developers | `poncle`, `Nosebleed Interactive` |
| Publisher | `poncle` |
| Official Store platforms in API snapshot | Windows `true`, macOS `true`, Linux `false` |
| Official latest Steam Community Announcement seen | 2026-04-29 `1 million Crawlers in 1 week` |
| Official latest patch label seen | `Hotfix 1.4.1` in the 2026-04-29 announcement |
| Direct installed build ID | Deferred: assume no local Steam access unless the user provides it later |
| In-game version label | Deferred with direct build proof |
| Game-file proof | Deferred with direct build proof |

## Sources Checked

| Source | URL | Status | Use | Limit |
| --- | --- | --- | --- | --- |
| Steam Store page | https://store.steampowered.com/app/3265700/Vampire_Crawlers/ | Official | Product identity, release date, genre tags, developer/publisher, public feature language | Store copy and media can change; not direct runtime proof |
| Steam Store appdetails API | https://store.steampowered.com/api/appdetails?appids=3265700 | Official API | App ID, release date, developer/publisher, platform/category snapshot | API values are dated snapshots and do not prove installed build |
| Steam News API | https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3265700&count=100&maxlength=0&format=json | Official API | Official Community Announcements list and latest official patch label | News label does not map to a local build ID by itself |
| Local Steam news crawl | `research/official-steam-news-crawl.md` | Existing local research | Preserves 9 official announcement rows through 2026-04-29 and `Hotfix 1.4.1` notes | Generated 2026-05-22; rechecked by API on 2026-05-26 |
| Local Store/media crawl | `research/steam-store-appdetails-crawl.md` | Existing local research | Preserves Store API/media snapshot, demo app, screenshots, movies, achievements count | Media can include staged/development images; not final runtime proof |
| Local SteamDB build crawl | `research/steamdb-build-baseline-crawl.md` | Third-party local snapshot | Build/depot candidate layer, especially build `23012943` as a temporal candidate | SteamDB is not official, has no public API, and must not be treated as patch proof |

## 2026-05-26 Recheck

Official Steam News API result:

- Fetched UTC: `2026-05-26 11:52:58`
- News items returned: `22`
- Official `steam_community_announcements` rows: `9`
- Latest official announcement: `2026-04-29 18:06:55 UTC`, `1 million Crawlers in 1 week`
- Latest official patch label in official announcements: `Hotfix 1.4.1`

Official Store appdetails API result:

- Name: `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors`
- App ID: `3265700`
- Release date: `21 Apr, 2026`
- Developers: `poncle`, `Nosebleed Interactive`
- Publisher: `poncle`
- Categories include `Single-player`, `Steam Achievements`, `Full controller support`, `Steam Cloud`, `Family Sharing`

SteamDB handling:

- Do not make additional direct automated requests to SteamDB from this workspace.
- SteamDB returned a browser-check / no-API warning when queried from PowerShell.
- Existing `research/steamdb-build-baseline-crawl.md` remains a dated third-party snapshot only.
- Build `23012943` remains a strong temporal candidate, not verified patch/build truth.

## Source Priority

| Priority | Source type | How to use |
| --- | --- | --- |
| 1 | Direct installed build, app manifest, game files, in-game version label, fresh local captures | Required before claiming runtime parity, exact current values, or build-specific behavior |
| 2 | Official Steam Store, official Steam News API, official Store media | Valid for product identity, official high-level features, announcement dates, and visible media candidates |
| 3 | Official wiki/API/static extracts preserved in `research/` | Valid for source-level content rows and planning candidates, not direct shipped UI/runtime proof |
| 4 | SteamDB snapshot | Valid only for public build/depot candidate ordering; never an official patch-note source |
| 5 | Press/guides/videos | Useful as secondary capture queues, not final truth unless corroborated |
| 6 | Current local prototype | Originalized implementation baseline only; never evidence of reference-game completion |

## No-Local-Steam Working Assumption

As of 2026-05-27, the user instructed Codex to assume Steam access is unavailable for now.

Impact:

- Steam/appmanifest proof is no longer an active next-work item.
- Development may continue from official public sources, preserved local research, role mapping, and originalized implementation decisions.
- Exact current-build runtime values, build-specific behavior, and original-game similarity claims still require direct proof if those claims become necessary later.
- If Steam access, an `appmanifest_3265700.acf`, an installed game folder, or fresh captures are provided later, this section can be reopened.

## Locked Rules

- Do not claim `Hotfix 1.4.1` is the installed build until local app manifest, in-game version text, or another direct build proof confirms it.
- Do not claim build `23012943` equals `Hotfix 1.4.1`; treat it as a temporal candidate only.
- Do not treat Store screenshots or trailer frames as exact current runtime values unless direct current-build capture agrees.
- Do not use SteamDB as an official source or continue automated SteamDB fetching.
- Do not start original-game similarity or 95% claims from this baseline.

## Direct Proof Deferred

| Proof target | State |
| --- | --- |
| Local Steam `appmanifest_3265700.acf` build ID | Deferred; no local Steam access is assumed |
| In-game version/build label, if exposed | Deferred; only needed for exact build/runtime claims |
| Fresh-save UI capture for town, first dungeon, first combat, reward, gem/rune, boss, result | Deferred; not required for current originalized foundation work |
| Game-file/static-data proof for exact card/gem/relic/character values | Deferred; exact value parity is not the current target |
| Save-slot and demo-to-full migration behavior | Deferred; not required for current local slice foundation |
| Whether later post-2026-04-29 patches shipped without official announcement | Deferred; verify only if exact source-version claims become necessary |

## 2026-05-26 Local Direct-Proof Attempt

Result: `Blocked locally`

What was checked:

- Common Windows Steam roots:
  - `C:\Program Files (x86)\Steam`
  - `C:\Program Files\Steam`
  - `%LOCALAPPDATA%\Steam`
  - `%APPDATA%\Steam`
  - `%USERPROFILE%\Steam`
- Steam registry keys:
  - `HKCU:\Software\Valve\Steam`
  - `HKLM:\SOFTWARE\WOW6432Node\Valve\Steam`
  - `HKLM:\SOFTWARE\Valve\Steam`
- User-profile recursive search for `appmanifest_3265700.acf`
- Fixed filesystem drive scan for likely `SteamLibrary` / `Steam` roots

Findings:

- No Steam install root was found in the checked common locations.
- No Valve/Steam registry key was found in the checked registry paths.
- No `appmanifest_3265700.acf` was found under the user profile or likely Steam library roots.
- Only the `C:\` filesystem drive was visible to this session.

Conclusion:

- This workspace cannot prove the installed build ID for app `3265700` yet.
- Direct build proof requires the user to install/provide access to the Steam library containing Vampire Crawlers or provide the relevant `appmanifest_3265700.acf` and installed game folder.
- Under the 2026-05-27 no-local-Steam working assumption, this proof path is deferred rather than treated as a blocker for current development.

## Decision

Future reference-driven implementation should use this as the planning baseline:

1. Treat official Steam News through `Hotfix 1.4.1` as the current official announcement baseline.
2. Treat direct installed-build proof as deferred under the no-local-Steam working assumption; do not keep it as active next work.
3. Keep all source-level wiki, Store media, SteamDB, and guide findings in their own evidence layers.
4. Continue building the local project as an originalized slice foundation. Reopen direct proof only if Steam access appears later or exact build/runtime claims become necessary.
