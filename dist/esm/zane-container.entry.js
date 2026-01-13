import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { f as findAllLegitChildren } from './findAllLegitChildren-Sl0ls-UQ.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneContainerCss = () => `.zane-container{display:flex;flex-direction:row;flex:1;flex-basis:auto;box-sizing:border-box;min-width:0}.zane-container.is-vertical{flex-direction:column}`;

const ns = useNamespace('container');
const ZaneContainer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isVertical = () => {
            if (this.direction === 'vertical') {
                return true;
            }
            else if (this.direction === 'horizontal') {
                return false;
            }
            const children = findAllLegitChildren(this.el);
            return children.some((child) => {
                return child.tagName === 'ZANE-HEADER' || child.tagName === 'ZANE-FOOTER';
            });
        };
    }
    render() {
        return (h(Host, { key: 'de89f18f01105690b1363a7ffe85068373f240bd', class: [ns.b(), ns.is('vertical', this.isVertical())].join(' ') }, h("slot", { key: '293b612169ab2c603db15081013d2f96b57e77db' })));
    }
    get el() { return getElement(this); }
};
ZaneContainer.style = zaneContainerCss();

export { ZaneContainer as zane_container };
