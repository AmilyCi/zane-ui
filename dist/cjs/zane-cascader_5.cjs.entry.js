'use strict';

var index = require('./index-ziNpORbs.js');
var uuid = require('./uuid-avdvDRhA.js');
var nextFrame = require('./nextFrame-DhVgSZmG.js');
var isClient = require('./isClient-DoX2b1Hx.js');
var error = require('./error-Bs0gfBMl.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');
var constants = require('./constants-WomdwpdF.js');
require('@zanejs/icons');
var isNumber = require('./isNumber-CJR0doT9.js');
var isObject = require('./isObject-EfaeaXJ_.js');
var normalizeStyle = require('./normalizeStyle-C2mBqaYG.js');
var typescript = require('./typescript-D5hEsiuE.js');
var debounce$1 = require('./debounce-BCWnjwam.js');
require('./isString-D2n3i_b0.js');
require('./toObjectString-rn-pSGT_.js');

// Keep input cursor in the correct position when we use formatter.
function useCursor(input) {
    let selectionInfo;
    function recordCursor() {
        if (input === undefined)
            return;
        const { selectionEnd, selectionStart, value } = input;
        if (selectionStart === null || selectionEnd === null)
            return;
        const beforeTxt = value.slice(0, Math.max(0, selectionStart));
        const afterTxt = value.slice(Math.max(0, selectionEnd));
        selectionInfo = {
            afterTxt,
            beforeTxt,
            selectionEnd,
            selectionStart,
            value,
        };
    }
    function setCursor() {
        if (input === undefined || selectionInfo === undefined)
            return;
        const { value } = input;
        const { afterTxt, beforeTxt, selectionStart } = selectionInfo;
        if (beforeTxt === undefined ||
            afterTxt === undefined ||
            selectionStart === undefined)
            return;
        let startPos = value.length;
        if (value.endsWith(afterTxt)) {
            startPos = value.length - afterTxt.length;
        }
        else if (value.startsWith(beforeTxt)) {
            startPos = beforeTxt.length;
        }
        else {
            const beforeLastChar = beforeTxt[selectionStart - 1];
            const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
            if (newIndex !== -1) {
                startPos = newIndex + 1;
            }
        }
        input.setSelectionRange(startPos, startPos);
    }
    return [recordCursor, setCursor];
}

function arrayFrom(value) {
    return Array.prototype.slice.call(value);
}

function normalizeToArray(value) {
    return [].concat(value);
}

function pushIfUnique(arr, value) {
    if (!arr.includes(value)) {
        arr.push(value);
    }
}

function updateTransitionEndListener(box, action, listener) {
    if (listener) {
        const method = `${action}EventListener`;
        // some browsers apparently support `transition` (unprefixed) but only fire
        // `webkitTransitionEnd`...
        ['transitionend', 'webkitTransitionEnd'].forEach((event) => {
            box[method](event, listener);
        });
    }
}

const isFirefox = () => isClient.isClient && /firefox/i.test(window.navigator.userAgent);

const HIDDEN_STYLE = {
    height: '0',
    overflow: isFirefox() ? '' : 'hidden',
    position: 'absolute',
    right: '0',
    top: '0',
    visibility: 'hidden',
    'z-index': '-1000',
};
const CONTEXT_STYLE = [
    'letter-spacing',
    'line-height',
    'padding-top',
    'padding-bottom',
    'font-family',
    'font-weight',
    'font-size',
    'text-rendering',
    'text-transform',
    'width',
    'text-indent',
    'padding-left',
    'padding-right',
    'border-width',
    'box-sizing',
    'word-break',
];
let hiddenTextarea;
function calculateNodeStyling(targetElement) {
    const style = window.getComputedStyle(targetElement);
    const boxSizing = style.getPropertyValue('box-sizing');
    const paddingSize = Number.parseFloat(style.getPropertyValue('padding-bottom')) +
        Number.parseFloat(style.getPropertyValue('padding-top'));
    const borderSize = Number.parseFloat(style.getPropertyValue('border-bottom-width')) +
        Number.parseFloat(style.getPropertyValue('border-top-width'));
    const contextStyle = CONTEXT_STYLE.map((name) => [
        name,
        style.getPropertyValue(name),
    ]);
    return { borderSize, boxSizing, contextStyle, paddingSize };
}
function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a;
    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement('textarea');
        ((_a = targetElement.parentNode) !== null && _a !== void 0 ? _a : document.body).append(hiddenTextarea);
    }
    const { borderSize, boxSizing, contextStyle, paddingSize } = calculateNodeStyling(targetElement);
    contextStyle.forEach(([key, value]) => hiddenTextarea === null || hiddenTextarea === void 0 ? void 0 : hiddenTextarea.style.setProperty(key, value));
    Object.entries(HIDDEN_STYLE).forEach(([key, value]) => hiddenTextarea === null || hiddenTextarea === void 0 ? void 0 : hiddenTextarea.style.setProperty(key, value, 'important'));
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';
    let height = hiddenTextarea.scrollHeight;
    const result = {};
    if (boxSizing === 'border-box') {
        height = height + borderSize;
    }
    else if (boxSizing === 'content-box') {
        height = height - paddingSize;
    }
    hiddenTextarea.value = '';
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (isNumber.isNumber(minRows)) {
        let minHeight = singleRowHeight * minRows;
        if (boxSizing === 'border-box') {
            minHeight = minHeight + paddingSize + borderSize;
        }
        height = Math.max(minHeight, height);
        result.minHeight = `${minHeight}px`;
    }
    if (isNumber.isNumber(maxRows)) {
        let maxHeight = singleRowHeight * maxRows;
        if (boxSizing === 'border-box') {
            maxHeight = maxHeight + paddingSize + borderSize;
        }
        height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;
    hiddenTextarea.remove();
    hiddenTextarea = undefined;
    return result;
}

// Firefox extensions don't allow .innerHTML = "..." property. This tricks it.
const innerHTML = () => 'innerHTML';
function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
}

function div() {
    return document.createElement('div');
}

const isFocusable = (element) => {
    if (element.tabIndex > 0 ||
        (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }
    if (element.tabIndex < 0 ||
        element.hasAttribute('disabled') ||
        element.getAttribute('aria-disabled') === 'true') {
        return false;
    }
    switch (element.nodeName) {
        case 'A': {
            // casting current element to Specific HTMLElement in order to be more type precise
            return (!!element.href &&
                element.rel !== 'ignore');
        }
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA': {
            return true;
        }
        case 'INPUT': {
            return !(element.type === 'hidden' ||
                element.type === 'file');
        }
        default: {
            return false;
        }
    }
};

function getOwnerDocument(elementOrElements) {
    var _a;
    const [element] = normalizeToArray(elementOrElements);
    // Elements created via a <template> have an ownerDocument with no reference to the body
    return ((_a = element === null || element === void 0 ? void 0 : element.ownerDocument) === null || _a === void 0 ? void 0 : _a.body) ? element.ownerDocument : document;
}

function isType(value, type) {
    const str = Object.prototype.toString.call(value);
    return str.indexOf('[object') === 0 && str.includes(`${type}]`);
}

function isElement$1(value) {
    return ['Element', 'Fragment'].some((type) => isType(value, type));
}

function isMouseEvent(value) {
    return isType(value, 'MouseEvent');
}

