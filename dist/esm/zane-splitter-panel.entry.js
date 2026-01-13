import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { s as splitterRootContexts, a as isPct, g as getPct, b as isPx, c as getPx } from './utils-DF25II1_.js';
import { t as throwError } from './error-DAO_9P5C.js';
import { b as buildUUID } from './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import './isObject-Ji6uxU-v.js';
import './isString-DaEH0FEg.js';
import './toObjectString-D4ItlKpz.js';

const zaneSplitterPanelCss = () => `.zane-splitter-panel{flex-grow:0;overflow:auto;scrollbar-width:thin;box-sizing:border-box}`;

const ns = useNamespace('splitter-panel');
const COMPONENT_NAME = 'zane-splitter-panel';
const ZaneSplitterPanel = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.updateSizeEvent = createEvent(this, "updateSize", 7);
        this.resizable = true;
        this.onPercentSizesUpdate = () => {
            this.update();
        };
        this.update = () => {
            this.panelSize =
                this.splitterContext.pxSizes[this.splitterContext.getPanelIndex(this.el)];
        };
    }
    get splitterContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-SPLITTER') {
                context = splitterRootContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        if (!this.splitterContext)
            throwError(COMPONENT_NAME, 'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>');
        this.uuid = buildUUID();
        this.splitterContext.addPercentSizesChangeListener(this.onPercentSizesUpdate);
        this.splitterContext.registerPanel(this);
    }
    disconnectedCallback() {
        this.splitterContext.removePercentSizesChangeListener(this.onPercentSizesUpdate);
        this.splitterContext.unregisterPanel(this);
    }
    handleSizeChange() {
        const size = this.sizeToPx(this.size);
        const maxSize = this.sizeToPx(this.max);
        const minSize = this.sizeToPx(this.min);
        const finalSize = Math.min(Math.max(size, minSize || 0), maxSize || size);
        this.updateSizeEvent.emit(finalSize);
        this.panelSize = finalSize;
    }
    render() {
        return (h(Host, { key: '8bce94b1ba7d6cb31da1b841448b4f1b3e2357f4', class: ns.b(), style: { flexBasis: `${this.panelSize}px` } }, h("slot", { key: '924976f7090b30e7598f237947aa338fad0f0108' })));
    }
    sizeToPx(str) {
        if (isPct(str)) {
            return getPct(str) * this.splitterContext.containerSize || 0;
        }
        else if (isPx(str)) {
            return getPx(str);
        }
        return str !== null && str !== void 0 ? str : 0;
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "size": [{
                "handleSizeChange": 0
            }]
    }; }
};
ZaneSplitterPanel.style = zaneSplitterPanelCss();

export { ZaneSplitterPanel as zane_splitter_panel };
