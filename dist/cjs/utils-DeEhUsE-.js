'use strict';

var isObject = require('./isObject-EfaeaXJ_.js');
var isString = require('./isString-D2n3i_b0.js');
require('./uuid-avdvDRhA.js');

const splitterRootContexts = new WeakMap();

function getCollapsible(collapsible) {
    if (collapsible && isObject.isObject(collapsible)) {
        return collapsible;
    }
    return {
        end: !!collapsible,
        start: !!collapsible,
    };
}
function isCollapsible(panel, size, nextPanel, nextSize) {
    if (getCollapsible(panel === null || panel === void 0 ? void 0 : panel.collapsible).end && size > 0) {
        return true;
    }
    if (getCollapsible(nextPanel === null || nextPanel === void 0 ? void 0 : nextPanel.collapsible).start &&
        nextSize === 0 &&
        size > 0) {
        return true;
    }
    return false;
}
function isPct(itemSize) {
    return isString.isString(itemSize) && itemSize.endsWith('%');
}
function isPx(itemSize) {
    return isString.isString(itemSize) && itemSize.endsWith('px');
}
function getPx(str) {
    return Number(str.slice(0, -2));
}
function getPct(str) {
    return Number(str.slice(0, -1)) / 100;
}

exports.getPct = getPct;
exports.getPx = getPx;
exports.isCollapsible = isCollapsible;
exports.isPct = isPct;
exports.isPx = isPx;
exports.splitterRootContexts = splitterRootContexts;
