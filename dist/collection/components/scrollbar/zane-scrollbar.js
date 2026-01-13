import { h, Host, } from "@stencil/core";
import { scrollbarContexts } from "../../constants";
import { useEventListener, useNamespace, useResizeObserver } from "../../hooks";
import { addUnit, debugWarn, isNumber, nextFrame, normalizeStyle, } from "../../utils";
import { ScrollbarContext } from "./scrollbar-context";
const ns = useNamespace('scrollbar');
const COMPONENT_NAME = 'zane-scrollbar';
const DIRECTION_PAIRS = {
    bottom: 'top',
    left: 'right',
    right: 'left',
    top: 'bottom',
};
export class ZaneScrollbar {
    constructor() {
        this.distance = 0;
        this.distanceScrollState = {
            bottom: false,
            left: false,
            right: false,
            top: false,
        };
        this.height = '';
        this.maxHeight = '';
        this.minSize = 20;
        this.tag = 'div';
        this.viewClass = '';
        this.viewStyle = {};
        this.wrapClass = '';
        this.wrapStyle = {};
        this.context = new ScrollbarContext();
        this.direction = 'right';
        this.stopResizeListener = undefined;
        this.stopResizeObserver = undefined;
        this.stopWrapResizeObserver = undefined;
        this.wrapScrollLeft = 0;
        this.wrapScrollTop = 0;
        this.onScrollHandler = () => {
            this.handleScroll();
        };
        this.onSizeChangeHandler = () => {
            this.update();
        };
        this.shouldSkipDirection = (direction) => {
            var _a;
            return (_a = this.distanceScrollState[direction]) !== null && _a !== void 0 ? _a : false;
        };
        this.updateTriggerStatus = (arrivedStates) => {
            const oppositeDirection = DIRECTION_PAIRS[this.direction];
            if (!oppositeDirection)
                return;
            const arrived = arrivedStates[this.direction];
            const oppositeArrived = arrivedStates[oppositeDirection];
            if (arrived && !this.distanceScrollState[this.direction]) {
                this.distanceScrollState[this.direction] = true;
            }
            if (!oppositeArrived && this.distanceScrollState[oppositeDirection]) {
                this.distanceScrollState[oppositeDirection] = false;
            }
        };
    }
    componentDidLoad() {
        this.context.wrapElement = this.wrapRef;
        this.watchNoresizeHandler();
        if (!this.native) {
            nextFrame(() => {
                this.update();
            });
        }
    }
    componentDidUpdate() {
        this.update();
    }
    componentWillLoad() {
        this.context.scrollbarElement = this.el;
        scrollbarContexts.set(this.el, this.context);
    }
    async handleScroll() {
        var _a;
        if (this.wrapRef) {
            (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.handleScroll(this.wrapRef);
            const prevTop = this.wrapScrollTop;
            const prevLeft = this.wrapScrollLeft;
            this.wrapScrollTop = this.wrapRef.scrollTop;
            this.wrapScrollLeft = this.wrapRef.scrollLeft;
            const arrivedStates = {
                bottom: this.wrapScrollTop + this.wrapRef.clientHeight >=
                    this.wrapRef.scrollHeight - this.distance,
                left: this.wrapScrollLeft <= this.distance && prevLeft !== 0,
                right: this.wrapScrollLeft + this.wrapRef.clientWidth >=
                    this.wrapRef.scrollWidth - this.distance &&
                    prevLeft !== this.wrapScrollLeft,
                top: this.wrapScrollTop <= this.distance && prevTop !== 0,
            };
            this.scrollEvent.emit({
                scrollLeft: this.wrapScrollLeft,
                scrollTop: this.wrapScrollTop,
            });
            if (prevTop !== this.wrapScrollTop) {
                this.direction = this.wrapScrollTop > prevTop ? 'bottom' : 'top';
            }
            if (prevLeft !== this.wrapScrollLeft) {
                this.direction = this.wrapScrollLeft > prevLeft ? 'right' : 'left';
            }
            if (this.distance > 0) {
                if (this.shouldSkipDirection(this.direction)) {
                    return;
                }
                this.updateTriggerStatus(arrivedStates);
            }
            if (arrivedStates[this.direction]) {
                this.endReachedEvent.emit(this.direction);
            }
        }
    }
    render() {
        const wrapKls = [
            this.wrapClass,
            ns.e('wrap'),
            !this.native && ns.em('wrap', 'hidden-default'),
        ].join(' ');
        const resizeKls = [ns.e('view'), this.viewClass].join(' ');
        const wrapStyle = normalizeStyle(this.wrapStyle);
        if (this.height) {
            wrapStyle.height = addUnit(this.height);
        }
        if (this.maxHeight) {
            wrapStyle.maxHeight = addUnit(this.maxHeight);
        }
        return (h(Host, { key: 'f6bbfe1896623897ca691e8e8ffdd0ddc7d4e034', class: ns.b() }, h("div", { key: 'c8c12eb40e20e9c883f9a50d359cd263731d19fb', class: wrapKls, onScroll: this.onScrollHandler, ref: (el) => (this.wrapRef = el), style: wrapStyle, tabindex: this.el.tabIndex }, h("div", { key: '29034af042633e572399e36fb0e1f042a4125ad6', class: resizeKls, id: this.el.id, ref: (el) => (this.resizeRef = el), role: this.role, style: this.viewStyle }, h("slot", { key: 'e6d68794cb2944b3748d5bbabae3d09c983286bd' }))), h("zane-bar", { key: '0ffa1e42753ec1c13c647c5faf5d3a8af36a9336', always: this.always, "min-size": this.minSize, ref: (el) => (this.barRef = el) })));
    }
    async scrollToCoord(xCoord, yCoord) {
        this.wrapRef.scrollTo(xCoord, yCoord);
    }
    async setScrollLeft(value) {
        if (!isNumber(value)) {
            debugWarn(COMPONENT_NAME, 'value must be a number');
            return;
        }
        this.wrapRef.scrollLeft = value;
    }
    async setScrollTop(value) {
        if (!isNumber(value)) {
            debugWarn(COMPONENT_NAME, 'value must be a number');
            return;
        }
        this.wrapRef.scrollTop = value;
    }
    async update() {
        var _a;
        (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.update();
        this.distanceScrollState[this.direction] = false;
    }
    watchHeightHandler() {
        if (!this.native)
            nextFrame(() => {
                var _a;
                this.update();
                if (this.wrapRef) {
                    (_a = this.barRef) === null || _a === void 0 ? void 0 : _a.handleScroll(this.wrapRef);
                }
            });
    }
    watchNoresizeHandler() {
        var _a, _b, _c;
        if (this.noresize) {
            (_a = this.stopResizeListener) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.stopResizeObserver) === null || _b === void 0 ? void 0 : _b.call(this);
            (_c = this.stopWrapResizeObserver) === null || _c === void 0 ? void 0 : _c.call(this);
        }
        else {
            this.stopResizeObserver = useResizeObserver(this.resizeRef, this.onSizeChangeHandler);
            this.stopWrapResizeObserver = useResizeObserver(this.wrapRef, this.onSizeChangeHandler);
            const { disconnect } = useEventListener(document, 'resize', this.onSizeChangeHandler);
            this.stopResizeListener = disconnect;
        }
    }
    static get is() { return "zane-scrollbar"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-scrollbar.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-scrollbar.css"]
        };
    }
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
            "distance": {
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
                "attribute": "distance",
                "defaultValue": "0"
            },
            "height": {
                "type": "any",
                "mutable": false,
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
                "reflect": true,
                "attribute": "height",
                "defaultValue": "''"
            },
            "maxHeight": {
                "type": "any",
                "mutable": false,
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
                "attribute": "max-height",
                "defaultValue": "''"
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
                "attribute": "min-size",
                "defaultValue": "20"
            },
            "native": {
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
                "attribute": "native"
            },
            "noresize": {
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
                "attribute": "noresize"
            },
            "role": {
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
                "attribute": "role"
            },
            "tag": {
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
                "attribute": "tag",
                "defaultValue": "'div'"
            },
            "viewClass": {
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
                "attribute": "view-class",
                "defaultValue": "''"
            },
            "viewStyle": {
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
            "wrapClass": {
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
                "attribute": "wrap-class",
                "defaultValue": "''"
            },
            "wrapStyle": {
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
            }
        };
    }
    static get states() {
        return {
            "distanceScrollState": {}
        };
    }
    static get events() {
        return [{
                "method": "endReachedEvent",
                "name": "end-reached",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "ScrollbarDirection",
                    "resolved": "\"bottom\" | \"left\" | \"right\" | \"top\"",
                    "references": {
                        "ScrollbarDirection": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ScrollbarDirection",
                            "referenceLocation": "ScrollbarDirection"
                        }
                    }
                }
            }, {
                "method": "scrollEvent",
                "name": "zScroll",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "{\n    scrollLeft: number;\n    scrollTop: number;\n  }",
                    "resolved": "{ scrollLeft: number; scrollTop: number; }",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "handleScroll": {
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
            },
            "scrollToCoord": {
                "complexType": {
                    "signature": "(xCoord: number, yCoord?: number) => Promise<void>",
                    "parameters": [{
                            "name": "xCoord",
                            "type": "number",
                            "docs": ""
                        }, {
                            "name": "yCoord",
                            "type": "number",
                            "docs": ""
                        }],
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
            },
            "setScrollLeft": {
                "complexType": {
                    "signature": "(value: number) => Promise<void>",
                    "parameters": [{
                            "name": "value",
                            "type": "number",
                            "docs": ""
                        }],
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
            },
            "setScrollTop": {
                "complexType": {
                    "signature": "(value: number) => Promise<void>",
                    "parameters": [{
                            "name": "value",
                            "type": "number",
                            "docs": ""
                        }],
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
    static get watchers() {
        return [{
                "propName": "maxHeight",
                "methodName": "watchHeightHandler"
            }, {
                "propName": "height",
                "methodName": "watchHeightHandler"
            }, {
                "propName": "noresize",
                "methodName": "watchNoresizeHandler"
            }];
    }
}
