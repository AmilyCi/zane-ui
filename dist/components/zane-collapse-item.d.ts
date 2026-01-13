import type { Components, JSX } from "../types/components";

interface ZaneCollapseItem extends Components.ZaneCollapseItem, HTMLElement {}
export const ZaneCollapseItem: {
    prototype: ZaneCollapseItem;
    new (): ZaneCollapseItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
