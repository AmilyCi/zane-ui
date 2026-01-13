import type { Components, JSX } from "../types/components";

interface ZaneSplitter extends Components.ZaneSplitter, HTMLElement {}
export const ZaneSplitter: {
    prototype: ZaneSplitter;
    new (): ZaneSplitter;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
