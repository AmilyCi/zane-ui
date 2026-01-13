import { h } from "@stencil/core";
import { collapseContexts } from "../../constants";
import state from "../../global/store";
import { useNamespace } from "../../hooks";
import { getTransitionInfo, nextFrame, whenTransitionEnds } from "../../utils";
const ns = useNamespace('collapse');
export class ZaneCollapseItem {
    constructor() {
        this.focusing = false;
        this.icon = 'arrow-right';
        this.isActive = false;
        this.isClick = false;
        this.label = '';
        this.handleHeaderClick = (e) => {
            var _a;
            if (this.disabled)
                return;
            const target = e.target;
            if (target === null || target === void 0 ? void 0 : target.closest('input, textarea, select'))
                return;
            (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.handleItemClick(this.collapseItemName);
            this.focusing = false;
            this.isClick = true;
        };
    }
    get arrowKls() {
        return [ns.be('item', 'arrow'), ns.is('active', this.isActive)].join(' ');
    }
    get collapseContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-COLLAPSE') {
                context = collapseContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    get collapseItemName() {
        var _a;
        return ((_a = this.name) !== null && _a !== void 0 ? _a : `${ns.namespace}-id-${state.idInjection.prefix}-${this.id}`);
    }
    get headKls() {
        return [
            ns.be('item', 'header'),
            ns.is('active', this.isActive),
            this.focusing && !this.disabled ? 'focusing' : '',
        ].join(' ');
    }
    get id() {
        return state.idInjection.current++;
    }
    get itemContentKls() {
        return ns.be('item', 'content');
    }
    get itemTitleKls() {
        return ns.be('item', 'title');
    }
    get itemWrapperKls() {
        return ns.be('item', 'wrap');
    }
    get rootKls() {
        return [
            ns.b('item'),
            ns.is('active', this.isActive),
            ns.is('disabled', this.disabled),
        ].join(' ');
    }
    get scopedContentId() {
        return ns.b(`content-${this.id}`);
    }
    get scopedHeadId() {
        return ns.b(`head-${this.id}`);
    }
    componentDidLoad() {
        const bodyStyle = getComputedStyle(this.wrapperRef);
        this.wrapperHeight = bodyStyle.height;
        this.isActive ? this.handleShow() : this.handleHidden();
    }
    componentWillLoad() {
        this.updateCallback = () => {
            const context = this.collapseContext;
            if (context) {
                this.isActive = context.activeNames.includes(this.name);
            }
        };
        const context = this.collapseContext;
        if (context) {
            this.isActive = context.activeNames.includes(this.name);
            context.addActiveNamesChangeListener(this.updateCallback);
        }
    }
    disconnectedCallback() {
        var _a;
        (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.removeActiveNamesChangeListener(this.updateCallback);
    }
    handleEnterClick(e) {
        var _a;
        const target = e.target;
        if (target === null || target === void 0 ? void 0 : target.closest('input, textarea, select'))
            return;
        e.preventDefault();
        (_a = this.collapseContext) === null || _a === void 0 ? void 0 : _a.handleItemClick(this.collapseItemName);
    }
    handleFocus() {
        setTimeout(() => {
            if (this.isClick) {
                this.isClick = false;
            }
            else {
                this.focusing = true;
            }
        }, 50);
    }
    handleHidden() {
        if (this.wrapperRef) {
            const { timeout } = getTransitionInfo(this.wrapperRef, 'transition');
            this.wrapperRef.style.height = '0';
            whenTransitionEnds(this.wrapperRef, 'transition', timeout, () => {
                this.wrapperRef.style.display = 'none';
            });
        }
    }
    handleShow() {
        if (this.wrapperRef) {
            this.wrapperRef.style.display = '';
            nextFrame(() => {
                this.wrapperRef.style.height = this.wrapperHeight;
            });
        }
    }
    render() {
        return (h("div", { key: '6d80050c834a526620229db60b22c729f71393d0', class: this.rootKls }, h("div", { key: 'eb86b9e92f1182ec1a25f50cbdd0240d3b54df64', class: this.headKls, id: this.scopedHeadId, onBlur: () => (this.focusing = false), onClick: this.handleHeaderClick, onFocus: this.handleFocus, onKeyDown: this.handleEnterClick, role: "button", tabindex: this.disabled ? -1 : 0 }, h("span", { key: 'c254462eb94f4d42612444c6938a9f6d7f641c13', class: this.itemTitleKls }, h("slot", { key: 'f67c5ff7d5cca070644415786f9b1deb7c01c147', name: "title" }, this.label)), h("slot", { key: '796123a540c281d8e61038160262bb32a90110ef', name: "icon" }, this.icon && (h("zane-icon", { key: '9c41e59d31bbe30de0a439c7681a2ff279070982', class: this.arrowKls, name: this.icon })))), h("div", { key: 'dcb95525e837b721527eb6d159d69270b11e368f', class: this.itemWrapperKls, id: this.scopedContentId, ref: (el) => (this.wrapperRef = el) }, h("div", { key: 'a9077931ddbf23990faebcb71b708616906d01a5', class: this.itemContentKls }, h("slot", { key: '4f6b5c8c7ae9c6d87dde77c0eb8107ca08533b21' })))));
    }
    watchIsActiveHandler(val) {
        val ? this.handleShow() : this.handleHidden();
    }
    static get is() { return "zane-collapse-item"; }
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
            "icon": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
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
                "attribute": "icon",
                "defaultValue": "'arrow-right'"
            },
            "label": {
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
                "attribute": "title",
                "defaultValue": "''"
            },
            "name": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "CollapseActiveName",
                    "resolved": "number | string",
                    "references": {
                        "CollapseActiveName": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::CollapseActiveName",
                            "referenceLocation": "CollapseActiveName"
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
                "reflect": false,
                "attribute": "name"
            }
        };
    }
    static get states() {
        return {
            "focusing": {},
            "isActive": {},
            "isClick": {},
            "wrapperRef": {}
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "isActive",
                "methodName": "watchIsActiveHandler"
            }];
    }
}
