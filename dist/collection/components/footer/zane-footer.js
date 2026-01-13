import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('footer');
export class ZaneFooter {
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (h(Host, { key: '63670738a4eeaaeaa4cd1d6014e085e969153a3e', class: ns.b(), style: style }, h("slot", { key: '15bc24eab8da71ccd7c5ac304827afacff1c3662' })));
    }
    static get is() { return "zane-footer"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-footer.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-footer.css"]
        };
    }
    static get properties() {
        return {
            "height": {
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
                "attribute": "height"
            }
        };
    }
}
