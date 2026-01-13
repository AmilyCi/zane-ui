'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneAsideCss = () => `.zane-aside{overflow:auto;box-sizing:border-box;flex-shrink:0;width:var(--zane-aside-width, 300px)}`;

const ns = useNamespace.useNamespace('aside');
const ZaneAside = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        const style = this.width
            ? ns.cssVarBlock({
                width: this.width,
            })
            : {};
        return (index.h(index.Host, { key: '51122d3edb51c83bd163d673928accfbca2f364c', class: ns.b(), style: style }, index.h("slot", { key: '6283c89972bd826387c326d28a094afa46325495' })));
    }
};
ZaneAside.style = zaneAsideCss();

exports.zane_aside = ZaneAside;
