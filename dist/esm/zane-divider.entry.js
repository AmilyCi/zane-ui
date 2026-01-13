import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { f as findAllLegitChildren } from './findAllLegitChildren-Sl0ls-UQ.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneDividerCss = () => `.zane-divider{position:relative}.zane-divider--horizontal{display:block;height:1px;width:100%;margin:24px 0;border-top:1px var(--zane-border-color) var(--zane-border-style)}.zane-divider--vertical{display:inline-block;width:1px;height:1em;margin:0 8px;vertical-align:middle;position:relative;border-left:1px var(--zane-border-color) var(--zane-border-style)}.zane-divider .zane-divider__text{position:absolute;background-color:var(--zane-bg-color);padding:0 20px;font-weight:500;color:var(--zane-text-color-primary);font-size:14px}.zane-divider .zane-divider__text.is-left{left:20px;transform:translateY(-50%)}.zane-divider .zane-divider__text.is-center{left:50%;transform:translateX(-50%) translateY(-50%)}.zane-divider .zane-divider__text.is-right{right:20px;transform:translateY(-50%)}`;

const ns = useNamespace('divider');
const ZaneDivider = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.borderStyle = 'solid';
        this.contentPosition = 'center';
        this.direction = 'horizontal';
    }
    render() {
        const dividerStyle = ns.cssVar({
            'border-style': this.borderStyle,
        });
        const $hasContent = findAllLegitChildren(this.el).length > 0;
        return (h(Host, { key: '6dc2a9015a6ea70ecd3df5ee7f9d3bd2b32c48c5' }, h("div", { key: 'a2107a9c6fff9452f6db249f46b4b68325cba64c', class: [ns.b(), ns.m(this.direction)].join(' '), role: "separator", style: dividerStyle }, $hasContent && this.direction !== 'vertical' && (h("div", { key: '71402652203aeeaf5a59512908c232b0df28de50', class: [ns.e('text'), ns.is(this.contentPosition)].join(' ') }, h("slot", { key: 'aad8652845808c512f65777a0cfad3a56df91d4f' }))))));
    }
    get el() { return getElement(this); }
};
ZaneDivider.style = zaneDividerCss();

export { ZaneDivider as zane_divider };
