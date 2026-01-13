import type { PopperContext } from '../interfaces';
import type { PopperContentContext } from '../interfaces/PopperContentContext';
export declare const effects: readonly ["light", "dark"];
export declare const triggers: readonly ["click", "contextmenu", "hover", "focus"];
export declare const roleTypes: readonly ["dialog", "grid", "group", "listbox", "menu", "navigation", "tooltip", "tree"];
export declare const popperContexts: WeakMap<HTMLElement, PopperContext>;
export declare const popperContentContexts: WeakMap<HTMLElement, PopperContentContext>;
