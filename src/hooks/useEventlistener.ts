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
export function useEventListener<
  T extends EventTarget,
  K extends keyof HTMLElementEventMap,
>(
  target: (() => T) | null | T | undefined,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: EventListenerOptions,
): EventListenerController;

export function useEventListener<
  T extends EventTarget,
  E extends Event = Event,
>(
  target: (() => T) | null | T | undefined,
  eventType: string,
  handler: EventHandler<E>,
  options?: EventListenerOptions,
): EventListenerController;

export function useEventListener(
  target: (() => EventTarget) | EventTarget | null | undefined,
  eventType: string,
  handler: EventHandler,
  options: EventListenerOptions = {},
): EventListenerController {
  const {
    capture = false,
    enabled = true,
    once = false,
    passive = false,
  } = options;

  let isConnected = false;
  let currentTarget: EventTarget | null = null;

  const connect = () => {
    if (isConnected) return;

    const resolvedTarget = typeof target === 'function' ? target() : target;

    if (!resolvedTarget || !enabled) {
      return;
    }

    currentTarget = resolvedTarget;
    const eventOptions: AddEventListenerOptions = { capture, once, passive };

    resolvedTarget.addEventListener(eventType, handler, eventOptions);
    isConnected = true;
  };

  const disconnect = () => {
    if (!isConnected || !currentTarget) return;

    const eventOptions: AddEventListenerOptions = { capture, once, passive };
    currentTarget.removeEventListener(eventType, handler, eventOptions);

    isConnected = false;
    currentTarget = null;
  };

  const reconnect = () => {
    disconnect();
    connect();
  };

  // 初始连接
  if (enabled) {
    connect();
  }

  return {
    disconnect,
    get isConnected() {
      return isConnected;
    },
    reconnect,
  };
}
