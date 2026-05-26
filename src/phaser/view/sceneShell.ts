import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";

interface SceneShellOptions {
  title: string;
  subtitle: string;
  focusLabel: string;
}

export function renderSceneShell(
  scene: Phaser.Scene,
  context: BootContext,
  options: SceneShellOptions
): void {
  const { width, height } = scene.scale;
  scene.cameras.main.setBackgroundColor("#f8efd8");

  scene.add.rectangle(width / 2, height / 2, width, height, 0xf8efd8);
  scene.add.rectangle(width / 2, 80, width, 160, 0x32415a, 0.96);
  scene.add.text(72, 42, options.title, {
    fontFamily: "Arial, sans-serif",
    fontSize: "44px",
    color: "#fff5d7",
    fontStyle: "bold"
  });
  scene.add.text(74, 101, options.subtitle, {
    fontFamily: "Arial, sans-serif",
    fontSize: "22px",
    color: "#f5c26b"
  });

  const stage = context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const character = context.dataBundle.characters[0];
  const validationText = context.validation.ok ? "DATA OK" : "DATA ERROR";

  addInfoPill(scene, 1510, 45, validationText, context.validation.ok ? 0x1f8a70 : 0xb94141);
  addInfoPill(scene, 1510, 96, context.manifestStatus, 0x8d6a2a);

  const panel = scene.add.rectangle(360, 338, 600, 330, 0xfff8e8, 0.92);
  panel.setStrokeStyle(4, 0xc6a65e, 0.95);
  scene.add.text(95, 205, options.focusLabel, textStyle(32, "#32415a", true));
  scene.add.text(95, 262, stage?.displayNameKo ?? "스테이지 없음", textStyle(42, "#1e2a3e", true));
  scene.add.text(95, 326, character?.displayNameKo ?? "캐릭터 없음", textStyle(28, "#805845"));
  scene.add.text(95, 382, `seed ${context.seed}`, textStyle(24, "#805845"));
  scene.add.text(95, 428, `saveVersion ${context.save.saveVersion}`, textStyle(24, "#805845"));

  renderCardHand(scene, context);
  renderRoute(scene, context);
}

export function renderCardHand(scene: Phaser.Scene, context: BootContext): void {
  const hand = context.save.currentRun?.hand ?? context.dataBundle.cards.slice(0, 5).map((card) => card.id);
  const cards = hand
    .map((id) => context.dataBundle.cards.find((card) => card.id === id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .slice(0, 5);

  cards.forEach((card, index) => {
    const x = 430 + index * 230;
    const y = 790;
    const cardRect = scene.add.rectangle(x, y, 190, 250, 0xfffbef, 0.98);
    cardRect.setStrokeStyle(4, card.type === "attack" ? 0xce5869 : card.type === "defense" ? 0x5d8d86 : 0x677ab8);
    scene.add.text(x - 78, y - 100, `${card.cost}`, textStyle(36, "#1e2a3e", true));
    scene.add.text(x - 78, y - 48, card.displayNameKo, textStyle(24, "#1e2a3e", true)).setWordWrapWidth(154);
    scene.add.text(x - 78, y + 18, card.descriptionKo, textStyle(18, "#6d5a48")).setWordWrapWidth(154);
  });
}

export function renderRoute(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  if (!stage) {
    return;
  }

  scene.add.text(1050, 218, "진행 경로", textStyle(30, "#32415a", true));
  stage.route.slice(0, 4).forEach((room, index) => {
    const x = 1060 + index * 180;
    const fill = room.type === "boss" ? 0xce5869 : room.type === "event" ? 0x6c8fd6 : 0x4f9b75;
    const node = scene.add.circle(x, 320, 54, fill, 0.9);
    node.setStrokeStyle(5, 0xffffff, 0.95);
    scene.add.text(x - 48, 390, room.type, textStyle(20, "#32415a", true)).setWordWrapWidth(100, true);
  });
}

export function textStyle(size: number, color: string, bold = false): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: "Arial, sans-serif",
    fontSize: `${size}px`,
    color,
    fontStyle: bold ? "bold" : "normal"
  };
}

function addInfoPill(scene: Phaser.Scene, x: number, y: number, label: string, color: number): void {
  scene.add.rectangle(x + 150, y + 20, 300, 40, color, 0.9).setStrokeStyle(2, 0xffffff, 0.5);
  scene.add.text(x + 16, y + 8, label, textStyle(20, "#fff8e6", true));
}
