import type { Components, JSX } from "../types/components";

interface ZaneTag extends Components.ZaneTag, HTMLElement {}
export const ZaneTag: {
    prototype: ZaneTag;
    new (): ZaneTag;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
