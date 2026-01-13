import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { b as buttonGroupContexts } from './button-DfaYvtkP.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

class ButtonGroupContext {
    constructor() {
        this._sizeChangeListeners = [];
        this._typeChangeListeners = [];
    }
    get size() {
        return this._size;
    }
    get type() {
        return this._type;
    }
    addSizeChangeListener(listener) {
        this._sizeChangeListeners.push(listener);
    }
    addTypeChangeListener(listener) {
        this._typeChangeListeners.push(listener);
    }
    removeSizeChangeListener(listener) {
        var _a, _b;
        const index = (_a = this._sizeChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
        if (index !== -1) {
            (_b = this._sizeChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
    }
    removeTypeChangeListener(listener) {
        var _a, _b;
        const index = (_a = this._typeChangeListeners) === null || _a === void 0 ? void 0 : _a.indexOf(listener);
        if (index !== -1) {
            (_b = this._typeChangeListeners) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
    }
    updateSize(size) {
        var _a;
        this._size = size;
        (_a = this._sizeChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener());
    }
    updateType(type) {
        var _a;
        this._type = type;
        (_a = this._typeChangeListeners) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener());
    }
}

const zaneButtonGroupCss = () => `.zane-button-group{display:inline-block;vertical-align:middle}.zane-button-group::before,.zane-button-group::after{display:table;content:""}.zane-button-group::after{clear:both}.zane-button-group>zane-button{float:left;position:relative}.zane-button-group>zane-button+zane-button{margin-left:0}.zane-button-group>zane-button:first-child .zane-button{border-top-right-radius:0;border-bottom-right-radius:0}.zane-button-group>zane-button:last-child .zane-button{border-top-left-radius:0;border-bottom-left-radius:0}.zane-button-group>zane-button:first-child:last-child .zane-button{border-top-right-radius:var(--zane-border-radius-base);border-bottom-right-radius:var(--zane-border-radius-base);border-top-left-radius:var(--zane-border-radius-base);border-bottom-left-radius:var(--zane-border-radius-base)}.zane-button-group>zane-button:first-child:last-child .zane-button.is-round{border-radius:var(--zane-border-radius-round)}.zane-button-group>zane-button:first-child:last-child .zane-button.is-circle{border-radius:50%}.zane-button-group>zane-button:not(:first-child):not(:last-child) .zane-button{border-radius:0}.zane-button-group>zane-button:not(:last-child) .zane-button{margin-right:-1px}.zane-button-group>zane-button:hover,.zane-button-group>zane-button:focus,.zane-button-group>zane-button:active{z-index:1}.zane-button-group>zane-button.is-active{z-index:1}.zane-button-group>zane-dropdown>.zane-button{border-top-left-radius:0;border-bottom-left-radius:0;border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:first-child .zane-button--primary{border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:last-child .zane-button--primary{border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:not(:first-child):not(:last-child) .zane-button--primary{border-left-color:var(--zane-button-divide-border-color);border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:first-child .zane-button--success{border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:last-child .zane-button--success{border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:not(:first-child):not(:last-child) .zane-button--success{border-left-color:var(--zane-button-divide-border-color);border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:first-child .zane-button--warning{border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:last-child .zane-button--warning{border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:not(:first-child):not(:last-child) .zane-button--warning{border-left-color:var(--zane-button-divide-border-color);border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:first-child .zane-button--danger{border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:last-child .zane-button--danger{border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:not(:first-child):not(:last-child) .zane-button--danger{border-left-color:var(--zane-button-divide-border-color);border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:first-child .zane-button--info{border-right-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:last-child .zane-button--info{border-left-color:var(--zane-button-divide-border-color)}.zane-button-group zane-button:not(:first-child):not(:last-child) .zane-button--info{border-left-color:var(--zane-button-divide-border-color);border-right-color:var(--zane-button-divide-border-color)}`;

const ns = useNamespace('button');
const ZaneButtonGroup = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentWillLoad() {
        const context = new ButtonGroupContext();
        context.updateSize(this.size);
        context.updateType(this.type);
        buttonGroupContexts.set(this.el, context);
    }
    disconnectedCallback() {
        buttonGroupContexts.delete(this.el);
    }
    handleWatchSize() {
        var _a;
        (_a = buttonGroupContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateSize(this.size);
    }
    handleWatchType() {
        var _a;
        (_a = buttonGroupContexts.get(this.el)) === null || _a === void 0 ? void 0 : _a.updateType(this.type);
    }
    render() {
        return (h(Host, { key: '6b491f3fecc8d986cbfa230c1377eaac81aca00e', class: ns.b('group') }, h("slot", { key: '6837edee828aa978c97353e5cc20f800c4a709e7' })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "size": [{
                "handleWatchSize": 0
            }],
        "type": [{
                "handleWatchType": 0
            }]
    }; }
};
ZaneButtonGroup.style = zaneButtonGroupCss();

export { ZaneButtonGroup as zane_button_group };
