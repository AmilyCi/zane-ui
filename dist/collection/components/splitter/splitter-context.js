import { buildUUID, nextFrame } from "../../utils";
import { getPct, getPx, isPct, isPx } from "./utils";
export class SplitterRootContext {
    get containerSize() {
        var _a, _b, _c, _d;
        return this.layout === 'horizontal'
            ? ((_b = (_a = this.containerEl) === null || _a === void 0 ? void 0 : _a.offsetWidth) !== null && _b !== void 0 ? _b : 0)
            : ((_d = (_c = this.containerEl) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0);
    }
    get layout() {
        return this._layout;
    }
    set layout(val) {
        this._layout = val;
        this.updatePercentSizes();
    }
    get lazy() {
        return this._lazy;
    }
    set lazy(val) {
        this._lazy = val;
    }
    get lazyOffset() {
        return this._lazyOffset;
    }
    set lazyOffset(val) {
        var _a;
        if (this._lazyOffset !== val) {
            this._lazyOffset = val;
            (_a = this._lazyOffsetChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(val));
        }
    }
    get limitSizes() {
        return this.panels.map((item) => [item.min, item.max]);
    }
    get movingIndex() {
        return this._movingIndex;
    }
    set movingIndex(val) {
        var _a;
        if (this._movingIndex !== val) {
            this._movingIndex = val;
            (_a = this._movingIndexChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(val));
        }
    }
    get panels() {
        return this._panels;
    }
    get percentSizes() {
        return this._percentSizes;
    }
    set percentSizes(val) {
        var _a;
        this._percentSizes = val;
        (_a = this._percentSizesChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener());
    }
    get pxSizes() {
        return this._percentSizes.map((item) => this.ptg2px(item));
    }
    get uuid() {
        return this._uuid;
    }
    constructor() {
        this._cacheCollapsedSize = [];
        this._lazy = false;
        this._lazyOffset = 0;
        this._lazyOffsetChangeListeners = [];
        this._movingIndex = null;
        this._movingIndexChangeListeners = [];
        this._panels = [];
        this._percentSizes = [];
        this._percentSizesChangeListeners = [];
        this._planeIndexMap = new Map();
        this.addLazyOffsetChangeListener = (listener) => {
            this._lazyOffsetChangeListeners.push(listener);
        };
        this.addMovingIndexChangeListener = (listener) => {
            this._movingIndexChangeListeners.push(listener);
        };
        this.addPercentSizesChangeListener = (listener) => {
            this._percentSizesChangeListeners.push(listener);
        };
        this.clearPanel = () => {
            this._panels = [];
        };
        this.getPanelIndex = (el) => {
            return this._planeIndexMap.get(el);
        };
        this.onCollapse = (index, type) => {
            var _a;
            const currentSizes = this._percentSizes.map((item) => this.ptg2px(item));
            if (!this._cacheCollapsedSize.length) {
                this._cacheCollapsedSize.push(...currentSizes);
            }
            const currentIndex = type === 'start' ? index : index + 1;
            const targetIndex = type === 'start' ? index + 1 : index;
            const currentSize = currentSizes[currentIndex];
            const targetSize = currentSizes[targetIndex];
            if (currentSize !== 0 && targetSize !== 0) {
                currentSizes[currentIndex] = 0;
                currentSizes[targetIndex] += currentSize;
                this._cacheCollapsedSize[index] = currentSize;
            }
            else {
                const totalSize = currentSize + targetSize;
                const targetCacheCollapsedSize = this._cacheCollapsedSize[index];
                const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize;
                currentSizes[targetIndex] = targetCacheCollapsedSize;
                currentSizes[currentIndex] = currentCacheCollapsedSize;
            }
            this.panels.forEach((panel, index) => {
                panel.size = currentSizes[index];
            });
            (_a = this.onCollapseCallback) === null || _a === void 0 ? void 0 : _a.call(this, index, type);
            nextFrame(() => {
                this.updatePercentSizes();
            });
        };
        this.onMoveEnd = (index) => {
            if (this.lazy) {
                this._updatePanelSizes();
            }
            this.lazyOffset = 0;
            this.movingIndex = null;
            this._cachePxSizes = [];
            nextFrame(() => {
                var _a;
                (_a = this.onMoveEndCallback) === null || _a === void 0 ? void 0 : _a.call(this, index);
                this.updatePercentSizes();
            });
        };
        this.onMoveStart = (index) => {
            var _a;
            this.lazyOffset = 0;
            this.movingIndex = { confirmed: false, index };
            this._cachePxSizes = this._percentSizes.map((item) => this.ptg2px(item));
            (_a = this.onMoveStartCallback) === null || _a === void 0 ? void 0 : _a.call(this, index);
        };
        this.onMoving = (index, offset) => {
            var _a, _b, _c;
            let confirmedIndex = null;
            if ((!this.movingIndex || !this.movingIndex.confirmed) && offset !== 0) {
                if (offset > 0) {
                    confirmedIndex = index;
                    this.movingIndex = { confirmed: true, index };
                }
                else {
                    for (let i = index; i >= 0; i -= 1) {
                        if (this._cachePxSizes[i] > 0) {
                            confirmedIndex = i;
                            this.movingIndex = { confirmed: true, index: i };
                            break;
                        }
                    }
                }
            }
            const mergedIndex = (_b = confirmedIndex !== null && confirmedIndex !== void 0 ? confirmedIndex : (_a = this.movingIndex) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : index;
            const numSizes = [...this._cachePxSizes];
            const nextIndex = mergedIndex + 1;
            const startMinSize = this.getLimitSize(this.limitSizes[mergedIndex][0], 0);
            const endMinSize = this.getLimitSize(this.limitSizes[nextIndex][0], 0);
            const startMaxSize = this.getLimitSize(this.limitSizes[mergedIndex][1], this.containerSize || 0);
            const endMaxSize = this.getLimitSize(this.limitSizes[nextIndex][1], this.containerSize || 0);
            let mergedOffset = offset;
            if (numSizes[mergedIndex] + mergedOffset < startMinSize) {
                mergedOffset = startMinSize - numSizes[mergedIndex];
            }
            if (numSizes[nextIndex] - mergedOffset < endMinSize) {
                mergedOffset = numSizes[nextIndex] - endMinSize;
            }
            if (numSizes[mergedIndex] + mergedOffset > startMaxSize) {
                mergedOffset = startMaxSize - numSizes[mergedIndex];
            }
            if (numSizes[nextIndex] - mergedOffset > endMaxSize) {
                mergedOffset = numSizes[nextIndex] - endMaxSize;
            }
            numSizes[mergedIndex] += mergedOffset;
            numSizes[nextIndex] -= mergedOffset;
            this.lazyOffset = mergedOffset;
            this._updatePanelSizes = () => {
                this.panels.forEach((panel, index) => {
                    panel.size = numSizes[index];
                });
                this._updatePanelSizes = () => { };
            };
            if (this.lazy) {
                (_c = this.onMovingCallback) === null || _c === void 0 ? void 0 : _c.call(this, index);
            }
            else {
                this._updatePanelSizes();
            }
        };
        this.registerPanel = (panel) => {
            this._panels.push(panel);
            this.sortPanels();
            this._planeIndexMap.clear();
            this._panels.forEach((panel, index) => {
                this._planeIndexMap.set(panel.el, index);
            });
            this.updatePercentSizes();
        };
        this.removeLazyOffsetChangeListener = (listener) => {
            var _a, _b;
            const index = (_a = this._lazyOffsetChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
            if (index !== -1) {
                (_b = this._lazyOffsetChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
            }
        };
        this.removeMovingIndexChangeListener = (listener) => {
            var _a, _b;
            const index = (_a = this._movingIndexChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
            if (index !== -1) {
                (_b = this._movingIndexChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
            }
        };
        this.removePercentSizesChangeListener = (listener) => {
            var _a, _b;
            const index = (_a = this._percentSizesChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
            if (index !== -1) {
                (_b = this._percentSizesChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
            }
        };
        this.sortPanels = () => {
            const uuidOrder = Array.from(this.containerEl.children)
                .filter((item) => item.tagName === 'ZANE-SPLITTER-PANEL')
                .map((item) => item.uuid);
            const uuidIndexMap = new Map();
            uuidOrder.forEach((uuid, index) => {
                uuidIndexMap.set(uuid, index);
            });
            // 使用稳定的排序算法
            this._panels.sort((a, b) => {
                const indexA = uuidIndexMap.get(a.uuid);
                const indexB = uuidIndexMap.get(b.uuid);
                // 如果两个UUID都在顺序列表中，按顺序排序
                if (indexA !== undefined && indexB !== undefined) {
                    return indexA - indexB;
                }
                // 如果只有a在顺序列表中，a排在前面
                if (indexA !== undefined) {
                    return -1;
                }
                // 如果只有b在顺序列表中，b排在前面
                if (indexB !== undefined) {
                    return 1;
                }
                // 如果两个都不在顺序列表中，保持原顺序
                return 0;
            });
        };
        this.unregisterPanel = (panel) => {
            this._panels.splice(this._panels.indexOf(panel), 1);
            this._planeIndexMap.clear();
            this._panels.forEach((panel, index) => {
                this._planeIndexMap.set(panel.el, index);
            });
            this.updatePercentSizes();
        };
        this._updatePanelSizes = () => { };
        this.getLimitSize = (str, defaultLimit) => {
            if (isPct(str)) {
                return this.ptg2px(getPct(str));
            }
            else if (isPx(str)) {
                return getPx(str);
            }
            return str !== null && str !== void 0 ? str : defaultLimit;
        };
        this.ptg2px = (ptg) => {
            return ptg * this.containerSize;
        };
        this.updatePercentSizes = () => {
            var _a;
            let ptgList = [];
            let emptyCount = 0;
            for (let i = 0; i < this.panels.length; i += 1) {
                const itemSize = (_a = this.panels[i]) === null || _a === void 0 ? void 0 : _a.size;
                if (isPct(itemSize)) {
                    ptgList[i] = getPct(itemSize);
                }
                else if (isPx(itemSize)) {
                    ptgList[i] = getPx(itemSize) / this.containerSize;
                }
                else if (itemSize || itemSize === 0) {
                    const num = Number(itemSize);
                    if (!Number.isNaN(num)) {
                        ptgList[i] = num / this.containerSize;
                    }
                }
                else {
                    emptyCount += 1;
                    ptgList[i] = undefined;
                }
            }
            const totalPtg = ptgList.reduce((acc, ptg) => acc + (ptg || 0), 0);
            if (totalPtg > 1 || !emptyCount) {
                // If it is greater than 1, the scaling ratio
                const scale = 1 / totalPtg;
                ptgList = ptgList.map((ptg) => (ptg === undefined ? 0 : ptg * scale));
            }
            else {
                // If it is less than 1, the filling ratio
                const avgRest = (1 - totalPtg) / emptyCount;
                ptgList = ptgList.map((ptg) => (ptg === undefined ? avgRest : ptg));
            }
            this.percentSizes = ptgList;
        };
        this._uuid = buildUUID();
    }
}
