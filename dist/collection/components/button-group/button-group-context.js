export class ButtonGroupContext {
    constructor() {
        this._sizeChangeListeners = [];
        this._typeChangeListeners = [];
    }
    get size() {
        return this._size;
    }
    get type() {
        return this._type;
    }
    addSizeChangeListener(listener) {
        this._sizeChangeListeners.push(listener);
    }
    addTypeChangeListener(listener) {
        this._typeChangeListeners.push(listener);
    }
    removeSizeChangeListener(listener) {
        var _a, _b;
        const index = (_a = this._sizeChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
        if (index !== -1) {
            (_b = this._sizeChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
    }
    removeTypeChangeListener(listener) {
        var _a, _b;
        const index = (_a = this._typeChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
        if (index !== -1) {
            (_b = this._typeChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
    }
    updateSize(size) {
        var _a;
        this._size = size;
        (_a = this._sizeChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener());
    }
    updateType(type) {
        var _a;
        this._type = type;
        (_a = this._typeChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener());
    }
}
