import type { Components, JSX } from "../types/components";

interface ZaneSplitterBar extends Components.ZaneSplitterBar, HTMLElement {}
export const ZaneSplitterBar: {
    prototype: ZaneSplitterBar;
    new (): ZaneSplitterBar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
