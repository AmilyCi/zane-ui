import type { Components, JSX } from "../types/components";

interface ZaneFocusTrap extends Components.ZaneFocusTrap, HTMLElement {}
export const ZaneFocusTrap: {
    prototype: ZaneFocusTrap;
    new (): ZaneFocusTrap;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
