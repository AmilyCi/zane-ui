'use strict';

var index = require('./index-ziNpORbs.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneFormCss = () => ``;

const ns = useNamespace.useNamespace('form');
const ZaneForm = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return (index.h(index.Host, { key: 'c6923ba3a0ebf69504e2cdbd7e0a071f11e7fde8', className: formClasses }, index.h("form", { key: '1885fbea7b0d311eb01dc64d19b6cc7cb6cb3a66' }, index.h("slot", { key: '2eaa54ee6172260182a37dce54e6fc8a11a9886e' }))));
    }
    get el() { return index.getElement(this); }
};
ZaneForm.style = zaneFormCss();

exports.zane_form = ZaneForm;
