import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneLinkCss = () => `.zane-link{--zane-link-font-size:var(--zane-font-size-base);--zane-link-font-weight:var(--zane-font-weight-primary);--zane-link-text-color:var(--zane-text-color-regular);--zane-link-hover-text-color:var(--zane-color-primary);--zane-link-disabled-text-color:var(--zane-text-color-placeholder)}.zane-link{display:inline-flex;flex-direction:row;align-items:center;justify-content:center;vertical-align:middle;position:relative;text-decoration:none;outline:none;cursor:pointer;padding:0;font-size:var(--zane-link-font-size);font-weight:var(--zane-link-font-weight);color:var(--zane-link-text-color)}.zane-link.is-hover-underline:hover:after{content:"";position:absolute;left:0;right:0;height:0;bottom:0;border-bottom:1px solid var(--zane-link-hover-text-color)}.zane-link.is-underline:after{content:"";position:absolute;left:0;right:0;height:0;bottom:0;border-bottom:1px solid var(--zane-link-text-color)}.zane-link:hover{color:var(--zane-link-hover-text-color)}.zane-link:hover:after{border-color:var(--zane-link-hover-text-color)}.zane-link [class*=zane-icon-]+span{margin-left:5px}.zane-link .zane-link__inner{display:inline-flex;justify-content:center;align-items:center}.zane-link.zane-link--primary{--zane-link-text-color:var(--zane-color-primary);--zane-link-hover-text-color:var(--zane-color-primary-light-3);--zane-link-disabled-text-color:var(--zane-color-primary-light-5)}.zane-link.zane-link--success{--zane-link-text-color:var(--zane-color-success);--zane-link-hover-text-color:var(--zane-color-success-light-3);--zane-link-disabled-text-color:var(--zane-color-success-light-5)}.zane-link.zane-link--warning{--zane-link-text-color:var(--zane-color-warning);--zane-link-hover-text-color:var(--zane-color-warning-light-3);--zane-link-disabled-text-color:var(--zane-color-warning-light-5)}.zane-link.zane-link--danger{--zane-link-text-color:var(--zane-color-danger);--zane-link-hover-text-color:var(--zane-color-danger-light-3);--zane-link-disabled-text-color:var(--zane-color-danger-light-5)}.zane-link.zane-link--error{--zane-link-text-color:var(--zane-color-error);--zane-link-hover-text-color:var(--zane-color-error-light-3);--zane-link-disabled-text-color:var(--zane-color-error-light-5)}.zane-link.zane-link--info{--zane-link-text-color:var(--zane-color-info);--zane-link-hover-text-color:var(--zane-color-info-light-3);--zane-link-disabled-text-color:var(--zane-color-info-light-5)}.zane-link.is-disabled{color:var(--zane-link-disabled-text-color);cursor:not-allowed}.zane-link.is-disabled:after{border-color:var(--zane-link-disabled-text-color)}`;

const ns = useNamespace('link');
const ZaneLink = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.clickEvent = createEvent(this, "zClick", 7);
        this.href = '';
        this.target = '_self';
        this.handleClick = (event) => {
            if (!this.disabled)
                this.clickEvent.emit(event);
        };
    }
    render() {
        var _a;
        const linkKls = [
            ns.b(),
            ns.m((_a = this.type) !== null && _a !== void 0 ? _a : 'default'),
            ns.is('disabled', this.disabled),
            ns.is('underline', this.underline === 'always'),
            ns.is('hover-underline', this.underline === 'hover' && !this.disabled),
        ].join(' ');
        const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');
        return (h(Host, { key: '0979db78edca14b43edbcca81abe16084c1b25aa' }, h("a", { key: 'cf22c93a6ce968564b0937d606458d9881f9f99e', class: linkKls, href: this.disabled || !this.href ? undefined : this.href, onClick: this.handleClick, target: this.disabled || !this.href ? undefined : this.target }, hasIcon && this.icon ? (h("zane-icon", { name: this.icon })) : (h("slot", { name: "icon" })), h("slot", { key: '148d258939ff46a538f096b22cae8087ea25ef66' }))));
    }
    get el() { return getElement(this); }
};
ZaneLink.style = zaneLinkCss();

export { ZaneLink as zane_link };
