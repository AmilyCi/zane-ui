'use strict';

var index = require('./index-ziNpORbs.js');
var findAllLegitChildren = require('./findAllLegitChildren-BeFgQwjQ.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneDividerCss = () => `.zane-divider{position:relative}.zane-divider--horizontal{display:block;height:1px;width:100%;margin:24px 0;border-top:1px var(--zane-border-color) var(--zane-border-style)}.zane-divider--vertical{display:inline-block;width:1px;height:1em;margin:0 8px;vertical-align:middle;position:relative;border-left:1px var(--zane-border-color) var(--zane-border-style)}.zane-divider .zane-divider__text{position:absolute;background-color:var(--zane-bg-color);padding:0 20px;font-weight:500;color:var(--zane-text-color-primary);font-size:14px}.zane-divider .zane-divider__text.is-left{left:20px;transform:translateY(-50%)}.zane-divider .zane-divider__text.is-center{left:50%;transform:translateX(-50%) translateY(-50%)}.zane-divider .zane-divider__text.is-right{right:20px;transform:translateY(-50%)}`;

const ns = useNamespace.useNamespace('divider');
const ZaneDivider = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.borderStyle = 'solid';
        this.contentPosition = 'center';
        this.direction = 'horizontal';
    }
    render() {
        const dividerStyle = ns.cssVar({
            'border-style': this.borderStyle,
        });
        const $hasContent = findAllLegitChildren.findAllLegitChildren(this.el).length > 0;
        return (index.h(index.Host, { key: '6dc2a9015a6ea70ecd3df5ee7f9d3bd2b32c48c5' }, index.h("div", { key: 'a2107a9c6fff9452f6db249f46b4b68325cba64c', class: [ns.b(), ns.m(this.direction)].join(' '), role: "separator", style: dividerStyle }, $hasContent && this.direction !== 'vertical' && (index.h("div", { key: '71402652203aeeaf5a59512908c232b0df28de50', class: [ns.e('text'), ns.is(this.contentPosition)].join(' ') }, index.h("slot", { key: 'aad8652845808c512f65777a0cfad3a56df91d4f' }))))));
    }
    get el() { return index.getElement(this); }
};
ZaneDivider.style = zaneDividerCss();

exports.zane_divider = ZaneDivider;
