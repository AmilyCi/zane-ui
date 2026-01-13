import { isString } from "./is";
class ZaneJsError extends Error {
    constructor(m) {
        super(m);
        this.name = 'ZaneJsError';
    }
}
export function throwError(scope, m) {
    throw new ZaneJsError(`[${scope}] ${m}`);
}
export function debugWarn(scope, message) {
    const error = isString(scope)
        ? new ZaneJsError(`[${scope}] ${message}`)
        : scope;
    console.warn(error);
}
