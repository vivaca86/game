export function filterAuditViewports(viewports) {
  const scope = String(process.env.UI_AUDIT_VIEWPORTS ?? "all").trim().toLowerCase();
  if (!scope || scope === "all") {
    return viewports;
  }

  const tokens = new Set(scope.split(",").map((item) => item.trim()).filter(Boolean));
  const filtered = viewports.filter((viewport) => {
    const key = String(viewport.key ?? "").toLowerCase();
    if (tokens.has(key)) return true;
    if (tokens.has("desktop") && key.startsWith("desktop-")) return true;
    if (tokens.has("mobile") && key.startsWith("mobile")) return true;
    return false;
  });

  if (filtered.length === 0) {
    throw new Error(`UI_AUDIT_VIEWPORTS=${scope} did not match any audit viewports`);
  }

  return filtered;
}
