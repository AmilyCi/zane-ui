import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { r as rowContexts } from './row-B6FQCOMy.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneRowCss = () => `.zane-row{display:flex;flex-wrap:wrap;position:relative;box-sizing:border-box}.zane-row.is-justify-center{justify-content:center}.zane-row.is-justify-end{justify-content:flex-end}.zane-row.is-justify-space-between{justify-content:space-between}.zane-row.is-justify-space-around{justify-content:space-around}.zane-row.is-justify-space-evenly{justify-content:space-evenly}.zane-row.is-align-top{align-items:flex-start}.zane-row.is-align-middle{align-items:center}.zane-row.is-align-bottom{align-items:flex-end}`;

const ns = useNamespace('row');
const ZaneRow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        rowContexts.set(this.el, { gutter: this.gutter });
    }
    render() {
        return (h(Host, { key: '683afe851d8ba860ba71bad3c70ecdacfa276add', class: this.rowKls, style: this.style }, h("slot", { key: '9f0e64f8d8ccbed747039d4795d23edc81595ac7' })));
    }
    get el() { return getElement(this); }
};
ZaneRow.style = zaneRowCss();

export { ZaneRow as zane_row };
