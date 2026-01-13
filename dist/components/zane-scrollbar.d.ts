import type { Components, JSX } from "../types/components";

interface ZaneScrollbar extends Components.ZaneScrollbar, HTMLElement {}
export const ZaneScrollbar: {
    prototype: ZaneScrollbar;
    new (): ZaneScrollbar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
