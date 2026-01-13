'use strict';

var index = require('./index-ziNpORbs.js');
var row = require('./row-CKwYs92g.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

const zaneRowCss = () => `.zane-row{display:flex;flex-wrap:wrap;position:relative;box-sizing:border-box}.zane-row.is-justify-center{justify-content:center}.zane-row.is-justify-end{justify-content:flex-end}.zane-row.is-justify-space-between{justify-content:space-between}.zane-row.is-justify-space-around{justify-content:space-around}.zane-row.is-justify-space-evenly{justify-content:space-evenly}.zane-row.is-align-top{align-items:flex-start}.zane-row.is-align-middle{align-items:center}.zane-row.is-align-bottom{align-items:flex-end}`;

const ns = useNamespace.useNamespace('row');
const ZaneRow = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.gutter = 0;
        this.justify = 'start';
    }
    get rowKls() {
        return [
            ns.b(),
            ns.is(`justify-${this.justify}`, this.justify !== 'start'),
            ns.is(`align-${this.align}`, !!this.align),
        ].join(' ');
    }
    get style() {
        const styles = {};
        if (!this.gutter) {
            return styles;
        }
        styles.marginRight = styles.marginLeft = `-${this.gutter / 2}px`;
        return styles;
    }
    componentWillLoad() {
        row.rowContexts.set(this.el, { gutter: this.gutter });
    }
    render() {
        return (index.h(index.Host, { key: '683afe851d8ba860ba71bad3c70ecdacfa276add', class: this.rowKls, style: this.style }, index.h("slot", { key: '9f0e64f8d8ccbed747039d4795d23edc81595ac7' })));
    }
    get el() { return index.getElement(this); }
};
ZaneRow.style = zaneRowCss();

exports.zane_row = ZaneRow;
