import type { Components, JSX } from "../types/components";

interface ZaneForm extends Components.ZaneForm, HTMLElement {}
export const ZaneForm: {
    prototype: ZaneForm;
    new (): ZaneForm;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
