import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { RelicData } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { getStage } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, textStyle } from "../view/sceneShell";

type ResultTone = "clear" | "defeat" | "return";
const RESULT_RASTER_UNDERLAY_KEY = "result_raster_underlay_concept";
const RESULT_RASTER_HOVER_ACTION_KEY = "ui_hover_action_seal_concept";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "결과",
      subtitle: "귀환 기록",
      focusLabel: "탐험 결과",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    if (hasResultRasterUnderlay(this)) {
      renderResultRasterStage(this, context);
    } else {
      renderResultTheater(this, context);
    }

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "ResultScene");
  }
}

function hasResultRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(RESULT_RASTER_UNDERLAY_KEY);
}

function renderResultRasterStage(scene: Phaser.Scene, context: BootContext): void {
  scene.add.image(960, 540, RESULT_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  renderResultRasterHitTarget(scene, 1010, 742, 330, 66, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"));
  renderResultRasterHitTarget(scene, 960, 944, 440, 120, 0x5eead4, () => handleSceneAction(scene, context, "confirm"));
}

function renderResultRasterHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  _accent: number,
  onClick: () => void
): void {
  const hoverSize = Math.min(108, Math.max(80, Math.min(width, height) * 1.12));
  renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: RESULT_RASTER_HOVER_ACTION_KEY,
    hoverX: x + width * 0.38,
    hoverY: y - height * 0.24,
    hoverWidth: hoverSize,
    hoverHeight: hoverSize,
    downAlpha: 0.76
  });
}

