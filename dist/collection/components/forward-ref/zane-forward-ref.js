import { h } from "@stencil/core";
import { forwardRefContexts } from "../../constants";
import { ForwardRefContext } from "./forwardRefContext";
export class ZaneForwardRef {
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
    static get is() { return "zane-forward-ref"; }
    static get properties() {
        return {
            "setForwardRef": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "ForwardRefSetter",
                    "resolved": "T",
                    "references": {
                        "ForwardRefSetter": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ForwardRefSetter",
                            "referenceLocation": "ForwardRefSetter"
                        }
                    }
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get elementRef() { return "el"; }
}
