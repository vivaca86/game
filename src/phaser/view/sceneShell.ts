import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";

interface SceneShellOptions {
  title: string;
  subtitle: string;
  focusLabel: string;
  showHand?: boolean;
  backgroundKey?: string;
  onCardClick?: (index: number) => void;
}

export function renderSceneShell(
  scene: Phaser.Scene,
  context: BootContext,
  options: SceneShellOptions
): void {
  const { width, height } = scene.scale;
  scene.cameras.main.setBackgroundColor("#f8efd8");

  renderSceneBackdrop(scene, context, options.backgroundKey);
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

  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const validationText = context.validation.ok ? "DATA OK" : "DATA ERROR";

  addInfoPill(scene, 1510, 45, validationText, context.validation.ok ? 0x1f8a70 : 0xb94141);
  addInfoPill(scene, 1510, 96, context.manifestStatus, 0x8d6a2a);

  const panel = scene.add.rectangle(360, 338, 600, 330, 0xfff8e8, 0.92);
  panel.setStrokeStyle(4, 0xc6a65e, 0.95);
  scene.add.text(95, 205, options.focusLabel, textStyle(32, "#32415a", true));
  scene.add.text(95, 262, stage?.displayNameKo ?? "missing stage", textStyle(42, "#1e2a3e", true));
  scene.add.text(95, 326, character?.displayNameKo ?? "missing character", textStyle(28, "#805845"));
  scene.add.text(95, 382, `phase ${context.run.phase} / room ${context.run.roomIndex + 1}`, textStyle(24, "#805845"));
  scene.add.text(
    95,
    428,
    `HP ${context.run.player.hp}/${context.run.player.maxHp}  EN ${context.run.player.energy}/${context.run.player.maxEnergy}  BLK ${context.run.player.block}`,
    textStyle(24, "#805845")
  );
  renderCharacterPortrait(scene, character);

  if (options.showHand) {
    renderCardHand(scene, context, options.onCardClick);
  }
  renderRoute(scene, context);
}

export function renderCardHand(
  scene: Phaser.Scene,
  context: BootContext,
  onCardClick?: (index: number) => void
): void {
  const hand = context.run.hand.length > 0
    ? context.run.hand
    : context.save.currentRun?.hand ?? context.dataBundle.cards.slice(0, 5).map((card) => card.id);
  const cards = hand
    .map((id) => context.dataBundle.cards.find((card) => card.id === id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .slice(0, 5);

  cards.forEach((card, index) => {
    const x = 430 + index * 230;
    const y = 790;
    const cardWidth = 190;
    const cardHeight = 278;
    renderCardFace(scene, x, y, cardWidth, cardHeight, card);

    const hitTarget = scene.add.rectangle(x, y, cardWidth, cardHeight, 0xffffff, 0.001);
    if (onCardClick) {
      hitTarget.setInteractive({ useHandCursor: true });
      hitTarget.on("pointerdown", () => onCardClick(index));
    }
    scene.add.text(x + 56, y - 126, `${index + 1}`, textStyle(19, "#805845", true));
    scene.add.text(x - 77, y - 126, `${card.cost}`, textStyle(34, "#1e2a3e", true));
    scene.add.text(x - 72, y + 4, card.displayNameKo, textStyle(20, "#1e2a3e", true)).setWordWrapWidth(144);
    scene.add.text(x - 72, y + 54, card.descriptionKo, textStyle(13, "#6d5a48")).setWordWrapWidth(146);
  });
}

function renderCardFace(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  card: BootContext["dataBundle"]["cards"][number]
): void {
  const frameKey = card.assetKeys.frame;
  const artKey = card.assetKeys.illustration;
  const iconKey = card.assetKeys.typeIcon;

  if (scene.textures.exists(frameKey)) {
    scene.add.image(x, y, frameKey).setDisplaySize(width, height);
  } else {
    const fallback = scene.add.rectangle(x, y, width, height, 0xfffbef, 0.98);
    fallback.setStrokeStyle(4, card.type === "attack" ? 0xce5869 : card.type === "defense" ? 0x5d8d86 : 0x677ab8);
  }

  if (scene.textures.exists(artKey)) {
    scene.add.image(x, y - 50, artKey).setDisplaySize(width - 48, 96);
  }

  if (scene.textures.exists(iconKey)) {
    scene.add.image(x + 58, y - 102, iconKey).setDisplaySize(30, 30);
  }
}

export function renderActionButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void
): void {
  const button = scene.add.rectangle(x, y, 290, 58, 0x32415a, 0.94);
  button.setStrokeStyle(3, 0xf5c26b, 0.95);
  button.setInteractive({ useHandCursor: true });
  button.on("pointerdown", onClick);
  scene.add.text(x - 124, y - 16, label, textStyle(22, "#fff5d7", true)).setWordWrapWidth(248);
}

export function renderRoute(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  if (!stage) {
    return;
  }

  if (stage.assetKeys.mapIcon && scene.textures.exists(stage.assetKeys.mapIcon)) {
    scene.add.image(1012, 236, stage.assetKeys.mapIcon).setDisplaySize(64, 64);
  }
  scene.add.text(1060, 218, "Route", textStyle(30, "#32415a", true));
  stage.route.slice(0, 5).forEach((room, index) => {
    const x = 1060 + index * 160;
    const fill = room.type === "boss" ? 0xce5869 : room.type === "event" ? 0x6c8fd6 : 0x4f9b75;
    const node = scene.add.circle(x, 320, 54, fill, 0.9);
    node.setStrokeStyle(
      index === context.run.roomIndex ? 8 : 5,
      index === context.run.roomIndex ? 0xf5c26b : 0xffffff,
      0.95
    );
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

function renderCharacterPortrait(
  scene: Phaser.Scene,
  character: BootContext["dataBundle"]["characters"][number] | undefined
): void {
  const portraitKey = character?.assetKeys.portrait;
  if (!portraitKey || !scene.textures.exists(portraitKey)) {
    return;
  }

  scene.add.circle(566, 332, 74, 0xfff2d6, 0.82).setStrokeStyle(4, 0xc6a65e, 0.95);
  scene.add.image(566, 332, portraitKey).setDisplaySize(132, 132);
}

function renderSceneBackdrop(scene: Phaser.Scene, context: BootContext, explicitBackgroundKey?: string): void {
  const { width, height } = scene.scale;
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const backgroundKey = explicitBackgroundKey ?? stage?.assetKeys.backgroundSet;

  if (backgroundKey && scene.textures.exists(backgroundKey)) {
    const isSceneSpecific = Boolean(explicitBackgroundKey);
    scene.add.image(width / 2, height / 2, backgroundKey)
      .setDisplaySize(width, height)
      .setAlpha(isSceneSpecific ? 0.7 : 0.84);
    scene.add.rectangle(width / 2, height / 2, width, height, 0xfff4df, isSceneSpecific ? 0.34 : 0.28);
    return;
  }

  scene.add.rectangle(width / 2, height / 2, width, height, 0xf8efd8);
}
