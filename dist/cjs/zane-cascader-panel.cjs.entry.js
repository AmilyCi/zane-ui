'use strict';

var index = require('./index-ziNpORbs.js');

const ZaneCascaderPanel = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.checkedNodes = [];
    }
    async clearCheckedNodes() { }
    render() {
        return index.h(index.Host, { key: '9bcc548974fc37c0b9759cf3db411e151f5c128e' });
    }
    async scrollToExpandingNode() { }
};

exports.zane_cascader_panel = ZaneCascaderPanel;
