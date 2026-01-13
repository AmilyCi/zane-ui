import { h, Host } from "@stencil/core";
import state from "../../global/store";
import { useNamespace } from "../../hooks";
import { formContexts, formItemContexts } from "../form/constants";
const ns = useNamespace('tag');
export class ZaneTag {
    constructor() {
        this.effect = 'light';
        this.type = 'primary';
        this.handleClick = (event) => {
            this.clickEvent.emit(event);
        };
        this.handleClose = (event) => {
            event.stopPropagation();
            this.closeEvent.emit();
        };
    }
    get formContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM') {
                context = formContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get formItemContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM-ITEM') {
                context = formItemContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    render() {
        const containerKls = [
            ns.b(),
            ns.is('closeable', this.closeable),
            ns.m(this.type || 'primary'),
            ns.m(this.getTagSize()),
            ns.m(this.effect),
            ns.is('hit', this.hit),
            ns.is('round', this.round),
        ].join(' ');
        return (h(Host, { key: '202f3ea53f8222c4210dc25e993a0b2359375f91' }, h("span", { key: '4da947a0cbc615bccb165e4b13ca9e96857fc05a', class: containerKls, onClick: this.handleClick, style: { backgroundColor: this.color } }, h("span", { key: 'f1242cb09f982879e5eff09ddb4bd03147c6ee5d', class: ns.e('content') }, h("slot", { key: '98df8752377aa4fc43981e8b763a3faf73bdbd9c' })), this.closeable && (h("button", { key: '7c26a21a0ccd5b48f993965bcd9a65b2afdae48e', class: ns.e('close'), onClick: this.handleClose, type: "botton" }, h("zane-icon", { key: '8e0959bac2599adecf3e1acb5005bcc150328712', name: "close" }))))));
    }
    getTagSize() {
        var _a, _b;
        return (this.size ||
            ((_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.size) ||
            ((_b = this.formContext) === null || _b === void 0 ? void 0 : _b.size) ||
            state.size ||
            '');
    }
    static get is() { return "zane-tag"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-tag.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-tag.css"]
        };
    }
    static get properties() {
        return {
            "closeable": {
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
                "reflect": true,
                "attribute": "closeable"
            },
            "color": {
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
                "attribute": "color"
            },
            "effect": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'dark' | 'light' | 'plain'",
                    "resolved": "\"dark\" | \"light\" | \"plain\"",
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
                "attribute": "effect",
                "defaultValue": "'light'"
            },
            "hit": {
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
                "attribute": "hit"
            },
            "round": {
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
                "attribute": "round"
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
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'danger' | 'info' | 'primary' | 'success' | 'warning'",
                    "resolved": "\"danger\" | \"info\" | \"primary\" | \"success\" | \"warning\"",
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
                "attribute": "type",
                "defaultValue": "'primary'"
            }
        };
    }
    static get events() {
        return [{
                "method": "clickEvent",
                "name": "zClick",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "MouseEvent",
                    "resolved": "MouseEvent",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                }
            }, {
                "method": "closeEvent",
                "name": "zClose",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "MouseEvent",
                    "resolved": "MouseEvent",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
}
