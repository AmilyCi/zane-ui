import type { Components, JSX } from "../types/components";

interface ZaneFooter extends Components.ZaneFooter, HTMLElement {}
export const ZaneFooter: {
    prototype: ZaneFooter;
    new (): ZaneFooter;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
