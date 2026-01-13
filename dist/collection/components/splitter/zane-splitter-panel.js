import { h, Host, } from "@stencil/core";
import { splitterRootContexts } from "../../constants/splitter";
import { useNamespace } from "../../hooks";
import { buildUUID, throwError } from "../../utils";
import { getPct, getPx, isPct, isPx } from "./utils";
const ns = useNamespace('splitter-panel');
const COMPONENT_NAME = 'zane-splitter-panel';
export class ZaneSplitterPanel {
    constructor() {
        this.resizable = true;
        this.onPercentSizesUpdate = () => {
            this.update();
        };
        this.update = () => {
            this.panelSize =
                this.splitterContext.pxSizes[this.splitterContext.getPanelIndex(this.el)];
        };
    }
    get splitterContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SPLITTER') {
                context = splitterRootContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        if (!this.splitterContext)
            throwError(COMPONENT_NAME, 'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>');
        this.uuid = buildUUID();
        this.splitterContext.addPercentSizesChangeListener(this.onPercentSizesUpdate);
        this.splitterContext.registerPanel(this);
    }
    disconnectedCallback() {
        this.splitterContext.removePercentSizesChangeListener(this.onPercentSizesUpdate);
        this.splitterContext.unregisterPanel(this);
    }
    handleSizeChange() {
        const size = this.sizeToPx(this.size);
        const maxSize = this.sizeToPx(this.max);
        const minSize = this.sizeToPx(this.min);
        const finalSize = Math.min(Math.max(size, minSize || 0), maxSize || size);
        this.updateSizeEvent.emit(finalSize);
        this.panelSize = finalSize;
    }
    render() {
        return (h(Host, { key: '8bce94b1ba7d6cb31da1b841448b4f1b3e2357f4', class: ns.b(), style: { flexBasis: `${this.panelSize}px` } }, h("slot", { key: '924976f7090b30e7598f237947aa338fad0f0108' })));
    }
    sizeToPx(str) {
        if (isPct(str)) {
            return getPct(str) * this.splitterContext.containerSize || 0;
        }
        else if (isPx(str)) {
            return getPx(str);
        }
        return str !== null && str !== void 0 ? str : 0;
    }
    static get is() { return "zane-splitter-panel"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-splitter-panel.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-splitter-panel.css"]
        };
    }
    static get properties() {
        return {
            "collapsible": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean | { end?: boolean; start?: boolean }",
                    "resolved": "boolean | { end?: boolean; start?: boolean; }",
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
                "attribute": "collapsible"
            },
            "max": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
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
                "attribute": "max"
            },
            "min": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
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
                "attribute": "min"
            },
            "resizable": {
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
                "attribute": "resizable",
                "defaultValue": "true"
            },
            "size": {
                "type": "any",
                "mutable": true,
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
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
            "uuid": {
                "type": "string",
                "mutable": true,
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
                "attribute": "uuid"
            }
        };
    }
    static get states() {
        return {
            "isResizable": {},
            "panelSize": {}
        };
    }
    static get events() {
        return [{
                "method": "updateSizeEvent",
                "name": "updateSize",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "size",
                "methodName": "handleSizeChange"
            }];
    }
}
