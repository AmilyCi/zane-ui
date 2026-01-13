import { h, Host } from "@stencil/core";
import { rowContexts } from "../../constants";
import { useNamespace } from "../../hooks";
const ns = useNamespace('row');
export class ZaneRow {
    constructor() {
        this.gutter = 0;
        this.justify = 'start';
    }
    get rowKls() {
        return [
            ns.b(),
            ns.is(`justify-${this.justify}`, this.justify !== 'start'),
            ns.is(`align-${this.align}`, !!this.align),
        ].join(' ');
    }
    get style() {
        const styles = {};
        if (!this.gutter) {
            return styles;
        }
        styles.marginRight = styles.marginLeft = `-${this.gutter / 2}px`;
        return styles;
    }
    componentWillLoad() {
        rowContexts.set(this.el, { gutter: this.gutter });
    }
    render() {
        return (h(Host, { key: '683afe851d8ba860ba71bad3c70ecdacfa276add', class: this.rowKls, style: this.style }, h("slot", { key: '9f0e64f8d8ccbed747039d4795d23edc81595ac7' })));
    }
    static get is() { return "zane-row"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-row.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-row.css"]
        };
    }
    static get properties() {
        return {
            "align": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "RowAlignType",
                    "resolved": "\"bottom\" | \"middle\" | \"top\"",
                    "references": {
                        "RowAlignType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::RowAlignType",
                            "referenceLocation": "RowAlignType"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "align"
            },
            "gutter": {
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
                "reflect": true,
                "attribute": "gutter",
                "defaultValue": "0"
            },
            "justify": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "RowJustifyType",
                    "resolved": "\"center\" | \"end\" | \"space-around\" | \"space-between\" | \"space-evenly\" | \"start\"",
                    "references": {
                        "RowJustifyType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::RowJustifyType",
                            "referenceLocation": "RowJustifyType"
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
                "reflect": true,
                "attribute": "justify",
                "defaultValue": "'start'"
            }
        };
    }
    static get elementRef() { return "el"; }
}
