import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
import { findAllLegitChildren } from "../../utils";
const ns = useNamespace('container');
export class ZaneContainer {
    constructor() {
        this.isVertical = () => {
            if (this.direction === 'vertical') {
                return true;
            }
            else if (this.direction === 'horizontal') {
                return false;
            }
            const children = findAllLegitChildren(this.el);
            return children.some((child) => {
                return child.tagName === 'ZANE-HEADER' || child.tagName === 'ZANE-FOOTER';
            });
        };
    }
    render() {
        return (h(Host, { key: 'de89f18f01105690b1363a7ffe85068373f240bd', class: [ns.b(), ns.is('vertical', this.isVertical())].join(' ') }, h("slot", { key: '293b612169ab2c603db15081013d2f96b57e77db' })));
    }
    static get is() { return "zane-container"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-container.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-container.css"]
        };
    }
    static get properties() {
        return {
            "direction": {
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
                "attribute": "direction"
            }
        };
    }
    static get elementRef() { return "el"; }
}
