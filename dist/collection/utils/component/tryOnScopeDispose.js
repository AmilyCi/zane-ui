const cleanupMap = new WeakMap();
/**
 * 尝试在组件的销毁回调中注册清理函数。
 *
 * @param {ComponentInterface} component - 要操作的组件对象。
 * @param {CleanupFunction} fn - 需要在组件销毁时执行的清理函数。
 * @returns {boolean} 如果成功注册清理函数返回true，否则返回false。
 */
export function tryOnScopeDispose(component, fn) {
    if (!component) {
        return false;
    }
    if (!cleanupMap.has(component)) {
        cleanupMap.set(component, []);
        const originalDisconnected = component.disconnectedCallback;
        component.disconnectedCallback = function () {
            const cleanups = cleanupMap.get(component);
            if (cleanups) {
                cleanups.forEach((cleanup) => cleanup());
                cleanupMap.delete(component);
            }
            originalDisconnected === null || originalDisconnected === void 0 ? void 0 : originalDisconnected.call(component);
        };
    }
    const cleanups = cleanupMap.get(component);
    cleanups.push(fn);
    return true;
}
