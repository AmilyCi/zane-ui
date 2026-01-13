'use strict';

var index = require('./index-ziNpORbs.js');

const zaneConfigProviderCss = () => ``;

const ZaneConfigProvider = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return (index.h(index.Host, { key: '9a7d73c3ab6367f2cac89722951bf5d64a4e6f32' }, index.h("slot", { key: '0927724a065559b161fd7aa23e954c98ae1aaae3' })));
    }
    get el() { return index.getElement(this); }
};
ZaneConfigProvider.style = zaneConfigProviderCss();

exports.zane_config_provider = ZaneConfigProvider;
