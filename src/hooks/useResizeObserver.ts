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
export function createResizeObserver(
  callback: ResizeCallback,
): ResizeObserverController {
  let observer: null | ResizeObserver = null;
  const observedElements: Set<Element> = new Set();

  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(callback);
  }

  return {
    disconnect() {
      if (observer) {
        observer.disconnect();
        observedElements.clear();
        this.isObserving = false;
      }
    },
    isObserving: false,

    observe(element: Element) {
      if (observer && element && !observedElements.has(element)) {
        observer.observe(element);
        observedElements.add(element);
        this.isObserving = true;
      }
    },

    observer,

    unobserve(element: Element) {
      if (observer && element && observedElements.has(element)) {
        observer.unobserve(element);
        observedElements.delete(element);
        if (observedElements.size === 0) {
          this.isObserving = false;
        }
      }
    },
  };
}

export function useResizeObserver(
  element: HTMLElement | null | undefined,
  callback: (entry: ResizeObserverEntry) => void,
): () => void {
  if (!element || typeof ResizeObserver === 'undefined') {
    return () => {};
  }

  const controller = createResizeObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry);
    });
  });

  controller.observe(element);

  // 返回清理函数
  return () => {
    controller.disconnect();
  };
}
