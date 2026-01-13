import type { Components, JSX } from "../types/components";

interface ZaneAside extends Components.ZaneAside, HTMLElement {}
export const ZaneAside: {
    prototype: ZaneAside;
    new (): ZaneAside;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
