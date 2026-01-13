export function useEventListener(target, eventType, handler, options = {}) {
    const { capture = false, enabled = true, once = false, passive = false, } = options;
    let isConnected = false;
    let currentTarget = null;
    const connect = () => {
        if (isConnected)
            return;
        const resolvedTarget = typeof target === 'function' ? target() : target;
        if (!resolvedTarget || !enabled) {
            return;
        }
        currentTarget = resolvedTarget;
        const eventOptions = { capture, once, passive };
        resolvedTarget.addEventListener(eventType, handler, eventOptions);
        isConnected = true;
    };
    const disconnect = () => {
        if (!isConnected || !currentTarget)
            return;
        const eventOptions = { capture, once, passive };
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
