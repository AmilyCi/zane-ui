import type { Components, JSX } from "../types/components";

interface ZaneCollapse extends Components.ZaneCollapse, HTMLElement {}
export const ZaneCollapse: {
    prototype: ZaneCollapse;
    new (): ZaneCollapse;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
