import type { ZaneSplitterPanel } from './zane-splitter-panel';
export declare function getCollapsible(collapsible: boolean | {
    end?: boolean;
    start?: boolean;
}): {
    end?: boolean;
    start?: boolean;
};
export declare function isCollapsible(panel: null | undefined | ZaneSplitterPanel, size: number, nextPanel: null | undefined | ZaneSplitterPanel, nextSize: number): boolean;
export declare function isPct(itemSize: number | string | undefined): itemSize is string;
export declare function isPx(itemSize: number | string | undefined): itemSize is string;
export declare function getPx(str: string): number;
export declare function getPct(str: string): number;
