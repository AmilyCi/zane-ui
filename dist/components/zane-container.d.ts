import type { Components, JSX } from "../types/components";

interface ZaneContainer extends Components.ZaneContainer, HTMLElement {}
export const ZaneContainer: {
    prototype: ZaneContainer;
    new (): ZaneContainer;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
