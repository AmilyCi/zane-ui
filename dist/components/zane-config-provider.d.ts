import type { Components, JSX } from "../types/components";

interface ZaneConfigProvider extends Components.ZaneConfigProvider, HTMLElement {}
export const ZaneConfigProvider: {
    prototype: ZaneConfigProvider;
    new (): ZaneConfigProvider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
