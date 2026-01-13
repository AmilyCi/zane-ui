'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneHeaderCss = () => `.zane-header{--zane-header-padding:0 20px;--zane-header-height:60px;padding:var(--zane-header-padding);box-sizing:border-box;flex-shrink:0;height:var(--zane-header-height)}`;

const ns = useNamespace.useNamespace('header');
const ZaneHeader = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (index.h(index.Host, { key: '98feea7d87d49ea65ac55ee9af5656ce3f693489', class: ns.b(), style: style }, index.h("slot", { key: '5ec2d17603f52d3d82a1312e47c9d46091108cbd' })));
    }
};
ZaneHeader.style = zaneHeaderCss();

exports.zane_header = ZaneHeader;
