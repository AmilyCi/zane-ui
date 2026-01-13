import { h, Host, } from "@stencil/core";
import { EVENT_CODE } from "../../constants";
import { useNamespace } from "../../hooks";
import { mutable } from "../../types";
import { buildUUID, getEventCode, nextFrame, NOOP, throwError, } from "../../utils";
import { formContexts } from "../form/constants";
import { debounce, isArray } from "lodash-es";
const ns = useNamespace('autocomplete');
const SCOPE = 'zane-autocomplete';
export class ZaneComplete {
    constructor() {
        this.autosize = false;
        this.clearIcon = 'circle-close';
        this.debounce = 300;
        this.disabled = undefined;
        this.dropdownWidth = '';
        this.fetchSuggestions = NOOP;
        this.hasFooter = false;
        this.hasHeader = false;
        this.highlightedIndex = -1;
        this.inputStyle = mutable({});
        this.loading = false;
        this.loopNavigation = true;
        this.placement = 'bottom-start';
        this.popperTheme = 'autocomplete';
        this.rows = 2;
        this.suggestionDisabled = false;
        this.suggestions = [];
        this.triggerOnFocus = true;
        this.type = 'text';
        this.validateEvent = true;
        this.value = '';
        this.valueKey = 'value';
        this.wordLimitPosition = 'inside';
        this.zTabindex = 0;
        this.debouncedGetData = debounce(this.getData, this.debounce);
        this.ignoreFocusEvent = false;
        this.listboxId = buildUUID();
        this.readonly = false;
        this.appendTo = () => document === null || document === void 0 ? void 0 : document.body;
        this.getSuggestionContext = () => {
            var _a;
            const suggestion = (_a = this.regionRef) === null || _a === void 0 ? void 0 : _a.querySelector(`.${ns.be('suggestion', 'wrap')}`);
            const suggestionList = suggestion.querySelectorAll(`.${ns.be('suggestion', 'list')} li`);
            return [suggestion, suggestionList];
        };
        this.handleBlur = (e) => {
            nextFrame(() => {
                this.blurEvent.emit(e.detail);
            });
        };
        this.handleChange = (e) => {
            this.changeEvent.emit(e.detail);
        };
        this.handleClear = () => {
            this.value = '';
            this.changeEvent.emit('');
            this.clearEvent.emit();
        };
        this.handleClickOutside = () => {
            this.popperRef.hide();
        };
        this.handleFocus = (e) => {
            var _a;
            if (this.ignoreFocusEvent) {
                this.ignoreFocusEvent = false;
            }
            else {
                this.focusEvent.emit(e.detail);
                const queryString = (_a = this.value) !== null && _a !== void 0 ? _a : '';
                if (this.triggerOnFocus && !this.readonly) {
                    this.suggestions = [];
                    this.popperRef.show();
                    this.debouncedGetData(String(queryString));
                }
            }
        };
        this.handleHide = () => {
            this.highlightedIndex = -1;
        };
        this.handleInput = (e) => {
            const value = e.detail;
            this.inputEvent.emit(value);
            this.suggestionDisabled = false;
            if (!this.triggerOnFocus && !value) {
                this.suggestionDisabled = true;
                this.suggestions = [];
                return;
            }
            this.popperRef.isVisible().then((v) => {
                if (!v) {
                    this.popperRef.show();
                }
            });
            this.debouncedGetData(value);
        };
        this.handleKeydown = (e) => {
            const code = getEventCode(e);
            switch (code) {
                case EVENT_CODE.down: {
                    e.preventDefault();
                    this.highlight(this.highlightedIndex + 1);
                    break;
                }
                case EVENT_CODE.end: {
                    e.preventDefault();
                    this.highlight(this.suggestions.length - 1);
                    break;
                }
                case EVENT_CODE.enter:
                case EVENT_CODE.numpadEnter: {
                    e.preventDefault();
                    this.handleKeyEnter();
                    break;
                }
                case EVENT_CODE.esc: {
                    this.handleKeyEscape(e);
                    break;
                }
                case EVENT_CODE.home: {
                    e.preventDefault();
                    this.highlight(0);
                    break;
                }
                case EVENT_CODE.pageDown: {
                    e.preventDefault();
                    this.highlight(Math.min(this.suggestions.length - 1, this.highlightedIndex + 10));
                    break;
                }
                case EVENT_CODE.pageUp: {
                    e.preventDefault();
                    this.highlight(Math.max(0, this.highlightedIndex - 10));
                    break;
                }
                case EVENT_CODE.tab: {
                    this.close();
                    break;
                }
                case EVENT_CODE.up: {
                    e.preventDefault();
                    this.highlight(this.highlightedIndex - 1);
                    break;
                }
            }
        };
        this.handleKeyEscape = (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.popperRef.hide();
        };
        this.handleLoadingRender = () => {
            nextFrame(() => {
                const loadingChildEl = this.loadingRender();
                const loadingEL = document.querySelector(`[id="${this.listboxId}-loading"]`);
                if (loadingEL && loadingChildEl) {
                    loadingEL.innerHTML = loadingChildEl.innerHTML;
                }
            });
        };
        this.handleShow = () => {
            this.dropdownWidth = `${this.inputRef.offsetWidth}px`;
        };
        this.handleSuggestionItemRender = (item, index) => {
            nextFrame(() => {
                const suggestionEL = this.suggestionRender(item);
                const itemEL = document.querySelector(`[id="${this.listboxId}-item-${index}"]`);
                if (itemEL && suggestionEL) {
                    itemEL.append(suggestionEL);
                }
            });
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
    async close() {
        var _a;
        (_a = this.popperRef) === null || _a === void 0 ? void 0 : _a.hide();
    }
    componentWillLoad() {
        // console.log(this.fetchSuggestions);
        this.hasFooter = !!this.el.querySelector('[slot="footer"]');
        this.hasHeader = !!this.el.querySelector('[slot="header"]');
    }
    async getData(queryString) {
        if (this.suggestionDisabled) {
            return;
        }
        const cb = (suggestionList) => {
            this.loading = false;
            if (this.suggestionDisabled)
                return;
            if (isArray(suggestionList)) {
                this.suggestions = suggestionList;
                this.highlightedIndex = this.highlightFirstItem ? 0 : -1;
            }
            else {
                throwError(SCOPE, 'autocomplete suggestions must be an array');
            }
        };
        this.loading = true;
        if (isArray(this.fetchSuggestions)) {
            cb(this.fetchSuggestions);
        }
        else {
            const result = await this.fetchSuggestions(queryString, cb);
            if (isArray(result))
                cb(result);
        }
    }
    async handleKeyEnter() {
        var _a;
        if ((_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.isComposing) {
            return;
        }
        if (this.highlightedIndex >= 0 &&
            this.highlightedIndex < this.suggestions.length) {
            this.handleSelect(this.suggestions[this.highlightedIndex]);
        }
        else {
            if (this.selectWhenUnmatched) {
                this.selectEvent.emit(this.value);
                this.suggestions = [];
                this.highlightedIndex = -1;
            }
            this.debouncedGetData(String(this.value));
        }
    }
    async handleSelect(item) {
        this.inputEvent.emit(item[this.valueKey]);
        this.value = item[this.valueKey];
        this.selectEvent.emit(item);
        this.suggestions = [];
        this.highlightedIndex = -1;
        this.popperRef.hide();
    }
    async highlight(index) {
        var _a;
        if (this.loading)
            return;
        if (index < 0) {
            if (!this.loopNavigation) {
                this.highlightedIndex = -1;
                return;
            }
            index = this.suggestions.length - 1;
        }
        if (index >= this.suggestions.length) {
            index = this.loopNavigation ? 0 : this.suggestions.length - 1;
        }
        const [suggestion, suggestionList] = this.getSuggestionContext();
        const highlightItem = suggestionList[index];
        const scrollTop = suggestion.scrollTop;
        const { offsetTop, scrollHeight } = highlightItem;
        if (offsetTop + scrollHeight > scrollTop + suggestion.clientHeight) {
            suggestion.scrollTop = offsetTop + scrollHeight - suggestion.clientHeight;
        }
        if (offsetTop < scrollTop) {
            suggestion.scrollTop = offsetTop;
        }
        this.highlightedIndex = index;
        (_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-activedescendant', `${this.listboxId}-item-${this.highlightedIndex}`);
    }
    async inputBlur() {
        var _a;
        (_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.blur();
    }
    async inputFocus() {
        var _a;
        (_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.focus();
    }
    render() {
        return (h(Host, { key: '52a7621e97a06ea631ed7b55548a4fdfd00470e6' }, h("zane-tooltip", { key: '2601cf2059a12661554c82b6277e574e9c2627fc', appendTo: this.appendTo, arrow: false, hideOnClick: false, interactive: true, maxWidth: this.dropdownWidth, offset: [0, 1], onZClickOutside: this.handleClickOutside, onZHide: this.handleHide, onZShow: this.handleShow, placement: this.placement, ref: (el) => (this.popperRef = el), role: "listbox", theme: this.popperTheme, trigger: "manual" }, h("div", { key: 'aaa415eec77a3e4bdcd1b3693d3ec881ed2deda6', class: {
                [ns.b()]: true,
                [ns.is('loading', !this.hideLoading && this.loading)]: true,
                [this.el.className]: true,
            }, style: {
                outline: 'none',
                [this.fitInputWidth ? 'width' : 'minWidth']: this.dropdownWidth,
            } }, h("zane-input", { key: 'd15a21583e240e827b6233b6ec03632dc103ace8', ariaLabel: this.ariaLabel, autosize: this.autosize, clearable: this.clearable, clearIcon: this.clearIcon, disabled: this.getInputDisabled(), form: this.form, formatter: this.formatter, inputStyle: this.inputStyle, max: this.max, maxLength: this.maxLength, min: this.min, minLength: this.minLength, name: this.name, onKeyDown: this.handleKeydown, onZBlur: this.handleBlur, onZChange: this.handleChange, onZClear: this.handleClear, onZFocus: this.handleFocus, onZInput: this.handleInput, parser: this.parser, placeholder: this.placeholder, prefixIcon: this.prefixIcon, readonly: this.readonly, ref: (el) => (this.inputRef = el), resize: this.resize, rows: this.rows, showPassword: this.showPassword, showWordLimit: this.showWordLimit, size: this.size, step: this.step, suffixIcon: this.suffixIcon, type: this.type, validateEvent: this.validateEvent, value: this.value, wordLimitPosition: this.wordLimitPosition, zInputMode: this.zInputMode, zTabindex: this.zTabindex }, h("slot", { key: 'ff1d195faed4420e8f494b3a06bd3ea01bdd287d', name: "prepend", slot: "prepend" }), h("slot", { key: '6f39bf97a68555129a5a27c38009d517bcada971', name: "append", slot: "append" }), h("slot", { key: '3968fb8798a6543b7656fbe9af0e4728840b43f8', name: "prefix", slot: "prefix" }), h("slot", { key: '830b56e826a086f4d9760477c889d351bae27502', name: "suffix", slot: "suffix" }))), h("div", { key: '2380801ac5a64e9a29ec7812b2bb50012b116dc2', slot: "content" }, h("div", { key: '23e1f1e320f39579542d53ed625d7f1ad913004a', class: {
                [ns.b('suggestion')]: true,
                [ns.is('loading', !this.hideLoading && this.loading)]: true,
            }, ref: (el) => (this.regionRef = el), role: "region", style: {
                outline: 'none',
                [this.fitInputWidth ? 'width' : 'minWidth']: this.dropdownWidth,
            } }, this.hasHeader && (h("div", { key: '3014d7eee62dc32a06fb9bf920a6301be5edec0c', class: ns.be('suggestion', 'header'), onClick: (e) => e.stopPropagation() }, h("slot", { key: '4eaee070c7273cab598c540ffc2d274b222d76e9', name: "header" }))), h("zane-scrollbar", { key: 'e05033d087c5ce514c64bab3319f32d018eb4834', id: this.listboxId, role: "listbox", viewClass: ns.be('suggestion', 'list'), wrapClass: ns.be('suggestion', 'wrap') }, h("ul", { key: '8c23cf381478416a8af161140324b09bc3daabad' }, !this.hideLoading && this.loading ? (h("li", { id: `${this.listboxId}-loading` }, this.loadingRender ? (this.handleLoadingRender()) : (h("zane-icon", { class: ns.is('loading'), name: "loading", spin: true })))) : (this.handleSuggestionsRender(this.suggestions)))), this.hasFooter && (h("div", { key: '94f78d37a425c93494f757f366c971daf29463ad', class: ns.be('suggestion', 'footer'), onClick: (e) => e.stopPropagation() }, h("slot", { key: '767209e0347c4f5d37a056affc13e257464e301a', name: "footer" }))))))));
    }
    getInputDisabled() {
        var _a, _b, _c;
        return (_c = (_a = this.disabled) !== null && _a !== void 0 ? _a : (_b = this.formContext) === null || _b === void 0 ? void 0 : _b.disabled) !== null && _c !== void 0 ? _c : false;
    }
    handleSuggestionsRender(suggestions) {
        return suggestions.map((item, index) => (h("li", { "aria-selected": this.highlightedIndex === index, class: {
                highlighted: this.highlightedIndex === index,
            }, id: `${this.listboxId}-item-${index}`, key: `${this.listboxId}-item-${index}`, onClick: () => this.handleSelect(item), role: "option" }, this.suggestionRender
            ? this.handleSuggestionItemRender(item, index)
            : item[this.valueKey])));
    }
    static get is() { return "zane-autocomplete"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-autocomplete.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-autocomplete.css"]
        };
    }
    static get properties() {
        return {
            "ariaLabel": {
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
                "attribute": "aria-label"
            },
            "autosize": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean | { maxRows?: number; minRows?: number }",
                    "resolved": "boolean | { maxRows?: number; minRows?: number; }",
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
                "attribute": "autosize",
                "defaultValue": "false"
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
            "fetchSuggestions": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "AutocompleteFetchSuggestions",
                    "resolved": "((queryString: string, cb: AutocompleteFetchSuggestionsCallback) => Awaitable<AutocompleteData>) | Record<string, any>[]",
                    "references": {
                        "AutocompleteFetchSuggestions": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/autocomplete/types.ts::AutocompleteFetchSuggestions",
                            "referenceLocation": "AutocompleteFetchSuggestions"
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
                "defaultValue": "NOOP"
            },
            "fitInputWidth": {
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
                "attribute": "fit-input-width"
            },
            "form": {
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
                "attribute": "form"
            },
            "formatter": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "AnyNormalFunction<any, string>",
                    "resolved": "any | string",
                    "references": {
                        "AnyNormalFunction": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::AnyNormalFunction",
                            "referenceLocation": "AnyNormalFunction"
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
            "hideLoading": {
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
                "attribute": "hide-loading"
            },
            "highlightFirstItem": {
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
                "attribute": "highlight-first-item"
            },
            "inputStyle": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Record<string, string> | string",
                    "resolved": "string",
                    "references": {
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        },
                        "const": {
                            "location": "global",
                            "id": "global::const"
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
                "attribute": "input-style",
                "defaultValue": "mutable({} as const)"
            },
            "loadingRender": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "() => HTMLElement",
                    "resolved": "() => HTMLElement",
                    "references": {
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
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
            "loopNavigation": {
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
                "attribute": "loop-navigation",
                "defaultValue": "true"
            },
            "max": {
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
                "attribute": "max"
            },
            "maxLength": {
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
                "attribute": "max-length"
            },
            "min": {
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
                "attribute": "min"
            },
            "minLength": {
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
                "attribute": "min-length"
            },
            "name": {
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
                "attribute": "name"
            },
            "parser": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "AnyNormalFunction<any, any>",
                    "resolved": "any",
                    "references": {
                        "AnyNormalFunction": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::AnyNormalFunction",
                            "referenceLocation": "AnyNormalFunction"
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
                "attribute": "placeholder"
            },
            "placement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'bottom-start' | 'top-start'",
                    "resolved": "\"bottom-start\" | \"top-start\"",
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
                "defaultValue": "'autocomplete'"
            },
            "prefixIcon": {
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
                "attribute": "prefix-icon"
            },
            "resize": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'both' | 'horizontal' | 'none' | 'vertical'",
                    "resolved": "\"both\" | \"horizontal\" | \"none\" | \"vertical\"",
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
                "attribute": "resize"
            },
            "rows": {
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
                "attribute": "rows",
                "defaultValue": "2"
            },
            "selectWhenUnmatched": {
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
                "attribute": "select-when-unmatched"
            },
            "showPassword": {
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
                "attribute": "show-password"
            },
            "showWordLimit": {
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
                "attribute": "show-word-limit"
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
            "step": {
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
                "attribute": "step"
            },
            "suffixIcon": {
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
                "attribute": "suffix-icon"
            },
            "suggestionRender": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(item: any) => HTMLElement",
                    "resolved": "(item: any) => HTMLElement",
                    "references": {
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
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
            "triggerOnFocus": {
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
                "reflect": true,
                "attribute": "trigger-on-focus",
                "defaultValue": "true"
            },
            "type": {
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
                "attribute": "type",
                "defaultValue": "'text'"
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
            "value": {
                "type": "any",
                "mutable": true,
                "complexType": {
                    "original": "null | number | string | undefined",
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
                "attribute": "value",
                "defaultValue": "''"
            },
            "valueKey": {
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
                "attribute": "value-key",
                "defaultValue": "'value'"
            },
            "wordLimitPosition": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'inside' | 'outside'",
                    "resolved": "\"inside\" | \"outside\"",
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
                "attribute": "word-limit-position",
                "defaultValue": "'inside'"
            },
            "zInputMode": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "| 'decimal'\n    | 'email'\n    | 'none'\n    | 'numeric'\n    | 'search'\n    | 'tel'\n    | 'text'\n    | 'url'",
                    "resolved": "\"decimal\" | \"email\" | \"none\" | \"numeric\" | \"search\" | \"tel\" | \"text\" | \"url\"",
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
                "attribute": "inputmode"
            },
            "zTabindex": {
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
                "attribute": "tabindex",
                "defaultValue": "0"
            },
            "appendTo": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'parent' | ((ref: Element) => Element) | Element",
                    "resolved": "\"parent\" | ((ref: Element) => Element) | Element",
                    "references": {
                        "Element": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Element",
                            "referenceLocation": "Element"
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
                "attribute": "append-to",
                "defaultValue": "() =>\n    document?.body"
            }
        };
    }
    static get states() {
        return {
            "dropdownWidth": {},
            "hasFooter": {},
            "hasHeader": {},
            "highlightedIndex": {},
            "loading": {},
            "suggestionDisabled": {},
            "suggestions": {}
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
                "method": "changeEvent",
                "name": "zChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
                    "references": {}
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
                "method": "inputEvent",
                "name": "zInput",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                }
            }, {
                "method": "selectEvent",
                "name": "zSelect",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "close": {
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
            "getData": {
                "complexType": {
                    "signature": "(queryString: string) => Promise<void>",
                    "parameters": [{
                            "name": "queryString",
                            "type": "string",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "AutocompleteData": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/autocomplete/types.ts::AutocompleteData",
                            "referenceLocation": "AutocompleteData"
                        },
                        "AutocompleteFetchFunc": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/autocomplete/types.ts::AutocompleteFetchFunc",
                            "referenceLocation": "AutocompleteFetchFunc"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "handleKeyEnter": {
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
            "handleSelect": {
                "complexType": {
                    "signature": "(item: any) => Promise<void>",
                    "parameters": [{
                            "name": "item",
                            "type": "any",
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
            "highlight": {
                "complexType": {
                    "signature": "(index: number) => Promise<void>",
                    "parameters": [{
                            "name": "index",
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
            "inputBlur": {
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
            "inputFocus": {
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
