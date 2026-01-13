import type { RowContext } from '../interfaces';
export declare const RowJustify: readonly ["start", "center", "end", "space-around", "space-between", "space-evenly"];
export declare const RowAlign: readonly ["top", "middle", "bottom"];
export declare const rowContexts: WeakMap<HTMLElement, RowContext>;
