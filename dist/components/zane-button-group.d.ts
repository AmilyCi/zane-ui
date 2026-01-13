import type { Components, JSX } from "../types/components";

interface ZaneButtonGroup extends Components.ZaneButtonGroup, HTMLElement {}
export const ZaneButtonGroup: {
    prototype: ZaneButtonGroup;
    new (): ZaneButtonGroup;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
