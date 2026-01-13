import { tryOnScopeDispose } from "../utils";
export function useTimeout(component) {
    let timeoutHandle;
    const registerTimeout = (fn, delay) => {
        cancelTimeout();
        timeoutHandle = window.setTimeout(fn, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose(component, () => cancelTimeout());
    return {
        cancelTimeout,
        registerTimeout,
    };
}
