'use strict';

var index = require('./index-ziNpORbs.js');
var collapse = require('./collapse-BYGMnHdX.js');
var uuid = require('./uuid-avdvDRhA.js');
var nextFrame = require('./nextFrame-DhVgSZmG.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

function toMs(s) {
    if (s === 'auto')
        return 0;
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}

const TRANSITION = 'transition';
const ANIMATION = 'animation';

function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    const getStyleProperties = (key) => (styles[key] || '').split(', ');
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    const hasTransform = type === TRANSITION &&
        /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
    return {
        hasTransform,
        propCount,
        timeout,
        type,
    };
}

function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = (el._endId = (el._endId || 0) + 1);
    const resolveIfNotStale = () => {
        if (id === el._endId)
            resolve();
    };
    if (explicitTimeout !== null) {
        setTimeout(resolveIfNotStale, explicitTimeout);
        return;
    }
    const { propCount, timeout, type } = getTransitionInfo(el);
    if (!type) {
        resolve();
        return;
    }
    const endEvent = `${type}end`;
    let ended = 0;
    const end = () => {
        el.removeEventListener(endEvent, onEnd);
        resolveIfNotStale();
    };
    const onEnd = (e) => {
        if (e.target === el && ++ended >= propCount)
            end();
    };
    setTimeout(() => {
        if (ended < propCount)
            end();
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
}

const ns = useNamespace.useNamespace('collapse');
const ZaneCollapseItem = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.focusing = false;
        this.icon = 'arrow-right';
        this.isActive = false;
        this.isClick = false;
        this.label = '';
        this.handleHeaderClick = (e) => {
            var _a;
            if (this.disabled)
                return;
            const target = e.target;
            if (target === null || target === void 0 ? void 0 : target.closest('input, textarea, select'))
                return;
            (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.handleItemClick(this.collapseItemName);
            this.focusing = false;
            this.isClick = true;
        };
    }
    get arrowKls() {
        return [ns.be('item', 'arrow'), ns.is('active', this.isActive)].join(' ');
    }
    get collapseContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-COLLAPSE') {
                context = collapse.collapseContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get collapseItemName() {
        var _a;
        return ((_a = this.name) !== null && _a !== void 0 ? _a : `${ns.namespace}-id-${uuid.state.idInjection.prefix}-${this.id}`);
    }
    get headKls() {
        return [
            ns.be('item', 'header'),
            ns.is('active', this.isActive),
            this.focusing && !this.disabled ? 'focusing' : '',
        ].join(' ');
    }
    get id() {
        return uuid.state.idInjection.current++;
    }
    get itemContentKls() {
        return ns.be('item', 'content');
    }
    get itemTitleKls() {
        return ns.be('item', 'title');
    }
    get itemWrapperKls() {
        return ns.be('item', 'wrap');
    }
    get rootKls() {
        return [
            ns.b('item'),
            ns.is('active', this.isActive),
            ns.is('disabled', this.disabled),
        ].join(' ');
    }
    get scopedContentId() {
        return ns.b(`content-${this.id}`);
    }
    get scopedHeadId() {
        return ns.b(`head-${this.id}`);
    }
    componentDidLoad() {
        const bodyStyle = getComputedStyle(this.wrapperRef);
        this.wrapperHeight = bodyStyle.height;
        this.isActive ? this.handleShow() : this.handleHidden();
    }
    componentWillLoad() {
        this.updateCallback = () => {
            const context = this.collapseContext;
            if (context) {
                this.isActive = context.activeNames.includes(this.name);
            }
        };
        const context = this.collapseContext;
        if (context) {
            this.isActive = context.activeNames.includes(this.name);
            context.addActiveNamesChangeListener(this.updateCallback);
        }
    }
    disconnectedCallback() {
        var _a;
        (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.removeActiveNamesChangeListener(this.updateCallback);
    }
    handleEnterClick(e) {
        var _a;
        const target = e.target;
        if (target === null || target === void 0 ? void 0 : target.closest('input, textarea, select'))
            return;
        e.preventDefault();
        (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.handleItemClick(this.collapseItemName);
    }
    handleFocus() {
        setTimeout(() => {
            if (this.isClick) {
                this.isClick = false;
            }
            else {
                this.focusing = true;
            }
        }, 50);
    }
    handleHidden() {
        if (this.wrapperRef) {
            const { timeout } = getTransitionInfo(this.wrapperRef);
            this.wrapperRef.style.height = '0';
            whenTransitionEnds(this.wrapperRef, 'transition', timeout, () => {
                this.wrapperRef.style.display = 'none';
            });
        }
    }
    handleShow() {
        if (this.wrapperRef) {
            this.wrapperRef.style.display = '';
            nextFrame.nextFrame(() => {
                this.wrapperRef.style.height = this.wrapperHeight;
            });
        }
    }
    render() {
        return (index.h("div", { key: '6d80050c834a526620229db60b22c729f71393d0', class: this.rootKls }, index.h("div", { key: 'eb86b9e92f1182ec1a25f50cbdd0240d3b54df64', class: this.headKls, id: this.scopedHeadId, onBlur: () => (this.focusing = false), onClick: this.handleHeaderClick, onFocus: this.handleFocus, onKeyDown: this.handleEnterClick, role: "button", tabindex: this.disabled ? -1 : 0 }, index.h("span", { key: 'c254462eb94f4d42612444c6938a9f6d7f641c13', class: this.itemTitleKls }, index.h("slot", { key: 'f67c5ff7d5cca070644415786f9b1deb7c01c147', name: "title" }, this.label)), index.h("slot", { key: '796123a540c281d8e61038160262bb32a90110ef', name: "icon" }, this.icon && (index.h("zane-icon", { key: '9c41e59d31bbe30de0a439c7681a2ff279070982', class: this.arrowKls, name: this.icon })))), index.h("div", { key: 'dcb95525e837b721527eb6d159d69270b11e368f', class: this.itemWrapperKls, id: this.scopedContentId, ref: (el) => (this.wrapperRef = el) }, index.h("div", { key: 'a9077931ddbf23990faebcb71b708616906d01a5', class: this.itemContentKls }, index.h("slot", { key: '4f6b5c8c7ae9c6d87dde77c0eb8107ca08533b21' })))));
    }
    watchIsActiveHandler(val) {
        val ? this.handleShow() : this.handleHidden();
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "isActive": [{
                "watchIsActiveHandler": 0
            }]
    }; }
};

exports.zane_collapse_item = ZaneCollapseItem;
