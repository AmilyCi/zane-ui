import { r as registerInstance, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { s as state } from './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';

const zaneCardCss = () => `.zane-card{--zane-card-border-color:var(--zane-border-color-light);--zane-card-border-radius:4px;--zane-card-padding:20px;--zane-card-bg-color:var(--zane-fill-color-blank)}.zane-card{border-radius:var(--zane-card-border-radius);border:1px solid var(--zane-card-border-color);background-color:var(--zane-card-bg-color);overflow:hidden;color:var(--zane-text-color-primary);transition:var(--zane-transition-duration)}.zane-card.is-always-shadow{box-shadow:var(--zane-box-shadow-light)}.zane-card.is-hover-shadow:hover,.zane-card.is-hover-shadow:focus{box-shadow:var(--zane-box-shadow-light)}.zane-card .zane-card__header{padding:calc(var(--zane-card-padding) - 2px) var(--zane-card-padding);border-bottom:1px solid var(--zane-card-border-color);box-sizing:border-box}.zane-card .zane-card__body{padding:var(--zane-card-padding)}.zane-card .zane-card__footer{padding:calc(var(--zane-card-padding) - 2px) var(--zane-card-padding);border-top:1px solid var(--zane-card-border-color);box-sizing:border-box}`;

const ns = useNamespace('card');
const ZaneCard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.bodyClass = '';
        this.bodyStyle = {};
        this.footer = '';
        this.footerClass = '';
        this.hasFooterContent = false;
        this.hasHeaderContent = false;
        this.header = '';
        this.headerClass = '';
    }
    checkSlotContent() {
        this.hasHeaderContent = !!this.el.querySelector('[slot="header"]');
        this.hasFooterContent = !!this.el.querySelector('[slot="footer"]');
    }
    componentWillLoad() {
        this.checkSlotContent();
    }
    render() {
        return (h(Host, { key: '36edc2178e7664e874357dceba58a14b566798bb' }, h("div", { key: 'a7a507b4cfa0d989154baa80eda7e92845ca7712', class: [
                ns.b(),
                ns.is(`${this.shadow || state.configProviderContext.card.shadow || 'always'}-shadow`),
            ].join(' ') }, (this.hasHeaderContent || this.header) && (h("div", { key: '28c0e2ffe27ce4e1b0867d27aa81af2746c7d41d', class: [ns.e('header'), this.headerClass].join(' ') }, h("slot", { key: '743f22be327bb95df80dcd4f89d6aced4ba63635', name: "header" }, this.header))), h("div", { key: '72643bb0417a91a1cc2d73eac6513a8d3cec6ca1', class: [ns.e('body'), this.bodyClass].join(' '), style: this.bodyStyle }, h("slot", { key: '79477d065273442a648a3dde7248a54fe1c00007' })), (this.hasFooterContent || this.footer) && (h("div", { key: '7adb1ea92144efbd189b0bb7bf913f6802f11aca', class: [ns.e('footer'), this.footerClass].join(' ') }, h("slot", { key: '011b7417d19e8379b25b4f98aaef1dcc2136ead6', name: "footer" }, this.footer))))));
    }
    get el() { return getElement(this); }
};
ZaneCard.style = zaneCardCss();

export { ZaneCard as zane_card };
