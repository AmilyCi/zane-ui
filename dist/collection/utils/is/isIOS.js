import { isClient } from "./isClient";
export const isIOS = /* #__PURE__ */ getIsIOS();
function getIsIOS() {
    var _a, _b;
    return (isClient &&
        ((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) &&
        (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) ||
            // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
            // https://github.com/vueuse/vueuse/issues/3577
            (((_b = window === null || window === void 0 ? void 0 : window.navigator) === null || _b === void 0 ? void 0 : _b.maxTouchPoints) > 2 &&
                /iPad|Macintosh/.test(window === null || window === void 0 ? void 0 : window.navigator.userAgent))));
}
