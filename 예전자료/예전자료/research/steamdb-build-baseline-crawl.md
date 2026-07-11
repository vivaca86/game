# SteamDB Build Baseline Crawl

Status: generated 2026-05-22 / third-party SteamDB build and depot metadata crawl

This file preserves the public SteamDB build/depot layer for app `3265700`.
SteamDB is useful for build IDs, branch timestamps, depot IDs, and public update ordering, but it is not Valve, poncle, an official patch note, game text, or direct installed-build proof.

Source pages:

- https://steamdb.info/app/3265700/depots/
- https://steamdb.info/patchnotes/23012943/
- https://steamdb.info/patchnotes/22813976/
- https://steamdb.info/app/3265700/patchnotes/

## Crawl Notes

| Field | Value |
| --- | --- |
| Fetched | 2026-05-22 |
| Steam app | `3265700` |
| SteamDB latest public branch build seen | `23012943` |
| Public branch build time | 2026-04-29 14:40:29 UTC |
| Public branch update time | 2026-04-30 10:01:00 UTC |
| Build `23012943` patchnote page | `Vampire Crawlers update for 30 April 2026` |
| Build `23012943` official patch-note text | None shown by SteamDB; page says no official patch notes are available besides changed files in 2 depots |
| Previous visible SteamDB update | Build `22813976` on 2026-04-21, launch post mirrored via Steam Community |
| Steam Deck tested build | `22813976` |
| Direct installed-build proof | No |
| Game-file proof | No |

## Public Depot / Branch Rows

| Row | SteamDB page | Finding | Use | Limit |
| --- | --- | --- | --- | --- |
| SDBBLD-001 | App depots page | Depots listed: `3265701` Windows/Linux and `3265702` macOS. | Confirms public depot IDs and supported depot split for future install/file checks. | Does not expose file contents or gameplay data. |
| SDBBLD-002 | App depots page | Windows/Linux depot size is shown as 999.46 MiB on disk / 564.92 MiB download; macOS depot is 1.12 GiB on disk / 602.80 MiB download; Windows English filtered download is 564.92 MiB. | Sets install-size expectation for future capture. | Sizes are metadata and can change; not rule proof. |
| SDBBLD-003 | App depots page | Public branch points to build `23012943`, built 2026-04-29 14:40:29 UTC and updated 2026-04-30 10:01:00 UTC. | Current public build candidate for direct-play baseline. | SteamDB public branch timestamp does not prove the in-game version label or patch name. |
| SDBBLD-004 | Build `23012943` page | SteamDB titles it `Build 23012943 on 30 April 2026`, edited 2026-04-30 10:01:02 UTC. | Confirms the visible build update after launch. | SteamDB says no official patch notes are available for this build besides changed files in 2 depots. |
| SDBBLD-005 | Build `23012943` page | Previous update is build `22813976` / launch post on 2026-04-21. | Narrows public build sequence from launch build to later public build. | Intermediate private or unlisted builds may exist. |
| SDBBLD-006 | Build `22813976` page | SteamDB mirrors the official launch post and labels it build `22813976` on 2026-04-21. | Confirms launch-build anchor used by SteamDB and Steam Deck test metadata. | Launch post content is already official through Steam news; SteamDB mirror is not the primary source for rules. |
| SDBBLD-007 | App metadata / Steam Deck section | Steam Deck compatibility lists tested build ID `22813976`, test timestamp 2026-04-18, and category Verified. | Captures Deck test build separate from current public build. | Deck test build is not current gameplay baseline. |

## Hotfix 1.4.1 Mapping Attempt

| Candidate | Evidence supporting link | Evidence against finalizing | Current treatment |
| --- | --- | --- | --- |
| Build `23012943` may correspond to official `Hotfix 1.4.1` | Official Steam news says `Hotfix 1.4.1` was released in the 2026-04-29 announcement; SteamDB public branch build `23012943` was built earlier on 2026-04-29 and updated publicly on 2026-04-30. | SteamDB build `23012943` page explicitly shows no official patch notes; no local app manifest, installed build ID, game version label, or file manifest is available. | Treat as a strong temporal candidate only. Do not call direct-play captures final until installed build/version proves `23012943`, `Hotfix 1.4.1`, or a later patch. |
| Build `22813976` is the launch anchor | SteamDB labels build `22813976` with the 2026-04-21 launch post, and the app metadata lists it as the Steam Deck tested build. | It predates the 2026-04-29 `Hotfix 1.4.1` announcement and cannot include later hotfix fixes unless re-used in a branch not visible here. | Use as launch/Steam Deck comparison only. |

## Direct Capture Targets

- Record the local Steam `appmanifest_3265700.acf` build ID and compare it to `23012943`.
- Capture any in-game version label, credits/build text, or save metadata that can confirm `Hotfix 1.4.1` or a later patch.
- If local build is `23012943`, still verify save-slot, demo-migration, Echo gem, frame-rate, and Gatti Amari behavior directly because SteamDB does not include official patch text for this build.
- Preserve build `22813976` as launch/Steam Deck baseline, not current public gameplay proof.
