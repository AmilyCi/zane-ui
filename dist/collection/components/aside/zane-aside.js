import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('aside');
export class ZaneAside {
    render() {
        const style = this.width
            ? ns.cssVarBlock({
                width: this.width,
            })
            : {};
        return (h(Host, { key: '51122d3edb51c83bd163d673928accfbca2f364c', class: ns.b(), style: style }, h("slot", { key: '6283c89972bd826387c326d28a094afa46325495' })));
    }
    static get is() { return "zane-aside"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-aside.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-aside.css"]
        };
    }
    static get properties() {
        return {
            "width": {
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
                "attribute": "width"
            }
        };
    }
}