function renderResultTheater(scene: Phaser.Scene, context: BootContext): void {
  const stage = getStage(context.dataBundle, context.run);
  const defeated = context.run.player.hp <= 0;
  const cleared = !defeated && context.run.completedStages.includes(context.run.stageId);
  const tone: ResultTone = defeated ? "defeat" : cleared ? "clear" : "return";
  const profileClears = context.save.profile.completedStages.length;

  scene.add.rectangle(960, 560, 1680, 840, 0xfff8e8, 0.44)
    .setStrokeStyle(6, 0xb98c34, 0.34);
  scene.add.polygon(168, 550, [0, -352, 168, -286, 190, 306, 0, 376, -82, 306, -58, -292], toneFill(tone), 0.2)
    .setStrokeStyle(5, toneStroke(tone), 0.38);
  scene.add.polygon(1752, 550, [0, -352, 58, -292, 82, 306, 0, 376, -190, 306, -168, -286], 0x5d8d86, 0.2)
    .setStrokeStyle(5, 0x3f6f68, 0.38);

  renderPaperPanel(scene, 960, 126, 800, 132, { alpha: 0.96 });
  scene.add.circle(610, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.rectangle(960, 190, 720, 18, 0xf5c26b, 0.68);
  scene.add.text(960, 82, "탐험 결과", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(
    960,
    137,
    `${stage?.displayNameKo ?? "스테이지 없음"} / ${resultTitle(tone)} / 저장 완료 ${profileClears}`,
    textStyle(22, "#805845", true)
  ).setOrigin(0.5);

  renderResultLedger(scene, context, tone);
  renderResultCertificate(scene, context, tone);
  renderCollectionLedger(scene, context);

  renderActionButton(scene, 1010, 742, "마을로", () => handleSceneAction(scene, context, "confirm"), {
    width: 330,
    height: 66,
    fontSize: 25,
    focus: true
  });
}

function renderResultLedger(scene: Phaser.Scene, context: BootContext, tone: ResultTone): void {
  const stage = getStage(context.dataBundle, context.run);
  const completedTotal = new Set([...context.save.profile.completedStages, ...context.run.completedStages]).size;

  renderPaperPanel(scene, 430, 620, 486, 596, { alpha: 0.96 });
  scene.add.text(236, 358, "귀환 기록", textStyle(31, "#32415a", true));
  scene.add.text(236, 404, "마을에 넘길 탐험 증서", textStyle(20, "#805845", true));

  const rows = [
    { label: "결과", value: resultTitle(tone) },
    { label: "현관", value: stage?.displayNameKo ?? "스테이지 없음" },
    { label: "체력", value: `${context.run.player.hp}/${context.run.player.maxHp}` },
    { label: "골드", value: `${context.run.player.gold}` },
    { label: "완료", value: `${completedTotal}` }
  ];
  rows.forEach((row, index) => {
    const y = 470 + index * 70;
    renderUiSlot(scene, 430, y, 360, 54, "choice", { disabled: true, focus: index === 0 });
    scene.add.text(282, y - 15, row.label, textStyle(17, "#805845", true)).setWordWrapWidth(76);
    scene.add.text(388, y - 17, row.value, textStyle(20, "#1e2a3e", true)).setWordWrapWidth(190);
  });

  scene.add.rectangle(430, 840, 354, 92, 0xfff6df, 0.42).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(274, 812, resultHelper(tone), textStyle(18, "#805845", true)).setWordWrapWidth(306);
}

function renderResultCertificate(scene: Phaser.Scene, context: BootContext, tone: ResultTone): void {
  const stage = getStage(context.dataBundle, context.run);
  const routeLength = stage?.route.length ?? 0;
  const roomProgress = Math.min(context.run.roomIndex + 1, Math.max(1, routeLength || 1));
  const roomCounts = countRouteRooms(stage);
  const nextStage = getNextStage(context);

  renderPaperPanel(scene, 1040, 616, 860, 600, { alpha: 0.96 });
  scene.add.text(690, 352, "종이 커튼콜", textStyle(32, "#32415a", true));
  scene.add.text(690, 398, resultTitle(tone), textStyle(30, toneTextColor(tone), true));

  scene.add.rectangle(1040, 602, 640, 270, 0xfff2d6, 0.62).setStrokeStyle(5, 0xc6a65e, 0.58);
  scene.add.polygon(1040, 672, [-320, 96, -220, -120, 220, -120, 320, 96], 0x32415a, 0.08)
    .setStrokeStyle(5, 0x8d6a2a, 0.34);
  scene.add.circle(1040, 574, 116, toneFill(tone), 0.86).setStrokeStyle(8, 0xfff3b0, 0.78);
  scene.add.circle(1004, 532, 28, 0xfff6df, 0.42);
  scene.add.circle(1076, 616, 18, 0x32415a, 0.2);
  scene.add.text(1040, 542, resultSealText(tone), textStyle(32, "#fff5d7", true)).setOrigin(0.5);
  scene.add.text(1040, 592, stage?.displayNameKo ?? "스테이지 없음", textStyle(22, "#fff5d7", true))
    .setOrigin(0.5)
    .setWordWrapWidth(230);

  renderResultTicket(scene, 806, 574, "진행", `${roomProgress}/${Math.max(1, routeLength || 1)}`, routeCountLine(roomCounts));

  scene.add.rectangle(1040, 692, 520, 60, 0xfff6df, 0.58).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(
    804,
    672,
    `${resultMessage(tone)} / 방 ${roomProgress}/${Math.max(1, routeLength || 1)}`,
    textStyle(19, "#805845", true)
  ).setWordWrapWidth(472);

  scene.add.rectangle(1040, 848, 520, 56, 0xfff6df, 0.48).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(804, 830, "다음 기록", textStyle(17, "#805845", true)).setWordWrapWidth(88);
  scene.add.text(912, 828, resultNextTitle(tone, nextStage), textStyle(19, "#1e2a3e", true)).setWordWrapWidth(178);
  scene.add.text(1114, 831, resultNextLine(tone, nextStage), textStyle(16, "#805845", true)).setWordWrapWidth(162);
}

function renderCollectionLedger(scene: Phaser.Scene, context: BootContext): void {
  const relics = context.run.relics
    .map((relicId) => context.dataBundle.relics.find((relic) => relic.id === relicId))
    .filter((relic): relic is RelicData => Boolean(relic));
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const startingDeckSize = character?.startingDeck.length ?? 0;
  const addedCards = Math.max(0, context.run.deck.length - startingDeckSize);

  renderPaperPanel(scene, 1480, 620, 386, 596, { alpha: 0.95 });
  scene.add.text(1320, 358, "수집 기록", textStyle(31, "#32415a", true));
  scene.add.text(1320, 404, "이번 탐험의 흔적", textStyle(20, "#805845", true));

  const rows = [
    { label: "유물", value: `${relics.length}` },
    { label: "룬", value: `${context.run.runes.length}` },
    { label: "기운", value: `${context.run.arcanas.length}` },
    { label: "덱", value: `${context.run.deck.length} / +${addedCards}` }
  ];
  rows.forEach((row, index) => {
    const y = 480 + index * 74;
    renderUiSlot(scene, 1480, y, 292, 54, "choice", { disabled: true, focus: index === 0 });
    scene.add.text(1352, y - 15, row.label, textStyle(17, "#805845", true)).setWordWrapWidth(70);
    scene.add.text(1430, y - 17, row.value, textStyle(20, "#1e2a3e", true)).setWordWrapWidth(168);
  });

  const iconY = 724;
  relics.slice(0, 4).forEach((relic, index) => {
    const x = 1374 + index * 58;
    scene.add.circle(x, iconY, 26, 0xfff6df, 0.72).setStrokeStyle(3, 0xc6a65e, 0.7);
    if (scene.textures.exists(relic.assetKeys.icon)) {
      scene.add.image(x, iconY, relic.assetKeys.icon).setDisplaySize(42, 42);
    }
  });

  scene.add.rectangle(1480, 840, 302, 82, 0xfff6df, 0.38).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(1342, 812, collectionSummary(relics, context.run.runes.length, context.run.arcanas.length, addedCards), textStyle(17, "#805845", true)).setWordWrapWidth(260);
}

function renderResultTicket(scene: Phaser.Scene, x: number, y: number, label: string, value: string, detail: string): void {
  renderUiSlot(scene, x, y, 210, 128, "choice", { disabled: true });
  scene.add.text(x - 82, y - 46, label, textStyle(18, "#805845", true)).setWordWrapWidth(164);
  scene.add.text(x - 82, y - 12, value, textStyle(23, "#1e2a3e", true)).setWordWrapWidth(164);
  scene.add.text(x - 82, y + 26, detail, textStyle(15, "#805845", true)).setWordWrapWidth(164);
}

function resultTitle(tone: ResultTone): string {
  if (tone === "clear") return "스테이지 클리어";
  if (tone === "defeat") return "탐험 실패";
  return "귀환 결산";
}

function resultSealText(tone: ResultTone): string {
  if (tone === "clear") return "완료";
  if (tone === "defeat") return "실패";
  return "귀환";
}

function resultMessage(tone: ResultTone): string {
  if (tone === "clear") return "현관의 마지막 장면을 넘겼습니다";
  if (tone === "defeat") return "기록은 남고 다음 도전을 기다립니다";
  return "현재 탐험 상태를 정리했습니다";
}

function resultHelper(tone: ResultTone): string {
  if (tone === "clear") return "클리어 기록은 마을 저장장에 남습니다.";
  if (tone === "defeat") return "패배 기록은 완료 스테이지로 계산하지 않습니다.";
  return "현재 결과를 확인하고 마을로 복귀합니다.";
}

function resultNextTitle(tone: ResultTone, nextStage: ReturnType<typeof getNextStage>): string {
  if (tone === "clear") return nextStage?.displayNameKo ?? "모든 장";
  if (tone === "defeat") return "재도전";
  return "정비";
}

function resultNextLine(tone: ResultTone, nextStage: ReturnType<typeof getNextStage>): string {
  if (tone === "clear") return nextStage ? "다음 장 해금" : "열린 장 전체 확인";
  if (tone === "defeat") return "완료 기록 없음";
  return "현재 저장 유지";
}

function countRouteRooms(stage: ReturnType<typeof getStage> | undefined): Partial<Record<string, number>> {
  const counts: Partial<Record<string, number>> = {};
  stage?.route.forEach((room) => {
    counts[room.type] = (counts[room.type] ?? 0) + 1;
  });
  return counts;
}

function routeCountLine(counts: Partial<Record<string, number>>): string {
  const combat = (counts.combat ?? 0) + (counts.elite ?? 0);
  const event = counts.event ?? 0;
  const rest = counts.rest ?? 0;
  return `전투 ${combat} / 사건 ${event} / 휴식 ${rest}`;
}

function getNextStage(context: BootContext): BootContext["dataBundle"]["stages"][number] | undefined {
  const stageIndex = context.dataBundle.stages.findIndex((stage) => stage.id === context.run.stageId);
  if (stageIndex < 0) return undefined;
  return context.dataBundle.stages[stageIndex + 1];
}

function collectionSummary(relics: RelicData[], runeCount: number, arcanaCount: number, addedCards: number): string {
  const parts = [];
  if (addedCards > 0) parts.push(`카드 +${addedCards}`);
  if (runeCount > 0) parts.push(`룬 ${runeCount}`);
  if (relics.length > 0) parts.push(`유물 ${relics.length}`);
  if (arcanaCount > 0) parts.push(`기운 ${arcanaCount}`);
  return parts.length > 0 ? `보존: ${parts.join(" / ")}` : "보존할 새 수집품 없음";
}

function toneFill(tone: ResultTone): number {
  if (tone === "clear") return 0x5d8d86;
  if (tone === "defeat") return 0xce5869;
  return 0x6c8fd6;
}

function toneStroke(tone: ResultTone): number {
  if (tone === "clear") return 0x3f6f68;
  if (tone === "defeat") return 0x8d4b7a;
  return 0x4c659d;
}

function toneTextColor(tone: ResultTone): string {
  if (tone === "clear") return "#2f6d5e";
  if (tone === "defeat") return "#9b3145";
  return "#32415a";
}
