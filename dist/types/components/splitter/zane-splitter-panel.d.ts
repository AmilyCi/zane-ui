import type { EventEmitter } from '../../stencil-public-runtime';
import type { SplitterRootContext } from './splitter-context';
export declare class ZaneSplitterPanel {
    collapsible: boolean | {
        end?: boolean;
        start?: boolean;
    };
    el: HTMLElement;
    isResizable: boolean;
    max?: number | string;
    min?: number | string;
    panelSize: number;
    resizable: boolean;
    size: number | string;
    updateSizeEvent: EventEmitter<number>;
    uuid: string;
    get splitterContext(): SplitterRootContext;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    handleSizeChange(): void;
    render(): any;
    private onPercentSizesUpdate;
    private sizeToPx;
    private update;
}
