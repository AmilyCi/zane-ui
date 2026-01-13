import { h, Host, } from "@stencil/core";
import { splitterRootContexts } from "../../constants/splitter";
import { useNamespace } from "../../hooks";
import { SplitterRootContext } from "./splitter-context";
const ns = useNamespace('splitter');
export class ZaneSplitter {
    constructor() {
        this.layout = 'horizontal';
        this.lazy = false;
        this.lazyOffset = 0;
        this.movingIndex = null;
        this.lazyOffsetUpdate = (val) => {
            this.lazyOffset = val;
        };
        this.movingIndexUpdate = (val) => {
            this.movingIndex = val;
        };
    }
    componentDidLoad() { }
    componentWillLoad() {
        this.rootContext = new SplitterRootContext();
        this.rootContext.containerEl = this.el;
        this.rootContext.layout = this.layout;
        this.rootContext.lazy = this.lazy;
        this.rootContext.onMoveStartCallback = (index) => {
            this.resizeStartEvent.emit({
                index,
            });
        };
        this.rootContext.onMovingCallback = (index) => {
            this.resizeEvent.emit({
                index,
            });
        };
        this.rootContext.onMoveEndCallback = (index) => {
            this.resizeEndEvent.emit({
                index,
            });
        };
        this.rootContext.onCollapseCallback = (index, type) => {
            this.collapseEvent.emit({
                index,
                type,
            });
        };
        this.rootContext.addLazyOffsetChangeListener(this.lazyOffsetUpdate);
        this.rootContext.addMovingIndexChangeListener(this.movingIndexUpdate);
        // console.log(this.rootContext.uuid);
        splitterRootContexts.set(this.el, this.rootContext);
    }
    disconnectedCallback() {
        this.rootContext = null;
        splitterRootContexts.delete(this.el);
    }
    handleLayoutChange() {
        this.rootContext.layout = this.layout;
    }
    handleLazyChange() {
        this.rootContext.lazy = this.lazy;
        if (this.lazyOffset) {
            const mouseup = new MouseEvent('mouseup', { bubbles: true });
            window.dispatchEvent(mouseup);
        }
    }
    render() {
        const splitterStyles = {
            [ns.cssVarBlockName('bar-offset')]: this.lazy
                ? `${this.lazyOffset}px`
                : undefined,
        };
        return (h(Host, { key: '75149a66180b5169fc8f622dfe00d23071eee1ae', class: [ns.b(), ns.e(this.layout)].join(' '), style: splitterStyles }, h("slot", { key: 'd5876da316acb62a7686e11871643809eb28e582' }), this.movingIndex && (h("div", { key: 'd904b16e57318ec41807b1ca89c09f6cc122c811', class: [ns.e('mask'), ns.e(`mask-${this.layout}`)].join(' ') }))));
    }
    static get is() { return "zane-splitter"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-splitter.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-splitter.css"]
        };
    }
    static get properties() {
        return {
            "layout": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'horizontal' | 'vertical'",
                    "resolved": "\"horizontal\" | \"vertical\"",
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
                "attribute": "layout",
                "defaultValue": "'horizontal'"
            },
            "lazy": {
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
                "attribute": "lazy",
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "lazyOffset": {},
            "movingIndex": {}
        };
    }
    static get events() {
        return [{
                "method": "collapseEvent",
                "name": "collapse",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "{\n    index: number;\n    type: 'end' | 'start';\n  }",
                    "resolved": "{ index: number; type: \"start\" | \"end\"; }",
                    "references": {}
                }
            }, {
                "method": "resizeEndEvent",
                "name": "zResizeEnd",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "{\n    index: number;\n  }",
                    "resolved": "{ index: number; }",
                    "references": {}
                }
            }, {
                "method": "resizeEvent",
                "name": "zResize",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "{\n    index: number;\n  }",
                    "resolved": "{ index: number; }",
                    "references": {}
                }
            }, {
                "method": "resizeStartEvent",
                "name": "zResizeStart",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "{\n    index: number;\n  }",
                    "resolved": "{ index: number; }",
                    "references": {}
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "layout",
                "methodName": "handleLayoutChange"
            }, {
                "propName": "lazy",
                "methodName": "handleLazyChange"
            }];
    }
}
