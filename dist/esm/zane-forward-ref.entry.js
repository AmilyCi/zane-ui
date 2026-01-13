import { r as registerInstance, h, a as getElement } from './index-B2_qc6fD.js';
import { f as forwardRefContexts } from './forward-ref-CEAiJPam.js';

class ForwardRefContext {
}

const ZaneForwardRef = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentWillLoad() {
        const context = new ForwardRefContext();
        context.setForwardRef = this.setForwardRef;
        forwardRefContexts.set(this.el, context);
    }
    disconnectedCallback() {
        forwardRefContexts.delete(this.el);
    }
    render() {
        return h("slot", { key: '6cfe25a23f5f0869cca0926fcb690bf60ccb6f58' });
    }
    get el() { return getElement(this); }
};

export { ZaneForwardRef as zane_forward_ref };
