'use strict';

var index = require('./index-ziNpORbs.js');
var findAllLegitChildren = require('./findAllLegitChildren-BeFgQwjQ.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneContainerCss = () => `.zane-container{display:flex;flex-direction:row;flex:1;flex-basis:auto;box-sizing:border-box;min-width:0}.zane-container.is-vertical{flex-direction:column}`;

const ns = useNamespace.useNamespace('container');
const ZaneContainer = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.isVertical = () => {
            if (this.direction === 'vertical') {
                return true;
            }
            else if (this.direction === 'horizontal') {
                return false;
            }
            const children = findAllLegitChildren.findAllLegitChildren(this.el);
            return children.some((child) => {
                return child.tagName === 'ZANE-HEADER' || child.tagName === 'ZANE-FOOTER';
            });
        };
    }
    render() {
        return (index.h(index.Host, { key: 'de89f18f01105690b1363a7ffe85068373f240bd', class: [ns.b(), ns.is('vertical', this.isVertical())].join(' ') }, index.h("slot", { key: '293b612169ab2c603db15081013d2f96b57e77db' })));
    }
    get el() { return index.getElement(this); }
};
ZaneContainer.style = zaneContainerCss();

exports.zane_container = ZaneContainer;
