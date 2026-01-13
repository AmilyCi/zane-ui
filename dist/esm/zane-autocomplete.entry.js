import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { n as nextFrame } from './nextFrame-BGGLuZuD.js';
import { t as throwError } from './error-DAO_9P5C.js';
import { i as isClient } from './isClient-VXT6p8t0.js';
import { b as buildUUID } from './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import { m as mutable } from './typescript-B-rxnVJv.js';
import { f as formContexts } from './constants-DPmqmB4-.js';
import { d as debounce } from './debounce-BnmERUdf.js';
import './isString-DaEH0FEg.js';
import './toObjectString-D4ItlKpz.js';

const isAndroid = () => isClient && /android/i.test(window.navigator.userAgent);

const EVENT_CODE = {
    backspace: 'Backspace',
    delete: 'Delete',
    down: 'ArrowDown', // 40
    end: 'End',
    enter: 'Enter',
    esc: 'Escape',
    home: 'Home',
    left: 'ArrowLeft', // 37
    numpadEnter: 'NumpadEnter',
    pageDown: 'PageDown',
    pageUp: 'PageUp',
    right: 'ArrowRight', // 39
    space: 'Space',
    tab: 'Tab',
    up: 'ArrowUp', // 38
};

const getEventKey = (event) => {
    let key = event.key && event.key !== 'Unidentified' ? event.key : '';
    // On Android, event.key and event.code may not be useful when entering characters or space
    // So here we directly get the last character of the input
    // **only takes effect in the keyup event**
    if (!key && event.type === 'keyup' && isAndroid()) {
        const target = event.target;
        key = target.value.charAt(target.selectionStart - 1);
    }
    return key;
};

const getEventCode = (event) => {
    if (event.code && event.code !== 'Unidentified')
        return event.code;
    // On android, event.code is always '' (see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#browser_compatibility)
    const key = getEventKey(event);
    if (key) {
        if (Object.values(EVENT_CODE).includes(key))
            return key;
        switch (key) {
            case ' ': {
                return EVENT_CODE.space;
            }
            default: {
                return '';
            }
        }
    }
    return '';
};

const NOOP = () => undefined;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

const zaneAutocompleteCss = () => `.zane-autocomplete{--zane-input-text-color:var(--zane-text-color-regular);--zane-input-border:var(--zane-border);--zane-input-hover-border:var(--zane-border-color-hover);--zane-input-focus-border:var(--zane-color-primary);--zane-input-transparent-border:0 0 0 1px transparent inset;--zane-input-border-color:var(--zane-border-color);--zane-input-border-radius:var(--zane-border-radius-base);--zane-input-bg-color:var(--zane-fill-color-blank);--zane-input-icon-color:var(--zane-text-color-placeholder);--zane-input-placeholder-color:var(--zane-text-color-placeholder);--zane-input-hover-border-color:var(--zane-border-color-hover);--zane-input-clear-hover-color:var(--zane-text-color-secondary);--zane-input-focus-border-color:var(--zane-color-primary);--zane-input-width:100%}.zane-autocomplete{width:var(--zane-input-width);position:relative;display:inline-block}.zane-autocomplete-suggestion{border-radius:var(--zane-border-radius-base);box-sizing:border-box}.zane-autocomplete-suggestion .zane-autocomplete-suggestion__header{padding:10px;border-bottom:1px solid var(--zane-border-color-lighter)}.zane-autocomplete-suggestion .zane-autocomplete-suggestion__footer{padding:10px;border-top:1px solid var(--zane-border-color-lighter)}.zane-autocomplete-suggestion .zane-autocomplete-suggestion__wrap{max-height:280px;padding:10px 0;box-sizing:border-box}.zane-autocomplete-suggestion .zane-autocomplete-suggestion__list{margin:0;padding:0}.zane-autocomplete-suggestion .zane-autocomplete-suggestion__list>div{height:100px;display:flex;align-items:center;justify-content:center;font-size:20px}.zane-autocomplete-suggestion ul{list-style:none;margin:0;padding:0}.zane-autocomplete-suggestion li{padding:0 20px;margin:0;line-height:34px;cursor:pointer;color:var(--zane-text-color-regular);font-size:var(--zane-font-size-base);list-style:none;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.zane-autocomplete-suggestion li:hover{background-color:var(--zane-fill-color-light)}.zane-autocomplete-suggestion li.highlighted{background-color:var(--zane-fill-color-light)}.zane-autocomplete-suggestion li.divider{margin-top:6px;border-top:1px solid var(--zane-color-black)}.zane-autocomplete-suggestion li.divider:last-child{margin-bottom:-6px}.zane-autocomplete-suggestion.is-loading li{cursor:default;height:100px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--zane-text-color-secondary)}.zane-autocomplete-suggestion.is-loading li:hover{background-color:var(--zane-bg-color-overlay)}.zane-tooltip-box[data-theme~=autocomplete]{background-color:var(--zane-bg-color-overlay);border:1px solid var(--zane-border-color-lighter)}.zane-tooltip-box[data-theme~=autocomplete] .zane-tooltip-content{padding:0}`;

const ns = useNamespace('autocomplete');
const SCOPE = 'zane-autocomplete';
const ZaneComplete = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.blurEvent = createEvent(this, "zBlur", 7);
        this.changeEvent = createEvent(this, "zChange", 7);
        this.clearEvent = createEvent(this, "zClear", 7);
        this.focusEvent = createEvent(this, "zFocus", 7);
        this.inputEvent = createEvent(this, "zInput", 7);
        this.selectEvent = createEvent(this, "zSelect", 7);
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
    get el() { return getElement(this); }
};
ZaneComplete.style = zaneAutocompleteCss();

export { ZaneComplete as zane_autocomplete };
