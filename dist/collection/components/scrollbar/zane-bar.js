import { h, Host, } from "@stencil/core";
import { GAP, scrollbarContexts } from "../../constants";
export class ZaneBar {
    constructor() {
        this.moveX = 0;
        this.moveY = 0;
        this.ratioX = 1;
        this.ratioY = 1;
        this.sizeHeight = '';
        this.sizeWidth = '';
    }
    get scrollbarContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SCROLLBAR') {
                context = scrollbarContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    async handleScroll(wrap) {
        if (wrap) {
            const offsetHeight = wrap.offsetHeight - GAP;
            const offsetWidth = wrap.offsetWidth - GAP;
            this.moveY = ((wrap.scrollTop * 100) / offsetHeight) * this.ratioY;
            this.moveX = ((wrap.scrollLeft * 100) / offsetWidth) * this.ratioX;
        }
    }
    render() {
        return (h(Host, { key: 'ea377501d1432ad26f41f2526f73eab5ed64bd29' }, h("zane-thumb", { key: '56ff0bf173b8bedad8621b0326990245cb4c24e0', always: this.always, move: this.moveX, ratio: this.ratioX, size: this.sizeWidth }), h("zane-thumb", { key: 'e8ccb4067fe314b1a856af9a70e7d523339a7ed9', always: this.always, move: this.moveY, ratio: this.ratioY, size: this.sizeHeight, vertical: true })));
    }
    async update() {
        var _a;
        const wrap = (_a = this.scrollbarContext) === null || _a === void 0 ? void 0 : _a.wrapElement;
        if (!wrap)
            return;
        const offsetHeight = wrap.offsetHeight - GAP;
        const offsetWidth = wrap.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
        const height = Math.max(originalHeight, this.minSize);
        const width = Math.max(originalWidth, this.minSize);
        this.ratioY =
            originalHeight /
                (offsetHeight - originalHeight) /
                (height / (offsetHeight - height));
        this.ratioX =
            originalWidth /
                (offsetWidth - originalWidth) /
                (width / (offsetWidth - width));
        this.sizeHeight = height + GAP < offsetHeight ? `${height}px` : '';
        this.sizeWidth = width + GAP < offsetWidth ? `${width}px` : '';
    }
    static get is() { return "zane-bar"; }
    static get properties() {
        return {
            "always": {
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
                "attribute": "always"
            },
            "minSize": {
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
                "attribute": "min-size"
            }
        };
    }
    static get states() {
        return {
            "moveX": {},
            "moveY": {},
            "ratioX": {},
            "ratioY": {},
            "sizeHeight": {},
            "sizeWidth": {}
        };
    }
    static get methods() {
        return {
            "handleScroll": {
                "complexType": {
                    "signature": "(wrap: HTMLDivElement) => Promise<void>",
                    "parameters": [{
                            "name": "wrap",
                            "type": "HTMLDivElement",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "HTMLDivElement": {
                            "location": "global",
                            "id": "global::HTMLDivElement"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "update": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
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
}
