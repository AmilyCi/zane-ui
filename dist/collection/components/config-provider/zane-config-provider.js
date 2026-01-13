import { h, Host } from "@stencil/core";
export class ZaneConfigProvider {
    render() {
        return (h(Host, { key: '9a7d73c3ab6367f2cac89722951bf5d64a4e6f32' }, h("slot", { key: '0927724a065559b161fd7aa23e954c98ae1aaae3' })));
    }
    static get is() { return "zane-config-provider"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-config-provider.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-config-provider.css"]
        };
    }
    static get properties() {
        return {
            "button": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "ButtonConfigContext",
                    "resolved": "ButtonConfigContext",
                    "references": {
                        "ButtonConfigContext": {
                            "location": "import",
                            "path": "../../interfaces",
                            "id": "src/interfaces/index.ts::ButtonConfigContext",
                            "referenceLocation": "ButtonConfigContext"
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
                "setter": false
            },
            "card": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "CardConfigContext",
                    "resolved": "CardConfigContext",
                    "references": {
                        "CardConfigContext": {
                            "location": "import",
                            "path": "../../interfaces",
                            "id": "src/interfaces/index.ts::CardConfigContext",
                            "referenceLocation": "CardConfigContext"
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
                "setter": false
            },
            "locale": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Language",
                    "resolved": "{ el: TranslatePair; name: string; }",
                    "references": {
                        "Language": {
                            "location": "import",
                            "path": "../../locale",
                            "id": "src/locale/index.ts::Language",
                            "referenceLocation": "Language"
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
                "setter": false
            },
            "zIndex": {
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
                "attribute": "z-index"
            }
        };
    }
    static get elementRef() { return "el"; }
}
