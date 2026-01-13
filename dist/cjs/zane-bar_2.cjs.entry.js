'use strict';

var index = require('./index-ziNpORbs.js');
var scrollbar = require('./scrollbar-DdUYAJt2.js');
var isClient = require('./isClient-DoX2b1Hx.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const ZaneBar$1 = class ZaneBar {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.moveX = 0;
        this.moveY = 0;
        this.ratioX = 1;
        this.ratioY = 1;
        this.sizeHeight = '';
        this.sizeWidth = '';
    }
    get scrollbarContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SCROLLBAR') {
                context = scrollbar.scrollbarContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    async handleScroll(wrap) {
        if (wrap) {
            const offsetHeight = wrap.offsetHeight - scrollbar.GAP;
            const offsetWidth = wrap.offsetWidth - scrollbar.GAP;
            this.moveY = ((wrap.scrollTop * 100) / offsetHeight) * this.ratioY;
            this.moveX = ((wrap.scrollLeft * 100) / offsetWidth) * this.ratioX;
        }
    }
    render() {
        return (index.h(index.Host, { key: 'ea377501d1432ad26f41f2526f73eab5ed64bd29' }, index.h("zane-thumb", { key: '56ff0bf173b8bedad8621b0326990245cb4c24e0', always: this.always, move: this.moveX, ratio: this.ratioX, size: this.sizeWidth }), index.h("zane-thumb", { key: 'e8ccb4067fe314b1a856af9a70e7d523339a7ed9', always: this.always, move: this.moveY, ratio: this.ratioY, size: this.sizeHeight, vertical: true })));
    }
    async update() {
        var _a;
        const wrap = (_a = this.scrollbarContext) === null || _a === void 0 ? void 0 : _a.wrapElement;
        if (!wrap)
            return;
        const offsetHeight = wrap.offsetHeight - scrollbar.GAP;
        const offsetWidth = wrap.offsetWidth - scrollbar.GAP;
        const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
        const height = Math.max(originalHeight, this.minSize);
        const width = Math.max(originalWidth, this.minSize);
        this.ratioY =
            originalHeight /
                (offsetHeight - originalHeight) /
                (height / (offsetHeight - height));
        this.ratioX =
            originalWidth /
                (offsetWidth - originalWidth) /
                (width / (offsetWidth - width));
        this.sizeHeight = height + scrollbar.GAP < offsetHeight ? `${height}px` : '';
        this.sizeWidth = width + scrollbar.GAP < offsetWidth ? `${width}px` : '';
    }
    get el() { return index.getElement(this); }
};

