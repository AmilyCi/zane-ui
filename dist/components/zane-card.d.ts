import type { Components, JSX } from "../types/components";

interface ZaneCard extends Components.ZaneCard, HTMLElement {}
export const ZaneCard: {
    prototype: ZaneCard;
    new (): ZaneCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
