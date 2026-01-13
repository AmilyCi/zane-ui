import type { Components, JSX } from "../types/components";

interface ZaneBar extends Components.ZaneBar, HTMLElement {}
export const ZaneBar: {
    prototype: ZaneBar;
    new (): ZaneBar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
