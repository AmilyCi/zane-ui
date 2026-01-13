import type { Components, JSX } from "../types/components";

interface ZaneButton extends Components.ZaneButton, HTMLElement {}
export const ZaneButton: {
    prototype: ZaneButton;
    new (): ZaneButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
