import type { Components, JSX } from "../types/components";

interface ZaneDivider extends Components.ZaneDivider, HTMLElement {}
export const ZaneDivider: {
    prototype: ZaneDivider;
    new (): ZaneDivider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
