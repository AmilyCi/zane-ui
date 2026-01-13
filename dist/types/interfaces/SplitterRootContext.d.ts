import type { ZaneSplitterPanel } from '../components/splitter/zane-splitter-panel';
export interface SplitterRootContext {
    containerEl: HTMLElement;
    get containerSize(): any;
    getPanelIndex(el: HTMLElement): number;
    get layout(): any;
    get lazy(): any;
    get lazyOffset(): number;
    set lazyOffset(val: number);
    get movingIndex(): {
        confirmed: boolean;
        index: number;
    };
    set movingIndex(val: {
        confirmed: boolean;
        index: number;
    });
    onCollapse(index: number, type: 'end' | 'start'): any;
    onCollapseCallback: (index: number, type: 'end' | 'start') => void;
    onMoveEnd(index: number): any;
    onMoveEndCallback: (index: number) => void;
    onMoveStart(index: number): any;
    onMoveStartCallback: (index: number) => void;
    onMoving(index: number, offset: number): any;
    onMovingCallback: (index: number) => void;
    get pxSizes(): any;
    registerPanel(panel: ZaneSplitterPanel): any;
    unregisterPanel(panel: ZaneSplitterPanel): any;
}
