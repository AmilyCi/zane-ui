import type { SplitterRootContext } from './splitter-context';
export declare class ZaneSplitterBar {
    el: HTMLElement;
    endCollapsible: boolean;
    startCollapsible: boolean;
    startPos: [x: number, y: number] | null;
    get index(): number;
    get resizable(): boolean;
    get splitterContext(): SplitterRootContext;
    componentDidLoad(): void;
    render(): any;
    private getEndCollapsible;
    private getStartCollapsible;
    private onCollapse;
    private onMousedown;
    private onMouseMove;
    private onMouseUp;
    private onTouchEnd;
    private onTouchMove;
    private onTouchStart;
    private renderEndIcon;
    private renderStartIcon;
}
