export function setTransitionDuration(
  els: (HTMLDivElement | null)[],
  value: number,
): void {
  els.forEach((el) => {
    if (el) {
      el.style.transitionDuration = `${value}ms`;
    }
  });
}
