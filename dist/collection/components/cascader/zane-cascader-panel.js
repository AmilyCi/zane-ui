import { h, Host } from "@stencil/core";
export class ZaneCascaderPanel {
    constructor() {
        this.checkedNodes = [];
    }
    async clearCheckedNodes() { }
    render() {
        return h(Host, { key: '9bcc548974fc37c0b9759cf3db411e151f5c128e' });
    }
    async scrollToExpandingNode() { }
    static get is() { return "zane-cascader-panel"; }
    static get properties() {
        return {
            "checkedNodes": {
                "type": "unknown",
                "mutable": true,
                "complexType": {
                    "original": "CascaderNode[]",
                    "resolved": "CascaderNode[]",
                    "references": {
                        "CascaderNode": {
                            "location": "import",
                            "path": "./node",
                            "id": "src/components/cascader/node.ts::CascaderNode",
                            "referenceLocation": "CascaderNode"
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
                "defaultValue": "[]"
            }
        };
    }
    static get methods() {
        return {
            "clearCheckedNodes": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "scrollToExpandingNode": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
}