function isNodeList(value) {
    return isType(value, 'NodeList');
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const isIE11 = () => isBrowser() ? !!(window === null || window === void 0 ? void 0 : window.msCrypto) : false;

const isKorean = (text) => /[\uAC00-\uD7AF\u3130-\u318F]+/.test(text);

const zaneCascaderCss = () => ``;

const ns$4 = useNamespace.useNamespace('cascader');
const nsInput$1 = useNamespace.useNamespace('input');
const ZaneCascader = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.blurEvent = index.createEvent(this, "zBlur", 7);
        this.clearEvent = index.createEvent(this, "zClear", 7);
        this.compositionendEvent = index.createEvent(this, "zCompositionEnd", 7);
        this.compositionstartEvent = index.createEvent(this, "zCompositionStart", 7);
        this.compositionupdateEvent = index.createEvent(this, "zCompositionUpdate", 7);
        this.focusEvent = index.createEvent(this, "zFocus", 7);
        this.visibleChangeEvent = index.createEvent(this, "visibleChange", 7);
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
                (_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validate('blur').catch((error$1) => error.debugWarn(error$1));
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
                nextFrame.nextFrame(() => {
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
                (_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validate('blur').catch((error$1) => error.debugWarn(error$1));
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
                        nextFrame.nextFrame(() => {
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
            nextFrame.nextFrame(() => {
                this.tooltipRef.show();
            });
        };
        this.updateStyle = async () => {
            var _a;
            const inputInner = await ((_a = this.inputRef) === null || _a === void 0 ? void 0 : _a.getInput());
            if (!isClient.isClient || !inputInner) {
                return;
            }
            if (this.suggestionPanel) {
                const suggestionList = this.suggestionPanel.querySelector(`.${ns$4.e('suggestion-list')}`);
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
                context = constants.formContexts.get(parent);
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
                context = constants.formItemContexts.get(parent);
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
        nextFrame.nextFrame(() => {
            this.updateStyle();
        });
    }
    render() {
        var _a;
        const cascaderKls = [
            ns$4.b(),
            ns$4.m(this.getRealSize()),
            ns$4.is('disabled', this.getIsDisabled()),
            this.el.className,
        ].join(' ');
        return (index.h(index.Host, { key: '772d0bac9eda7f82e90c118e0964e8c2865009c1' }, index.h("zane-tooltip", { key: 'a711a3e4068acd01ec6c8177ba82a531758a0841', arrow: false, hideOnClick: false, interactive: true, offset: [0, 1], onZClickOutside: this.handleClickOutside, onZHide: this.handleHide, placement: this.placement, ref: (el) => (this.tooltipRef = el), theme: this.popperTheme, trigger: "manual" }, index.h("div", { key: 'be6ba2c6e32f4850d81006c5b82493139ce3a406', class: cascaderKls, onBlur: this.handleBlur, onClick: this.handleClick, onFocus: this.handleFocus, onKeyDown: this.handleKeyDown, onMouseEnter: () => (this.inputHover = true), onMouseLeave: () => (this.inputHover = false), ref: (el) => (this.wrapperRef = el), style: this.wrapperStyle, tabIndex: this.getIsDisabled ? -1 : undefined }, index.h("zane-input", { key: '1f1a34f6865d2ae1b8350ca29b805634c5d1b1ef', class: ns$4.is('focus'), disabled: this.getIsDisabled(), onZCompositionEnd: this.handleCompositionEnd, onZCompositionStart: this.handleCompositionStart, onZCompositionUpdate: this.handleCompositionUpdate, placeholder: this.searchInputValue ||
                this.tags.length > 0 ||
                this.isComposing
                ? ''
                : this.placeholder, readonly: !this.filterable || this.multiple, ref: (el) => (this.inputRef = el), size: this.getRealSize(), validateEvent: false, value: this.inputValue }, this.hasPrefix && index.h("slot", { key: '8ce610e2ff71c10da8bd1dfd19e2cbfae040919f', name: "prefix" }), index.h("div", { key: '38df8f3098b022b2ef6bb546c25405c750e75ef8', slot: "suffix" }, this.getClearBtnVisible() ? (index.h("zane-icon", { class: [nsInput$1.e('icon'), 'icon-circle-close'].join(' '), key: "clear", name: this.clearIcon, onClick: this.handleClear })) : (index.h("zane-icon", { class: [
                nsInput$1.e('icon'),
                'icon-arrow-down',
                ns$4.is('reverse', this.popperVisible),
            ].join(' '), key: "arrow-down", name: "arrow-down" })))), this.multiple && (index.h("div", { key: '5d3dae7ffd324fe4e4de8ed3ab0e2d4171537d68', class: [
                ns$4.e('tags'),
                ns$4.is('validate', !!((_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.validateState)),
            ].join(' '), ref: (el) => (this.tagWrapper = el) }, this.getShowTagList().map((tag) => (index.h("zane-tag", { key: tag.key })))))))));
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
            uuid.state.size ||
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
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "tags": [{
                "handleWatchTags": 0
            }]
    }; }
};
ZaneCascader.style = zaneCascaderCss();

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

var hasRequiredClassnames;

function requireClassnames () {
	if (hasRequiredClassnames) return classnames.exports;
	hasRequiredClassnames = 1;
	(function (module) {
		/* global define */

		(function () {

			var hasOwn = {}.hasOwnProperty;

			function classNames () {
				var classes = '';

				for (var i = 0; i < arguments.length; i++) {
					var arg = arguments[i];
					if (arg) {
						classes = appendClass(classes, parseValue(arg));
					}
				}

				return classes;
			}

			function parseValue (arg) {
				if (typeof arg === 'string' || typeof arg === 'number') {
					return arg;
				}

				if (typeof arg !== 'object') {
					return '';
				}

				if (Array.isArray(arg)) {
					return classNames.apply(null, arg);
				}

				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					return arg.toString();
				}

				var classes = '';

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes = appendClass(classes, key);
					}
				}

				return classes;
			}

			function appendClass (value, newClass) {
				if (!newClass) {
					return value;
				}
			
				if (value) {
					return value + ' ' + newClass;
				}
			
				return value + newClass;
			}

			if (module.exports) {
				classNames.default = classNames;
				module.exports = classNames;
			} else {
				window.classNames = classNames;
			}
		}()); 
	} (classnames));
	return classnames.exports;
}

var classnamesExports = requireClassnames();
var classNameFun = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

const zaneIconCss = () => `.zane-icon{--zane-icon-color:inherit;display:inline-flex;justify-content:center;align-items:center;fill:currentColor;color:var(--zane-icon-color);font-size:inherit}.zane-icon .icon-empty,.zane-icon .icon-loading,.zane-icon .icon-error,.zane-icon .icon-not-found{padding:4px 8px;border-radius:4px;font-size:12px;line-height:1.4}.zane-icon .icon-empty{color:#999;background-color:#f5f5f5}.zane-icon .icon-loading{color:#1890ff;background-color:#e6f7ff}.zane-icon .icon-error{color:#ff4d4f;background-color:#fff2f0}.zane-svg{display:inline-flex;height:1em;width:1em}.zane-svg.is-spin{animation:rotating 2s linear infinite}@keyframes rotating{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}`;

const ns$3 = useNamespace.useNamespace('icon');
const ZaneIcon = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.classNames = '';
    }
    render() {
        const style = Object.assign({
            color: this.color,
        }, this.styles || {});
        if (this.size) {
            const value = Number.isNaN(Number(this.size))
                ? this.size
                : `${this.size}px`;
            style.width = value;
            style.height = value;
        }
        if (this.rotate && Number.isSafeInteger(this.rotate)) {
            style.transform = `rotate(${this.rotate}deg)`;
        }
        const IconName = this.name ? `zane-icon-${this.name}` : 'slot';
        return (index.h(index.Host, { key: 'ab0cece39bb8e64789ed6614e659114e24dd4e58', class: ns$3.b() }, index.h(IconName, { key: '5def34d8c619f4be0f352bd1043a90b718fe1e71', class: classNameFun(this.classNames, ns$3.is('spin', this.spin)), style: style })));
    }
};
ZaneIcon.style = zaneIconCss();

const zaneInputCss = () => `.zane-textarea{--zane-input-text-color:var(--zane-text-color-regular);--zane-input-border:var(--zane-border);--zane-input-hover-border:var(--zane-border-color-hover);--zane-input-focus-border:var(--zane-color-primary);--zane-input-transparent-border:0 0 0 1px transparent inset;--zane-input-border-color:var(--zane-border-color);--zane-input-border-radius:var(--zane-border-radius-base);--zane-input-bg-color:var(--zane-fill-color-blank);--zane-input-icon-color:var(--zane-text-color-placeholder);--zane-input-placeholder-color:var(--zane-text-color-placeholder);--zane-input-hover-border-color:var(--zane-border-color-hover);--zane-input-clear-hover-color:var(--zane-text-color-secondary);--zane-input-focus-border-color:var(--zane-color-primary);--zane-input-width:100%}.zane-textarea{position:relative;display:inline-block;width:100%;vertical-align:bottom;font-size:var(--zane-font-size-base)}.zane-textarea .zane-textarea__inner{position:relative;display:block;resize:vertical;padding:5px 11px;line-height:1.5;box-sizing:border-box;width:100%;font-size:inherit;font-family:inherit;color:var(--zane-input-text-color, var(--zane-text-color-regular));background-color:var(--zane-input-bg-color, var(--zane-fill-color-blank));background-image:none;-webkit-appearance:none;box-shadow:0 0 0 1px var(--zane-input-border-color, var(--zane-border-color)) inset;border-radius:var(--zane-input-border-radius, var(--zane-border-radius-base));transition:var(--zane-transition-box-shadow);border:none}.zane-textarea .zane-textarea__inner::placeholder{color:var(--zane-input-placeholder-color, var(--zane-text-color-placeholder))}.zane-textarea .zane-textarea__inner:hover{box-shadow:0 0 0 1px var(--zane-input-hover-border-color) inset}.zane-textarea .zane-textarea__inner:focus{outline:none;box-shadow:0 0 0 1px var(--zane-input-focus-border-color) inset}.zane-textarea .zane-input__count{color:var(--zane-color-info);background:var(--zane-fill-color-blank);position:absolute;font-size:12px;line-height:14px;bottom:5px;right:10px}.zane-textarea .zane-input__count.is-outside{position:absolute;background:transparent;padding-top:2px;top:100%;right:0;bottom:unset;line-height:1}.zane-textarea.is-disabled .zane-textarea__inner{box-shadow:0 0 0 1px var(--zane-disabled-border-color) inset;background-color:var(--zane-disabled-bg-color);color:var(--zane-disabled-text-color);cursor:not-allowed}.zane-textarea.is-disabled .zane-textarea__inner::placeholder{color:var(--zane-text-color-placeholder)}.zane-textarea.is-exceed .zane-textarea__inner{box-shadow:0 0 0 1px var(--zane-color-danger) inset}.zane-textarea.is-exceed .zane-input__count{color:var(--zane-color-danger)}.zane-input{--zane-input-text-color:var(--zane-text-color-regular);--zane-input-border:var(--zane-border);--zane-input-hover-border:var(--zane-border-color-hover);--zane-input-focus-border:var(--zane-color-primary);--zane-input-transparent-border:0 0 0 1px transparent inset;--zane-input-border-color:var(--zane-border-color);--zane-input-border-radius:var(--zane-border-radius-base);--zane-input-bg-color:var(--zane-fill-color-blank);--zane-input-icon-color:var(--zane-text-color-placeholder);--zane-input-placeholder-color:var(--zane-text-color-placeholder);--zane-input-hover-border-color:var(--zane-border-color-hover);--zane-input-clear-hover-color:var(--zane-text-color-secondary);--zane-input-focus-border-color:var(--zane-color-primary);--zane-input-width:100%}.zane-input{--zane-input-height:var(--zane-component-size);position:relative;font-size:var(--zane-font-size-base);display:inline-flex;width:var(--zane-input-width);line-height:var(--zane-input-height);box-sizing:border-box;vertical-align:middle}.zane-input::-webkit-scrollbar{z-index:11;width:6px}.zane-input::-webkit-scrollbar:horizontal{height:6px}.zane-input::-webkit-scrollbar-thumb{border-radius:5px;width:6px;background:var(--zane-text-color-disabled)}.zane-input::-webkit-scrollbar-corner{background:var(--zane-fill-color-blank)}.zane-input::-webkit-scrollbar-track{background:var(--zane-fill-color-blank)}.zane-input::-webkit-scrollbar-track-piece{background:var(--zane-fill-color-blank);width:6px}.zane-input .zane-input__clear,.zane-input .zane-input__password{color:var(--zane-input-icon-color);font-size:14px;cursor:pointer}.zane-input .zane-input__clear:hover,.zane-input .zane-input__password:hover{color:var(--zane-input-clear-hover-color)}.zane-input .zane-input__count{height:100%;display:inline-flex;align-items:center;color:var(--zane-color-info);font-size:12px}.zane-input .zane-input__count .zane-input__count-inner{background:var(--zane-fill-color-blank);line-height:initial;display:inline-block;padding-left:8px}.zane-input .zane-input__count.is-outside{height:unset;position:absolute;padding-top:2px;top:100%;right:0}.zane-input .zane-input__count.is-outside .zane-input__count-inner{background:transparent;padding-left:0px;line-height:1}.zane-input .zane-input__wrapper{display:inline-flex;flex-grow:1;align-items:center;justify-content:center;padding:1px 11px;background-color:var(--zane-input-bg-color, var(--zane-fill-color-blank));background-image:none;border-radius:var(--zane-input-border-radius, var(--zane-border-radius-base));cursor:text;transition:var(--zane-transition-box-shadow);transform:translate3d(0, 0, 0);box-shadow:0 0 0 1px var(--zane-input-border-color, var(--zane-border-color)) inset}.zane-input .zane-input__wrapper:hover{box-shadow:0 0 0 1px var(--zane-input-hover-border-color) inset}.zane-input .zane-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--zane-input-focus-border-color) inset}.zane-input{--zane-input-inner-height:calc(var(--zane-input-height, 32px) - 2px)}.zane-input .zane-input__inner{width:100%;flex-grow:1;-webkit-appearance:none;color:var(--zane-input-text-color, var(--zane-text-color-regular));font-size:inherit;height:var(--zane-input-inner-height);line-height:var(--zane-input-inner-height);padding:0;outline:none;border:none;background:none;box-sizing:border-box}.zane-input .zane-input__inner:focus{outline:none}.zane-input .zane-input__inner::placeholder{color:var(--zane-input-placeholder-color, var(--zane-text-color-placeholder))}.zane-input .zane-input__inner[type=password]::-ms-reveal{display:none}.zane-input .zane-input__inner[type=number]{line-height:1}.zane-input .zane-input__prefix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;line-height:var(--zane-input-inner-height);text-align:center;color:var(--zane-input-icon-color, var(--zane-text-color-placeholder));transition:all var(--zane-transition-duration);pointer-events:none}.zane-input .zane-input__prefix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.zane-input .zane-input__prefix-inner>:last-child{margin-right:8px}.zane-input .zane-input__prefix-inner>:first-child,.zane-input .zane-input__prefix-inner>:first-child.zane-input__icon{margin-left:0}.zane-input .zane-input__suffix{display:inline-flex;white-space:nowrap;flex-shrink:0;flex-wrap:nowrap;height:100%;line-height:var(--zane-input-inner-height);text-align:center;color:var(--zane-input-icon-color, var(--zane-text-color-placeholder));transition:all var(--zane-transition-duration);pointer-events:none}.zane-input .zane-input__suffix-inner{pointer-events:all;display:inline-flex;align-items:center;justify-content:center}.zane-input .zane-input__suffix-inner>:first-child{margin-left:8px}.zane-input .zane-input__icon{height:inherit;line-height:inherit;display:flex;justify-content:center;align-items:center;transition:all var(--zane-transition-duration);margin-left:8px}.zane-input .zane-input__validateIcon{pointer-events:none}.zane-input.is-active .zane-input__wrapper{box-shadow:0 0 0 1px var(--zane-input-focus-color, ) inset}.zane-input.is-disabled{cursor:not-allowed}.zane-input.is-disabled .zane-input__wrapper{background-color:var(--zane-disabled-bg-color);cursor:not-allowed;box-shadow:0 0 0 1px var(--zane-disabled-border-color) inset}.zane-input.is-disabled .zane-input__inner{color:var(--zane-disabled-text-color);-webkit-text-fill-color:var(--zane-disabled-text-color);cursor:not-allowed}.zane-input.is-disabled .zane-input__inner::placeholder{color:var(--zane-text-color-placeholder)}.zane-input.is-disabled .zane-input__icon{cursor:not-allowed}.zane-input.is-disabled .zane-input__prefix-inner,.zane-input.is-disabled .zane-input__suffix-inner{pointer-events:none}.zane-input.is-exceed .zane-input__wrapper{box-shadow:0 0 0 1px var(--zane-color-danger) inset}.zane-input.is-exceed .zane-input__suffix .zane-input__count{color:var(--zane-color-danger)}.zane-input--large{--zane-input-height:var(--zane-component-size-large);font-size:14px}.zane-input--large .zane-input__wrapper{padding:1px 15px}.zane-input--large{--zane-input-inner-height:calc(var(--zane-input-height, 40px) - 2px)}.zane-input--small{--zane-input-height:var(--zane-component-size-small);font-size:12px}.zane-input--small .zane-input__wrapper{padding:1px 7px}.zane-input--small{--zane-input-inner-height:calc(var(--zane-input-height, 24px) - 2px)}.zane-input-group{display:inline-flex;width:100%;align-items:stretch}.zane-input-group .zane-input-group__append,.zane-input-group .zane-input-group__prepend{background-color:var(--zane-fill-color-light);color:var(--zane-color-info);position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:100%;border-radius:var(--zane-input-border-radius);padding:0 20px;white-space:nowrap}.zane-input-group .zane-input-group__append:focus,.zane-input-group .zane-input-group__prepend:focus{outline:none}.zane-input-group .zane-input-group__append .zane-select,.zane-input-group .zane-input-group__append .zane-button,.zane-input-group .zane-input-group__prepend .zane-select,.zane-input-group .zane-input-group__prepend .zane-button{display:inline-block;flex:1;margin:0 -20px}.zane-input-group .zane-input-group__append button.zane-button,.zane-input-group .zane-input-group__append button.zane-button:hover,.zane-input-group .zane-input-group__append div.zane-select .zane-select__wrapper,.zane-input-group .zane-input-group__append div.zane-select:hover .zane-select__wrapper,.zane-input-group .zane-input-group__prepend button.zane-button,.zane-input-group .zane-input-group__prepend button.zane-button:hover,.zane-input-group .zane-input-group__prepend div.zane-select .zane-select__wrapper,.zane-input-group .zane-input-group__prepend div.zane-select:hover .zane-select__wrapper{border-color:transparent;background-color:transparent;color:inherit}.zane-input-group .zane-input-group__append .zane-button,.zane-input-group .zane-input-group__append .zane-input,.zane-input-group .zane-input-group__prepend .zane-button,.zane-input-group .zane-input-group__prepend .zane-input{font-size:inherit}.zane-input-group .zane-input-group__prepend{border-right:0;border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--zane-input-border-color) inset, 0 1px 0 0 var(--zane-input-border-color) inset, 0 -1px 0 0 var(--zane-input-border-color) inset}.zane-input-group .zane-input-group__append{border-left:0;border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--zane-input-border-color) inset, 0 -1px 0 0 var(--zane-input-border-color) inset, -1px 0 0 0 var(--zane-input-border-color) inset}.zane-input-group--prepend>.zane-input__wrapper{border-top-left-radius:0;border-bottom-left-radius:0}.zane-input-group--prepend .zane-input-group__prepend .zane-select .zane-select__wrapper{border-top-right-radius:0;border-bottom-right-radius:0;box-shadow:1px 0 0 0 var(--zane-input-border-color) inset, 0 1px 0 0 var(--zane-input-border-color) inset, 0 -1px 0 0 var(--zane-input-border-color) inset}.zane-input-group--append>.zane-input__wrapper{border-top-right-radius:0;border-bottom-right-radius:0}.zane-input-group--append .zane-input-group__append .zane-select .zane-select__wrapper{border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:0 1px 0 0 var(--zane-input-border-color) inset, 0 -1px 0 0 var(--zane-input-border-color) inset, -1px 0 0 0 var(--zane-input-border-color) inset}.zane-input-hidden{display:none !important}`;

const nsInput = useNamespace.useNamespace('input');
const nsTextarea = useNamespace.useNamespace('textarea');
const ZaneInput = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.blurEvent = index.createEvent(this, "zBlur", 7);
        this.changeEvent = index.createEvent(this, "zChange", 7);
        this.clearEvent = index.createEvent(this, "zClear", 7);
        this.compositionendEvent = index.createEvent(this, "zCompositionEnd", 7);
        this.compositionstartEvent = index.createEvent(this, "zCompositionStart", 7);
        this.compositionupdateEvent = index.createEvent(this, "zCompositionUpdate", 7);
        this.focusEvent = index.createEvent(this, "zFocus", 7);
        this.inputEvent = index.createEvent(this, "zInput", 7);
        this.keydownEvent = index.createEvent(this, "zKeyDown", 7);
        this.mouseEnterEvent = index.createEvent(this, "zMouseEnter", 7);
        this.mouseLeaveEvent = index.createEvent(this, "zMouseLeave", 7);
        this.autocomplete = 'off';
        this.autosize = false;
        this.clearable = false;
        this.clearIcon = 'circle-close';
        this.countStyle = {};
        this.disabled = undefined;
        this.hovering = false;
        this.inputStyle = typescript.mutable({});
        this.isComposing = false;
        this.isFocused = false;
        this.passwordVisible = false;
        this.rows = 2;
        this.textareaCalcStyle = {};
        this.type = 'text';
        this.validateEvent = true;
        this.value = '';
        this.wordLimitPosition = 'inside';
        this.zTabindex = 0;
        this.resizeTextarea = () => {
            if (!isClient.isClient || this.type !== 'textarea' || !this.textareaRef)
                return;
            if (this.autosize) {
                const minRows = isObject.isObject(this.autosize)
                    ? this.autosize.minRows
                    : undefined;
                const maxRows = isObject.isObject(this.autosize)
                    ? this.autosize.maxRows
                    : undefined;
                const textareaStyle = calcTextareaHeight(this.textareaRef, minRows, maxRows);
                // If the scrollbar is displayed, the height of the textarea needs more space than the calculated height.
                // If set textarea height in this case, the scrollbar will not hide.
                // So we need to hide scrollbar first, and reset it in next tick.
                // see https://github.com/element-plus/element-plus/issues/8825
                this.textareaCalcStyle = Object.assign({ overflowY: 'hidden' }, textareaStyle);
                nextFrame.nextFrame(() => {
                    this.textareaCalcStyle = textareaStyle;
                });
            }
            else {
                this.textareaCalcStyle = {
                    minHeight: calcTextareaHeight(this.textareaRef).minHeight,
                };
            }
        };
        this.setNativeInputValue = () => {
            const input = this.inputRef || this.textareaRef;
            const formatterValue = this.formatter
                ? this.formatter(this.getNativeInputValue())
                : this.getNativeInputValue();
            if (!input || input.value === formatterValue)
                return;
            input.value = formatterValue;
        };
        this.handleAfterBlur = () => {
        };
        this.handleBlur = (event) => {
            var _a;
            if (this.getInputDisabled() ||
                (event.relatedTarget &&
                    ((_a = this.wrapperRef) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget)))) {
                return;
            }
            this.isFocused = false;
            this.blurEvent.emit(event);
            this.handleAfterBlur();
        };
        this.handleChange = (event) => {
            let { value } = event.target;
            if (this.formatter && this.parser) {
                value = this.parser(value);
            }
            this.changeEvent.emit(value);
        };
        this.handleClear = () => {
            this.clear();
        };
        this.handleCompositionEnd = (event) => {
            this.compositionendEvent.emit(event);
            if (this.isComposing) {
                this.isComposing = false;
                nextFrame.nextFrame(() => {
                    this.handleInput(event);
                });
            }
        };
        this.handleCompositionStart = (event) => {
            this.compositionstartEvent.emit(event);
            this.isComposing = true;
        };
        this.handleCompositionUpdate = (event) => {
            var _a;
            this.compositionupdateEvent.emit(event);
            const text = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
            const lastCharacter = text[text.length - 1] || '';
            this.isComposing = !isKorean(lastCharacter);
        };
        this.handleFocus = (event) => {
            if (this.getInputDisabled() || this.isFocused)
                return;
            this.isFocused = true;
            this.focusEvent.emit(event);
        };
        this.handleInput = async (event) => {
            this.recordCursor();
            let { value } = event.target;
            if (this.formatter && this.parser) {
                value = this.parser(value);
            }
            // should not emit input during composition
            // see: https://github.com/ElemeFE/element/issues/10516
            if (this.isComposing)
                return;
            // hack for https://github.com/ElemeFE/element/issues/8548
            // should remove the following line when we don't support IE
            if (value === this.getNativeInputValue()) {
                this.setNativeInputValue();
                return;
            }
            this.value = value;
            this.inputEvent.emit(value);
            nextFrame.nextFrame(() => {
                this.setNativeInputValue();
                this.setCursor();
            });
        };
        this.handleKeydown = (evt) => {
            this.keydownEvent.emit(evt);
        };
        this.handleMouseEnter = (evt) => {
            this.hovering = true;
            this.mouseEnterEvent.emit(evt);
        };
        this.handleMouseLeave = (evt) => {
            this.hovering = false;
            this.mouseLeaveEvent.emit(evt);
        };
        this.handlePasswordVisible = () => {
            this.recordCursor();
            this.passwordVisible = !this.passwordVisible;
            // The native input needs a little time to regain focus
            setTimeout(this.setCursor);
        };
        this.renderInput = () => {
            const wrapperClasses = {
                [nsInput.e('wrapper')]: true,
                [nsInput.is('focus', this.isFocused)]: true,
            };
            return (index.h(index.Fragment, null, this.hasPrepend && (index.h("div", { class: nsInput.be('group', 'prepend') }, index.h("slot", { name: "prepend" }))), index.h("div", { class: wrapperClasses, ref: (el) => (this.wrapperRef = el) }, (this.hasPrefix || this.prefixIcon) && (index.h("span", { class: nsInput.e('prefix') }, index.h("span", { class: nsInput.e('prefix-inner') }, index.h("slot", { name: "prefix" }), this.prefixIcon && (index.h("zane-icon", { class: nsInput.e('icon'), name: this.prefixIcon }))))), index.h("input", { "aria-label": this.ariaLabel, autocomplete: this.autocomplete, autofocus: this.autofocus, class: nsInput.e('inner'), disabled: this.getInputDisabled(), form: this.form, inputmode: this.zInputMode, max: this.max, maxlength: this.maxLength, min: this.min, minlength: this.minLength, name: this.name, onBlur: this.handleBlur, onChange: this.handleChange, onCompositionend: this.handleCompositionEnd, onCompositionstart: this.handleCompositionStart, onCompositionupdate: this.handleCompositionUpdate, onFocus: this.handleFocus, onInput: this.handleInput, onKeyDown: this.handleKeydown, placeholder: this.placeholder, readonly: this.readonly, ref: (el) => (this.inputRef = el), step: this.step, tabindex: this.zTabindex, type: this.getInputType() }), this.getSuffixVisible() && (index.h("span", { class: nsInput.e('suffix') }, index.h("span", { class: nsInput.e('suffix-inner') }, (!this.getShowClear() ||
                !this.getShowPwdVisible() ||
                !this.getIsWordLimitVisible()) && (index.h(index.Fragment, null, index.h("slot", { name: "suffix" }), this.suffixIcon && (index.h("zane-icon", { class: nsInput.e('icon'), name: this.suffixIcon })))), this.getShowClear() && (index.h("zane-icon", { class: {
                    [nsInput.e('clear')]: true,
                    [nsInput.e('icon')]: true,
                }, name: this.clearIcon, onClick: this.handleClear })), this.getShowPwdVisible() && (index.h("zane-icon", { class: {
                    [nsInput.e('icon')]: true,
                    [nsInput.e('password')]: true,
                }, name: "view", onClick: this.handlePasswordVisible })), this.getIsWordLimitVisible() && (index.h("span", { class: {
                    [nsInput.e('count')]: true,
                    [nsInput.is('outside', this.wordLimitPosition === 'outside')]: true,
                } }, index.h("span", { class: nsInput.e('count-inner') }, this.getTextLength(), " / ", this.maxLength))))))), this.hasAppend && (index.h("div", { class: nsInput.be('group', 'append') }, index.h("slot", { name: "append" })))));
        };
        this.renderTextarea = () => {
            return (index.h(index.Fragment, null, index.h("textarea", { "aria-label": this.ariaLabel, autocomplete: this.autocomplete, autofocus: this.autofocus, class: {
                    [nsInput.is('focus', this.isFocused)]: true,
                    [nsTextarea.e('inner')]: true,
                }, disabled: this.getInputDisabled(), form: this.form, maxlength: this.maxLength, minlength: this.minLength, name: this.name, onBlur: this.handleBlur, onChange: this.handleChange, onCompositionend: this.handleCompositionEnd, onCompositionstart: this.handleCompositionStart, onCompositionupdate: this.handleCompositionUpdate, onFocus: this.handleFocus, onInput: this.handleInput, onKeyDown: this.handleKeydown, placeholder: this.placeholder, readonly: this.readonly, ref: (el) => (this.textareaRef = el), rows: this.rows, style: this.getTextareaStyle(), tabindex: this.zTabindex }), this.getIsWordLimitVisible() && (index.h("span", { class: {
                    [nsInput.e('count')]: true,
                    [nsInput.is('outside', this.wordLimitPosition === 'outside')]: true,
                }, style: this.countStyle }, this.getTextLength(), " / ", this.maxLength))));
        };
    }
    get formContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM') {
                context = constants.formContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    async clear() {
        this.value = '';
        this.setNativeInputValue();
        this.changeEvent.emit('');
        this.clearEvent.emit();
        this.inputEvent.emit('');
    }
    componentDidLoad() {
        const [recordCursor, setCursor] = useCursor(this.inputRef);
        this.recordCursor = recordCursor;
        this.setCursor = setCursor;
        this.setNativeInputValue();
        nextFrame.nextFrame(() => {
            this.resizeTextarea();
        });
    }
    componentWillLoad() {
        this.hasAppend = !!this.el.querySelector('[slot="append"]');
        this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
        this.hasPrepend = !!this.el.querySelector('[slot="prepend"]');
        this.hasSuffix = !!this.el.querySelector('[slot="suffix"]');
        this.textareaCalcStyle = normalizeStyle.normalizeStyle(this.inputStyle);
    }
    async getInput() {
        return this.inputRef;
    }
    getInputDisabled() {
        var _a, _b, _c;
        return (_c = (_a = this.disabled) !== null && _a !== void 0 ? _a : (_b = this.formContext) === null || _b === void 0 ? void 0 : _b.disabled) !== null && _c !== void 0 ? _c : false;
    }
    getInputExceed() {
        return (!!this.getIsWordLimitVisible() &&
            this.getTextLength() > Number(this.maxLength));
    }
    getInputSize() {
        var _a;
        return this.size || ((_a = this.formContext) === null || _a === void 0 ? void 0 : _a.size) || 'default';
    }
    getInputType() {
        if (this.showPassword) {
            return this.passwordVisible ? 'text' : 'password';
        }
        return this.type;
    }
    getIsWordLimitVisible() {
        return (this.showWordLimit &&
            !!this.maxLength &&
            (this.type === 'text' || this.type === 'textarea') &&
            !this.getInputDisabled() &&
            !this.readonly &&
            !this.showPassword);
    }
    getNativeInput() {
        return this.inputRef || this.textareaRef;
    }
    getNativeInputValue() {
        return this.value === null ? '' : String(this.value);
    }
    getShowClear() {
        return (this.clearable &&
            !this.getInputDisabled() &&
            !this.readonly &&
            !!this.getNativeInputValue() &&
            (this.isFocused || this.hovering));
    }
    getShowPwdVisible() {
        return (this.showPassword &&
            !this.getInputDisabled() &&
            !!this.getNativeInputValue());
    }
    getSuffixVisible() {
        return (!!this.hasSuffix ||
            !!this.suffixIcon ||
            this.getShowClear() ||
            this.showPassword ||
            this.getIsWordLimitVisible());
    }
    getTextareaStyle() {
        return Object.assign(Object.assign(Object.assign({}, normalizeStyle.normalizeStyle(this.inputStyle)), this.textareaCalcStyle), { resize: this.resize });
    }
    getTextLength() {
        return this.getNativeInputValue().length;
    }
    onTypeChange() {
        setTimeout(() => {
            this.setNativeInputValue();
            this.resizeTextarea();
        });
    }
    onValueChange() {
        this.inputRef.value = this.value;
        this.resizeTextarea();
    }
    render() {
        const isTextarea = this.type === 'textarea';
        const containerClasses = {
            [nsInput.b('group')]: this.hasPrepend || this.hasAppend,
            [nsInput.b('hidden')]: this.type === 'hidden',
            [nsInput.b()]: !isTextarea,
            [nsInput.bm('group', 'append')]: this.hasAppend,
            [nsInput.bm('group', 'prepend')]: this.hasPrepend,
            [nsInput.bm('suffix', 'password-clear')]: this.getShowClear() && this.getShowPwdVisible(),
            [nsInput.is('disabled', this.getInputDisabled())]: true,
            [nsInput.is('exceed', this.getInputExceed())]: true,
            [nsInput.m('prefix')]: this.hasPrefix || !!this.prefixIcon,
            [nsInput.m('suffix')]: this.hasSuffix ||
                !!this.suffixIcon ||
                this.clearable ||
                this.showPassword,
            [nsInput.m(this.getInputSize())]: true,
            [nsTextarea.b()]: isTextarea,
        };
        return (index.h(index.Host, { key: 'd7006653e4dec3533701e42a52435308da65c80c', class: containerClasses, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, this.type === 'textarea' ? this.renderTextarea() : this.renderInput()));
    }
    async select() {
        var _a;
        (_a = this.getNativeInput()) === null || _a === void 0 ? void 0 : _a.select();
    }
    async zBlur() {
        var _a;
        (_a = this.getNativeInput()) === null || _a === void 0 ? void 0 : _a.blur();
    }
    async zFocus() {
        var _a;
        (_a = this.getNativeInput()) === null || _a === void 0 ? void 0 : _a.focus();
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "type": [{
                "onTypeChange": 0
            }],
        "value": [{
                "onValueChange": 0
            }]
    }; }
};
ZaneInput.style = zaneInputCss();

