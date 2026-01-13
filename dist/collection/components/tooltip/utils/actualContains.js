export function actualContains(parent, child) {
    var _a, _b;
    let target = child;
    while (target) {
        if (parent.contains(target)) {
            return true;
        }
        target = (_b = (_a = target.getRootNode) === null || _a === void 0 ? void 0 : _a.call(target)) === null || _b === void 0 ? void 0 : _b.host;
    }
    return false;
}
