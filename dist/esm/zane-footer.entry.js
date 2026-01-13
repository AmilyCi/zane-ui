import { r as registerInstance, h, H as Host } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneFooterCss = () => `.zane-footer{--zane-footer-padding:0 20px;--zane-footer-height:60px;padding:var(--zane-footer-padding);box-sizing:border-box;flex-shrink:0;height:var(--zane-footer-height)}`;

const ns = useNamespace('footer');
const ZaneFooter = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (h(Host, { key: '63670738a4eeaaeaa4cd1d6014e085e969153a3e', class: ns.b(), style: style }, h("slot", { key: '15bc24eab8da71ccd7c5ac304827afacff1c3662' })));
    }
};
ZaneFooter.style = zaneFooterCss();

export { ZaneFooter as zane_footer };
