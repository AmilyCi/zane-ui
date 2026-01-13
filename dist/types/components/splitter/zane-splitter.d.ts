import type { EventEmitter } from '../../stencil-public-runtime';
export declare class ZaneSplitter {
    collapseEvent: EventEmitter<{
        index: number;
        type: 'end' | 'start';
    }>;
    el: HTMLElement;
    layout: 'horizontal' | 'vertical';
    lazy: boolean;
    lazyOffset: number;
    movingIndex: {
        confirmed: boolean;
        index: number;
    };
    resizeEndEvent: EventEmitter<{
        index: number;
    }>;
    resizeEvent: EventEmitter<{
        index: number;
    }>;
    resizeStartEvent: EventEmitter<{
        index: number;
    }>;
    private rootContext;
    componentDidLoad(): void;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    handleLayoutChange(): void;
    handleLazyChange(): void;
    render(): any;
    private lazyOffsetUpdate;
    private movingIndexUpdate;
}
