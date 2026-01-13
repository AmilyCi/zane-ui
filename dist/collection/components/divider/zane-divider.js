import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
import { findAllLegitChildren } from "../../utils";
const ns = useNamespace('divider');
export class ZaneDivider {
    constructor() {
        this.borderStyle = 'solid';
        this.contentPosition = 'center';
        this.direction = 'horizontal';
    }
    render() {
        const dividerStyle = ns.cssVar({
            'border-style': this.borderStyle,
        });
        const $hasContent = findAllLegitChildren(this.el).length > 0;
        return (h(Host, { key: '6dc2a9015a6ea70ecd3df5ee7f9d3bd2b32c48c5' }, h("div", { key: 'a2107a9c6fff9452f6db249f46b4b68325cba64c', class: [ns.b(), ns.m(this.direction)].join(' '), role: "separator", style: dividerStyle }, $hasContent && this.direction !== 'vertical' && (h("div", { key: '71402652203aeeaf5a59512908c232b0df28de50', class: [ns.e('text'), ns.is(this.contentPosition)].join(' ') }, h("slot", { key: 'aad8652845808c512f65777a0cfad3a56df91d4f' }))))));
    }
    static get is() { return "zane-divider"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-divider.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-divider.css"]
        };
    }
    static get properties() {
        return {
            "borderStyle": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "CSSStyleDeclaration['borderStyle']",
                    "resolved": "string",
                    "references": {
                        "CSSStyleDeclaration": {
                            "location": "global",
                            "id": "global::CSSStyleDeclaration"
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
                "attribute": "border-style",
                "defaultValue": "'solid'"
            },
            "contentPosition": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'center' | 'left' | 'right'",
                    "resolved": "\"center\" | \"left\" | \"right\"",
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
                "attribute": "content-position",
                "defaultValue": "'center'"
            },
            "direction": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'horizontal' | 'vertical'",
                    "resolved": "\"horizontal\" | \"vertical\"",
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
                "attribute": "direction",
                "defaultValue": "'horizontal'"
            }
        };
    }
    static get elementRef() { return "el"; }
}
