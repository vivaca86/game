import type { BootContext } from "../../app/bootContext";
import { createDebugSummary } from "../../debug/debugActions";
import { renderAccessibilityOverlay } from "./accessibilityOverlay";
import { hideReadabilityTooltip } from "./readabilityOverlay";

export function renderDebugOverlay(context: BootContext, sceneName: string): void {
  renderAccessibilityOverlay(context, sceneName);
  hideReadabilityTooltip();

  const root = document.getElementById("debug-overlay");
  if (!root) {
    return;
  }

  if (!context.debug.enabled) {
    root.replaceChildren();
    root.dataset.visible = "false";
    return;
  }

  root.dataset.visible = "true";
  const summary = createDebugSummary(context);
  root.innerHTML = `
    <div class="debug-card">
      <strong>${sceneName}</strong>
      ${summary.map((item) => `<span>${item}</span>`).join("")}
      ${context.validation.errors.map((item) => `<em>${item}</em>`).join("")}
    </div>
  `;
}
