import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneFormCss = () => ``;

const ns = useNamespace('form');
const ZaneForm = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.labelPosition = 'right';
        this.labelSuffix = '';
        this.labelWidth = '';
        this.requireAsteriskPosition = 'left';
        this.scrollIntoViewOptions = true;
        this.showMessage = true;
        this.validateOnRuleChange = true;
    }
    // private formRef: HTMLFormElement;
    render() {
        const formClasses = {
            [ns.b()]: true,
            [ns.m('inline')]: this.inline,
            [ns.m(`label-${this.labelPosition}`)]: this.labelPosition,
            [ns.m(this.size || 'default')]: true,
        };
        return (h(Host, { key: 'c6923ba3a0ebf69504e2cdbd7e0a071f11e7fde8', className: formClasses }, h("form", { key: '1885fbea7b0d311eb01dc64d19b6cc7cb6cb3a66' }, h("slot", { key: '2eaa54ee6172260182a37dce54e6fc8a11a9886e' }))));
    }
    get el() { return getElement(this); }
};
ZaneForm.style = zaneFormCss();

export { ZaneForm as zane_form };
