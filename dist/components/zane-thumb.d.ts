import type { Components, JSX } from "../types/components";

interface ZaneThumb extends Components.ZaneThumb, HTMLElement {}
export const ZaneThumb: {
    prototype: ZaneThumb;
    new (): ZaneThumb;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
