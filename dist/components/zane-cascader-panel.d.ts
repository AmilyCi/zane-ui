import type { Components, JSX } from "../types/components";

interface ZaneCascaderPanel extends Components.ZaneCascaderPanel, HTMLElement {}
export const ZaneCascaderPanel: {
    prototype: ZaneCascaderPanel;
    new (): ZaneCascaderPanel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
