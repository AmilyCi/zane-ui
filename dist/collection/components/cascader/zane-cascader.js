import { h, Host, } from "@stencil/core";
import state from "../../global/store";
import { useNamespace } from "../../hooks";
import { debugWarn, isClient, isFocusable, isKorean, nextFrame, } from "../../utils";
import { formContexts, formItemContexts } from "../form/constants";
const ns = useNamespace('cascader');
const nsInput = useNamespace('input');
// const SCOPE = 'zane-cascader';
export class ZaneCascader {
    constructor() {
        this.clearIcon = 'circle-close';
        this.debounce = 300;
        this.disabled = undefined;
        this.filtering = false;
        this.inputHover = false;
        this.inputValue = '';
        this.isComposing = false;
        this.isFocused = false;
        this.maxCollapseTags = 1;
        this.multiple = false;
        this.options = [];
        this.placeholder = 'Select';
        this.placement = 'bottom-start';
        this.popperTheme = 'cascader';
        this.popperVisible = false;
        this.searchInputValue = '';
        this.separator = ' / ';
        this.showAllLevels = true;
        this.showCheckedStrategy = 'child';
        this.showPrefix = true;
        this.tags = [];
        this.validateEvent = true;
        this.inputInitialHeight = 0;
        this.beforeFilter = () => true;
        this.handleBlur = async (event) => {
            var _a;
            const isFocusInsideTooltipContent = await this.tooltipRef.isFocusInsideContent(event);
            const isFocusInsideTagTooltipContent = await this.tagTooltipRef.isFocusInsideContent(event);
            const cancelBlur = isFocusInsideTooltipContent || isFocusInsideTagTooltipContent;
            if (this.getIsDisabled() ||
                (event.relatedTarget &&
                    this.wrapperRef.contains(event.relatedTarget)) ||
                cancelBlur) {
                return;
            }
            this.isFocused = false;
            this.blurEvent.emit(event);
            if (this.validateEvent) {
                (_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validate('blur').catch((error) => debugWarn(error));
            }
        };
        this.handleClear = (event) => {
            event.stopPropagation();
            this.cascaderPanelRef.clearCheckedNodes();
            if (!this.popperVisible && this.filterable) {
                this.syncPresentTextValue();
            }
            this.togglePopperVisible(false);
            this.clearEvent.emit();
        };
        this.handleClick = (event) => {
            this.togglePopperVisible(!this.filterable || this.multiple ? undefined : true);
            if (this.getIsDisabled() ||
                isFocusable(event.target) ||
                (this.wrapperRef.contains(document.activeElement) &&
                    this.wrapperRef !== document.activeElement)) {
                return;
            }
            this.inputRef.focus();
        };
        this.handleClickOutside = () => { };
        this.handleCompositionEnd = (event) => {
            this.compositionendEvent.emit(event.detail);
            if (this.isComposing) {
                this.isComposing = false;
                nextFrame(() => {
                    var _a;
                    const text = (_a = event.detail.target) === null || _a === void 0 ? void 0 : _a.value;
                    this.handleInput(text);
                });
            }
        };
        this.handleCompositionStart = (event) => {
            this.compositionstartEvent.emit(event.detail);
            this.isComposing = true;
        };
        this.handleCompositionUpdate = (event) => {
            var _a;
            this.compositionupdateEvent.emit(event.detail);
            const text = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
            const lastCharacter = text[text.length - 1] || '';
            this.isComposing = !isKorean(lastCharacter);
        };
        this.handleFilter = () => { };
        this.handleFocus = async (event) => {
            var _a;
            const isFocusInsideTooltipContent = await this.tooltipRef.isFocusInsideContent(event);
            const isFocusInsideTagTooltipContent = await this.tagTooltipRef.isFocusInsideContent(event);
            const cancelFocus = isFocusInsideTooltipContent || isFocusInsideTagTooltipContent;
            if (this.getIsDisabled() || this.isFocused || cancelFocus) {
                return;
            }
            this.isFocused = true;
            this.focusEvent.emit(event);
            if (this.validateEvent) {
                (_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validate('blur').catch((error) => debugWarn(error));
            }
        };
        this.handleHide = () => { };
        this.handleInput = (val, e) => {
            this.tooltipRef.isVisible().then((visible) => {
                if (!visible) {
                    this.togglePopperVisible(true);
                }
            });
            if (e === null || e === void 0 ? void 0 : e.isComposing) {
                return;
            }
            val ? this.handleFilter() : this.hideSuggestionPanel();
        };
        this.handleKeyDown = () => { };
        this.hideSuggestionPanel = () => { };
        this.syncPresentTextValue = () => {
            const presentText = this.getPresentText();
            this.inputValue = presentText;
            this.searchInputValue = presentText;
        };
        this.togglePopperVisible = (visible) => {
            if (this.getIsDisabled()) {
                return;
            }
            visible = visible !== null && visible !== void 0 ? visible : !this.popperVisible;
            if (visible !== this.popperVisible) {
                this.popperVisible = visible;
                this.inputRef.getInput().then((nativeInput) => {
                    nativeInput === null || nativeInput === void 0 ? void 0 : nativeInput.setAttribute('aria-expanded', `${visible}`);
                });
                if (visible) {
                    this.updatePopperPosition();
                    if (this.cascaderPanelRef) {
                        nextFrame(() => {
                            this.cascaderPanelRef.scrollToExpandingNode();
                        });
                    }
                }
                else {
                    this.syncPresentTextValue();
                }
            }
        };
        this.updatePopperPosition = () => {
            nextFrame(() => {
                this.tooltipRef.show();
            });
        };
        this.updateStyle = async () => {
            var _a;
            const inputInner = await ((_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.getInput());
            if (!isClient || !inputInner) {
                return;
            }
            if (this.suggestionPanel) {
                const suggestionList = this.suggestionPanel.querySelector(`.${ns.e('suggestion-list')}`);
                suggestionList.style.minWidth = `${inputInner.offsetWidth}px`;
            }
            if (this.tagWrapper) {
                const { offsetHeight } = this.tagWrapper;
                const height = this.tags.length > 0
                    ? `${Math.max(offsetHeight, this.inputInitialHeight) - 2}px`
                    : `${this.inputInitialHeight}px`;
                inputInner.style.height = height;
                this.updatePopperPosition();
            }
        };
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
    get formItemContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM-ITEM') {
                context = formItemContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
    }
    handleWatchTags() {
        nextFrame(() => {
            this.updateStyle();
        });
    }
    render() {
        var _a;
        const cascaderKls = [
            ns.b(),
            ns.m(this.getRealSize()),
            ns.is('disabled', this.getIsDisabled()),
            this.el.className,
        ].join(' ');
        return (h(Host, { key: '772d0bac9eda7f82e90c118e0964e8c2865009c1' }, h("zane-tooltip", { key: 'a711a3e4068acd01ec6c8177ba82a531758a0841', arrow: false, hideOnClick: false, interactive: true, offset: [0, 1], onZClickOutside: this.handleClickOutside, onZHide: this.handleHide, placement: this.placement, ref: (el) => (this.tooltipRef = el), theme: this.popperTheme, trigger: "manual" }, h("div", { key: 'be6ba2c6e32f4850d81006c5b82493139ce3a406', class: cascaderKls, onBlur: this.handleBlur, onClick: this.handleClick, onFocus: this.handleFocus, onKeyDown: this.handleKeyDown, onMouseEnter: () => (this.inputHover = true), onMouseLeave: () => (this.inputHover = false), ref: (el) => (this.wrapperRef = el), style: this.wrapperStyle, tabIndex: this.getIsDisabled ? -1 : undefined }, h("zane-input", { key: '1f1a34f6865d2ae1b8350ca29b805634c5d1b1ef', class: ns.is('focus'), disabled: this.getIsDisabled(), onZCompositionEnd: this.handleCompositionEnd, onZCompositionStart: this.handleCompositionStart, onZCompositionUpdate: this.handleCompositionUpdate, placeholder: this.searchInputValue ||
                this.tags.length > 0 ||
                this.isComposing
                ? ''
                : this.placeholder, readonly: !this.filterable || this.multiple, ref: (el) => (this.inputRef = el), size: this.getRealSize(), validateEvent: false, value: this.inputValue }, this.hasPrefix && h("slot", { key: '8ce610e2ff71c10da8bd1dfd19e2cbfae040919f', name: "prefix" }), h("div", { key: '38df8f3098b022b2ef6bb546c25405c750e75ef8', slot: "suffix" }, this.getClearBtnVisible() ? (h("zane-icon", { class: [nsInput.e('icon'), 'icon-circle-close'].join(' '), key: "clear", name: this.clearIcon, onClick: this.handleClear })) : (h("zane-icon", { class: [
                nsInput.e('icon'),
                'icon-arrow-down',
                ns.is('reverse', this.popperVisible),
            ].join(' '), key: "arrow-down", name: "arrow-down" })))), this.multiple && (h("div", { key: '5d3dae7ffd324fe4e4de8ed3ab0e2d4171537d68', class: [
                ns.e('tags'),
                ns.is('validate', !!((_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validateState)),
            ].join(' '), ref: (el) => (this.tagWrapper = el) }, this.getShowTagList().map((tag) => (h("zane-tag", { key: tag.key })))))))));
    }
    getClearBtnVisible() {
        if (!this.clearable ||
            this.getIsDisabled() ||
            this.filtering ||
            (!this.inputHover && !this.isFocused)) {
            return false;
        }
        return !!this.cascaderPanelRef.checkedNodes.length;
    }
    getIsDisabled() {
        var _a, _b, _c;
        return (_c = (_a = this.disabled) !== null && _a !== void 0 ? _a : (_b = this.formContext) === null || _b === void 0 ? void 0 : _b.disabled) !== null && _c !== void 0 ? _c : false;
    }
    getPresentText() {
        var _a;
        if (this.cascaderPanelRef.checkedNodes.length) {
            return this.multiple
                ? ''
                : (_a = this.cascaderPanelRef.checkedNodes[0]) === null || _a === void 0 ? void 0 : _a.calcText(this.showAllLevels, this.separator);
        }
        return '';
    }
    getRealSize() {
        var _a, _b;
        return (this.size ||
            ((_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.size) ||
            ((_b = this.formContext) === null || _b === void 0 ? void 0 : _b.size) ||
            state.size ||
            '');
    }
    getShowTagList() {
        if (!this.multiple) {
            return [];
        }
        return this.collapseTags
            ? this.tags.slice(0, this.maxCollapseTags)
            : this.tags;
    }
    static get is() { return "zane-cascader"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-cascader.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-cascader.css"]
        };
    }
    static get properties() {
        return {
            "checkOnClickNode": {
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
                "attribute": "check-on-click-node"
            },
            "clearable": {
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
                "attribute": "clearable"
            },
            "clearIcon": {
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
                "attribute": "clear-icon",
                "defaultValue": "'circle-close'"
            },
            "collapseTags": {
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
                "attribute": "collapse-tags"
            },
            "collapseTagsTooltip": {
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
                "attribute": "collapse-tags-tooltip"
            },
            "debounce": {
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
                "attribute": "debounce",
                "defaultValue": "300"
            },
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
                "attribute": "disabled",
                "defaultValue": "undefined"
            },
            "filterable": {
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
                "attribute": "filterable"
            },
            "filterMethod": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(node: CascaderNode, keyword: string) => boolean",
                    "resolved": "(node: CascaderNode, keyword: string) => boolean",
                    "references": {
                        "CascaderNode": {
                            "location": "import",
                            "path": "./node",
                            "id": "src/components/cascader/node.ts::CascaderNode",
                            "referenceLocation": "CascaderNode"
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
            "maxCollapseTags": {
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
                "attribute": "max-collapse-tags",
                "defaultValue": "1"
            },
            "maxCollapseTagsTooltipHeight": {
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
                "attribute": "max-collapse-tags-tooltip-height"
            },
            "multiple": {
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
                "attribute": "multiple",
                "defaultValue": "false"
            },
            "options": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "CascaderOption[]",
                    "resolved": "CascaderOption[]",
                    "references": {
                        "CascaderOption": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/cascader/types.ts::CascaderOption",
                            "referenceLocation": "CascaderOption"
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
                "defaultValue": "[]"
            },
            "placeholder": {
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
                "attribute": "placeholder",
                "defaultValue": "'Select'"
            },
            "placement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "| 'bottom'\n    | 'bottom-start'\n    | 'left'\n    | 'right'\n    | 'top'\n    | 'top-start'",
                    "resolved": "\"bottom\" | \"bottom-start\" | \"left\" | \"right\" | \"top\" | \"top-start\"",
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
                "attribute": "placement",
                "defaultValue": "'bottom-start'"
            },
            "popperTheme": {
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
                "attribute": "popper-theme",
                "defaultValue": "'cascader'"
            },
            "separator": {
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
                "attribute": "separator",
                "defaultValue": "' / '"
            },
            "showAllLevels": {
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
                "attribute": "show-all-levels",
                "defaultValue": "true"
            },
            "showCheckedStrategy": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'child' | 'parent'",
                    "resolved": "\"child\" | \"parent\"",
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
                "attribute": "show-checked-strategy",
                "defaultValue": "'child'"
            },
            "showPrefix": {
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
                "attribute": "show-prefix",
                "defaultValue": "true"
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
                "attribute": "size"
            },
            "validateEvent": {
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
                "attribute": "validate-event",
                "defaultValue": "true"
            },
            "wrapperStyle": {
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
                "setter": false
            },
            "beforeFilter": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(value: string) => boolean | Promise<any>",
                    "resolved": "(value: string) => boolean | Promise<any>",
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
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
                "defaultValue": "() => true"
            }
        };
    }
    static get states() {
        return {
            "filtering": {},
            "inputHover": {},
            "inputValue": {},
            "isComposing": {},
            "isFocused": {},
            "popperVisible": {},
            "searchInputValue": {},
            "tags": {}
        };
    }
    static get events() {
        return [{
                "method": "blurEvent",
                "name": "zBlur",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        }
                    }
                }
            }, {
                "method": "clearEvent",
                "name": "zClear",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "compositionendEvent",
                "name": "zCompositionEnd",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "CompositionEvent",
                    "resolved": "CompositionEvent",
                    "references": {
                        "CompositionEvent": {
                            "location": "global",
                            "id": "global::CompositionEvent"
                        }
                    }
                }
            }, {
                "method": "compositionstartEvent",
                "name": "zCompositionStart",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "CompositionEvent",
                    "resolved": "CompositionEvent",
                    "references": {
                        "CompositionEvent": {
                            "location": "global",
                            "id": "global::CompositionEvent"
                        }
                    }
                }
            }, {
                "method": "compositionupdateEvent",
                "name": "zCompositionUpdate",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "CompositionEvent",
                    "resolved": "CompositionEvent",
                    "references": {
                        "CompositionEvent": {
                            "location": "global",
                            "id": "global::CompositionEvent"
                        }
                    }
                }
            }, {
                "method": "focusEvent",
                "name": "zFocus",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "FocusEvent",
                    "resolved": "FocusEvent",
                    "references": {
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        }
                    }
                }
            }, {
                "method": "visibleChangeEvent",
                "name": "visibleChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "tags",
                "methodName": "handleWatchTags"
            }];
    }
}
