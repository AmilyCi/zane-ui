import { h, Host } from "@stencil/core";
import classNameFun from "classnames";
import { useNamespace } from "../../hooks/useNamespace";
import "@zanejs/icons";
const ns = useNamespace('icon');
export class ZaneIcon {
    constructor() {
        this.classNames = '';
    }
    render() {
        const style = Object.assign({
            color: this.color,
        }, this.styles || {});
        if (this.size) {
            const value = Number.isNaN(Number(this.size))
                ? this.size
                : `${this.size}px`;
            style.width = value;
            style.height = value;
        }
        if (this.rotate && Number.isSafeInteger(this.rotate)) {
            style.transform = `rotate(${this.rotate}deg)`;
        }
        const IconName = this.name ? `zane-icon-${this.name}` : 'slot';
        return (h(Host, { key: 'ab0cece39bb8e64789ed6614e659114e24dd4e58', class: ns.b() }, h(IconName, { key: '5def34d8c619f4be0f352bd1043a90b718fe1e71', class: classNameFun(this.classNames, ns.is('spin', this.spin)), style: style })));
    }
    static get is() { return "zane-icon"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-icon.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-icon.css"]
        };
    }
    static get properties() {
        return {
            "classNames": {
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
                "attribute": "class-names",
                "defaultValue": "''"
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
            "name": {
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
                "attribute": "name"
            },
            "rotate": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "rotate"
            },
            "size": {
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
                "attribute": "size"
            },
            "spin": {
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
                "attribute": "spin"
            },
            "styles": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "object",
                    "resolved": "object",
                    "references": {}
                },
                "required": false,
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
}
