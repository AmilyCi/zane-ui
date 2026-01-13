'use strict';

var index = require('./index-ziNpORbs.js');
var forwardRef = require('./forward-ref-xik_RVwH.js');

class ForwardRefContext {
}

const ZaneForwardRef = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    componentWillLoad() {
        const context = new ForwardRefContext();
        context.setForwardRef = this.setForwardRef;
        forwardRef.forwardRefContexts.set(this.el, context);
    }
    disconnectedCallback() {
        forwardRef.forwardRefContexts.delete(this.el);
    }
    render() {
        return index.h("slot", { key: '6cfe25a23f5f0869cca0926fcb690bf60ccb6f58' });
    }
    get el() { return index.getElement(this); }
};

exports.zane_forward_ref = ZaneForwardRef;
