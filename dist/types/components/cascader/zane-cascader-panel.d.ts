import type { CascaderNode } from './node';
export declare class ZaneCascaderPanel {
    checkedNodes: CascaderNode[];
    clearCheckedNodes(): Promise<void>;
    render(): any;
    scrollToExpandingNode(): Promise<void>;
}
