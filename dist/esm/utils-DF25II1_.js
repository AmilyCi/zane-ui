import { i as isObject } from './isObject-Ji6uxU-v.js';
import { i as isString } from './isString-DaEH0FEg.js';
import './uuid-BZTOj-_U.js';

const splitterRootContexts = new WeakMap();

function getCollapsible(collapsible) {
    if (collapsible && isObject(collapsible)) {
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
    return isString(itemSize) && itemSize.endsWith('%');
}
function isPx(itemSize) {
    return isString(itemSize) && itemSize.endsWith('px');
}
function getPx(str) {
    return Number(str.slice(0, -2));
}
function getPct(str) {
    return Number(str.slice(0, -1)) / 100;
}

export { isPct as a, isPx as b, getPx as c, getPct as g, isCollapsible as i, splitterRootContexts as s };
