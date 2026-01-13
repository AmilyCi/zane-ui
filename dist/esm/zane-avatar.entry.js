import { r as registerInstance, e as createEvent, h, H as Host, a as getElement } from './index-B2_qc6fD.js';
import { i as isNumber } from './isNumber-Bq5rOKx7.js';
import { a as addUnit } from './addUnit-eWRTywfV.js';
import { i as isString } from './isString-DaEH0FEg.js';
import './uuid-BZTOj-_U.js';
import { u as useNamespace } from './useNamespace-HoRSxEcr.js';
import './toObjectString-D4ItlKpz.js';

const zaneAvatarCss = () => `.zane-avatar{--zane-avatar-text-color:var(--zane-color-white);--zane-avatar-bg-color:var(--zane-text-color-disabled);--zane-avatar-text-size:14px;--zane-avatar-icon-size:18px;--zane-avatar-border-radius:var(--zane-border-radius-base);--zane-avatar-size-large:56px;--zane-avatar-size:40px;--zane-avatar-size-small:24px;--zane-avatar-size:40px;display:inline-flex;justify-content:center;align-items:center;box-sizing:border-box;text-align:center;overflow:hidden;outline:none;color:var(--zane-avatar-text-color);background:var(--zane-avatar-bg-color);width:var(--zane-avatar-size);height:var(--zane-avatar-size);font-size:var(--zane-avatar-text-size)}.zane-avatar>img{display:block;width:100%;height:100%}.zane-avatar--circle{border-radius:50%}.zane-avatar--square{border-radius:var(--zane-avatar-border-radius)}.zane-avatar--icon{font-size:var(--zane-avatar-icon-size)}.zane-avatar--small{--zane-avatar-size:24px}.zane-avatar--large{--zane-avatar-size:56px}`;

const ns = useNamespace('avatar');
const ZaneAvatar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.imgError = createEvent(this, "imgError", 7);
        this.fit = 'cover';
        this.hasLoadError = false;
        this.shape = 'circle';
        this.size = 'default';
        this.src = '';
    }
    get avatarClass() {
        const classList = [ns.b()];
        if (isString(this.size))
            classList.push(ns.m(this.size));
        if (this.icon)
            classList.push(ns.m('icon'));
        if (this.shape)
            classList.push(ns.m(this.shape));
        return classList.join(' ');
    }
    get fitStyle() {
        return { objectFit: this.fit };
    }
    get sizeStyle() {
        return isNumber(this.size)
            ? ns.cssVarBlock({
                size: addUnit(this.size) || '',
            })
            : undefined;
    }
    handleError(e) {
        this.hasLoadError = true;
        this.imgError.emit(e);
    }
    render() {
        return (h(Host, { key: '8c1791ef21d387955357dd167227fb2ac6f0cdff', class: this.avatarClass, style: this.sizeStyle }, this.renderContent()));
    }
    watchSrcHandler() {
        this.hasLoadError = false;
    }
    renderContent() {
        if ((this.src || this.srcSet) && !this.hasLoadError) {
            return (h("img", { alt: this.alt, onError: (e) => this.handleError(e), src: this.src, srcset: this.srcSet, style: this.fitStyle }));
        }
        if (this.icon) {
            return h("zane-icon", { name: this.icon });
        }
        return h("slot", null);
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "src": [{
                "watchSrcHandler": 0
            }]
    }; }
};
ZaneAvatar.style = zaneAvatarCss();

export { ZaneAvatar as zane_avatar };