const zaneTagCss = () => `.zane-tag{--zane-tag-font-size:12px;--zane-tag-border-radius:4px;--zane-tag-border-radius-rounded:9999px}.zane-tag{background-color:var(--zane-tag-bg-color);border-color:var(--zane-tag-border-color);color:var(--zane-tag-text-color);display:inline-flex;justify-content:center;align-items:center;vertical-align:middle;height:24px;padding:0 9px;font-size:var(--zane-tag-font-size);line-height:1;border-width:1px;border-style:solid;border-radius:var(--zane-tag-border-radius);box-sizing:border-box;white-space:nowrap;--zane-icon-size:14px;--zane-tag-bg-color:var(--zane-color-primary-light-9);--zane-tag-border-color:var(--zane-color-primary-light-8);--zane-tag-hover-color:var(--zane-color-primary)}.zane-tag.zane-tag--primary{--zane-tag-bg-color:var(--zane-color-primary-light-9);--zane-tag-border-color:var(--zane-color-primary-light-8);--zane-tag-hover-color:var(--zane-color-primary)}.zane-tag.zane-tag--success{--zane-tag-bg-color:var(--zane-color-success-light-9);--zane-tag-border-color:var(--zane-color-success-light-8);--zane-tag-hover-color:var(--zane-color-success)}.zane-tag.zane-tag--warning{--zane-tag-bg-color:var(--zane-color-warning-light-9);--zane-tag-border-color:var(--zane-color-warning-light-8);--zane-tag-hover-color:var(--zane-color-warning)}.zane-tag.zane-tag--danger{--zane-tag-bg-color:var(--zane-color-danger-light-9);--zane-tag-border-color:var(--zane-color-danger-light-8);--zane-tag-hover-color:var(--zane-color-danger)}.zane-tag.zane-tag--error{--zane-tag-bg-color:var(--zane-color-error-light-9);--zane-tag-border-color:var(--zane-color-error-light-8);--zane-tag-hover-color:var(--zane-color-error)}.zane-tag.zane-tag--info{--zane-tag-bg-color:var(--zane-color-info-light-9);--zane-tag-border-color:var(--zane-color-info-light-8);--zane-tag-hover-color:var(--zane-color-info)}.zane-tag.is-hit{border-color:var(--zane-color-primary)}.zane-tag.is-round{border-radius:var(--zane-tag-border-radius-rounded)}.zane-tag .zane-tag__close{flex-shrink:0;color:var(--zane-tag-text-color)}.zane-tag .zane-tag__close:hover{color:var(--zane-color-white);background-color:var(--zane-tag-hover-color)}.zane-tag.zane-tag--primary{--zane-tag-text-color:var(--zane-color-primary)}.zane-tag.zane-tag--success{--zane-tag-text-color:var(--zane-color-success)}.zane-tag.zane-tag--warning{--zane-tag-text-color:var(--zane-color-warning)}.zane-tag.zane-tag--danger{--zane-tag-text-color:var(--zane-color-danger)}.zane-tag.zane-tag--error{--zane-tag-text-color:var(--zane-color-error)}.zane-tag.zane-tag--info{--zane-tag-text-color:var(--zane-color-info)}.zane-tag .zane-icon{display:flex;border-radius:50%;cursor:pointer;font-size:calc(var(--zane-icon-size) - 2px);height:var(--zane-icon-size);width:var(--zane-icon-size)}.zane-tag .zane-tag__close{padding:0;background-color:transparent;border-radius:50%;border:none;outline:none;overflow:hidden;margin-left:6px}.zane-tag .zane-tag__close:focus-visible{outline:2px solid var(--zane-color-primary);outline-offset:2px}.zane-tag--dark{--zane-tag-text-color:var(--zane-color-white);--zane-tag-bg-color:var(--zane-color-primary);--zane-tag-border-color:var(--zane-color-primary);--zane-tag-hover-color:var(--zane-color-primary-light-3)}.zane-tag--dark.zane-tag--primary{--zane-tag-bg-color:var(--zane-color-primary);--zane-tag-border-color:var(--zane-color-primary);--zane-tag-hover-color:var(--zane-color-primary-light-3)}.zane-tag--dark.zane-tag--success{--zane-tag-bg-color:var(--zane-color-success);--zane-tag-border-color:var(--zane-color-success);--zane-tag-hover-color:var(--zane-color-success-light-3)}.zane-tag--dark.zane-tag--warning{--zane-tag-bg-color:var(--zane-color-warning);--zane-tag-border-color:var(--zane-color-warning);--zane-tag-hover-color:var(--zane-color-warning-light-3)}.zane-tag--dark.zane-tag--danger{--zane-tag-bg-color:var(--zane-color-danger);--zane-tag-border-color:var(--zane-color-danger);--zane-tag-hover-color:var(--zane-color-danger-light-3)}.zane-tag--dark.zane-tag--error{--zane-tag-bg-color:var(--zane-color-error);--zane-tag-border-color:var(--zane-color-error);--zane-tag-hover-color:var(--zane-color-error-light-3)}.zane-tag--dark.zane-tag--info{--zane-tag-bg-color:var(--zane-color-info);--zane-tag-border-color:var(--zane-color-info);--zane-tag-hover-color:var(--zane-color-info-light-3)}.zane-tag--dark.zane-tag--primary{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--dark.zane-tag--success{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--dark.zane-tag--warning{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--dark.zane-tag--danger{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--dark.zane-tag--error{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--dark.zane-tag--info{--zane-tag-text-color:var(--zane-color-white)}.zane-tag--plain{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-primary-light-5);--zane-tag-hover-color:var(--zane-color-primary)}.zane-tag--plain.zane-tag--primary{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-primary-light-5);--zane-tag-hover-color:var(--zane-color-primary)}.zane-tag--plain.zane-tag--success{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-success-light-5);--zane-tag-hover-color:var(--zane-color-success)}.zane-tag--plain.zane-tag--warning{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-warning-light-5);--zane-tag-hover-color:var(--zane-color-warning)}.zane-tag--plain.zane-tag--danger{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-danger-light-5);--zane-tag-hover-color:var(--zane-color-danger)}.zane-tag--plain.zane-tag--error{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-error-light-5);--zane-tag-hover-color:var(--zane-color-error)}.zane-tag--plain.zane-tag--info{--zane-tag-bg-color:var(--zane-fill-color-blank);--zane-tag-border-color:var(--zane-color-info-light-5);--zane-tag-hover-color:var(--zane-color-info)}.zane-tag.is-closable{padding-right:5px}.zane-tag--large{padding:0 11px;height:32px;--zane-icon-size:16px}.zane-tag--large .zane-tag__close{margin-left:8px}.zane-tag--large.is-closable{padding-right:7px}.zane-tag--small{padding:0 7px;height:20px;--zane-icon-size:12px}.zane-tag--small .zane-tag__close{margin-left:4px}.zane-tag--small.is-closable{padding-right:3px}.zane-tag--small .zane-icon-close{transform:scale(0.8)}.zane-tag.zane-tag--primary.is-hit{border-color:var(--zane-color-primary)}.zane-tag.zane-tag--success.is-hit{border-color:var(--zane-color-success)}.zane-tag.zane-tag--warning.is-hit{border-color:var(--zane-color-warning)}.zane-tag.zane-tag--danger.is-hit{border-color:var(--zane-color-danger)}.zane-tag.zane-tag--error.is-hit{border-color:var(--zane-color-error)}.zane-tag.zane-tag--info.is-hit{border-color:var(--zane-color-info)}`;

