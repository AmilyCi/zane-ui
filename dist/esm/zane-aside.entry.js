import { r as registerInstance, h, H as Host } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneAsideCss = () => `.zane-aside{overflow:auto;box-sizing:border-box;flex-shrink:0;width:var(--zane-aside-width, 300px)}`;

const ns = useNamespace('aside');
const ZaneAside = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const style = this.width
            ? ns.cssVarBlock({
                width: this.width,
            })
            : {};
        return (h(Host, { key: '51122d3edb51c83bd163d673928accfbca2f364c', class: ns.b(), style: style }, h("slot", { key: '6283c89972bd826387c326d28a094afa46325495' })));
    }
};
ZaneAside.style = zaneAsideCss();

export { ZaneAside as zane_aside };
