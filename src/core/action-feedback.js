export function setActionFeedback(state, feedback = {}) {
  if (!state) return null;
  state.status = state.status || {};
  state.status.feedbackSeq = (state.status.feedbackSeq || 0) + 1;
  state.status.actionFeedback = {
    id: state.status.feedbackSeq,
    kind: feedback.kind || "note",
    tone: feedback.tone || "neutral",
    icon: feedback.icon || "!",
    title: feedback.title || "알림",
    subject: feedback.subject || "",
    detail: feedback.detail || "",
    metrics: (feedback.metrics || []).filter((item) => item && item.value !== undefined && item.value !== null),
    targetInstanceIds: [...new Set(feedback.targetInstanceIds || [])]
  };
  return state.status.actionFeedback;
}