const ns$2 = useNamespace.useNamespace('tag');
const ZaneTag = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.clickEvent = index.createEvent(this, "zClick", 7);
        this.closeEvent = index.createEvent(this, "zClose", 7);
        this.effect = 'light';
        this.type = 'primary';
        this.handleClick = (event) => {
            this.clickEvent.emit(event);
        };
        this.handleClose = (event) => {
            event.stopPropagation();
            this.closeEvent.emit();
        };
    }
    get formContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORM') {
                context = constants.formContexts.get(parent);
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
                context = constants.formItemContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    render() {
        const containerKls = [
            ns$2.b(),
            ns$2.is('closeable', this.closeable),
            ns$2.m(this.type || 'primary'),
            ns$2.m(this.getTagSize()),
            ns$2.m(this.effect),
            ns$2.is('hit', this.hit),
            ns$2.is('round', this.round),
        ].join(' ');
        return (index.h(index.Host, { key: '202f3ea53f8222c4210dc25e993a0b2359375f91' }, index.h("span", { key: '4da947a0cbc615bccb165e4b13ca9e96857fc05a', class: containerKls, onClick: this.handleClick, style: { backgroundColor: this.color } }, index.h("span", { key: 'f1242cb09f982879e5eff09ddb4bd03147c6ee5d', class: ns$2.e('content') }, index.h("slot", { key: '98df8752377aa4fc43981e8b763a3faf73bdbd9c' })), this.closeable && (index.h("button", { key: '7c26a21a0ccd5b48f993965bcd9a65b2afdae48e', class: ns$2.e('close'), onClick: this.handleClose, type: "botton" }, index.h("zane-icon", { key: '8e0959bac2599adecf3e1acb5005bcc150328712', name: "close" }))))));
    }
    getTagSize() {
        var _a, _b;
        return (this.size ||
            ((_a = this.formItemContext) === null || _a === void 0 ? void 0 : _a.size) ||
            ((_b = this.formContext) === null || _b === void 0 ? void 0 : _b.size) ||
            uuid.state.size ||
            '');
    }
    get el() { return index.getElement(this); }
};
ZaneTag.style = zaneTagCss();

function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
}

