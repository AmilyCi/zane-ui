import type { Components, JSX } from "../types/components";

interface ZaneAutocomplete extends Components.ZaneAutocomplete, HTMLElement {}
export const ZaneAutocomplete: {
    prototype: ZaneAutocomplete;
    new (): ZaneAutocomplete;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
