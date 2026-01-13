import { h, Host } from "@stencil/core";
import { buttonGroupContexts } from "../../constants";
import { useNamespace } from "../../hooks";
import { ButtonGroupContext } from "./button-group-context";
const ns = useNamespace('button');
export class ZaneButtonGroup {
    componentWillLoad() {
        const context = new ButtonGroupContext();
        context.updateSize(this.size);
        context.updateType(this.type);
        buttonGroupContexts.set(this.el, context);
    }
    disconnectedCallback() {
        buttonGroupContexts.delete(this.el);
    }
    handleWatchSize() {
        var _a;
        (_a = buttonGroupContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateSize(this.size);
    }
    handleWatchType() {
        var _a;
        (_a = buttonGroupContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateType(this.type);
    }
    render() {
        return (h(Host, { key: '6b491f3fecc8d986cbfa230c1377eaac81aca00e', class: ns.b('group') }, h("slot", { key: '6837edee828aa978c97353e5cc20f800c4a709e7' })));
    }
    static get is() { return "zane-button-group"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-button-group.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-button-group.css"]
        };
    }
    static get properties() {
        return {
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
                    "original": "ButtonType",
                    "resolved": "\"\" | \"danger\" | \"default\" | \"info\" | \"primary\" | \"success\" | \"warning\"",
                    "references": {
                        "ButtonType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ButtonType",
                            "referenceLocation": "ButtonType"
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
                "attribute": "type"
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "size",
                "methodName": "handleWatchSize"
            }, {
                "propName": "type",
                "methodName": "handleWatchType"
            }];
    }
}
