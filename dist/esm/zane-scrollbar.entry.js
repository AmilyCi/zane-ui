import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { s as scrollbarContexts } from './scrollbar-BkQhOBil.js';
import { n as nextFrame } from './nextFrame-BGGLuZuD.js';
import { i as isNumber } from './isNumber-Bq5rOKx7.js';
import { a as addUnit } from './addUnit-eWRTywfV.js';
import { n as normalizeStyle } from './normalizeStyle-CuhDUa4W.js';
import { d as debugWarn } from './error-DAO_9P5C.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import './toObjectString-D4ItlKpz.js';
import './isString-DaEH0FEg.js';

function useEventListener(target, eventType, handler, options = {}) {
    const { capture = false, enabled = true, once = false, passive = false, } = options;
    let isConnected = false;
    let currentTarget = null;
    const connect = () => {
        if (isConnected)
            return;
        const resolvedTarget = typeof target === 'function' ? target() : target;
        if (!resolvedTarget || !enabled) {
            return;
        }
        currentTarget = resolvedTarget;
        const eventOptions = { capture, once, passive };
        resolvedTarget.addEventListener(eventType, handler, eventOptions);
        isConnected = true;
    };
    const disconnect = () => {
        if (!isConnected || !currentTarget)
            return;
        const eventOptions = { capture, once, passive };
        currentTarget.removeEventListener(eventType, handler, eventOptions);
        isConnected = false;
        currentTarget = null;
    };
    const reconnect = () => {
        disconnect();
        connect();
    };
    // 初始连接
    if (enabled) {
        connect();
    }
    return {
        disconnect,
        get isConnected() {
            return isConnected;
        },
        reconnect,
    };
}

/**
 * 创建 ResizeObserver 控制器
 */
function createResizeObserver(callback) {
    let observer = null;
    const observedElements = new Set();
    if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(callback);
    }
    return {
        disconnect() {
            if (observer) {
                observer.disconnect();
                observedElements.clear();
                this.isObserving = false;
            }
        },
        isObserving: false,
        observe(element) {
            if (observer && element && !observedElements.has(element)) {
                observer.observe(element);
                observedElements.add(element);
                this.isObserving = true;
            }
        },
        observer,
        unobserve(element) {
            if (observer && element && observedElements.has(element)) {
                observer.unobserve(element);
                observedElements.delete(element);
                if (observedElements.size === 0) {
                    this.isObserving = false;
                }
            }
        },
    };
}
function useResizeObserver(element, callback) {
    if (!element || typeof ResizeObserver === 'undefined') {
        return () => { };
    }
    const controller = createResizeObserver((entries) => {
        entries.forEach((entry) => {
            callback(entry);
        });
    });
    controller.observe(element);
    // 返回清理函数
    return () => {
        controller.disconnect();
    };
}

class ScrollbarContext {
}

const zaneScrollbarCss = () => `.zane-scrollbar{--zane-scrollbar-opacity:0.3;--zane-scrollbar-bg-color:var(--zane-text-color-secondary);--zane-scrollbar-hover-opacity:0.5;--zane-scrollbar-hover-bg-color:var(--zane-text-color-secondary)}.zane-scrollbar{display:block;overflow:hidden;position:relative;height:100%}.zane-scrollbar .zane-scrollbar__wrap{overflow:auto;height:100%}.zane-scrollbar .zane-scrollbar__wrap--hidden-default{scrollbar-width:none}.zane-scrollbar .zane-scrollbar__wrap--hidden-default::-webkit-scrollbar{display:none}.zane-scrollbar .zane-scrollbar__thumb{position:relative;display:block;width:0;height:0;cursor:pointer;border-radius:inherit;background-color:var(--zane-scrollbar-bg-color, var(--zane-text-color-secondary));transition:var(--zane-transition-duration) background-color;opacity:var(--zane-scrollbar-opacity, 0.3)}.zane-scrollbar .zane-scrollbar__thumb:hover{background-color:var(--zane-scrollbar-hover-bg-color, var(--zane-text-color-secondary));opacity:var(--zane-scrollbar-hover-opacity, 0.5)}.zane-scrollbar .zane-scrollbar__bar{position:absolute;right:2px;bottom:2px;z-index:1;border-radius:4px}.zane-scrollbar .zane-scrollbar__bar.is-vertical{width:6px;top:2px}.zane-scrollbar .zane-scrollbar__bar.is-vertical>div{width:100%}.zane-scrollbar .zane-scrollbar__bar.is-horizontal{height:6px;left:2px}.zane-scrollbar .zane-scrollbar__bar.is-horizontal>div{height:100%}.zane-scrollbar-fade-enter-active{transition:opacity 340ms ease-out}.zane-scrollbar-fade-leave-active{transition:opacity 120ms ease-out}.zane-scrollbar-fade-enter-from,.zane-scrollbar-fade-leave-active{opacity:0}`;

