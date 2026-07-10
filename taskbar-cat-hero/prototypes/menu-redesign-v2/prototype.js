const directionButtons = [...document.querySelectorAll("[data-direction]")];
const directionPanels = [...document.querySelectorAll("[data-panel]")];
const navButtons = [...document.querySelectorAll("[data-view]")];
const viewPanels = [...document.querySelectorAll("[data-view-panel]")];
const toast = document.querySelector("#prototypeToast");
let toastTimer = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function selectDirection(id) {
  directionButtons.forEach((button) => {
    const active = button.dataset.direction === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  directionPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === id));
}

function selectView(id) {
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === id));
  viewPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === id));
}

directionButtons.forEach((button) => button.addEventListener("click", () => selectDirection(button.dataset.direction)));
navButtons.forEach((button) => button.addEventListener("click", () => selectView(button.dataset.view)));
document.querySelectorAll("[data-view-jump]").forEach((button) => button.addEventListener("click", () => selectView(button.dataset.viewJump)));

document.querySelector("#startAction").addEventListener("click", () => {
  document.querySelector("#actionTitle").textContent = "토마토 스튜 준비 중";
  document.querySelector("#actionDescription").textContent = "모모가 냄비를 살피기 시작했어요. 작업표시줄에서도 준비 행동으로 전환됩니다.";
  document.querySelector("#taskbarResult").textContent = "냄비 살피기 · 준비 모션";
  showToast("선택 결과가 작업표시줄 고양이에게 연결됐어요");
});

document.querySelector("#changeAction").addEventListener("click", () => {
  document.querySelector("#actionTitle").textContent = "당근 주스 준비";
  document.querySelector("#actionDescription").textContent = "온실 수확 뒤 시작할 수 있어요. 먼저 농장으로 이동할까요?";
  document.querySelector("#taskbarResult").textContent = "온실 쪽을 궁금해하는 모션";
  showToast("다른 행동을 선택했어요");
});
