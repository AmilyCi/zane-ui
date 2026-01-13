import { h, Host, } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('link');
export class ZaneLink {
    constructor() {
        this.href = '';
        this.target = '_self';
        this.handleClick = (event) => {
            if (!this.disabled)
                this.clickEvent.emit(event);
        };
    }
    render() {
        var _a;
        const linkKls = [
            ns.b(),
            ns.m((_a = this.type) !== null && _a !== void 0 ? _a : 'default'),
            ns.is('disabled', this.disabled),
            ns.is('underline', this.underline === 'always'),
            ns.is('hover-underline', this.underline === 'hover' && !this.disabled),
        ].join(' ');
        const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');
        return (h(Host, { key: '0979db78edca14b43edbcca81abe16084c1b25aa' }, h("a", { key: 'cf22c93a6ce968564b0937d606458d9881f9f99e', class: linkKls, href: this.disabled || !this.href ? undefined : this.href, onClick: this.handleClick, target: this.disabled || !this.href ? undefined : this.target }, hasIcon && this.icon ? (h("zane-icon", { name: this.icon })) : (h("slot", { name: "icon" })), h("slot", { key: '148d258939ff46a538f096b22cae8087ea25ef66' }))));
    }
    static get is() { return "zane-link"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-link.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-link.css"]
        };
    }
    static get properties() {
        return {
            "disabled": {
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
                "attribute": "disabled"
            },
            "href": {
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
                "attribute": "href",
                "defaultValue": "''"
            },
            "icon": {
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
                "attribute": "icon"
            },
            "target": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'_blank' | '_parent' | '_self' | '_top' | string",
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
                "attribute": "target",
                "defaultValue": "'_self'"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "| 'danger'\n    | 'default'\n    | 'info'\n    | 'primary'\n    | 'success'\n    | 'warning'",
                    "resolved": "\"danger\" | \"default\" | \"info\" | \"primary\" | \"success\" | \"warning\"",
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
                "attribute": "type"
            },
            "underline": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'always' | 'hover' | 'never' | boolean",
                    "resolved": "\"always\" | \"hover\" | \"never\" | boolean",
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
                "attribute": "underline"
            }
        };
    }
    static get events() {
        return [{
                "method": "clickEvent",
                "name": "zClick",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "MouseEvent",
                    "resolved": "MouseEvent",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
}
