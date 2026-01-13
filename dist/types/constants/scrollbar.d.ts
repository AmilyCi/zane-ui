import type { ScrollbarContext } from '../interfaces/ScrollbarContext';
export declare const GAP = 4;
export declare const BAR_MAP: {
    readonly horizontal: {
        readonly axis: "X";
        readonly client: "clientX";
        readonly direction: "left";
        readonly key: "horizontal";
        readonly offset: "offsetWidth";
        readonly scroll: "scrollLeft";
        readonly scrollSize: "scrollWidth";
        readonly size: "width";
    };
    readonly vertical: {
        readonly axis: "Y";
        readonly client: "clientY";
        readonly direction: "top";
        readonly key: "vertical";
        readonly offset: "offsetHeight";
        readonly scroll: "scrollTop";
        readonly scrollSize: "scrollHeight";
        readonly size: "height";
    };
};
export declare const scrollbarContexts: WeakMap<HTMLElement, ScrollbarContext>;
