import type { Components, JSX } from "../types/components";

interface ZaneCascader extends Components.ZaneCascader, HTMLElement {}
export const ZaneCascader: {
    prototype: ZaneCascader;
    new (): ZaneCascader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
