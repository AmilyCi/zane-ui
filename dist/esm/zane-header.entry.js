import { r as registerInstance, h, H as Host } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneHeaderCss = () => `.zane-header{--zane-header-padding:0 20px;--zane-header-height:60px;padding:var(--zane-header-padding);box-sizing:border-box;flex-shrink:0;height:var(--zane-header-height)}`;

const ns = useNamespace('header');
const ZaneHeader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (h(Host, { key: '98feea7d87d49ea65ac55ee9af5656ce3f693489', class: ns.b(), style: style }, h("slot", { key: '5ec2d17603f52d3d82a1312e47c9d46091108cbd' })));
    }
};
ZaneHeader.style = zaneHeaderCss();

export { ZaneHeader as zane_header };
