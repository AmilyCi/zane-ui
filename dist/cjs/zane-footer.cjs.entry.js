'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneFooterCss = () => `.zane-footer{--zane-footer-padding:0 20px;--zane-footer-height:60px;padding:var(--zane-footer-padding);box-sizing:border-box;flex-shrink:0;height:var(--zane-footer-height)}`;

const ns = useNamespace.useNamespace('footer');
const ZaneFooter = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (index.h(index.Host, { key: '63670738a4eeaaeaa4cd1d6014e085e969153a3e', class: ns.b(), style: style }, index.h("slot", { key: '15bc24eab8da71ccd7c5ac304827afacff1c3662' })));
    }
};
ZaneFooter.style = zaneFooterCss();

exports.zane_footer = ZaneFooter;
