import type { Components, JSX } from "../types/components";

interface ZaneLink extends Components.ZaneLink, HTMLElement {}
export const ZaneLink: {
    prototype: ZaneLink;
    new (): ZaneLink;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
