import type { Components, JSX } from "../types/components";

interface ZaneMain extends Components.ZaneMain, HTMLElement {}
export const ZaneMain: {
    prototype: ZaneMain;
    new (): ZaneMain;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
