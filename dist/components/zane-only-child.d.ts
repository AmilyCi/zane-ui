import type { Components, JSX } from "../types/components";

interface ZaneOnlyChild extends Components.ZaneOnlyChild, HTMLElement {}
export const ZaneOnlyChild: {
    prototype: ZaneOnlyChild;
    new (): ZaneOnlyChild;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
