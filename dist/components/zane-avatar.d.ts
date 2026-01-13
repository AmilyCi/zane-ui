import type { Components, JSX } from "../types/components";

interface ZaneAvatar extends Components.ZaneAvatar, HTMLElement {}
export const ZaneAvatar: {
    prototype: ZaneAvatar;
    new (): ZaneAvatar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
