'use strict';

var index = require('./index-ziNpORbs.js');
var utils = require('./utils-DeEhUsE-.js');
var nextFrame = require('./nextFrame-DhVgSZmG.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');
require('./isObject-EfaeaXJ_.js');
require('./isString-D2n3i_b0.js');
require('./toObjectString-rn-pSGT_.js');

const ns = useNamespace.useNamespace('splitter-bar');
const ZaneSplitterBar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.startPos = null;
        this.onCollapse = (type) => {
            this.splitterContext.onCollapse(this.index, type);
            nextFrame.nextFrame(() => {
                this.startCollapsible = this.getStartCollapsible();
                this.endCollapsible = this.getEndCollapsible();
            });
        };
        this.onMousedown = (e) => {
            if (!this.resizable)
                return;
            this.startPos = [e.pageX, e.pageY];
            this.splitterContext.onMoveStart(this.index);
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousemove', this.onMouseMove);
        };
        this.onMouseMove = (e) => {
            const { pageX, pageY } = e;
            const offsetX = pageX - this.startPos[0];
            const offsetY = pageY - this.startPos[1];
            const offset = this.splitterContext.layout === 'horizontal' ? offsetX : offsetY;
            this.splitterContext.onMoving(this.index, offset);
        };
        this.onMouseUp = () => {
            this.startPos = null;
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
            this.splitterContext.onMoveEnd(this.index);
        };
        this.onTouchEnd = () => {
            this.startPos = null;
            window.removeEventListener('touchend', this.onTouchEnd);
            window.removeEventListener('touchmove', this.onTouchMove);
            this.splitterContext.onMoveEnd(this.index);
        };
        this.onTouchMove = (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const offsetX = touch.pageX - this.startPos[0];
                const offsetY = touch.pageY - this.startPos[1];
                const offset = this.splitterContext.layout === 'horizontal' ? offsetX : offsetY;
                this.splitterContext.onMoving(this.index, offset);
            }
        };
        this.onTouchStart = (e) => {
            if (this.resizable && e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                this.startPos = [touch.pageX, touch.pageY];
                this.splitterContext.onMoveStart(this.index);
                window.addEventListener('touchend', this.onTouchEnd);
                window.addEventListener('touchmove', this.onTouchMove);
            }
        };
    }
    get index() {
        return this.splitterContext.getPanelIndex(this.el.previousElementSibling);
    }
    get resizable() {
        return (this.el.previousElementSibling &&
            this.el.previousElementSibling.tagName === 'ZANE-SPLITTER-PANEL' &&
            this.el.nextElementSibling &&
            this.el.nextElementSibling.tagName === 'ZANE-SPLITTER-PANEL');
    }
    get splitterContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SPLITTER') {
                context = utils.splitterRootContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentDidLoad() {
        this.startCollapsible = this.getStartCollapsible();
        this.endCollapsible = this.getEndCollapsible();
    }
    render() {
        const prefix = ns.e('dragger');
        const barWrapStyles = this.splitterContext.layout === 'horizontal'
            ? { width: '0' }
            : { height: '0' };
        const draggerStyles = {
            cursor: this.resizable
                ? // eslint-disable-next-line unicorn/no-nested-ternary
                    this.splitterContext.layout === 'horizontal'
                        ? 'ew-resize'
                        : 'ns-resize'
                : 'auto',
            height: this.splitterContext.layout === 'horizontal' ? '100%' : '16px',
            touchAction: 'none',
            width: this.splitterContext.layout === 'horizontal' ? '16px' : '100%',
        };
        return (index.h(index.Host, { key: 'd3740062f9da07e877548e86fae857e5caafb414', class: ns.b(), style: barWrapStyles }, this.startCollapsible && (index.h("div", { key: '0531f62b67d776f6a6116554c668b8e5edf43944', class: [
                ns.e('collapse-icon'),
                ns.e(`${this.splitterContext.layout}-collapse-icon-start`),
            ].join(' '), onClick: () => this.onCollapse('start') }, index.h("slot", { key: '58fc584bc43f9961b1f8c9ae1f24698d17327064', name: "start-collapsible" }, this.renderStartIcon()))), index.h("div", { key: '3f55c43b01202985ee59c6bf88eac121ac11ed88', class: {
                [`${prefix}-active`]: !!this.startPos,
                [`${prefix}-horizontal`]: this.splitterContext.layout === 'horizontal',
                [`${prefix}-vertical`]: this.splitterContext.layout !== 'horizontal',
                [ns.e('dragger')]: true,
                [ns.is('disabled', !this.resizable)]: true,
                [ns.is('lazy', this.resizable && this.splitterContext.lazy)]: true,
            }, onMouseDown: this.onMousedown, onTouchStart: this.onTouchStart, style: draggerStyles }), this.endCollapsible && (index.h("div", { key: 'ea22716a26b6eae81e3d874d3d4e6859c653c7b3', class: [
                ns.e('collapse-icon'),
                ns.e(`${this.splitterContext.layout}-collapse-icon-end`),
            ].join(' '), onClick: () => this.onCollapse('end') }, index.h("slot", { key: 'c83c2dd692215ab2a2f359085b8b893d1879a589', name: "end-collapsible" }, this.renderEndIcon())))));
    }
    getEndCollapsible() {
        const panel = this.splitterContext.panels[this.index];
        const panelSize = this.splitterContext.pxSizes[this.index];
        const nextPanel = this.splitterContext.panels[this.index + 1];
        const nextPanelSize = this.splitterContext.pxSizes[this.index + 1];
        return utils.isCollapsible(nextPanel, nextPanelSize, panel, panelSize);
    }
    getStartCollapsible() {
        const panel = this.splitterContext.panels[this.index];
        const panelSize = this.splitterContext.pxSizes[this.index];
        const nextPanel = this.splitterContext.panels[this.index + 1];
        const nextPanelSize = this.splitterContext.pxSizes[this.index + 1];
        return utils.isCollapsible(panel, panelSize, nextPanel, nextPanelSize);
    }
    renderEndIcon() {
        return (index.h("zane-icon", { name: this.splitterContext.layout === 'horizontal'
                ? 'arrow-right'
                : 'arrow-down', size: "12px" }));
    }
    renderStartIcon() {
        return (index.h("zane-icon", { name: this.splitterContext.layout === 'horizontal'
                ? 'arrow-left'
                : 'arrow-up', size: "12px" }));
    }
    get el() { return index.getElement(this); }
};

exports.zane_splitter_bar = ZaneSplitterBar;
