/**
 * 创建 ResizeObserver 控制器
 */
export function createResizeObserver(callback) {
    let observer = null;
    const observedElements = new Set();
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
        observe(element) {
            if (observer && element && !observedElements.has(element)) {
                observer.observe(element);
                observedElements.add(element);
                this.isObserving = true;
            }
        },
        observer,
        unobserve(element) {
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
export function useResizeObserver(element, callback) {
    if (!element || typeof ResizeObserver === 'undefined') {
        return () => { };
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
