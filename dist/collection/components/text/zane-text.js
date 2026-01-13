import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
import { formContexts } from "../form/constants";
const ns = useNamespace('text');
export class ZaneText {
    constructor() {
        this.size = '';
        this.type = '';
    }
    get formContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM') {
                context = formContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get textSize() {
        var _a;
        return this.size || ((_a = this.formContext) === null || _a === void 0 ? void 0 : _a.size) || 'default';
    }
    componentDidLoad() {
        this.bindTitle();
    }
    componentDidUpdate() {
        this.bindTitle();
    }
    render() {
        const textKls = [
            ns.b(),
            ns.m(this.type),
            ns.m(this.textSize),
            ns.is('truncated', this.truncated),
            ns.is('line-clamp', this.lineClamp !== undefined),
        ].join(' ');
        return (h(Host, { key: 'c09680b49d35a9a599f23e8032c4b40e6f542817', class: textKls, style: { '-webkit-line-clamp': this.lineClamp } }, h("slot", { key: '984fe274bf0456e6edad2b9c10acda347842dbff' })));
    }
    bindTitle() {
        if (this.el.title) {
            return;
        }
        let shouldAddTitle = false;
        const text = this.el.textContent || '';
        if (this.truncated) {
            const width = this.el.offsetWidth;
            const scrollWidth = this.el.scrollWidth;
            if (width && scrollWidth && scrollWidth > width) {
                shouldAddTitle = true;
            }
        }
        else if (this.lineClamp !== undefined) {
            const height = this.el.offsetHeight;
            const scrollHeight = this.el.scrollHeight;
            if (height && scrollHeight && scrollHeight > height) {
                shouldAddTitle = true;
            }
        }
        if (shouldAddTitle) {
            this.el.setAttribute('title', text);
        }
        else {
            this.el.removeAttribute('title');
        }
    }
    static get is() { return "zane-text"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-text.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-text.css"]
        };
    }
    static get properties() {
        return {
            "lineClamp": {
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
                "attribute": "line-clamp"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "ComponentSize",
                    "resolved": "\"\" | \"default\" | \"large\" | \"small\"",
                    "references": {
                        "ComponentSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ComponentSize",
                            "referenceLocation": "ComponentSize"
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
                "attribute": "size",
                "defaultValue": "''"
            },
            "truncated": {
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
                "attribute": "truncated"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'' | 'danger' | 'info' | 'primary' | 'success' | 'warning'",
                    "resolved": "\"\" | \"danger\" | \"info\" | \"primary\" | \"success\" | \"warning\"",
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
                "attribute": "type",
                "defaultValue": "''"
            }
        };
    }
    static get elementRef() { return "el"; }
}
