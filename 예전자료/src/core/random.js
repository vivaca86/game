export function createRng(seed = 1) {
  let state = Math.max(1, Number(seed) || 1) >>> 0;
  return {
    next() {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    },
    pick(list) {
      if (!list.length) return null;
      return list[Math.floor(this.next() * list.length)];
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }
  };
}

export function shuffle(list, rng) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng.next() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
