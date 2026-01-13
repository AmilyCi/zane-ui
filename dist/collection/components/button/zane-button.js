import { TinyColor } from "@ctrl/tinycolor";
import { h, Host, } from "@stencil/core";
import { buttonGroupContexts } from "../../constants";
import state from "../../global/store";
import { useNamespace } from "../../hooks";
import { darken, findAllLegitChildren } from "../../utils";
const ns = useNamespace('button');
export class ZaneButton {
    constructor() {
        this.autofocus = false;
        this.bg = false;
        this.buttonStyle = {};
        this.circle = false;
        this.dark = false;
        this.disabled = false;
        this.link = false;
        this.loading = false;
        this.nativeType = 'button';
        this.shouldAddSpace = false;
        this.type = '';
        this.handleClick = (evt) => {
            if (this.loading || this.disabled)
                return;
            this.clickEvent.emit(evt);
        };
    }
    get buttonKls() {
        return [
            ns.b(),
            ns.m(this._type),
            ns.m(this._size),
            this.el.className,
            ns.is('disabled', this._disabled),
            ns.is('loading', this.loading),
            ns.is('plain', this._plain),
            ns.is('round', this._round),
            ns.is('circle', this.circle),
            ns.is('text', this._text),
            ns.is('link', this.link),
            ns.is('has-bg', this.bg),
        ].join(' ');
    }
    get groupContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-BUTTON-GROUP') {
                context = buttonGroupContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        var _a, _b;
        this.onGroupUpdateSize = () => {
            this.updateInternalState();
        };
        this.onGroupUpdateType = () => {
            this.updateInternalState();
        };
        (_a = this.groupContext) === null || _a === void 0 ? void 0 : _a.addSizeChangeListener(this.onGroupUpdateSize);
        (_b = this.groupContext) === null || _b === void 0 ? void 0 : _b.addTypeChangeListener(this.onGroupUpdateType);
        this.updateInternalState();
        this.updateCustomStyle();
    }
    onPropChange() {
        this.updateInternalState();
        this.updateCustomStyle();
    }
    render() {
        const hasContent = findAllLegitChildren(this.el).length > 0;
        return (h(Host, { key: '20349ae578f6e0af983b9224f8461dfdaa907827' }, h("button", { key: '705a83ff0ccafbf78a3212a153bc7fbff099ed4d', autofocus: this.autofocus, class: this.buttonKls, disabled: this.disabled, onClick: this.handleClick, style: this.buttonStyle, type: this.nativeType }, this.renderIcon(), hasContent && (h("span", { key: 'e708f4f2eb389968334f13592da8ec775dd3c091', class: { [ns.em('text', 'expand')]: this.shouldAddSpace } }, h("slot", { key: 'e1332c8127e8b95955dd903487cfcf8c617a789a' }))))));
    }
    renderIcon() {
        const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');
        if (this.loading) {
            return (h("slot", { name: "loading" }, h("svg", { class: "mr-2", height: "1em", viewBox: "0 0 24 24", width: "1em", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z", fill: "currentColor", opacity: ".25" }), h("path", { d: "M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z", fill: "currentColor" }, h("animateTransform", { attributeName: "transform", dur: "0.75s", repeatCount: "indefinite", type: "rotate", values: "0 12 12;360 12 12" })))));
        }
        else if (hasIcon) {
            return this.icon ? (h("zane-icon", { name: this.icon })) : (h("slot", { name: "icon" }));
        }
        return null;
    }
    updateCustomStyle() {
        let styles = {};
        let buttonColor = this.color;
        if (buttonColor) {
            const match = buttonColor.match(/var\((.*?)\)/);
            if (match) {
                buttonColor = window
                    .getComputedStyle(window.document.documentElement)
                    .getPropertyValue(match[1]);
            }
            const color = new TinyColor(buttonColor);
            const activeBgColor = this.dark
                ? color.tint(20).toString()
                : darken(color, 20);
            if (this.plain) {
                styles = ns.cssVarBlock({
                    'active-bg-color': activeBgColor,
                    'active-border-color': activeBgColor,
                    'active-text-color': `var(${ns.cssVarName('color-white')})`,
                    'bg-color': this.dark ? darken(color, 90) : color.tint(90).toString(),
                    'border-color': this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString(),
                    'hover-bg-color': buttonColor,
                    'hover-border-color': buttonColor,
                    'hover-text-color': `var(${ns.cssVarName('color-white')})`,
                    'text-color': buttonColor,
                });
                if (this.disabled) {
                    styles[ns.cssVarBlockName('disabled-bg-color')] = this.dark
                        ? darken(color, 90)
                        : color.tint(90).toString();
                    styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString();
                    styles[ns.cssVarBlockName('disabled-border-color')] = this.dark
                        ? darken(color, 80)
                        : color.tint(80).toString();
                }
            }
            else {
                const hoverBgColor = this.dark
                    ? darken(color, 30)
                    : color.tint(30).toString();
                const textColor = color.isDark()
                    ? `var(${ns.cssVarName('color-white')})`
                    : `var(${ns.cssVarName('color-black')})`;
                styles = ns.cssVarBlock({
                    'active-bg-color': activeBgColor,
                    'active-border-color': activeBgColor,
                    'bg-color': buttonColor,
                    'border-color': buttonColor,
                    'hover-bg-color': hoverBgColor,
                    'hover-border-color': hoverBgColor,
                    'hover-text-color': textColor,
                    'text-color': textColor,
                });
                if (this.disabled) {
                    const disabledButtonColor = this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString();
                    styles[ns.cssVarBlockName('disabled-bg-color')] = disabledButtonColor;
                    styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
                        ? 'rgba(255, 255, 255, 0.5)'
                        : `var(${ns.cssVarName('color-white')})`;
                    styles[ns.cssVarBlockName('disabled-border-color')] =
                        disabledButtonColor;
                }
            }
        }
        this.buttonStyle = Object.assign(Object.assign({}, styles), this.el.style);
    }
    updateInternalState() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const globalButtonConfig = state.configProviderContext.button;
        const autoInsertSpace = (_b = (_a = this.autoInsertSpace) !== null && _a !== void 0 ? _a : globalButtonConfig.autoInsertSpace) !== null && _b !== void 0 ? _b : false;
        this._size = this.size || ((_c = this.groupContext) === null || _c === void 0 ? void 0 : _c.size) || state.size || '';
        this._type =
            this.type || ((_d = this.groupContext) === null || _d === void 0 ? void 0 : _d.type) || globalButtonConfig.type || '';
        this._disabled = this.disabled;
        this._plain = (_f = (_e = this.plain) !== null && _e !== void 0 ? _e : globalButtonConfig.plain) !== null && _f !== void 0 ? _f : false;
        this._round = (_h = (_g = this.round) !== null && _g !== void 0 ? _g : globalButtonConfig.round) !== null && _h !== void 0 ? _h : false;
        this._text = (_k = (_j = this.text) !== null && _j !== void 0 ? _j : globalButtonConfig.text) !== null && _k !== void 0 ? _k : false;
        if (autoInsertSpace) {
            const slot = this.el.querySelector('span');
            if (slot) {
                const text = slot.textContent;
                this.shouldAddSpace = /^\p{Unified_Ideograph}{2}$/u.test(text);
            }
        }
        this.shouldAddSpace = false;
    }
    static get is() { return "zane-button"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-button.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-button.css"]
        };
    }
    static get properties() {
        return {
            "autofocus": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "autofocus",
                "defaultValue": "false"
            },
            "autoInsertSpace": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "auto-insert-space"
            },
            "bg": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "bg",
                "defaultValue": "false"
            },
            "circle": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "circle",
                "defaultValue": "false"
            },
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "color"
            },
            "dark": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "dark",
                "defaultValue": "false"
            },
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "icon": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "icon"
            },
            "link": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "link",
                "defaultValue": "false"
            },
            "loading": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "loading",
                "defaultValue": "false"
            },
            "nativeType": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "ButtonNativeType",
                    "resolved": "\"button\" | \"reset\" | \"submit\"",
                    "references": {
                        "ButtonNativeType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ButtonNativeType",
                            "referenceLocation": "ButtonNativeType"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "native-type",
                "defaultValue": "'button'"
            },
            "plain": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "plain"
            },
            "round": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "round"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "ComponentSize",
                    "resolved": "\"\" | \"default\" | \"large\" | \"small\"",
                    "references": {
                        "ComponentSize": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ComponentSize",
                            "referenceLocation": "ComponentSize"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "size"
            },
            "text": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "text"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "ButtonType",
                    "resolved": "\"\" | \"danger\" | \"default\" | \"info\" | \"primary\" | \"success\" | \"warning\"",
                    "references": {
                        "ButtonType": {
                            "location": "import",
                            "path": "../../types",
                            "id": "src/types/index.ts::ButtonType",
                            "referenceLocation": "ButtonType"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "type",
                "defaultValue": "''"
            }
        };
    }
    static get states() {
        return {
            "_disabled": {},
            "_plain": {},
            "_round": {},
            "_size": {},
            "_text": {},
            "_type": {},
            "buttonStyle": {},
            "shouldAddSpace": {}
        };
    }
    static get events() {
        return [{
                "method": "clickEvent",
                "name": "zClick",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "MouseEvent",
                    "resolved": "MouseEvent",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "size",
                "methodName": "onPropChange"
            }, {
                "propName": "type",
                "methodName": "onPropChange"
            }, {
                "propName": "disabled",
                "methodName": "onPropChange"
            }, {
                "propName": "plain",
                "methodName": "onPropChange"
            }, {
                "propName": "round",
                "methodName": "onPropChange"
            }, {
                "propName": "text",
                "methodName": "onPropChange"
            }, {
                "propName": "color",
                "methodName": "onPropChange"
            }, {
                "propName": "dark",
                "methodName": "onPropChange"
            }];
    }
}
