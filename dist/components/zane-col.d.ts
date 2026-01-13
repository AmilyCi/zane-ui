import type { Components, JSX } from "../types/components";

interface ZaneCol extends Components.ZaneCol, HTMLElement {}
export const ZaneCol: {
    prototype: ZaneCol;
    new (): ZaneCol;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
