import type { Components, JSX } from "../types/components";

interface ZaneInput extends Components.ZaneInput, HTMLElement {}
export const ZaneInput: {
    prototype: ZaneInput;
    new (): ZaneInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
