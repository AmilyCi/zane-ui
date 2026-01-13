import type { Components, JSX } from "../types/components";

interface ZaneIcon extends Components.ZaneIcon, HTMLElement {}
export const ZaneIcon: {
    prototype: ZaneIcon;
    new (): ZaneIcon;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
