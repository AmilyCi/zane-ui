import { isFocusable } from './isFocusable';
import { isHTMLElement } from './isHTMLElement';

export const focusElement = (
  el?: HTMLElement | null | { focus: () => void },
  options?: FocusOptions,
) => {
  if (!el || !el.focus) return;
  let cleanup: boolean = false;

  if (isHTMLElement(el) && !isFocusable(el) && !el.getAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1');
    cleanup = true;
  }

  el.focus(options);

  if (isHTMLElement(el) && cleanup) {
    el.removeAttribute('tabindex');
  }
};
