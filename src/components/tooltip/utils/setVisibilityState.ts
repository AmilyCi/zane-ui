export function setVisibilityState(
  els: (HTMLDivElement | null)[],
  state: 'hidden' | 'visible',
): void {
  els.forEach((el) => {
    if (el) {
      el.dataset.state = state;
    }
  });
}
