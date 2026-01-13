import { isFocusable } from "./isFocusable";
import { isHTMLElement } from "./isHTMLElement";
export const focusElement = (el, options) => {
    if (!el || !el.focus)
        return;
    let cleanup = false;
    if (isHTMLElement(el) && !isFocusable(el) && !el.getAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
        cleanup = true;
    }
    el.focus(options);
    if (isHTMLElement(el) && cleanup) {
        el.removeAttribute('tabindex');
    }
};
