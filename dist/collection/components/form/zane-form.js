import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('form');
export class ZaneForm {
    constructor() {
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
    static get is() { return "zane-form"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-form.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-form.css"]
        };
    }
    static get properties() {
        return {
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled"
            },
            "hideRequiredAsterisk": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "hide-required-asterisk"
            },
            "inline": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "inline"
            },
            "inlineMessage": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "inline-message"
            },
            "labelPosition": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'left' | 'right' | 'top'",
                    "resolved": "\"left\" | \"right\" | \"top\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label-position",
                "defaultValue": "'right'"
            },
            "labelSuffix": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label-suffix",
                "defaultValue": "''"
            },
            "labelWidth": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label-width",
                "defaultValue": "''"
            },
            "model": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Record<string, any>",
                    "resolved": "any | string",
                    "references": {
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "requireAsteriskPosition": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'left' | 'right'",
                    "resolved": "\"left\" | \"right\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "require-asterisk-position",
                "defaultValue": "'left'"
            },
            "rules": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "FormRules",
                    "resolved": "FormItemRule | FormItemRule[] | string",
                    "references": {
                        "FormRules": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/form/types.ts::FormRules",
                            "referenceLocation": "FormRules"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            },
            "scrollIntoViewOptions": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean | ScrollIntoViewOptions",
                    "resolved": "ScrollIntoViewOptions | boolean",
                    "references": {
                        "ScrollIntoViewOptions": {
                            "location": "global",
                            "id": "global::ScrollIntoViewOptions"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "scroll-into-view-options",
                "defaultValue": "true"
            },
            "scrollToError": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "scroll-to-error"
            },
            "showMessage": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-message",
                "defaultValue": "true"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "ComponentSize",
                    "resolved": "\"\" | \"default\" | \"large\" | \"small\"",
                    "references": {
                        "ComponentSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ComponentSize",
                            "referenceLocation": "ComponentSize"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "size"
            },
            "statusIcon": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "status-icon"
            },
            "validateOnRuleChange": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "validate-on-rule-change",
                "defaultValue": "true"
            }
        };
    }
    static get elementRef() { return "el"; }
}
