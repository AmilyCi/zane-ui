export function updateTransitionEndListener(
  box: HTMLDivElement,
  action: 'add' | 'remove',
  listener: (event: TransitionEvent) => void,
): void {
  if (listener) {
    const method = `${action}EventListener` as
      | 'addEventListener'
      | 'removeEventListener';

    // some browsers apparently support `transition` (unprefixed) but only fire
    // `webkitTransitionEnd`...
    ['transitionend', 'webkitTransitionEnd'].forEach((event) => {
      box[method](event, listener as EventListener);
    });
  }
}
