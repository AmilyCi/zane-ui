import { h, Host, } from "@stencil/core";
import { useNamespace } from "../../hooks";
import { addUnit, isNumber, isString } from "../../utils";
const ns = useNamespace('avatar');
export class ZaneAvatar {
    constructor() {
        this.fit = 'cover';
        this.hasLoadError = false;
        this.shape = 'circle';
        this.size = 'default';
        this.src = '';
    }
    get avatarClass() {
        const classList = [ns.b()];
        if (isString(this.size))
            classList.push(ns.m(this.size));
        if (this.icon)
            classList.push(ns.m('icon'));
        if (this.shape)
            classList.push(ns.m(this.shape));
        return classList.join(' ');
    }
    get fitStyle() {
        return { objectFit: this.fit };
    }
    get sizeStyle() {
        return isNumber(this.size)
            ? ns.cssVarBlock({
                size: addUnit(this.size) || '',
            })
            : undefined;
    }
    handleError(e) {
        this.hasLoadError = true;
        this.imgError.emit(e);
    }
    render() {
        return (h(Host, { key: '8c1791ef21d387955357dd167227fb2ac6f0cdff', class: this.avatarClass, style: this.sizeStyle }, this.renderContent()));
    }
    watchSrcHandler() {
        this.hasLoadError = false;
    }
    renderContent() {
        if ((this.src || this.srcSet) && !this.hasLoadError) {
            return (h("img", { alt: this.alt, onError: (e) => this.handleError(e), src: this.src, srcset: this.srcSet, style: this.fitStyle }));
        }
        if (this.icon) {
            return h("zane-icon", { name: this.icon });
        }
        return h("slot", null);
    }
    static get is() { return "zane-avatar"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-avatar.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-avatar.css"]
        };
    }
    static get properties() {
        return {
            "alt": {
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
                "reflect": true,
                "attribute": "alt"
            },
            "fit": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'",
                    "resolved": "\"contain\" | \"cover\" | \"fill\" | \"none\" | \"scale-down\"",
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
                "attribute": "fit",
                "defaultValue": "'cover'"
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
                "reflect": true,
                "attribute": "icon"
            },
            "shape": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'circle' | 'square'",
                    "resolved": "\"circle\" | \"square\"",
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
                "attribute": "shape",
                "defaultValue": "'circle'"
            },
            "size": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'default' | 'large' | 'small' | number",
                    "resolved": "\"default\" | \"large\" | \"small\" | number",
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
                "attribute": "size",
                "defaultValue": "'default'"
            },
            "src": {
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
                "reflect": true,
                "attribute": "src",
                "defaultValue": "''"
            },
            "srcSet": {
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
                "reflect": true,
                "attribute": "srcset"
            }
        };
    }
    static get states() {
        return {
            "hasLoadError": {}
        };
    }
    static get events() {
        return [{
                "method": "imgError",
                "name": "imgError",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Event",
                    "resolved": "Event",
                    "references": {
                        "Event": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Event",
                            "referenceLocation": "Event"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "src",
                "methodName": "watchSrcHandler"
            }];
    }
}