const currentInput = { isTouch: false };
let lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */
function onDocumentTouchStart() {
    if (currentInput.isTouch) {
        return;
    }
    currentInput.isTouch = true;
    if (window.performance) {
        document.addEventListener('mousemove', onDocumentMouseMove);
    }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */
function onDocumentMouseMove() {
    const now = performance.now();
    if (now - lastMouseMoveTime < 20) {
        currentInput.isTouch = false;
        document.removeEventListener('mousemove', onDocumentMouseMove);
    }
    lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */
function onWindowBlur() {
    const activeElement = document.activeElement;
    if (isReferenceElement(activeElement)) {
        const instance = activeElement._tippy;
        if (activeElement.blur && !(instance === null || instance === void 0 ? void 0 : instance.state.isVisible)) {
            activeElement.blur();
        }
    }
}
function bindGlobalEventListeners() {
    document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
    window.addEventListener('blur', onWindowBlur);
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement$1(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement$1(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement$1(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement$1(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement$1(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement$1(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement$1(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement$1(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement$1(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement$1(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement$1(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!debounce$1.isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = debounce$1.baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = debounce$1.root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!debounce$1.isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (-1);

  while ((++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(debounce$1.root, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/* Built-in method references that are verified to be native. */
var Set$1 = getNative(debounce$1.root, 'Set');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set$1 && (1 / setToArray(new Set$1([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set$1(values);
};

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (length >= LARGE_ARRAY_SIZE) {
    var set = createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = value;

    value = (value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

function actualContains(parent, child) {
    var _a, _b;
    let target = child;
    while (target) {
        if (parent.contains(target)) {
            return true;
        }
        target = (_b = (_a = target.getRootNode) === null || _a === void 0 ? void 0 : _a.call(target)) === null || _b === void 0 ? void 0 : _b.host;
    }
    return false;
}

function getExtendedPassedProps(passedProps) {
    const plugins = passedProps.plugins || [];
    const pluginProps = plugins.reduce((acc, plugin) => {
        var _a;
        const { defaultValue, name } = plugin;
        if (name) {
            acc[name] =
                passedProps[name] === undefined
                    ? ((_a = defaultProps[name]) !== null && _a !== void 0 ? _a : defaultValue)
                    : passedProps[name];
        }
        return acc;
    }, {});
    return Object.assign(Object.assign({}, passedProps), pluginProps);
}

function getDataAttributeProps(reference, plugins) {
    const propKeys = plugins
        ? Object.keys(getExtendedPassedProps(Object.assign(Object.assign({}, defaultProps), { plugins })))
        : defaultKeys;
    const props = propKeys.reduce((acc, key) => {
        const valueAsString = (reference.getAttribute(`data-tippy-${key}`) || '').trim();
        if (!valueAsString) {
            return acc;
        }
        if (key === 'content') {
            acc[key] = valueAsString;
        }
        else {
            try {
                acc[key] = JSON.parse(valueAsString);
            }
            catch (_a) {
                acc[key] = valueAsString;
            }
        }
        return acc;
    }, {});
    return props;
}

function invokeWithArgsOrReturn(value, args) {
    return typeof value === 'function' ? value(...args) : value;
}

function evaluateProps(reference, props) {
    const out = Object.assign(Object.assign(Object.assign({}, props), { content: invokeWithArgsOrReturn(props.content, [reference]) }), (props.ignoreAttributes
        ? {}
        : getDataAttributeProps(reference, props.plugins)));
    out.aria = Object.assign(Object.assign({}, defaultProps.aria), out.aria);
    out.aria = {
        content: out.aria.content === 'auto'
            ? // eslint-disable-next-line unicorn/no-nested-ternary
                props.interactive
                    ? null
                    : 'describedby'
            : out.aria.content,
        expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    };
    return out;
}

function getChildren(popper) {
    const box = popper.firstElementChild;
    const boxChildren = arrayFrom(box.children);
    return {
        arrow: boxChildren.find((node) => node.classList.contains(ARROW_CLASS) ||
            node.classList.contains(SVG_ARROW_CLASS)),
        backdrop: boxChildren.find((node) => node.classList.contains(BACKDROP_CLASS)),
        box,
        content: boxChildren.find((node) => node.classList.contains(CONTENT_CLASS)),
    };
}

function getValueAtIndexOrReturn(value, index, defaultValue) {
    if (Array.isArray(value)) {
        const v = value[index];
        return v === null
            ? // eslint-disable-next-line unicorn/no-nested-ternary
                Array.isArray(defaultValue)
                    ? defaultValue[index]
                    : defaultValue
            : v;
    }
    return value;
}

function getBasePlacement(placement) {
    return placement.split('-')[0];
}

function isCursorOutsideInteractiveBorder(popperTreeData, event) {
    const { clientX, clientY } = event;
    return popperTreeData.every(({ popperRect, popperState, props }) => {
        const { interactiveBorder } = props;
        const basePlacement = getBasePlacement(popperState.placement);
        const offsetData = popperState.modifiersData.offset;
        if (!offsetData) {
            return true;
        }
        const topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
        const bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
        const leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
        const rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
        const exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
        const exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
        const exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
        const exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
        return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
    });
}

function removeUndefinedProps(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== undefined) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

function setTransitionDuration(els, value) {
    els.forEach((el) => {
        if (el) {
            el.style.transitionDuration = `${value}ms`;
        }
    });
}

function setVisibilityState(els, state) {
    els.forEach((el) => {
        if (el) {
            el.dataset.state = state;
        }
    });
}

function splitBySpaces(value) {
    return value.split(/\s+/).filter(Boolean);
}

const ns$1 = useNamespace.useNamespace('tooltip');
let idCounter = 1;
let mouseMoveListeners = [];
function createTippy(reference, passedProps) {
    const props = evaluateProps(reference, Object.assign(Object.assign({}, defaultProps), getExtendedPassedProps(removeUndefinedProps(passedProps))));
    // ===========================================================================
    // 🔒 Private members
    // ===========================================================================
    let showTimeout;
    let hideTimeout;
    let scheduleHideAnimationFrame;
    let isVisibleFromClick = false;
    let didHideDueToDocumentMouseDown = false;
    let didTouchMove = false;
    let ignoreOnFirstUpdate = false;
    let lastTriggerEvent;
    let currentTransitionEndListener;
    let onFirstUpdate;
    let listeners = [];
    let debouncedOnMouseMove = debounce$1.debounce(onMouseMove, props.interactiveDebounce);
    let currentTarget;
    // ===========================================================================
    // 🔑 Public members
    // ===========================================================================
    const id = idCounter++;
    const popperInstance = null;
    const plugins = uniq(props.plugins);
    const state = {
        // Has the instance been destroyed?
        isDestroyed: false,
        // Is the instance currently enabled?
        isEnabled: true,
        // Is the tippy currently mounted to the DOM?
        isMounted: false,
        // Has the tippy finished transitioning in?
        isShown: false,
        // Is the tippy currently showing and not transitioning out?
        isVisible: false,
    };
    const instance = {
        // methods
        clearDelayTimeouts,
        destroy,
        disable,
        enable,
        hide,
        hideWithInteractivity,
        // properties
        id,
        plugins,
        popper: div(),
        popperInstance,
        props,
        reference,
        setContent,
        setProps,
        show,
        state,
        unmount,
    };
    // TODO: Investigate why this early return causes a TDZ error in the tests —
    // it doesn't seem to happen in the browser
    /* istanbul ignore if */
    if (!props.render) {
        return instance;
    }
    // ===========================================================================
    // Initial mutations
    // ===========================================================================
    const { onUpdate, popper } = props.render(instance);
    popper.setAttribute(`${DATASET_PREFIX}-root`, '');
    popper.id = `${ns$1.b()}-${instance.id}`;
    instance.popper = popper;
    reference._tippy = instance;
    popper._tippy = instance;
    const pluginsHooks = plugins.map((plugin) => plugin.fn(instance));
    const hasAriaExpanded = reference.hasAttribute('aria-expanded');
    addListeners();
    handleAriaExpandedAttribute();
    handleStyles();
    invokeHook('onCreate', [instance]);
    if (props.showOnCreate) {
        scheduleShow();
    }
    // Prevent a tippy with a delay from hiding if the cursor left then returned
    // before it started hiding
    popper.addEventListener('mouseenter', () => {
        if (instance.props.interactive && instance.state.isVisible) {
            instance.clearDelayTimeouts();
        }
    });
    popper.addEventListener('mouseleave', () => {
        if (instance.props.interactive &&
            instance.props.trigger.includes('mouseenter')) {
            getDocument().addEventListener('mousemove', debouncedOnMouseMove);
        }
    });
    return instance;
    // ===========================================================================
    // 🔒 Private methods
    // ===========================================================================
    function getNormalizedTouchSettings() {
        const { touch } = instance.props;
        return Array.isArray(touch) ? touch : [touch, 0];
    }
    function getIsCustomTouchBehavior() {
        return getNormalizedTouchSettings()[0] === 'hold';
    }
    function getIsDefaultRenderFn() {
        var _a;
        return !!((_a = instance.props.render) === null || _a === void 0 ? void 0 : _a.$$tippy);
    }
    function getCurrentTarget() {
        return currentTarget || reference;
    }
    function getDocument() {
        const parent = getCurrentTarget().parentNode;
        return parent ? getOwnerDocument(parent) : document;
    }
    function getDefaultTemplateChildren() {
        return getChildren(popper);
    }
    function getDelay(isShow) {
        // For touch or keyboard input, force `0` delay for UX reasons
        // Also if the instance is mounted but not visible (transitioning out),
        // ignore delay
        if ((instance.state.isMounted && !instance.state.isVisible) ||
            currentInput.isTouch ||
            (lastTriggerEvent && lastTriggerEvent.type === 'focus')) {
            return 0;
        }
        return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
    }
    function handleStyles(fromHide = false) {
        popper.style.pointerEvents =
            instance.props.interactive && !fromHide ? '' : 'none';
        popper.style.zIndex = `${instance.props.zIndex}`;
    }
    function invokeHook(hook, args, shouldInvokePropsHook = true) {
        var _a, _b;
        pluginsHooks.forEach((pluginHooks) => {
            if (pluginHooks[hook]) {
                pluginHooks[hook](...args);
            }
        });
        if (shouldInvokePropsHook) {
            (_b = (_a = instance.props)[hook]) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
        }
    }
    function handleAriaContentAttribute() {
        const { aria } = instance.props;
        if (!aria.content) {
            return;
        }
        const attr = `aria-${aria.content}`;
        const id = popper.id;
        const nodes = normalizeToArray(instance.props.triggerTarget || reference);
        nodes.forEach((node) => {
            const currentValue = node.getAttribute(attr);
            if (instance.state.isVisible) {
                node.setAttribute(attr, currentValue ? `${currentValue} ${id}` : id);
            }
            else {
                const nextValue = currentValue && currentValue.replace(id, '').trim();
                if (nextValue) {
                    node.setAttribute(attr, nextValue);
                }
                else {
                    node.removeAttribute(attr);
                }
            }
        });
    }
    function handleAriaExpandedAttribute() {
        if (hasAriaExpanded || !instance.props.aria.expanded) {
            return;
        }
        const nodes = normalizeToArray(instance.props.triggerTarget || reference);
        nodes.forEach((node) => {
            if (instance.props.interactive) {
                node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget()
                    ? 'true'
                    : 'false');
            }
            else {
                node.removeAttribute('aria-expanded');
            }
        });
    }
    function cleanupInteractiveMouseListeners() {
        getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
        mouseMoveListeners = mouseMoveListeners.filter((listener) => listener !== debouncedOnMouseMove);
    }
    function onDocumentPress(event) {
        // Moved finger to scroll instead of an intentional tap outside
        if (currentInput.isTouch && (didTouchMove || event.type === 'mousedown')) {
            return;
        }
        const actualTarget = (event.composedPath && event.composedPath()[0]) || event.target;
        // Clicked on interactive popper
        if (instance.props.interactive &&
            actualContains(popper, actualTarget)) {
            return;
        }
        // Clicked on the event listeners target
        if (normalizeToArray(instance.props.triggerTarget || reference).some((el) => actualContains(el, actualTarget))) {
            if (currentInput.isTouch) {
                return;
            }
            if (instance.state.isVisible &&
                instance.props.trigger.includes('click')) {
                return;
            }
        }
        else {
            invokeHook('onClickOutside', [instance, event]);
        }
        if (instance.props.hideOnClick === true) {
            instance.clearDelayTimeouts();
            instance.hide();
            // `mousedown` event is fired right before `focus` if pressing the
            // currentTarget. This lets a tippy with `focus` trigger know that it
            // should not show
            didHideDueToDocumentMouseDown = true;
            setTimeout(() => {
                didHideDueToDocumentMouseDown = false;
            });
            // The listener gets added in `scheduleShow()`, but this may be hiding it
            // before it shows, and hide()'s early bail-out behavior can prevent it
            // from being cleaned up
            if (!instance.state.isMounted) {
                removeDocumentPress();
            }
        }
    }
    function onTouchMove() {
        didTouchMove = true;
    }
    function onTouchStart() {
        didTouchMove = false;
    }
    function addDocumentPress() {
        const doc = getDocument();
        doc.addEventListener('mousedown', onDocumentPress, true);
        doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
        doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
        doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }
    function removeDocumentPress() {
        const doc = getDocument();
        doc.removeEventListener('mousedown', onDocumentPress, true);
        doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
        doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
        doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
    }
    function onTransitionedOut(duration, callback) {
        onTransitionEnd(duration, () => {
            if (!instance.state.isVisible &&
                popper.parentNode &&
                popper.parentNode.contains(popper)) {
                callback();
            }
        });
    }
    function onTransitionedIn(duration, callback) {
        onTransitionEnd(duration, callback);
    }
    function onTransitionEnd(duration, callback) {
        const box = getDefaultTemplateChildren().box;
        function listener(event) {
            if (event.target === box) {
                updateTransitionEndListener(box, 'remove', listener);
                callback();
            }
        }
        // Make callback synchronous if duration is 0
        // `transitionend` won't fire otherwise
        if (duration === 0) {
            return callback();
        }
        updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
        updateTransitionEndListener(box, 'add', listener);
        currentTransitionEndListener = listener;
    }
    function on(eventType, handler, options = false) {
        const nodes = normalizeToArray(instance.props.triggerTarget || reference);
        nodes.forEach((node) => {
            node.addEventListener(eventType, handler, options);
            listeners.push({ eventType, handler, node, options });
        });
    }
    function addListeners() {
        if (getIsCustomTouchBehavior()) {
            on('touchstart', onTrigger, { passive: true });
            on('touchend', onMouseLeave, { passive: true });
        }
        splitBySpaces(instance.props.trigger).forEach((eventType) => {
            if (eventType === 'manual') {
                return;
            }
            on(eventType, onTrigger);
            switch (eventType) {
                case 'focus': {
                    on(isIE11() ? 'focusout' : 'blur', onBlurOrFocusOut);
                    break;
                }
                case 'focusin': {
                    on('focusout', onBlurOrFocusOut);
                    break;
                }
                case 'mouseenter': {
                    on('mouseleave', onMouseLeave);
                    break;
                }
            }
        });
    }
    function removeListeners() {
        listeners.forEach(({ eventType, handler, node, options }) => {
            node.removeEventListener(eventType, handler, options);
        });
        listeners = [];
    }
    function onTrigger(event) {
        let shouldScheduleClickHide = false;
        if (!instance.state.isEnabled ||
            isEventListenerStopped(event) ||
            didHideDueToDocumentMouseDown) {
            return;
        }
        const wasFocused = (lastTriggerEvent === null || lastTriggerEvent === void 0 ? void 0 : lastTriggerEvent.type) === 'focus';
        lastTriggerEvent = event;
        currentTarget = event.currentTarget;
        handleAriaExpandedAttribute();
        if (!instance.state.isVisible && isMouseEvent(event)) {
            // If scrolling, `mouseenter` events can be fired if the cursor lands
            // over a new target, but `mousemove` events don't get fired. This
            // causes interactive tooltips to get stuck open until the cursor is
            // moved
            mouseMoveListeners.forEach((listener) => listener(event));
        }
        // Toggle show/hide when clicking click-triggered tooltips
        if (event.type === 'click' &&
            (!instance.props.trigger.includes('mouseenter') || isVisibleFromClick) &&
            instance.props.hideOnClick !== false &&
            instance.state.isVisible) {
            shouldScheduleClickHide = true;
        }
        else {
            scheduleShow(event);
        }
        if (event.type === 'click') {
            isVisibleFromClick = !shouldScheduleClickHide;
        }
        if (shouldScheduleClickHide && !wasFocused) {
            scheduleHide(event);
        }
    }
    function onMouseMove(event) {
        const target = event.target;
        const isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
        if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
            return;
        }
        const popperTreeData = getNestedPopperTree()
            .concat(popper)
            .map((popper) => {
            var _a;
            const instance = popper._tippy;
            const state = (_a = instance === null || instance === void 0 ? void 0 : instance.popperInstance) === null || _a === void 0 ? void 0 : _a.state;
            if (state) {
                return {
                    popperRect: popper.getBoundingClientRect(),
                    popperState: state,
                    props,
                };
            }
            return null;
        })
            .filter(Boolean);
        if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
            cleanupInteractiveMouseListeners();
            scheduleHide(event);
        }
    }
    function onMouseLeave(event) {
        const shouldBail = isEventListenerStopped(event) ||
            (instance.props.trigger.includes('click') && isVisibleFromClick);
        if (shouldBail) {
            return;
        }
        if (instance.props.interactive) {
            instance.hideWithInteractivity(event);
            return;
        }
        scheduleHide(event);
    }
    function onBlurOrFocusOut(event) {
        if (!instance.props.trigger.includes('focusin') &&
            event.target !== getCurrentTarget()) {
            return;
        }
        // If focus was moved to within the popper
        if (instance.props.interactive &&
            event.relatedTarget &&
            popper.contains(event.relatedTarget)) {
            return;
        }
        scheduleHide(event);
    }
    function isEventListenerStopped(event) {
        return currentInput.isTouch
            ? getIsCustomTouchBehavior() !== event.type.includes('touch')
            : false;
    }
    function createPopperInstance() {
        destroyPopperInstance();
        const { getReferenceClientRect, moveTransition, offset, placement, popperOptions, } = instance.props;
        const arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
        const computedReference = getReferenceClientRect
            ? {
                contextElement: getReferenceClientRect.contextElement || getCurrentTarget(),
                getBoundingClientRect: getReferenceClientRect,
            }
            : reference;
        const tippyModifier = {
            enabled: true,
            fn({ state }) {
                if (getIsDefaultRenderFn()) {
                    const { box } = getDefaultTemplateChildren();
                    ['placement', 'reference-hidden', 'escaped'].forEach((attr) => {
                        if (attr === 'placement') {
                            box.dataset.placement = state.placement;
                        }
                        else {
                            if (state.attributes.popper[`data-popper-${attr}`]) {
                                box.setAttribute(`data-${attr}`, '');
                            }
                            else {
                                box.removeAttribute(`data-${attr}`);
                            }
                        }
                    });
                    state.attributes.popper = {};
                }
            },
            name: '$$tippy',
            phase: 'beforeWrite',
            requires: ['computeStyles'],
        };
        const modifiers = [
            {
                name: 'offset',
                options: {
                    offset,
                },
            },
            {
                name: 'preventOverflow',
                options: {
                    padding: {
                        bottom: 2,
                        left: 5,
                        right: 5,
                        top: 2,
                    },
                },
            },
            {
                name: 'flip',
                options: {
                    padding: 5,
                },
            },
            {
                name: 'computeStyles',
                options: {
                    adaptive: !moveTransition,
                },
            },
            tippyModifier,
        ];
        if (getIsDefaultRenderFn() && arrow) {
            modifiers.push({
                name: 'arrow',
                options: {
                    element: arrow,
                    padding: 3,
                },
            });
        }
        modifiers.push(...((popperOptions === null || popperOptions === void 0 ? void 0 : popperOptions.modifiers) || []));
        instance.popperInstance = createPopper(computedReference, popper, Object.assign(Object.assign({}, popperOptions), { modifiers,
            onFirstUpdate,
            placement }));
    }
    function destroyPopperInstance() {
        if (instance.popperInstance) {
            instance.popperInstance.destroy();
            instance.popperInstance = null;
        }
    }
    function mount() {
        const { appendTo } = instance.props;
        // By default, we'll append the popper to the triggerTargets's parentNode so
        // it's directly after the reference element so the elements inside the
        // tippy can be tabbed to
        // If there are clipping issues, the user can specify a different appendTo
        // and ensure focus management is handled correctly manually
        const node = getCurrentTarget();
        const parentNode = (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO) ||
            appendTo === 'parent'
            ? node.parentNode
            : invokeWithArgsOrReturn(appendTo, [node]);
        // The popper element needs to exist on the DOM before its position can be
        // updated as Popper needs to read its dimensions
        if (!parentNode.contains(popper)) {
            parentNode.append(popper);
        }
        instance.state.isMounted = true;
        createPopperInstance();
    }
    function getNestedPopperTree() {
        return arrayFrom(popper.querySelectorAll(`[${DATASET_PREFIX}-root]`));
    }
    function scheduleShow(event) {
        instance.clearDelayTimeouts();
        if (event) {
            invokeHook('onTrigger', [instance, event]);
        }
        addDocumentPress();
        let delay = getDelay(true);
        const [touchValue, touchDelay] = getNormalizedTouchSettings();
        if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
            delay = touchDelay;
        }
        if (delay) {
            showTimeout = setTimeout(() => {
                instance.show();
            }, delay);
        }
        else {
            instance.show();
        }
    }
    function scheduleHide(event) {
        instance.clearDelayTimeouts();
        invokeHook('onUntrigger', [instance, event]);
        if (!instance.state.isVisible) {
            removeDocumentPress();
            return;
        }
        // For interactive tippies, scheduleHide is added to a document.body handler
        // from onMouseLeave so must intercept scheduled hides from mousemove/leave
        // events when trigger contains mouseenter and click, and the tip is
        // currently shown as a result of a click.
        if (instance.props.trigger.includes('mouseenter') &&
            instance.props.trigger.includes('click') &&
            ['mouseleave', 'mousemove'].includes(event.type) &&
            isVisibleFromClick) {
            return;
        }
        const delay = getDelay(false);
        if (delay) {
            hideTimeout = setTimeout(() => {
                if (instance.state.isVisible) {
                    instance.hide();
                }
            }, delay);
        }
        else {
            // Fixes a `transitionend` problem when it fires 1 frame too
            // late sometimes, we don't want hide() to be called.
            scheduleHideAnimationFrame = requestAnimationFrame(() => {
                instance.hide();
            });
        }
    }
    // ===========================================================================
    // 🔑 Public methods
    // ===========================================================================
    function enable() {
        instance.state.isEnabled = true;
    }
    function disable() {
        // Disabling the instance should also hide it
        // https://github.com/atomiks/tippy.js-react/issues/106
        instance.hide();
        instance.state.isEnabled = false;
    }
    function clearDelayTimeouts() {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
        cancelAnimationFrame(scheduleHideAnimationFrame);
    }
    function setProps(partialProps) {
        if (instance.state.isDestroyed) {
            return;
        }
        invokeHook('onBeforeUpdate', [instance, partialProps]);
        removeListeners();
        const prevProps = instance.props;
        const nextProps = evaluateProps(reference, Object.assign(Object.assign(Object.assign({}, prevProps), removeUndefinedProps(partialProps)), { ignoreAttributes: true }));
        instance.props = nextProps;
        addListeners();
        if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
            cleanupInteractiveMouseListeners();
            debouncedOnMouseMove = debounce$1.debounce(onMouseMove, nextProps.interactiveDebounce);
        }
        // Ensure stale aria-expanded attributes are removed
        if (prevProps.triggerTarget && !nextProps.triggerTarget) {
            normalizeToArray(prevProps.triggerTarget).forEach((node) => {
                node.removeAttribute('aria-expanded');
            });
        }
        else if (nextProps.triggerTarget) {
            reference.removeAttribute('aria-expanded');
        }
        handleAriaExpandedAttribute();
        handleStyles();
        if (onUpdate) {
            onUpdate(prevProps, nextProps);
        }
        if (instance.popperInstance) {
            createPopperInstance();
            // Fixes an issue with nested tippies if they are all getting re-rendered,
            // and the nested ones get re-rendered first.
            // https://github.com/atomiks/tippyjs-react/issues/177
            // TODO: find a cleaner / more efficient solution(!)
            getNestedPopperTree().forEach((nestedPopper) => {
                var _a, _b;
                // React (and other UI libs likely) requires a rAF wrapper as it flushes
                // its work in one
                requestAnimationFrame((_b = (_a = nestedPopper._tippy) === null || _a === void 0 ? void 0 : _a.popperInstance) === null || _b === void 0 ? void 0 : _b.forceUpdate);
            });
        }
        invokeHook('onAfterUpdate', [instance, partialProps]);
    }
    function setContent(content) {
        instance.setProps({ content });
    }
    function show() {
        // Early bail-out
        const isAlreadyVisible = instance.state.isVisible;
        const isDestroyed = instance.state.isDestroyed;
        const isDisabled = !instance.state.isEnabled;
        const isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
        const duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
        if (isAlreadyVisible ||
            isDestroyed ||
            isDisabled ||
            isTouchAndTouchDisabled) {
            return;
        }
        // Normalize `disabled` behavior across browsers.
        // Firefox allows events on disabled elements, but Chrome doesn't.
        // Using a wrapper element (i.e. <span>) is recommended.
        if (getCurrentTarget().hasAttribute('disabled')) {
            return;
        }
        invokeHook('onShow', [instance], false);
        if (instance.props.onShow(instance) === false) {
            return;
        }
        instance.state.isVisible = true;
        if (getIsDefaultRenderFn()) {
            popper.style.visibility = 'visible';
        }
        handleStyles();
        addDocumentPress();
        if (!instance.state.isMounted) {
            popper.style.transition = 'none';
        }
        // If flipping to the opposite side after hiding at least once, the
        // animation will use the wrong placement without resetting the duration
        if (getIsDefaultRenderFn()) {
            const { box, content } = getDefaultTemplateChildren();
            setTransitionDuration([box, content], 0);
        }
        onFirstUpdate = () => {
            var _a;
            if (!instance.state.isVisible || ignoreOnFirstUpdate) {
                return;
            }
            ignoreOnFirstUpdate = true;
            popper.style.transition = instance.props.moveTransition;
            if (getIsDefaultRenderFn() && instance.props.animation) {
                const { box, content } = getDefaultTemplateChildren();
                setTransitionDuration([box, content], duration);
                setVisibilityState([box, content], 'visible');
            }
            handleAriaContentAttribute();
            handleAriaExpandedAttribute();
            pushIfUnique(mountedInstances, instance);
            // certain modifiers (e.g. `maxSize`) require a second update after the
            // popper has been positioned for the first time
            (_a = instance.popperInstance) === null || _a === void 0 ? void 0 : _a.forceUpdate();
            invokeHook('onMount', [instance]);
            if (instance.props.animation && getIsDefaultRenderFn()) {
                onTransitionedIn(duration, () => {
                    instance.state.isShown = true;
                    invokeHook('onShown', [instance]);
                });
            }
        };
        mount();
    }
    function hide() {
        // Early bail-out
        const isAlreadyHidden = !instance.state.isVisible;
        const isDestroyed = instance.state.isDestroyed;
        const isDisabled = !instance.state.isEnabled;
        const duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
        if (isAlreadyHidden || isDestroyed || isDisabled) {
            return;
        }
        invokeHook('onHide', [instance], false);
        if (instance.props.onHide(instance) === false) {
            return;
        }
        instance.state.isVisible = false;
        instance.state.isShown = false;
        ignoreOnFirstUpdate = false;
        isVisibleFromClick = false;
        if (getIsDefaultRenderFn()) {
            popper.style.visibility = 'hidden';
        }
        cleanupInteractiveMouseListeners();
        removeDocumentPress();
        handleStyles(true);
        if (getIsDefaultRenderFn()) {
            const { box, content } = getDefaultTemplateChildren();
            if (instance.props.animation) {
                setTransitionDuration([box, content], duration);
                setVisibilityState([box, content], 'hidden');
            }
        }
        handleAriaContentAttribute();
        handleAriaExpandedAttribute();
        if (instance.props.animation) {
            if (getIsDefaultRenderFn()) {
                onTransitionedOut(duration, instance.unmount);
            }
        }
        else {
            instance.unmount();
        }
    }
    function hideWithInteractivity(event) {
        getDocument().addEventListener('mousemove', debouncedOnMouseMove);
        pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
        debouncedOnMouseMove(event);
    }
    function unmount() {
        if (instance.state.isVisible) {
            instance.hide();
        }
        if (!instance.state.isMounted) {
            return;
        }
        destroyPopperInstance();
        // If a popper is not interactive, it will be appended outside the popper
        // tree by default. This seems mainly for interactive tippies, but we should
        // find a workaround if possible
        getNestedPopperTree().forEach((nestedPopper) => {
            var _a;
            (_a = nestedPopper._tippy) === null || _a === void 0 ? void 0 : _a.unmount();
        });
        if (popper.parentNode) {
            popper.remove();
        }
        const index = mountedInstances.indexOf(instance);
        if (index !== -1) {
            mountedInstances.splice(index, 1);
        }
        instance.state.isMounted = false;
        invokeHook('onHidden', [instance]);
    }
    function destroy() {
        if (instance.state.isDestroyed) {
            return;
        }
        instance.clearDelayTimeouts();
        instance.unmount();
        removeListeners();
        delete reference._tippy;
        instance.state.isDestroyed = true;
        invokeHook('onDestroy', [instance]);
    }
}

function getArrayOfElements(value) {
    if (isElement$1(value)) {
        return [value];
    }
    if (isNodeList(value)) {
        return arrayFrom(value);
    }
    if (Array.isArray(value)) {
        return value;
    }
    return arrayFrom(document.querySelectorAll(value));
}

const setDefaultProps = (partialProps) => {
    const keys = Object.keys(partialProps);
    keys.forEach((key) => {
        defaultProps[key] = partialProps[key];
    });
};

function createBackdropElement() {
    const backdrop = div();
    backdrop.className = BACKDROP_CLASS;
    setVisibilityState([backdrop], 'hidden');
    return backdrop;
}
const animateFill = {
    defaultValue: false,
    fn(instance) {
        var _a;
        if (!((_a = instance.props.render) === null || _a === void 0 ? void 0 : _a.$$tippy)) {
            return {};
        }
        const { box, content } = getChildren(instance.popper);
        const backdrop = instance.props.animateFill
            ? createBackdropElement()
            : null;
        return {
            onCreate() {
                if (backdrop) {
                    box.insertBefore(backdrop, box.firstElementChild);
                    box.dataset.animatefill = '';
                    box.style.overflow = 'hidden';
                    instance.setProps({ animation: 'shift-away', arrow: false });
                }
            },
            onHide() {
                if (backdrop) {
                    setVisibilityState([backdrop], 'hidden');
                }
                return undefined;
            },
            onMount() {
                if (backdrop) {
                    const { transitionDuration } = box.style;
                    const duration = Number(transitionDuration.replace('ms', ''));
                    // The content should fade in after the backdrop has mostly filled the
                    // tooltip element. `clip-path` is the other alternative but is not
                    // well-supported and is buggy on some devices.
                    content.style.transitionDelay = `${Math.round(duration / 10)}ms`;
                    backdrop.style.transitionDuration = transitionDuration;
                    setVisibilityState([backdrop], 'visible');
                }
            },
            onShow() {
                if (backdrop) {
                    backdrop.style.transitionDuration = '0ms';
                }
                return undefined;
            },
        };
    },
    name: 'animateFill',
};

let mouseCoords = { clientX: 0, clientY: 0 };
let activeInstances = [];
function storeMouseCoords({ clientX, clientY }) {
    mouseCoords = { clientX, clientY };
}
function addMouseCoordsListener(doc) {
    doc.addEventListener('mousemove', storeMouseCoords);
}
function removeMouseCoordsListener(doc) {
    doc.removeEventListener('mousemove', storeMouseCoords);
}
const followCursor = {
    defaultValue: false,
    fn(instance) {
        const reference = instance.reference;
        const doc = getOwnerDocument(instance.props.triggerTarget || reference);
        let isInternalUpdate = false;
        let wasFocusEvent = false;
        let isUnmounted = true;
        let prevProps = instance.props;
        function getIsInitialBehavior() {
            return (instance.props.followCursor === 'initial' && instance.state.isVisible);
        }
        function addListener() {
            doc.addEventListener('mousemove', onMouseMove);
        }
        function removeListener() {
            doc.removeEventListener('mousemove', onMouseMove);
        }
        function unsetGetReferenceClientRect() {
            isInternalUpdate = true;
            instance.setProps({ getReferenceClientRect: null });
            isInternalUpdate = false;
        }
        function onMouseMove(event) {
            // If the instance is interactive, avoid updating the position unless it's
            // over the reference element
            const isCursorOverReference = event.target
                ? reference.contains(event.target)
                : true;
            const { followCursor } = instance.props;
            const { clientX, clientY } = event;
            const rect = reference.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            const relativeY = clientY - rect.top;
            if (isCursorOverReference || !instance.props.interactive) {
                instance.setProps({
                    // @ts-ignore - unneeded DOMRect properties
                    getReferenceClientRect() {
                        const rect = reference.getBoundingClientRect();
                        let x = clientX;
                        let y = clientY;
                        if (followCursor === 'initial') {
                            x = rect.left + relativeX;
                            y = rect.top + relativeY;
                        }
                        const top = followCursor === 'horizontal' ? rect.top : y;
                        const right = followCursor === 'vertical' ? rect.right : x;
                        const bottom = followCursor === 'horizontal' ? rect.bottom : y;
                        const left = followCursor === 'vertical' ? rect.left : x;
                        return {
                            bottom,
                            height: bottom - top,
                            left,
                            right,
                            top,
                            width: right - left,
                        };
                    },
                });
            }
        }
        function create() {
            if (instance.props.followCursor) {
                activeInstances.push({ doc, instance });
                addMouseCoordsListener(doc);
            }
        }
        function destroy() {
            activeInstances = activeInstances.filter((data) => data.instance !== instance);
            if (activeInstances.filter((data) => data.doc === doc).length === 0) {
                removeMouseCoordsListener(doc);
            }
        }
        return {
            onAfterUpdate(_, { followCursor }) {
                if (isInternalUpdate) {
                    return;
                }
                if (followCursor !== undefined &&
                    prevProps.followCursor !== followCursor) {
                    destroy();
                    if (followCursor) {
                        create();
                        if (instance.state.isMounted &&
                            !wasFocusEvent &&
                            !getIsInitialBehavior()) {
                            addListener();
                        }
                    }
                    else {
                        removeListener();
                        unsetGetReferenceClientRect();
                    }
                }
            },
            onBeforeUpdate() {
                prevProps = instance.props;
            },
            onCreate: create,
            onDestroy: destroy,
            onHidden() {
                if (instance.props.followCursor) {
                    unsetGetReferenceClientRect();
                    removeListener();
                    isUnmounted = true;
                }
            },
            onMount() {
                if (instance.props.followCursor && !wasFocusEvent) {
                    if (isUnmounted) {
                        onMouseMove(mouseCoords);
                        isUnmounted = false;
                    }
                    if (!getIsInitialBehavior()) {
                        addListener();
                    }
                }
            },
            onTrigger(_, event) {
                if (isMouseEvent(event)) {
                    mouseCoords = { clientX: event.clientX, clientY: event.clientY };
                }
                wasFocusEvent = event.type === 'focus';
            },
        };
    },
    name: 'followCursor',
};

function getProps(props, modifier) {
    var _a;
    return {
        popperOptions: Object.assign(Object.assign({}, props.popperOptions), { modifiers: [
                ...(((_a = props.popperOptions) === null || _a === void 0 ? void 0 : _a.modifiers) || []).filter(({ name }) => name !== modifier.name),
                modifier,
            ] }),
    };
}
const inlinePositioning = {
    defaultValue: false,
    fn(instance) {
        const { reference } = instance;
        function isEnabled() {
            return !!instance.props.inlinePositioning;
        }
        let placement;
        let cursorRectIndex = -1;
        let isInternalUpdate = false;
        let triedPlacements = [];
        const modifier = {
            enabled: true,
            fn({ state }) {
                if (isEnabled()) {
                    if (triedPlacements.includes(state.placement)) {
                        triedPlacements = [];
                    }
                    if (placement !== state.placement &&
                        !triedPlacements.includes(state.placement)) {
                        triedPlacements.push(state.placement);
                        instance.setProps({
                            getReferenceClientRect: () => getReferenceClientRect(state.placement),
                        });
                    }
                    placement = state.placement;
                }
            },
            name: 'tippyInlinePositioning',
            phase: 'afterWrite',
        };
        function getReferenceClientRect(placement) {
            return getInlineBoundingClientRect(getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
        }
        function setInternalProps(partialProps) {
            isInternalUpdate = true;
            instance.setProps(partialProps);
            isInternalUpdate = false;
        }
        function addModifier() {
            if (!isInternalUpdate) {
                setInternalProps(getProps(instance.props, modifier));
            }
        }
        return {
            onAfterUpdate: addModifier,
            onCreate: addModifier,
            onHidden() {
                cursorRectIndex = -1;
            },
            onTrigger(_, event) {
                if (isMouseEvent(event)) {
                    const rects = arrayFrom(instance.reference.getClientRects());
                    const cursorRect = rects.find((rect) => rect.left - 2 <= event.clientX &&
                        rect.right + 2 >= event.clientX &&
                        rect.top - 2 <= event.clientY &&
                        rect.bottom + 2 >= event.clientY);
                    const index = rects.indexOf(cursorRect);
                    cursorRectIndex = index === -1 ? cursorRectIndex : index;
                }
            },
        };
    },
    name: 'inlinePositioning',
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
    // Not an inline element, or placement is not yet known
    if (clientRects.length < 2 || currentBasePlacement === null) {
        return boundingRect;
    }
    // There are two rects and they are disjoined
    if (clientRects.length === 2 &&
        cursorRectIndex >= 0 &&
        clientRects[0].left > clientRects[1].right) {
        return clientRects[cursorRectIndex] || boundingRect;
    }
    switch (currentBasePlacement) {
        case 'bottom':
        case 'top': {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = currentBasePlacement === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return { bottom, height, left, right, top, width };
        }
        case 'left':
        case 'right': {
            const minLeft = Math.min(...clientRects.map((rects) => rects.left));
            const maxRight = Math.max(...clientRects.map((rects) => rects.right));
            const measureRects = clientRects.filter((rect) => currentBasePlacement === 'left'
                ? rect.left === minLeft
                : rect.right === maxRight);
            const top = measureRects[0].top;
            const bottom = measureRects[measureRects.length - 1].bottom;
            const left = minLeft;
            const right = maxRight;
            const width = right - left;
            const height = bottom - top;
            return { bottom, height, left, right, top, width };
        }
        default: {
            return boundingRect;
        }
    }
}

const sticky = {
    defaultValue: false,
    fn(instance) {
        const { popper, reference } = instance;
        function getReference() {
            return instance.popperInstance
                ? instance.popperInstance.state.elements.reference
                : reference;
        }
        function shouldCheck(value) {
            return instance.props.sticky === true || instance.props.sticky === value;
        }
        let prevRefRect = null;
        let prevPopRect = null;
        function updatePosition() {
            const currentRefRect = shouldCheck('reference')
                ? getReference().getBoundingClientRect()
                : null;
            const currentPopRect = shouldCheck('popper')
                ? popper.getBoundingClientRect()
                : null;
            if (((currentRefRect && areRectsDifferent(prevRefRect, currentRefRect)) ||
                (currentPopRect && areRectsDifferent(prevPopRect, currentPopRect))) &&
                instance.popperInstance) {
                instance.popperInstance.update();
            }
            prevRefRect = currentRefRect;
            prevPopRect = currentPopRect;
            if (instance.state.isMounted) {
                requestAnimationFrame(updatePosition);
            }
        }
        return {
            onMount() {
                if (instance.props.sticky) {
                    updatePosition();
                }
            },
        };
    },
    name: 'sticky',
};
function areRectsDifferent(rectA, rectB) {
    if (rectA && rectB) {
        return (rectA.top !== rectB.top ||
            rectA.right !== rectB.right ||
            rectA.bottom !== rectB.bottom ||
            rectA.left !== rectB.left);
    }
    return true;
}

function createArrowElement(value) {
    const arrow = div();
    if (value === true) {
        arrow.className = ARROW_CLASS;
    }
    else {
        arrow.className = SVG_ARROW_CLASS;
        if (isElement$1(value)) {
            arrow.append(value);
        }
        else {
            dangerouslySetInnerHTML(arrow, value);
        }
    }
    return arrow;
}

function setContent(content, props) {
    if (isElement$1(props.content)) {
        dangerouslySetInnerHTML(content, '');
        content.append(props.content);
    }
    else if (typeof props.content !== 'function') {
        if (props.allowHTML) {
            dangerouslySetInnerHTML(content, props.content);
        }
        else {
            content.textContent = props.content;
        }
    }
}

function render(instance) {
    const popper = div();
    const box = div();
    box.className = BOX_CLASS;
    box.dataset.state = 'hidden';
    box.setAttribute('tabindex', '-1');
    const content = div();
    content.className = CONTENT_CLASS;
    content.dataset.state = 'hidden';
    setContent(content, instance.props);
    popper.append(box);
    box.append(content);
    onUpdate(instance.props, instance.props);
    function onUpdate(prevProps, nextProps) {
        const { arrow, box, content } = getChildren(popper);
        if (nextProps.theme) {
            box.dataset.theme = nextProps.theme;
        }
        else {
            delete box.dataset.theme;
        }
        if (typeof nextProps.animation === 'string') {
            box.dataset.animation = nextProps.animation;
        }
        else {
            delete box.dataset.animation;
        }
        if (nextProps.inertia) {
            box.dataset.inertia = '';
        }
        else {
            delete box.dataset.inertia;
        }
        box.style.maxWidth =
            typeof nextProps.maxWidth === 'number'
                ? `${nextProps.maxWidth}px`
                : nextProps.maxWidth;
        if (nextProps.role) {
            box.setAttribute('role', nextProps.role);
        }
        else {
            box.removeAttribute('role');
        }
        if (prevProps.content !== nextProps.content ||
            prevProps.allowHTML !== nextProps.allowHTML) {
            setContent(content, instance.props);
        }
        if (nextProps.arrow) {
            if (!arrow) {
                box.append(createArrowElement(nextProps.arrow));
            }
            else if (prevProps.arrow !== nextProps.arrow) {
                arrow.remove();
                box.append(createArrowElement(nextProps.arrow));
            }
        }
        else if (arrow) {
            arrow === null || arrow === void 0 ? void 0 : arrow.remove();
        }
    }
    return {
        onUpdate,
        popper,
    };
}
// Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away
render.$$tippy = true;

const ns = useNamespace.useNamespace('tooltip');
const ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
const DATASET_PREFIX = `data-${ns.b()}`;
const BOX_CLASS = `${ns.b()}-box`;
const CONTENT_CLASS = `${ns.b()}-content`;
const BACKDROP_CLASS = `${ns.b()}-backdrop`;
const ARROW_CLASS = `${ns.b()}-arrow`;
const SVG_ARROW_CLASS = `${ns.b()}-svg-arrow`;
const TOUCH_OPTIONS = { capture: true, passive: true };
const TIPPY_DEFAULT_APPEND_TO = () => document.body;
const mountedInstances = [];
const pluginProps = {
    animateFill: false,
    followCursor: false,
    inlinePositioning: false,
    sticky: false,
};
const renderProps = {
    allowHTML: false,
    animation: 'fade',
    arrow: true,
    content: '',
    inertia: false,
    maxWidth: 350,
    role: 'tooltip',
    theme: '',
    zIndex: 9999,
};
const defaultProps = Object.assign(Object.assign({ appendTo: TIPPY_DEFAULT_APPEND_TO, aria: {
        content: 'auto',
        expanded: 'auto',
    }, delay: 0, duration: [300, 250], getReferenceClientRect: null, hideOnClick: true, ignoreAttributes: false, interactive: false, interactiveBorder: 2, interactiveDebounce: 0, moveTransition: '', offset: [0, 10], onAfterUpdate() { },
    onBeforeUpdate() { },
    onClickOutside() { },
    onCreate() { },
    onDestroy() { },
    onHidden() { },
    onHide() {
        return undefined;
    },
    onMount() { },
    onShow() {
        return undefined;
    },
    onShown() { },
    onTrigger() { },
    onUntrigger() { }, placement: 'top', plugins: [animateFill, followCursor, inlinePositioning, sticky], popperOptions: {}, render, showOnCreate: false, touch: true, trigger: 'mouseenter focus', triggerTarget: null }, pluginProps), renderProps);
const defaultKeys = Object.keys(defaultProps);

function tippy(targets, optionalProps = {}) {
    const plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    bindGlobalEventListeners();
    const passedProps = Object.assign(Object.assign({}, optionalProps), { plugins });
    const elements = getArrayOfElements(targets);
    const instances = elements.reduce((acc, reference) => {
        const instance = reference && createTippy(reference, passedProps);
        if (instance) {
            acc.push(instance);
        }
        return acc;
    }, []);
    return isElement$1(targets) ? instances[0] : instances;
}
tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;

const zaneTooltipCss = () => `@charset "UTF-8";:host{display:inline-block}[slot=content]{display:none}[data-zane-tooltip-root]{max-width:calc(100vw - 10px)}.zane-tooltip-box{position:relative;background-color:#333;color:white;border-radius:4px;font-size:12px;line-height:1.4;white-space:initial;outline:0;transition-property:transform, visibility, opacity}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-arrow{bottom:0}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-arrow::before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-arrow{top:0}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-arrow::before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-arrow{right:0}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-arrow::before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-arrow{left:0}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-arrow::before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-svg-arrow{bottom:0}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-svg-arrow::after,.zane-tooltip-box[data-placement^=top]>.zane-tooltip-svg-arrow>svg{top:16px;transform:rotate(180deg)}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-svg-arrow{top:0}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-svg-arrow>svg{bottom:16px}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-svg-arrow{right:0}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-svg-arrow::after,.zane-tooltip-box[data-placement^=left]>.zane-tooltip-svg-arrow>svg{transform:rotate(90deg);top:calc(50% - 3px);left:11px}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-svg-arrow{left:0}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-svg-arrow::after,.zane-tooltip-box[data-placement^=right]>.zane-tooltip-svg-arrow>svg{transform:rotate(-90deg);top:calc(50% - 3px);right:11px}.zane-tooltip-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(0.54, 1.5, 0.38, 1.11)}.zane-tooltip-box[data-theme~=light-border]{background-color:white;background-clip:padding-box;border:1px solid rgba(0, 8, 16, 0.15);color:#333;box-shadow:0 4px 14px -2px rgba(0, 8, 16, 0.08)}.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-backdrop{background-color:white}.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-arrow::after,.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-svg-arrow::after{content:"";position:absolute;z-index:-1}.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-arrow::after{border-color:transparent;border-style:solid}.zane-tooltip-box[data-theme~=light-border][data-placement^=top]>.zane-tooltip-arrow::before{border-top-color:white}.zane-tooltip-box[data-theme~=light-border][data-placement^=top]>.zane-tooltip-arrow::after{border-top-color:rgba(0, 8, 16, 0.2);border-width:7px 7px 0;top:17px;left:1px}.zane-tooltip-box[data-theme~=light-border][data-placement^=top]>.zane-tooltip-svg-arrow>svg{top:16px}.zane-tooltip-box[data-theme~=light-border][data-placement^=top]>.zane-tooltip-svg-arrow::after{top:17px}.zane-tooltip-box[data-theme~=light-border][data-placement^=bottom]>.zane-tooltip-arrow::before{border-bottom-color:white;bottom:16px}.zane-tooltip-box[data-theme~=light-border][data-placement^=bottom]>.zane-tooltip-arrow::after{border-bottom-color:rgba(0, 8, 16, 0.2);border-width:0 7px 7px;bottom:17px;left:1px}.zane-tooltip-box[data-theme~=light-border][data-placement^=bottom]>.zane-tooltip-svg-arrow>svg{bottom:16px}.zane-tooltip-box[data-theme~=light-border][data-placement^=bottom]>.zane-tooltip-svg-arrow::after{bottom:17px}.zane-tooltip-box[data-theme~=light-border][data-placement^=left]>.zane-tooltip-arrow::before{border-left-color:white}.zane-tooltip-box[data-theme~=light-border][data-placement^=left]>.zane-tooltip-arrow::after{border-left-color:rgba(0, 8, 16, 0.2);border-width:7px 0 7px 7px;left:17px;top:1px}.zane-tooltip-box[data-theme~=light-border][data-placement^=left]>.zane-tooltip-svg-arrow>svg{left:11px}.zane-tooltip-box[data-theme~=light-border][data-placement^=left]>.zane-tooltip-svg-arrow::after{left:12px}.zane-tooltip-box[data-theme~=light-border][data-placement^=right]>.zane-tooltip-arrow::before{border-right-color:white;right:16px}.zane-tooltip-box[data-theme~=light-border][data-placement^=right]>.zane-tooltip-arrow::after{border-width:7px 7px 7px 0;right:17px;top:1px;border-right-color:rgba(0, 8, 16, 0.2)}.zane-tooltip-box[data-theme~=light-border][data-placement^=right]>.zane-tooltip-svg-arrow>svg{right:11px}.zane-tooltip-box[data-theme~=light-border][data-placement^=right]>.zane-tooltip-svg-arrow::after{right:12px}.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-svg-arrow{fill:white}.zane-tooltip-box[data-theme~=light-border]>.zane-tooltip-svg-arrow::after{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA2czEuNzk2LS4wMTMgNC42Ny0zLjYxNUM1Ljg1MS45IDYuOTMuMDA2IDggMGMxLjA3LS4wMDYgMi4xNDguODg3IDMuMzQzIDIuMzg1QzE0LjIzMyA2LjAwNSAxNiA2IDE2IDZIMHoiIGZpbGw9InJnYmEoMCwgOCwgMTYsIDAuMikiIC8+PC9zdmc+);background-size:16px 6px;width:16px;height:6px}.zane-tooltip-box[data-theme~=light]{color:#26323d;box-shadow:0 0 20px 4px rgba(154, 161, 177, 0.15), 0 4px 80px -8px rgba(36, 40, 47, 0.25), 0 4px 4px -2px rgba(91, 94, 105, 0.15);background-color:white}.zane-tooltip-box[data-theme~=light][data-placement^=top]>.zane-tooltip-arrow::before{border-top-color:white}.zane-tooltip-box[data-theme~=light][data-placement^=bottom]>.zane-tooltip-arrow::before{border-bottom-color:white}.zane-tooltip-box[data-theme~=light][data-placement^=left]>.zane-tooltip-arrow::before{border-left-color:white}.zane-tooltip-box[data-theme~=light][data-placement^=right]>.zane-tooltip-arrow::before{border-right-color:white}.zane-tooltip-box[data-theme~=light]>.zane-tooltip-backdrop{background-color:white}.zane-tooltip-box[data-theme~=light]>.zane-tooltip-svg-arrow{fill:white}.zane-tooltip-box[data-theme~=material]{background-color:#505355;font-weight:600}.zane-tooltip-box[data-theme~=material][data-placement^=top]>.zane-tooltip-arrow::before{border-top-color:#505355}.zane-tooltip-box[data-theme~=material][data-placement^=bottom]>.zane-tooltip-arrow::before{border-bottom-color:#505355}.zane-tooltip-box[data-theme~=material][data-placement^=left]>.zane-tooltip-arrow::before{border-left-color:#505355}.zane-tooltip-box[data-theme~=material][data-placement^=right]>.zane-tooltip-arrow::before{border-right-color:#505355}.zane-tooltip-box[data-theme~=material]>.zane-tooltip-backdrop{background-color:#505355}.zane-tooltip-box[data-theme~=material]>.zane-tooltip-svg-arrow{fill:#505355}.zane-tooltip-box[data-theme~=translucent]{background-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent]>.zane-tooltip-arrow{width:14px;height:14px}.zane-tooltip-box[data-theme~=translucent]{}.zane-tooltip-box[data-theme~=translucent][data-placement^=top]>.zane-tooltip-arrow::before{border-width:7px 7px 0;border-top-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent][data-placement^=bottom]>.zane-tooltip-arrow::before{border-width:0 7px 7px;border-bottom-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent][data-placement^=left]>.zane-tooltip-arrow::before{border-width:7px 0 7px 7px;border-left-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent][data-placement^=right]>.zane-tooltip-arrow::before{border-width:7px 7px 7px 0;border-right-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent]>.zane-tooltip-backdrop{background-color:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-theme~=translucent]>.zane-tooltip-svg-arrow{fill:rgba(0, 0, 0, 0.7)}.zane-tooltip-box[data-animation=fade][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=top][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=top][data-state=hidden]{transform:perspective(700px) translateY(10px) rotateX(90deg)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=bottom][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=bottom][data-state=hidden]{transform:perspective(700px) translateY(-10px) rotateX(-90deg)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=left][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=left][data-state=hidden]{transform:perspective(700px) translateX(10px), rotateY(-90deg)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=right][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-extreme][data-placement^=right][data-state=hidden]{transform:perspective(700px) translateX(-10px), rotateY(90deg)}.zane-tooltip-box[data-animation=perspective-extreme][data-state=hidden]{opacity:0.5}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=top][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=top][data-state=hidden]{transform:perspective(700px) translateY(5px) rotateX(30deg)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=bottom][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=bottom][data-state=hidden]{transform:perspective(700px) translateY(-5px) rotateX(-30deg)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=left][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=left][data-state=hidden]{transform:perspective(700px) translateX(5px), rotateY(-30deg)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=right][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective-subtle][data-placement^=right][data-state=hidden]{transform:perspective(700px) translateX(-5px), rotateY(30deg)}.zane-tooltip-box[data-animation=perspective-subtle][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=perspective][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=perspective][data-placement^=top][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective][data-placement^=top][data-state=hidden]{transform:perspective(700px) translateY(8px) rotateX(60deg)}.zane-tooltip-box[data-animation=perspective][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=perspective][data-placement^=bottom][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective][data-placement^=bottom][data-state=hidden]{transform:perspective(700px) translateY(-8px) rotateX(-60deg)}.zane-tooltip-box[data-animation=perspective][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=perspective][data-placement^=left][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective][data-placement^=left][data-state=hidden]{transform:perspective(700px) translateX(8px), rotateY(-60deg)}.zane-tooltip-box[data-animation=perspective][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=perspective][data-placement^=right][data-state=visible]{transform:perspective(700px)}.zane-tooltip-box[data-animation=perspective][data-placement^=right][data-state=hidden]{transform:perspective(700px) translateX(-8px), rotateY(60deg)}.zane-tooltip-box[data-animation=perspective][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=scale-extreme][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=scale-extreme][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=scale-extreme][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=scale-extreme][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=scale-extreme][data-state=hidden]{transform:scale(0);opacity:0.25}.zane-tooltip-box[data-animation=scale-subtle][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=scale-subtle][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=scale-subtle][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=scale-subtle][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=scale-subtle][data-state=hidden]{transform:scale(0.8);opacity:0}.zane-tooltip-box[data-animation=scale][data-placement^=top]{transform-origin:bottom}.zane-tooltip-box[data-animation=scale][data-placement^=bottom]{transform-origin:top}.zane-tooltip-box[data-animation=scale][data-placement^=left]{transform-origin:right}.zane-tooltip-box[data-animation=scale][data-placement^=right]{transform-origin:left}.zane-tooltip-box[data-animation=scale][data-state=hidden]{transform:scale(0.5);opacity:0}.zane-tooltip-box[data-animation=shift-away-extreme][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-away-extreme][data-state=hidden][data-placement^=top]{transform:translateY(20px)}.zane-tooltip-box[data-animation=shift-away-extreme][data-state=hidden][data-placement^=bottom]{transform:translateY(-20px)}.zane-tooltip-box[data-animation=shift-away-extreme][data-state=hidden][data-placement^=left]{transform:translateX(20px)}.zane-tooltip-box[data-animation=shift-away-extreme][data-state=hidden][data-placement^=right]{transform:translateX(-20px)}.zane-tooltip-box[data-animation=shift-away-subtle][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=top]{transform:translateY(5px)}.zane-tooltip-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=bottom]{transform:translateY(-5px)}.zane-tooltip-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=left]{transform:translateX(5px)}.zane-tooltip-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=right]{transform:translateX(-5px)}.zane-tooltip-box[data-animation=shift-away][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-away][data-state=hidden][data-placement^=top]{transform:translateY(10px)}.zane-tooltip-box[data-animation=shift-away][data-state=hidden][data-placement^=bottom]{transform:translateY(-10px)}.zane-tooltip-box[data-animation=shift-away][data-state=hidden][data-placement^=left]{transform:translateX(10px)}.zane-tooltip-box[data-animation=shift-away][data-state=hidden][data-placement^=right]{transform:translateX(-10px)}.zane-tooltip-box[data-animation=shift-toward-extreme][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-toward-extreme][data-state=hidden][data-placement^=top]{transform:translateY(-20px)}.zane-tooltip-box[data-animation=shift-toward-extreme][data-state=hidden][data-placement^=bottom]{transform:translateY(20px)}.zane-tooltip-box[data-animation=shift-toward-extreme][data-state=hidden][data-placement^=left]{transform:translateX(-20px)}.zane-tooltip-box[data-animation=shift-toward-extreme][data-state=hidden][data-placement^=right]{transform:translateX(20px)}.zane-tooltip-box[data-animation=shift-toward-subtle][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=top][data-state=hidden]{transform:translateY(-5px)}.zane-tooltip-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=bottom][data-state=hidden]{transform:translateY(5px)}.zane-tooltip-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=left][data-state=hidden]{transform:translateX(-5px)}.zane-tooltip-box[data-animation=shift-toward-subtle][data-state=hidden][data-placement^=right][data-state=hidden]{transform:translateX(5px)}.zane-tooltip-box[data-animation=shift-toward][data-state=hidden]{opacity:0}.zane-tooltip-box[data-animation=shift-toward][data-state=hidden][data-placement^=top]{transform:translateY(-10px)}.zane-tooltip-box[data-animation=shift-toward][data-state=hidden][data-placement^=bottom]{transform:translateY(10px)}.zane-tooltip-box[data-animation=shift-toward][data-state=hidden][data-placement^=left]{transform:translateX(-10px)}.zane-tooltip-box[data-animation=shift-toward][data-state=hidden][data-placement^=right]{transform:translateX(10px)}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-backdrop{transform-origin:0% 25%;border-radius:40% 40% 0 0}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-backdrop[data-state=visible]{transform:scale(1) translate(-50%, -55%)}.zane-tooltip-box[data-placement^=top]>.zane-tooltip-backdrop[data-state=hidden]{transform:scale(0.2) translate(-50%, -45%)}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-backdrop{transform-origin:0% -50%;border-radius:0 0 30% 30%}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-backdrop[data-state=visible]{transform:scale(1) translate(-50%, -45%)}.zane-tooltip-box[data-placement^=bottom]>.zane-tooltip-backdrop[data-state=hidden]{transform:scale(0.2) translate(-50%, 0)}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-backdrop{transform-origin:50% 0%;border-radius:50% 0 0 50%}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-backdrop[data-state=visible]{transform:scale(1) translate(-50%, -50%)}.zane-tooltip-box[data-placement^=left]>.zane-tooltip-backdrop[data-state=hidden]{transform:scale(0.2) translate(-75%, -50%)}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-backdrop{transform-origin:-50% 0%;border-radius:0 50% 50% 0}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-backdrop[data-state=visible]{transform:scale(1) translate(-50%, -50%)}.zane-tooltip-box[data-placement^=right]>.zane-tooltip-backdrop[data-state=hidden]{transform:scale(0.2) translate(-25%, -50%)}.zane-tooltip-box[data-animatefill]{background-color:transparent !important}.zane-tooltip-arrow{width:16px;height:16px;color:#333}.zane-tooltip-arrow::before{content:"";position:absolute;border-color:transparent;border-style:solid}.zane-tooltip-content{position:relative;padding:5px 9px;z-index:1}.zane-tooltip-backdrop{position:absolute;background-color:#333;border-radius:50%;width:calc(110% + 32px);left:50%;top:50%;z-index:-1;transition:all cubic-bezier(0.46, 0.1, 0.52, 0.98);backface-visibility:hidden}.zane-tooltip-backdrop[data-state=hidden]{opacity:0}.zane-tooltip-backdrop::after{content:"";float:left;padding-top:100%}.zane-tooltip-svg-arrow{position:absolute;width:16px;height:16px;fill:#333;text-align:initial}.zane-tooltip-svg-arrow>svg{position:absolute}.zane-tooltip-backdrop+.zane-tooltip-content{transition-property:opacity;will-change:opacity}.zane-tooltip-backdrop+.zane-tooltip-content[data-state=hidden]{opacity:0}`;

const ZaneTooltip = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.zaneClickOutside = index.createEvent(this, "zClickOutside", 7);
        this.zaneHidden = index.createEvent(this, "zHidden", 7);
        this.zaneHide = index.createEvent(this, "zHide", 7);
        this.zaneMount = index.createEvent(this, "zMount", 7);
        this.zaneShow = index.createEvent(this, "zShow", 7);
        this.allowHTML = true;
        this.animateFill = false;
        this.animation = 'fade';
        this.appendTo = TIPPY_DEFAULT_APPEND_TO;
        this.aria = { content: 'describedby' };
        this.arrow = true;
        this.content = '';
        this.delay = 0;
        this.disabled = false;
        this.duration = 300;
        this.followCursor = false;
        this.getReferenceClientRect = null;
        this.hideOnClick = true;
        this.ignoreAttributes = false;
        this.inertia = false;
        this.inlinePositioning = true;
        this.interactive = false;
        this.interactiveBorder = 2;
        this.interactiveDebounce = 0;
        this.isMounted = false;
        this.maxWidth = 350;
        this.moveTransition = '';
        this.offset = [0, 10];
        this.placement = 'top';
        this.plugins = [];
        this.popperOptions = {};
        this.role = 'tooltip';
        this.showOnCreate = false;
        this.sticky = false;
        this.theme = '';
        this.touch = true;
        this.trigger = 'mouseenter focus';
        this.triggerTarget = null;
        this.zIndex = 9999;
        // 用于标记是否已经初始化
        this.isInitialized = false;
        // 用于存储slot内容的引用
        this.slotContentRef = null;
    }
    // 组件加载完成后初始化
    componentDidLoad() {
        // 只执行一次初始化
        if (!this.isInitialized) {
            this.initializeTippy();
            this.isInitialized = true;
        }
    }
    // 公共方法：禁用工具提示
    async disable() {
        if (this.tippyInstance) {
            this.tippyInstance.disable();
        }
    }
    // 组件卸载时清理
    disconnectedCallback() {
        var _a;
        const contentSlot = this.el.querySelector('[slot="content"]');
        if (contentSlot && this.slotContentRef) {
            while (this.slotContentRef.firstChild) {
                contentSlot.append(this.slotContentRef.firstChild);
            }
            (_a = this.slotContentRef) === null || _a === void 0 ? void 0 : _a.remove();
            this.slotContentRef = null;
        }
        this.destroyTippy();
    }
    // 公共方法：启用工具提示
    async enable() {
        if (this.tippyInstance) {
            this.tippyInstance.enable();
        }
    }
    // 监听属性变化
    handlePropsChange() {
        this.updateTippyInstance();
    }
    // 公共方法：隐藏工具提示
    async hide() {
        if (this.tippyInstance) {
            this.tippyInstance.hide();
        }
    }
    async isFocusInsideContent(event) {
        const popperContent = this.tippyInstance.popper;
        const activeElement = (event === null || event === void 0 ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent === null || popperContent === void 0 ? void 0 : popperContent.contains(activeElement);
    }
    async isVisible() {
        return this.tippyInstance.state.isVisible;
    }
    render() {
        return (index.h(index.Host, { key: 'e98a52d71f4e6cbda31fbf0edc7dd34a1ee62320' }, index.h("slot", { key: '0f17e159bb320d859a4cdc5896d591bddbba740d' }), index.h("slot", { key: 'eea91de21054af6d248a0ac54a78364743c589b8', name: "content" })));
    }
    // 公共方法：显示工具提示
    async show() {
        if (this.tippyInstance && !this.disabled) {
            this.tippyInstance.show();
        }
    }
    // 销毁Tippy实例
    destroyTippy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
            this.tippyInstance = null;
        }
    }
    // 获取工具提示内容
    getTooltipContent() {
        if (this.content) {
            return this.content;
        }
        // 如果通过slot传递内容
        const contentSlot = this.el.querySelector('[slot="content"]');
        if (contentSlot) {
            this.slotContentRef = div();
            // 直接循环 childNodes
            while (contentSlot.firstChild) {
                this.slotContentRef.append(contentSlot.firstChild);
            }
            return this.slotContentRef;
        }
        return '';
    }
    // 初始化Tippy实例
    initializeTippy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
        }
        if (this.el.children.length === 0) {
            console.warn('Tooltip组件需要一个触发元素作为子元素');
            return;
        }
        this.triggerElement = this.el.children[0];
        let arrow = this.arrow;
        if (this.arrow === 'round') {
            arrow = ROUND_ARROW;
        }
        // 配置Tippy选项
        const options = {
            allowHTML: this.allowHTML,
            animateFill: this.animateFill,
            animation: this.animation,
            appendTo: this.appendTo,
            aria: this.aria,
            arrow,
            content: this.getTooltipContent(),
            delay: this.delay,
            duration: this.duration,
            followCursor: this.followCursor,
            getReferenceClientRect: this.getReferenceClientRect,
            hideOnClick: this.hideOnClick,
            ignoreAttributes: this.ignoreAttributes,
            inertia: this.inertia,
            inlinePositioning: this.inlinePositioning,
            interactive: this.interactive,
            interactiveBorder: this.interactiveBorder,
            interactiveDebounce: this.interactiveDebounce,
            maxWidth: this.maxWidth,
            moveTransition: this.moveTransition,
            offset: this.offset,
            onClickOutside: (instance) => {
                this.zaneClickOutside.emit(instance);
            },
            onHidden: (instance) => {
                this.zaneHidden.emit(instance);
            },
            onHide: (instance) => {
                this.zaneHide.emit(instance);
                return undefined;
            },
            onMount: (instance) => {
                this.isMounted = true;
                this.zaneMount.emit(instance);
            },
            onShow: (instance) => {
                this.zaneShow.emit(instance);
                return undefined;
            },
            placement: this.placement,
            plugins: this.plugins,
            popperOptions: this.popperOptions,
            role: this.role,
            showOnCreate: this.showOnCreate,
            sticky: this.sticky,
            theme: this.theme,
            touch: this.touch,
            trigger: this.trigger,
            triggerTarget: this.triggerTarget,
            zIndex: this.zIndex,
        };
        if (this.tippyRender) {
            this.tippyRender.$$tippy = true;
            options.render = this.tippyRender;
        }
        // 创建Tippy实例
        this.tippyInstance = tippy(this.triggerElement, options);
        // 禁用状态处理
        if (this.disabled) {
            this.tippyInstance.disable();
        }
    }
    // 更新Tippy实例
    updateTippyInstance() {
        if (!this.tippyInstance)
            return;
        // 更新其他属性
        const props = {
            animation: this.animation,
            arrow: this.arrow,
            delay: this.delay,
            interactive: this.interactive,
            maxWidth: this.maxWidth,
            offset: this.offset,
            placement: this.placement,
            theme: this.theme,
            trigger: this.trigger,
        };
        this.tippyInstance.setProps(props);
        // 更新禁用状态
        if (this.disabled) {
            this.tippyInstance.disable();
        }
        else {
            this.tippyInstance.enable();
        }
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "content": [{
                "handlePropsChange": 0
            }],
        "placement": [{
                "handlePropsChange": 0
            }],
        "trigger": [{
                "handlePropsChange": 0
            }],
        "maxWidth": [{
                "handlePropsChange": 0
            }],
        "arrow": [{
                "handlePropsChange": 0
            }],
        "delay": [{
                "handlePropsChange": 0
            }],
        "disabled": [{
                "handlePropsChange": 0
            }]
    }; }
};
ZaneTooltip.style = zaneTooltipCss();

exports.zane_cascader = ZaneCascader;
exports.zane_icon = ZaneIcon;
exports.zane_input = ZaneInput;
exports.zane_tag = ZaneTag;
exports.zane_tooltip = ZaneTooltip;
