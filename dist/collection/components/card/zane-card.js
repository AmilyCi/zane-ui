import { h, Host } from "@stencil/core";
import state from "../../global/store";
import { useNamespace } from "../../hooks";
const ns = useNamespace('card');
export class ZaneCard {
    constructor() {
        this.bodyClass = '';
        this.bodyStyle = {};
        this.footer = '';
        this.footerClass = '';
        this.hasFooterContent = false;
        this.hasHeaderContent = false;
        this.header = '';
        this.headerClass = '';
    }
    checkSlotContent() {
        this.hasHeaderContent = !!this.el.querySelector('[slot="header"]');
        this.hasFooterContent = !!this.el.querySelector('[slot="footer"]');
    }
    componentWillLoad() {
        this.checkSlotContent();
    }
    render() {
        return (h(Host, { key: '36edc2178e7664e874357dceba58a14b566798bb' }, h("div", { key: 'a7a507b4cfa0d989154baa80eda7e92845ca7712', class: [
                ns.b(),
                ns.is(`${this.shadow || state.configProviderContext.card.shadow || 'always'}-shadow`),
            ].join(' ') }, (this.hasHeaderContent || this.header) && (h("div", { key: '28c0e2ffe27ce4e1b0867d27aa81af2746c7d41d', class: [ns.e('header'), this.headerClass].join(' ') }, h("slot", { key: '743f22be327bb95df80dcd4f89d6aced4ba63635', name: "header" }, this.header))), h("div", { key: '72643bb0417a91a1cc2d73eac6513a8d3cec6ca1', class: [ns.e('body'), this.bodyClass].join(' '), style: this.bodyStyle }, h("slot", { key: '79477d065273442a648a3dde7248a54fe1c00007' })), (this.hasFooterContent || this.footer) && (h("div", { key: '7adb1ea92144efbd189b0bb7bf913f6802f11aca', class: [ns.e('footer'), this.footerClass].join(' ') }, h("slot", { key: '011b7417d19e8379b25b4f98aaef1dcc2136ead6', name: "footer" }, this.footer))))));
    }
    static get is() { return "zane-card"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-card.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-card.css"]
        };
    }
    static get properties() {
        return {
            "bodyClass": {
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
                "attribute": "body-class",
                "defaultValue": "''"
            },
            "bodyStyle": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Record<string, string>",
                    "resolved": "string",
                    "references": {
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
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
                "defaultValue": "{}"
            },
            "footer": {
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
                "attribute": "footer",
                "defaultValue": "''"
            },
            "footerClass": {
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
                "attribute": "footer-class",
                "defaultValue": "''"
            },
            "header": {
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
                "attribute": "header",
                "defaultValue": "''"
            },
            "headerClass": {
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
                "attribute": "header-class",
                "defaultValue": "''"
            },
            "shadow": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'always' | 'hover' | 'never'",
                    "resolved": "\"always\" | \"hover\" | \"never\"",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "shadow"
            }
        };
    }
    static get states() {
        return {
            "hasFooterContent": {},
            "hasHeaderContent": {}
        };
    }
    static get elementRef() { return "el"; }
}
