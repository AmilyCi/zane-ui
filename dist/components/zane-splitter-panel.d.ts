import type { Components, JSX } from "../types/components";

interface ZaneSplitterPanel extends Components.ZaneSplitterPanel, HTMLElement {}
export const ZaneSplitterPanel: {
    prototype: ZaneSplitterPanel;
    new (): ZaneSplitterPanel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