const ns = useNamespace.useNamespace('scrollbar');
const ZaneBar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.thumbState = {};
        this.visible = false;
        this.baseScrollHeight = 0;
        this.baseScrollWidth = 0;
        this.cursorDown = false;
        this.cursorLeave = false;
        this.originalOnSelectStart = isClient.isClient ? document.onselectstart : null;
        this.clickHandler = (e) => {
            e.stopPropagation();
        };
        this.clickThumbHandler = (e) => {
            var _a;
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button))
                return;
            (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            this.startDrag(e);
            const el = e.currentTarget;
            if (!el)
                return;
            this.thumbState[this.bar.axis] =
                el[this.bar.offset] -
                    (e[this.bar.client] - el.getBoundingClientRect()[this.bar.direction]);
        };
        this.clickTrackHandler = (e) => {
            if (!this.thumbRef ||
                !this.instanceRef ||
                !this.scrollbarContext.wrapElement)
                return;
            const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] -
                e[this.bar.client]);
            const thumbHalf = this.thumbRef[this.bar.offset] / 2;
            const thumbPositionPercentage = ((offset - thumbHalf) * 100 * this.offsetRatio) /
                this.instanceRef[this.bar.offset];
            this.scrollbarContext.wrapElement[this.bar.scroll] =
                (thumbPositionPercentage *
                    this.scrollbarContext.wrapElement[this.bar.scrollSize]) /
                    100;
        };
        this.mouseLeaveScrollbarHandler = () => {
            this.cursorLeave = true;
            this.visible = this.cursorDown;
        };
        this.mouseMoveDocumentHandler = (e) => {
            if (!this.instanceRef || !this.thumbRef)
                return;
            if (this.cursorDown === false)
                return;
            const prevPage = this.thumbState[this.bar.axis];
            if (!prevPage)
                return;
            const offset = (this.instanceRef.getBoundingClientRect()[this.bar.direction] -
                e[this.bar.client]) *
                -1;
            const thumbClickPosition = this.thumbRef[this.bar.offset] - prevPage;
            const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 * this.offsetRatio) /
                this.instanceRef[this.bar.offset];
            this.scrollbarContext.wrapElement[this.bar.scroll] =
                this.bar.scroll === 'scrollLeft'
                    ? (thumbPositionPercentage * this.baseScrollWidth) / 100
                    : (thumbPositionPercentage * this.baseScrollHeight) / 100;
        };
        this.mouseMoveScrollbarHandler = () => {
            this.cursorLeave = false;
            this.visible = !!this.size;
        };
        this.mouseUpDocumentHandler = () => {
            this.cursorDown = false;
            this.thumbState[this.bar.axis] = 0;
            document.removeEventListener('mousemove', this.mouseMoveDocumentHandler);
            document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
            this.restoreOnselectstart();
            if (this.cursorLeave)
                this.visible = false;
        };
        this.restoreOnselectstart = () => {
            if (document.onselectstart !== this.originalOnSelectStart)
                document.addEventListener('selectstart', this.originalOnSelectStart);
        };
        this.startDrag = (e) => {
            e.stopImmediatePropagation();
            this.cursorDown = true;
            this.baseScrollHeight = this.scrollbarContext.wrapElement.scrollHeight;
            this.baseScrollWidth = this.scrollbarContext.wrapElement.scrollWidth;
            document.addEventListener('mousemove', this.mouseMoveDocumentHandler);
            document.addEventListener('mouseup', this.mouseUpDocumentHandler);
            this.originalOnSelectStart = document.onselectstart;
            document.addEventListener('selectstart', () => false);
        };
    }
    get bar() {
        return scrollbar.BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    }
    get offsetRatio() {
        if (!this.instanceRef ||
            !this.thumbRef ||
            !this.scrollbarContext.wrapElement) {
            return 1;
        }
        return (this.instanceRef[this.bar.offset] ** 2 /
            this.scrollbarContext.wrapElement[this.bar.scrollSize] /
            this.ratio /
            this.thumbRef[this.bar.offset]);
    }
    get scrollbarContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SCROLLBAR') {
                context = scrollbar.scrollbarContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentDidLoad() {
        var _a, _b;
        (_a = this.scrollbarContext.scrollbarElement) === null || _a === void 0 ? void 0 : _a.addEventListener('mousemove', this.mouseMoveScrollbarHandler);
        (_b = this.scrollbarContext.scrollbarElement) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseleave', this.mouseLeaveScrollbarHandler);
    }
    disconnectedCallback() {
        var _a, _b, _c, _d;
        this.restoreOnselectstart();
        document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
        (_b = (_a = this.scrollbarContext) === null || _a === void 0 ? void 0 : _a.scrollbarElement) === null || _b === void 0 ? void 0 : _b.removeEventListener('mousemove', this.mouseMoveScrollbarHandler);
        (_d = (_c = this.scrollbarContext) === null || _c === void 0 ? void 0 : _c.scrollbarElement) === null || _d === void 0 ? void 0 : _d.removeEventListener('mouseleave', this.mouseLeaveScrollbarHandler);
    }
    render() {
        const thumbStyle = {
            [this.bar.size]: this.size,
            transform: `translate${this.bar.axis}(${this.move}%)`,
        };
        return (index.h(index.Host, { key: '41693ed234a17efae18ac75761e8b51f5432a0b1', class: ns.b('fade') }, index.h("div", { key: '4582443efe01d03a1092dd6c3810bedfcf71969a', class: [ns.e('bar'), ns.is(this.bar.key)].join(' '), onClick: this.clickHandler, onMouseDown: this.clickTrackHandler, ref: (el) => (this.instanceRef = el), style: { display: this.always || this.visible ? '' : 'none' } }, index.h("div", { key: 'd21e21d3a1a42675ab0a3a40e84229773edb3a16', class: ns.e('thumb'), onMouseDown: this.clickThumbHandler, ref: (el) => (this.thumbRef = el), style: thumbStyle }))));
    }
    get el() { return index.getElement(this); }
};

exports.zane_bar = ZaneBar$1;
exports.zane_thumb = ZaneBar;
