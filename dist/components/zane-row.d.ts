import type { Components, JSX } from "../types/components";

interface ZaneRow extends Components.ZaneRow, HTMLElement {}
export const ZaneRow: {
    prototype: ZaneRow;
    new (): ZaneRow;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
