import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { a as isPct, g as getPct, b as isPx, c as getPx, s as splitterRootContexts } from './utils-DF25II1_.js';
import { b as buildUUID } from './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import { n as nextFrame } from './nextFrame-BGGLuZuD.js';
import './isObject-Ji6uxU-v.js';
import './isString-DaEH0FEg.js';
import './toObjectString-D4ItlKpz.js';

class SplitterRootContext {
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

const zaneSplitterCss = () => `.zane-splitter{position:relative;display:flex;height:100%;width:100%;margin:0;padding:0}.zane-splitter .zane-splitter__mask{position:absolute;z-index:999;left:0;right:0;top:0;bottom:0}.zane-splitter .zane-splitter__mask-horizontal{cursor:ew-resize}.zane-splitter .zane-splitter__mask-vertical{cursor:ns-resize}.zane-splitter.zane-splitter__horizontal{flex-direction:row}.zane-splitter.zane-splitter__vertical{flex-direction:column}.zane-splitter-bar{flex:none;position:relative;user-select:none}.zane-splitter-bar .zane-splitter-bar__dragger{z-index:1;position:absolute;background:transparent;top:50%;left:50%;transform:translate(-50%, -50%)}.zane-splitter-bar .zane-splitter-bar__dragger::before,.zane-splitter-bar .zane-splitter-bar__dragger::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background-color:var(--zane-border-color-light)}.zane-splitter-bar .zane-splitter-bar__dragger:not(.is-lazy)::after{display:none}.zane-splitter-bar .zane-splitter-bar__dragger::after{opacity:0.4}.zane-splitter-bar .zane-splitter-bar__dragger:hover:not(.is-disabled)::before{background-color:var(--zane-color-primary-light-5)}.zane-splitter-bar .zane-splitter-bar__dragger-horizontal::before,.zane-splitter-bar .zane-splitter-bar__dragger-horizontal::after{height:100%;width:2px}.zane-splitter-bar .zane-splitter-bar__dragger-vertical::before,.zane-splitter-bar .zane-splitter-bar__dragger-vertical::after{height:2px;width:100%}.zane-splitter-bar .zane-splitter-bar__dragger-active::before,.zane-splitter-bar .zane-splitter-bar__dragger-active::after{background-color:var(--zane-color-primary-light-3)}.zane-splitter-bar .zane-splitter-bar__dragger-active.zane-splitter-bar__dragger-horizontal::after{transform:translate(calc(-50% + var(--zane-splitter-bar-offset)), -50%)}.zane-splitter-bar .zane-splitter-bar__dragger-active.zane-splitter-bar__dragger-vertical::after{transform:translate(-50%, calc(-50% + var(--zane-splitter-bar-offset)))}.zane-splitter-bar:hover .zane-splitter-bar__collapse-icon{opacity:1}.zane-splitter-bar .zane-splitter-bar__collapse-icon{display:flex;align-items:center;justify-content:center;position:absolute;background:var(--zane-border-color-light);border-radius:2px;cursor:pointer;opacity:0;z-index:9}.zane-splitter-bar .zane-splitter-bar__collapse-icon:hover{opacity:1;background-color:var(--zane-color-primary-light-5)}.zane-splitter-bar .zane-splitter-bar__horizontal-collapse-icon-start{left:-12px;top:50%;height:24px;width:16px;transform:translate(-50%, -50%)}.zane-splitter-bar .zane-splitter-bar__horizontal-collapse-icon-end{left:12px;top:50%;height:24px;width:16px;transform:translate(-50%, -50%)}.zane-splitter-bar .zane-splitter-bar__vertical-collapse-icon-start{top:-12px;right:50%;height:16px;width:24px;transform:translate(50%, -50%)}.zane-splitter-bar .zane-splitter-bar__vertical-collapse-icon-end{top:12px;right:50%;height:16px;width:24px;transform:translate(50%, -50%)}`;

const ns = useNamespace('splitter');
const ZaneSplitter = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.collapseEvent = createEvent(this, "collapse", 7);
        this.resizeEndEvent = createEvent(this, "zResizeEnd", 7);
        this.resizeEvent = createEvent(this, "zResize", 7);
        this.resizeStartEvent = createEvent(this, "zResizeStart", 7);
        this.layout = 'horizontal';
        this.lazy = false;
        this.lazyOffset = 0;
        this.movingIndex = null;
        this.lazyOffsetUpdate = (val) => {
            this.lazyOffset = val;
        };
        this.movingIndexUpdate = (val) => {
            this.movingIndex = val;
        };
    }
    componentDidLoad() { }
    componentWillLoad() {
        this.rootContext = new SplitterRootContext();
        this.rootContext.containerEl = this.el;
        this.rootContext.layout = this.layout;
        this.rootContext.lazy = this.lazy;
        this.rootContext.onMoveStartCallback = (index) => {
            this.resizeStartEvent.emit({
                index,
            });
        };
        this.rootContext.onMovingCallback = (index) => {
            this.resizeEvent.emit({
                index,
            });
        };
        this.rootContext.onMoveEndCallback = (index) => {
            this.resizeEndEvent.emit({
                index,
            });
        };
        this.rootContext.onCollapseCallback = (index, type) => {
            this.collapseEvent.emit({
                index,
                type,
            });
        };
        this.rootContext.addLazyOffsetChangeListener(this.lazyOffsetUpdate);
        this.rootContext.addMovingIndexChangeListener(this.movingIndexUpdate);
        // console.log(this.rootContext.uuid);
        splitterRootContexts.set(this.el, this.rootContext);
    }
    disconnectedCallback() {
        this.rootContext = null;
        splitterRootContexts.delete(this.el);
    }
    handleLayoutChange() {
        this.rootContext.layout = this.layout;
    }
    handleLazyChange() {
        this.rootContext.lazy = this.lazy;
        if (this.lazyOffset) {
            const mouseup = new MouseEvent('mouseup', { bubbles: true });
            window.dispatchEvent(mouseup);
        }
    }
    render() {
        const splitterStyles = {
            [ns.cssVarBlockName('bar-offset')]: this.lazy
                ? `${this.lazyOffset}px`
                : undefined,
        };
        return (h(Host, { key: '75149a66180b5169fc8f622dfe00d23071eee1ae', class: [ns.b(), ns.e(this.layout)].join(' '), style: splitterStyles }, h("slot", { key: 'd5876da316acb62a7686e11871643809eb28e582' }), this.movingIndex && (h("div", { key: 'd904b16e57318ec41807b1ca89c09f6cc122c811', class: [ns.e('mask'), ns.e(`mask-${this.layout}`)].join(' ') }))));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "layout": [{
                "handleLayoutChange": 0
            }],
        "lazy": [{
                "handleLazyChange": 0
            }]
    }; }
};
ZaneSplitter.style = zaneSplitterCss();

export { ZaneSplitter as zane_splitter };
