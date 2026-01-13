import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { c as collapseContexts } from './collapse-vguOFti0.js';
import { i as isObject } from './isObject-Ji6uxU-v.js';
import { t as throwError, d as debugWarn } from './error-DAO_9P5C.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import './isString-DaEH0FEg.js';
import './toObjectString-D4ItlKpz.js';

function castArray(...args) {
    if (!args.length) {
        return [];
    }
    const value = args[0];
    return Array.isArray(value) ? value : [value];
}

const isBoolean = (val) => typeof val === 'boolean';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isFunction = (val) => typeof val === 'function';

const isPromise = (val) => {
    return ((isObject(val) || isFunction(val)) &&
        isFunction(val.then) &&
        isFunction(val.catch));
};

class CollapseContext {
    constructor() {
        this._activeNames = [];
        this._activeNamesChangeListeners = [];
    }
    get activeNames() {
        return this._activeNames;
    }
    addActiveNamesChangeListener(listener) {
        this._activeNamesChangeListeners.push(listener);
    }
    removeActiveNamesChangeListener(listener) {
        const index = this._activeNamesChangeListeners.indexOf(listener);
        if (index !== -1) {
            this._activeNamesChangeListeners.splice(index, 1);
        }
    }
    updateActiveNames(activeNames) {
        this._activeNames = activeNames;
        this._activeNamesChangeListeners.forEach((callback) => callback());
    }
}

const zaneCollapseCss = () => `.zane-collapse{--zane-collapse-border-color:var(--zane-border-color-lighter);--zane-collapse-header-height:48px;--zane-collapse-header-bg-color:var(--zane-fill-color-blank);--zane-collapse-header-text-color:var(--zane-text-color-primary);--zane-collapse-header-font-size:13px;--zane-collapse-content-bg-color:var(--zane-fill-color-blank);--zane-collapse-content-font-size:13px;--zane-collapse-content-text-color:var(--zane-text-color-primary);border-top:1px solid var(--zane-collapse-border-color);border-bottom:1px solid var(--zane-collapse-border-color)}.zane-collapse-item.is-disabled .zane-collapse-item__header{color:var(--zane-text-color-disabled);cursor:not-allowed}.zane-collapse-item .zane-collapse-item__header{width:100%;padding:0;border:none;display:flex;align-items:center;min-height:var(--zane-collapse-header-height);line-height:var(--zane-collapse-header-height);background-color:var(--zane-collapse-header-bg-color);color:var(--zane-collapse-header-text-color);cursor:pointer;border-bottom:1px solid var(--zane-collapse-border-color);font-size:var(--zane-collapse-header-font-size);font-weight:500;transition:border-bottom-color var(--zane-transition-duration);outline:none}.zane-collapse-item .zane-collapse-item__header .zane-collapse-item__arrow{transition:transform var(--zane-transition-duration);font-weight:300}.zane-collapse-item .zane-collapse-item__header .zane-collapse-item__arrow.is-active{transform:rotate(90deg)}.zane-collapse-item .zane-collapse-item__header .zane-collapse-item__title{text-align:left;flex:auto}.zane-collapse-item .zane-collapse-item__header.focusing:focus:not(:hover){color:var(--zane-color-primary)}.zane-collapse-item .zane-collapse-item__header.is-active{border-bottom-color:transparent}.zane-collapse-item .zane-collapse-item__wrap{will-change:height;background-color:var(--zane-collapse-content-bg-color);overflow:hidden;box-sizing:border-box;border-bottom:1px solid var(--zane-collapse-border-color);transition:height var(--zane-transition-duration)}.zane-collapse-item .zane-collapse-item__wrap.is-active{height:auto}.zane-collapse-item .zane-collapse-item__content{padding-bottom:25px;font-size:var(--zane-collapse-content-font-size);color:var(--zane-collapse-content-text-color);line-height:1.7692307692}.zane-collapse-item:last-child{margin-bottom:-1px}.zane-collapse-icon-position-left .zane-collapse-item__header{gap:8px}.zane-collapse-icon-position-left .zane-collapse-item__title{order:1}.zane-collapse-icon-position-right .zane-collapse-item__header{padding-right:8px}`;

const ns = useNamespace('collapse');
const SCOPE = 'zane-collapse';
const ZaneCollapse = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.zaneChange = createEvent(this, "zChange", 7);
        this.zaneUpdate = createEvent(this, "zUpdate", 7);
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
    get el() { return getElement(this); }
    static get watchers() { return {
        "value": [{
                "onModelValueChange": 0
            }]
    }; }
};
ZaneCollapse.style = zaneCollapseCss();

export { ZaneCollapse as zane_collapse };
