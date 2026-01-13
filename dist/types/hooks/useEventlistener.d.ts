export interface EventListenerOptions {
    capture?: boolean;
    enabled?: boolean;
    once?: boolean;
    passive?: boolean;
}
export type EventHandler<T = Event> = (event: T) => void;
export interface EventListenerController {
    disconnect: () => void;
    isConnected: boolean;
    reconnect: () => void;
}
/**
 * 增强版事件监听器，支持响应式目标和控制
 */
export declare function useEventListener<T extends EventTarget, K extends keyof HTMLElementEventMap>(target: (() => T) | null | T | undefined, eventType: K, handler: (event: HTMLElementEventMap[K]) => void, options?: EventListenerOptions): EventListenerController;
export declare function useEventListener<T extends EventTarget, E extends Event = Event>(target: (() => T) | null | T | undefined, eventType: string, handler: EventHandler<E>, options?: EventListenerOptions): EventListenerController;
