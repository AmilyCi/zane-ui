export type Target = HTMLElement | (() => HTMLElement | null) | string;

export interface UseMutationObserverReturn {
  /** 启动观察（如果尚未启动） */
  start: () => void;
  /** 停止观察并断开连接 */
  stop: () => void;
  /** 获取尚未传递给回调的变更记录并清空队列 */
  takeRecords: () => MutationRecord[];
  /** 当前观察是否已启动 */
  isActive: boolean;
}

/**
 * 在 Stencil 组件中管理 MutationObserver 的工具函数
 * @param target     要观察的目标元素：可以是元素、返回元素的函数或 CSS 选择器
 * @param options    MutationObserver 选项（attributes, childList, subtree 等）
 * @param callback   每次发生变更时触发的回调
 * @param contextEl  可选，当 target 是选择器时用于限定查询范围的根元素（例如 this.el）
 */
export function useMutationObserver(
  target: Target,
  options: MutationObserverInit = {},
  callback?: (mutations: MutationRecord[]) => void,
  contextEl?: HTMLElement
): UseMutationObserverReturn {
  let observer: MutationObserver | null = null;
  let targetEl: HTMLElement | null = null;
  let isActive = false;

  const getTargetElement = (): HTMLElement | null => {
    if (typeof target === 'function') {
      return target();
    }
    if (typeof target === 'string') {
      // 如果提供了上下文元素，优先在其内部查询（处理 Shadow DOM）
      const root = contextEl?.shadowRoot || contextEl || document;
      return root.querySelector(target);
    }
    return target;
  };

  const start = () => {
    if (observer) {
      // 如果已经观察同一个元素且配置相同，可以复用，但这里简单起见先停止再重启
      stop();
    }

    targetEl = getTargetElement();
    if (!targetEl) {
      console.warn('[useMutationObserver] Target element not found');
      return;
    }

    observer = new MutationObserver((records) => {
      if (callback) {
        callback(records);
      }
    });

    observer.observe(targetEl, options);
    isActive = true;
  };

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    isActive = false;
  };

  const takeRecords = () => {
    return observer ? observer.takeRecords() : [];
  };

  return {
    start,
    stop,
    takeRecords,
    get isActive() { return isActive; },
  };
}
