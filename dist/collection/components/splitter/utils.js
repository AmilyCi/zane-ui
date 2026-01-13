import { isObject, isString } from "../../utils";
export function getCollapsible(collapsible) {
    if (collapsible && isObject(collapsible)) {
        return collapsible;
    }
    return {
        end: !!collapsible,
        start: !!collapsible,
    };
}
export function isCollapsible(panel, size, nextPanel, nextSize) {
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
export function isPct(itemSize) {
    return isString(itemSize) && itemSize.endsWith('%');
}
export function isPx(itemSize) {
    return isString(itemSize) && itemSize.endsWith('px');
}
export function getPx(str) {
    return Number(str.slice(0, -2));
}
export function getPct(str) {
    return Number(str.slice(0, -1)) / 100;
}
