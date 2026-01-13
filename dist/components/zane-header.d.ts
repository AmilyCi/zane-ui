import type { Components, JSX } from "../types/components";

interface ZaneHeader extends Components.ZaneHeader, HTMLElement {}
export const ZaneHeader: {
    prototype: ZaneHeader;
    new (): ZaneHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
