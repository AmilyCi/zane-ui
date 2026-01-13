'use strict';

var index = require('./index-ziNpORbs.js');
var isNumber = require('./isNumber-CJR0doT9.js');
var addUnit = require('./addUnit-CZoGW7xT.js');
var isString = require('./isString-D2n3i_b0.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');
require('./toObjectString-rn-pSGT_.js');

const zaneAvatarCss = () => `.zane-avatar{--zane-avatar-text-color:var(--zane-color-white);--zane-avatar-bg-color:var(--zane-text-color-disabled);--zane-avatar-text-size:14px;--zane-avatar-icon-size:18px;--zane-avatar-border-radius:var(--zane-border-radius-base);--zane-avatar-size-large:56px;--zane-avatar-size:40px;--zane-avatar-size-small:24px;--zane-avatar-size:40px;display:inline-flex;justify-content:center;align-items:center;box-sizing:border-box;text-align:center;overflow:hidden;outline:none;color:var(--zane-avatar-text-color);background:var(--zane-avatar-bg-color);width:var(--zane-avatar-size);height:var(--zane-avatar-size);font-size:var(--zane-avatar-text-size)}.zane-avatar>img{display:block;width:100%;height:100%}.zane-avatar--circle{border-radius:50%}.zane-avatar--square{border-radius:var(--zane-avatar-border-radius)}.zane-avatar--icon{font-size:var(--zane-avatar-icon-size)}.zane-avatar--small{--zane-avatar-size:24px}.zane-avatar--large{--zane-avatar-size:56px}`;

const ns = useNamespace.useNamespace('avatar');
const ZaneAvatar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.imgError = index.createEvent(this, "imgError", 7);
        this.fit = 'cover';
        this.hasLoadError = false;
        this.shape = 'circle';
        this.size = 'default';
        this.src = '';
    }
    get avatarClass() {
        const classList = [ns.b()];
        if (isString.isString(this.size))
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
        return isNumber.isNumber(this.size)
            ? ns.cssVarBlock({
                size: addUnit.addUnit(this.size) || '',
            })
            : undefined;
    }
    handleError(e) {
        this.hasLoadError = true;
        this.imgError.emit(e);
    }
    render() {
        return (index.h(index.Host, { key: '8c1791ef21d387955357dd167227fb2ac6f0cdff', class: this.avatarClass, style: this.sizeStyle }, this.renderContent()));
    }
    watchSrcHandler() {
        this.hasLoadError = false;
    }
    renderContent() {
        if ((this.src || this.srcSet) && !this.hasLoadError) {
            return (index.h("img", { alt: this.alt, onError: (e) => this.handleError(e), src: this.src, srcset: this.srcSet, style: this.fitStyle }));
        }
        if (this.icon) {
            return index.h("zane-icon", { name: this.icon });
        }
        return index.h("slot", null);
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "src": [{
                "watchSrcHandler": 0
            }]
    }; }
};
ZaneAvatar.style = zaneAvatarCss();

exports.zane_avatar = ZaneAvatar;
