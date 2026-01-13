import { i as isString } from './isString-DaEH0FEg.js';

class ZaneJsError extends Error {
    constructor(m) {
        super(m);
        this.name = 'ZaneJsError';
    }
}
function throwError(scope, m) {
    throw new ZaneJsError(`[${scope}] ${m}`);
}
function debugWarn(scope, message) {
    const error = isString(scope)
        ? new ZaneJsError(`[${scope}] ${message}`)
        : scope;
    console.warn(error);
}

export { debugWarn as d, throwError as t };
