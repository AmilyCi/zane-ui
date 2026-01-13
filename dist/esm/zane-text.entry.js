import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import { f as formContexts } from './constants-DPmqmB4-.js';

const zaneTextCss = () => `.zane-text{--zane-text-font-size:var(--zane-font-size-base);--zane-text-color:var(--zane-text-color-regular)}.zane-text{align-self:center;margin:0;padding:0;font-size:var(--zane-text-font-size);color:var(--zane-text-color);overflow-wrap:break-word}.zane-text.is-truncated{display:inline-block;max-width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.zane-text.is-line-clamp{display:-webkit-inline-box;-webkit-box-orient:vertical;overflow:hidden}.zane-text--large{--zane-text-font-size:var(--zane-font-size-medium)}.zane-text--default{--zane-text-font-size:var(--zane-font-size-base)}.zane-text--small{--zane-text-font-size:var(--zane-font-size-extra-small)}.zane-text.zane-text--primary{--zane-text-color:var(--zane-color-primary)}.zane-text.zane-text--success{--zane-text-color:var(--zane-color-success)}.zane-text.zane-text--warning{--zane-text-color:var(--zane-color-warning)}.zane-text.zane-text--danger{--zane-text-color:var(--zane-color-danger)}.zane-text.zane-text--error{--zane-text-color:var(--zane-color-error)}.zane-text.zane-text--info{--zane-text-color:var(--zane-color-info)}.zane-text>.zane-icon{vertical-align:-2px}`;

const ns = useNamespace('text');
const ZaneText = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.size = '';
        this.type = '';
    }
    get formContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM') {
                context = formContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get textSize() {
        var _a;
        return this.size || ((_a = this.formContext) === null || _a === void 0 ? void 0 : _a.size) || 'default';
    }
    componentDidLoad() {
        this.bindTitle();
    }
    componentDidUpdate() {
        this.bindTitle();
    }
    render() {
        const textKls = [
            ns.b(),
            ns.m(this.type),
            ns.m(this.textSize),
            ns.is('truncated', this.truncated),
            ns.is('line-clamp', this.lineClamp !== undefined),
        ].join(' ');
        return (h(Host, { key: 'c09680b49d35a9a599f23e8032c4b40e6f542817', class: textKls, style: { '-webkit-line-clamp': this.lineClamp } }, h("slot", { key: '984fe274bf0456e6edad2b9c10acda347842dbff' })));
    }
    bindTitle() {
        if (this.el.title) {
            return;
        }
        let shouldAddTitle = false;
        const text = this.el.textContent || '';
        if (this.truncated) {
            const width = this.el.offsetWidth;
            const scrollWidth = this.el.scrollWidth;
            if (width && scrollWidth && scrollWidth > width) {
                shouldAddTitle = true;
            }
        }
        else if (this.lineClamp !== undefined) {
            const height = this.el.offsetHeight;
            const scrollHeight = this.el.scrollHeight;
            if (height && scrollHeight && scrollHeight > height) {
                shouldAddTitle = true;
            }
        }
        if (shouldAddTitle) {
            this.el.setAttribute('title', text);
        }
        else {
            this.el.removeAttribute('title');
        }
    }
    get el() { return getElement(this); }
};
ZaneText.style = zaneTextCss();

export { ZaneText as zane_text };
