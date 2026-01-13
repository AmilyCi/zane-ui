import type { Components, JSX } from "../types/components";

interface ZaneForwardRef extends Components.ZaneForwardRef, HTMLElement {}
export const ZaneForwardRef: {
    prototype: ZaneForwardRef;
    new (): ZaneForwardRef;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
