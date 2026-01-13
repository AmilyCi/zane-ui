import { h, Host, } from "@stencil/core";
import { collapseContexts } from "../../constants";
import { useNamespace } from "../../hooks";
import { castArray, debugWarn, isBoolean, isPromise, throwError, } from "../../utils";
import { CollapseContext } from "./collapse-context";
const ns = useNamespace('collapse');
const SCOPE = 'zane-collapse';
export class ZaneCollapse {
    constructor() {
        this.expandIconPosition = 'right';
        this.value = [];
        this.handleChange = (name) => {
            if (this.accordion) {
                this.setActiveNames([this.activeNames[0] === name ? '' : name]);
            }
            else {
                const _activeNames = [...this.activeNames];
                const index = _activeNames.indexOf(name);
                if (index === -1) {
                    _activeNames.push(name);
                }
                else {
                    _activeNames.splice(index, 1);
                }
                this.setActiveNames(_activeNames);
            }
        };
        this.handleItemClick = async (name) => {
            if (!this.beforeCollapse) {
                this.handleChange(name);
                return;
            }
            const shouldChange = this.beforeCollapse(name);
            const isPromiseOrBool = [
                isBoolean(shouldChange),
                isPromise(shouldChange),
            ].includes(true);
            if (!isPromiseOrBool) {
                throwError(SCOPE, 'beforeCollapse must return type `Promise<boolean>` or `boolean`');
            }
            if (isPromise(shouldChange)) {
                shouldChange
                    .then((result) => {
                    if (result !== false) {
                        this.handleChange(name);
                    }
                })
                    .catch((error) => {
                    debugWarn(SCOPE, `some error occurred: ${error}`);
                });
            }
            else if (shouldChange) {
                this.handleChange(name);
            }
        };
    }
    get rootKls() {
        return [ns.b(), ns.b(`icon-position-${this.expandIconPosition}`)].join(' ');
    }
    componentWillLoad() {
        this.activeNames = castArray(this.value);
        const context = new CollapseContext();
        context.handleItemClick = this.handleItemClick;
        context.updateActiveNames(this.activeNames);
        collapseContexts.set(this.el, context);
    }
    disconnectedCallback() {
        collapseContexts.delete(this.el);
    }
    onModelValueChange() {
        var _a;
        this.activeNames = castArray(this.value);
        (_a = collapseContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateActiveNames(this.activeNames);
    }
    render() {
        return (h(Host, { key: '5e22fe183f769df905cb68338143bfaf2209a6a3', class: this.rootKls }, h("slot", { key: '0110b8b8a254d2ab45c9e3583e8b4f7b0a51e029' })));
    }
    async setActiveNames(_activeNames) {
        var _a;
        this.activeNames = _activeNames;
        const value = this.accordion ? this.activeNames[0] : this.activeNames;
        this.zaneUpdate.emit(value);
        this.zaneChange.emit(value);
        (_a = collapseContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateActiveNames(this.activeNames);
    }
    static get is() { return "zane-collapse"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-collapse.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-collapse.css"]
        };
    }
    static get properties() {
        return {
            "accordion": {
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
                "attribute": "accordion"
            },
            "beforeCollapse": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(name: CollapseActiveName) => Awaitable<boolean>",
                    "resolved": "(name: CollapseActiveName) => Awaitable<boolean>",
                    "references": {
                        "CollapseActiveName": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::CollapseActiveName",
                            "referenceLocation": "CollapseActiveName"
                        },
                        "Awaitable": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::Awaitable",
                            "referenceLocation": "Awaitable"
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
            "expandIconPosition": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "CollapseIconPositionType",
                    "resolved": "\"left\" | \"right\"",
                    "references": {
                        "CollapseIconPositionType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::CollapseIconPositionType",
                            "referenceLocation": "CollapseIconPositionType"
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
                "attribute": "expand-icon-position",
                "defaultValue": "'right'"
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "CollapseModelValue",
                    "resolved": "CollapseActiveName[] | number | string",
                    "references": {
                        "CollapseModelValue": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::CollapseModelValue",
                            "referenceLocation": "CollapseModelValue"
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
                "attribute": "value",
                "defaultValue": "[]"
            }
        };
    }
    static get states() {
        return {
            "activeNames": {}
        };
    }
    static get events() {
        return [{
                "method": "zaneChange",
                "name": "zChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "(number | string)[] | number | string",
                    "resolved": "(string | number)[] | number | string",
                    "references": {}
                }
            }, {
                "method": "zaneUpdate",
                "name": "zUpdate",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "(number | string)[] | number | string",
                    "resolved": "(string | number)[] | number | string",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "setActiveNames": {
                "complexType": {
                    "signature": "(_activeNames: CollapseActiveName[]) => Promise<void>",
                    "parameters": [{
                            "name": "_activeNames",
                            "type": "CollapseActiveName[]",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "CollapseActiveName": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::CollapseActiveName",
                            "referenceLocation": "CollapseActiveName"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "value",
                "methodName": "onModelValueChange"
            }];
    }
}
