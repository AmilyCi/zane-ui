'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneMainCss = () => `.zane-main{--zane-main-padding:20px;display:block;flex:1;flex-basis:auto;overflow:auto;box-sizing:border-box;padding:var(--zane-main-padding)}`;

const ns = useNamespace.useNamespace('main');
const ZaneMain = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return (index.h(index.Host, { key: '7762ce61dceb394572f07d1f4e960c712e196d76', class: ns.b() }, index.h("slot", { key: '72a8596d94e85985ff48258c44e353469588e1b6' })));
    }
};
ZaneMain.style = zaneMainCss();

exports.zane_main = ZaneMain;
