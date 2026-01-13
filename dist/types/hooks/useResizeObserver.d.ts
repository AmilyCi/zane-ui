export interface ResizeObserverEntry {
    contentRect: DOMRectReadOnly;
    target: Element;
}
export type ResizeCallback = (entries: ResizeObserverEntry[]) => void;
export interface ResizeObserverController {
    disconnect: () => void;
    isObserving: boolean;
    observe: (element: Element) => void;
    observer: null | ResizeObserver;
    unobserve: (element: Element) => void;
}
/**
 * 创建 ResizeObserver 控制器
 */
export declare function createResizeObserver(callback: ResizeCallback): ResizeObserverController;
export declare function useResizeObserver(element: HTMLElement | null | undefined, callback: (entry: ResizeObserverEntry) => void): () => void;
