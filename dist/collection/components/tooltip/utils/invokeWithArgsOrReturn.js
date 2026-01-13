export function invokeWithArgsOrReturn(value, args) {
    return typeof value === 'function' ? value(...args) : value;
}
