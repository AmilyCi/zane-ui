'use strict';

var index = require('./index-ziNpORbs.js');
var utils = require('./utils-DeEhUsE-.js');
var error = require('./error-Bs0gfBMl.js');
var uuid = require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');
require('./isObject-EfaeaXJ_.js');
require('./isString-D2n3i_b0.js');
require('./toObjectString-rn-pSGT_.js');

const zaneSplitterPanelCss = () => `.zane-splitter-panel{flex-grow:0;overflow:auto;scrollbar-width:thin;box-sizing:border-box}`;

const ns = useNamespace.useNamespace('splitter-panel');
const COMPONENT_NAME = 'zane-splitter-panel';
const ZaneSplitterPanel = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.updateSizeEvent = index.createEvent(this, "updateSize", 7);
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
                context = utils.splitterRootContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        if (!this.splitterContext)
            error.throwError(COMPONENT_NAME, 'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>');
        this.uuid = uuid.buildUUID();
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
        return (index.h(index.Host, { key: '8bce94b1ba7d6cb31da1b841448b4f1b3e2357f4', class: ns.b(), style: { flexBasis: `${this.panelSize}px` } }, index.h("slot", { key: '924976f7090b30e7598f237947aa338fad0f0108' })));
    }
    sizeToPx(str) {
        if (utils.isPct(str)) {
            return utils.getPct(str) * this.splitterContext.containerSize || 0;
        }
        else if (utils.isPx(str)) {
            return utils.getPx(str);
        }
        return str !== null && str !== void 0 ? str : 0;
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "size": [{
                "handleSizeChange": 0
            }]
    }; }
};
ZaneSplitterPanel.style = zaneSplitterPanelCss();

exports.zane_splitter_panel = ZaneSplitterPanel;
