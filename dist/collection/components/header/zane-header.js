import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('header');
export class ZaneHeader {
    render() {
        const style = this.height
            ? ns.cssVarBlock({
                height: this.height,
            })
            : {};
        return (h(Host, { key: '98feea7d87d49ea65ac55ee9af5656ce3f693489', class: ns.b(), style: style }, h("slot", { key: '5ec2d17603f52d3d82a1312e47c9d46091108cbd' })));
    }
    static get is() { return "zane-header"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-header.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-header.css"]
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
