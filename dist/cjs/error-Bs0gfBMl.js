'use strict';

var isString = require('./isString-D2n3i_b0.js');

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
    const error = isString.isString(scope)
        ? new ZaneJsError(`[${scope}] ${message}`)
        : scope;
    console.warn(error);
}

exports.debugWarn = debugWarn;
exports.throwError = throwError;