const ns = useNamespace('scrollbar');
const COMPONENT_NAME = 'zane-scrollbar';
const DIRECTION_PAIRS = {
    bottom: 'top',
    left: 'right',
    right: 'left',
    top: 'bottom',
};
const ZaneScrollbar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.endReachedEvent = createEvent(this, "end-reached", 7);
        this.scrollEvent = createEvent(this, "zScroll", 7);
        this.distance = 0;
        this.distanceScrollState = {
            bottom: false,
            left: false,
            right: false,
            top: false,
        };
        this.height = '';
        this.maxHeight = '';
        this.minSize = 20;
        this.tag = 'div';
        this.viewClass = '';
        this.viewStyle = {};
        this.wrapClass = '';
        this.wrapStyle = {};
        this.context = new ScrollbarContext();
        this.direction = 'right';
        this.stopResizeListener = undefined;
        this.stopResizeObserver = undefined;
        this.stopWrapResizeObserver = undefined;
        this.wrapScrollLeft = 0;
        this.wrapScrollTop = 0;
        this.onScrollHandler = () => {
            this.handleScroll();
        };
        this.onSizeChangeHandler = () => {
            this.update();
        };
        this.shouldSkipDirection = (direction) => {
            var _a;
            return (_a = this.distanceScrollState[direction]) !== null && _a !== void 0 ? _a : false;
        };
        this.updateTriggerStatus = (arrivedStates) => {
            const oppositeDirection = DIRECTION_PAIRS[this.direction];
            if (!oppositeDirection)
                return;
            const arrived = arrivedStates[this.direction];
            const oppositeArrived = arrivedStates[oppositeDirection];
            if (arrived && !this.distanceScrollState[this.direction]) {
                this.distanceScrollState[this.direction] = true;
            }
            if (!oppositeArrived && this.distanceScrollState[oppositeDirection]) {
                this.distanceScrollState[oppositeDirection] = false;
            }
        };
    }
    componentDidLoad() {
        this.context.wrapElement = this.wrapRef;
        this.watchNoresizeHandler();
        if (!this.native) {
            nextFrame(() => {
                this.update();
            });
        }
    }
    componentDidUpdate() {
        this.update();
    }
    componentWillLoad() {
        this.context.scrollbarElement = this.el;
        scrollbarContexts.set(this.el, this.context);
    }
    async handleScroll() {
        var _a;
        if (this.wrapRef) {
            (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.handleScroll(this.wrapRef);
            const prevTop = this.wrapScrollTop;
            const prevLeft = this.wrapScrollLeft;
            this.wrapScrollTop = this.wrapRef.scrollTop;
            this.wrapScrollLeft = this.wrapRef.scrollLeft;
            const arrivedStates = {
                bottom: this.wrapScrollTop + this.wrapRef.clientHeight >=
                    this.wrapRef.scrollHeight - this.distance,
                left: this.wrapScrollLeft <= this.distance && prevLeft !== 0,
                right: this.wrapScrollLeft + this.wrapRef.clientWidth >=
                    this.wrapRef.scrollWidth - this.distance &&
                    prevLeft !== this.wrapScrollLeft,
                top: this.wrapScrollTop <= this.distance && prevTop !== 0,
            };
            this.scrollEvent.emit({
                scrollLeft: this.wrapScrollLeft,
                scrollTop: this.wrapScrollTop,
            });
            if (prevTop !== this.wrapScrollTop) {
                this.direction = this.wrapScrollTop > prevTop ? 'bottom' : 'top';
            }
            if (prevLeft !== this.wrapScrollLeft) {
                this.direction = this.wrapScrollLeft > prevLeft ? 'right' : 'left';
            }
            if (this.distance > 0) {
                if (this.shouldSkipDirection(this.direction)) {
                    return;
                }
                this.updateTriggerStatus(arrivedStates);
            }
            if (arrivedStates[this.direction]) {
                this.endReachedEvent.emit(this.direction);
            }
        }
    }
    render() {
        const wrapKls = [
            this.wrapClass,
            ns.e('wrap'),
            !this.native && ns.em('wrap', 'hidden-default'),
        ].join(' ');
        const resizeKls = [ns.e('view'), this.viewClass].join(' ');
        const wrapStyle = normalizeStyle(this.wrapStyle);
        if (this.height) {
            wrapStyle.height = addUnit(this.height);
        }
        if (this.maxHeight) {
            wrapStyle.maxHeight = addUnit(this.maxHeight);
        }
        return (h(Host, { key: 'f6bbfe1896623897ca691e8e8ffdd0ddc7d4e034', class: ns.b() }, h("div", { key: 'c8c12eb40e20e9c883f9a50d359cd263731d19fb', class: wrapKls, onScroll: this.onScrollHandler, ref: (el) => (this.wrapRef = el), style: wrapStyle, tabindex: this.el.tabIndex }, h("div", { key: '29034af042633e572399e36fb0e1f042a4125ad6', class: resizeKls, id: this.el.id, ref: (el) => (this.resizeRef = el), role: this.role, style: this.viewStyle }, h("slot", { key: 'e6d68794cb2944b3748d5bbabae3d09c983286bd' }))), h("zane-bar", { key: '0ffa1e42753ec1c13c647c5faf5d3a8af36a9336', always: this.always, "min-size": this.minSize, ref: (el) => (this.barRef = el) })));
    }
    async scrollToCoord(xCoord, yCoord) {
        this.wrapRef.scrollTo(xCoord, yCoord);
    }
    async setScrollLeft(value) {
        if (!isNumber(value)) {
            debugWarn(COMPONENT_NAME, 'value must be a number');
            return;
        }
        this.wrapRef.scrollLeft = value;
    }
    async setScrollTop(value) {
        if (!isNumber(value)) {
            debugWarn(COMPONENT_NAME, 'value must be a number');
            return;
        }
        this.wrapRef.scrollTop = value;
    }
    async update() {
        var _a;
        (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.update();
        this.distanceScrollState[this.direction] = false;
    }
    watchHeightHandler() {
        if (!this.native)
            nextFrame(() => {
                var _a;
                this.update();
                if (this.wrapRef) {
                    (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.handleScroll(this.wrapRef);
                }
            });
    }
    watchNoresizeHandler() {
        var _a, _b, _c;
        if (this.noresize) {
            (_a = this.stopResizeListener) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.stopResizeObserver) === null || _b === void 0 ? void 0 : _b.call(this);
            (_c = this.stopWrapResizeObserver) === null || _c === void 0 ? void 0 : _c.call(this);
        }
        else {
            this.stopResizeObserver = useResizeObserver(this.resizeRef, this.onSizeChangeHandler);
            this.stopWrapResizeObserver = useResizeObserver(this.wrapRef, this.onSizeChangeHandler);
            const { disconnect } = useEventListener(document, 'resize', this.onSizeChangeHandler);
            this.stopResizeListener = disconnect;
        }
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "maxHeight": [{
                "watchHeightHandler": 0
            }],
        "height": [{
                "watchHeightHandler": 0
            }],
        "noresize": [{
                "watchNoresizeHandler": 0
            }]
    }; }
};
ZaneScrollbar.style = zaneScrollbarCss();

export { ZaneScrollbar as zane_scrollbar };
