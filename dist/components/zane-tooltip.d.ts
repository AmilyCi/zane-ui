import type { Components, JSX } from "../types/components";

interface ZaneTooltip extends Components.ZaneTooltip, HTMLElement {}
export const ZaneTooltip: {
    prototype: ZaneTooltip;
    new (): ZaneTooltip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
