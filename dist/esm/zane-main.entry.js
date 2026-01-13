import { r as registerInstance, h, H as Host } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneMainCss = () => `.zane-main{--zane-main-padding:20px;display:block;flex:1;flex-basis:auto;overflow:auto;box-sizing:border-box;padding:var(--zane-main-padding)}`;

const ns = useNamespace('main');
const ZaneMain = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: '7762ce61dceb394572f07d1f4e960c712e196d76', class: ns.b() }, h("slot", { key: '72a8596d94e85985ff48258c44e353469588e1b6' })));
    }
};
ZaneMain.style = zaneMainCss();

export { ZaneMain as zane_main };
