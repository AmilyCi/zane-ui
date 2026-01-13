import type { Components, JSX } from "../types/components";

interface ZaneText extends Components.ZaneText, HTMLElement {}
export const ZaneText: {
    prototype: ZaneText;
    new (): ZaneText;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
