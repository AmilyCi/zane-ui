import { h, Host, } from "@stencil/core";
import { div } from "../../utils";
import { ROUND_ARROW, TIPPY_DEFAULT_APPEND_TO } from "./constants";
import tippy from "./tippy";
export class ZaneTooltip {
    constructor() {
        this.allowHTML = true;
        this.animateFill = false;
        this.animation = 'fade';
        this.appendTo = TIPPY_DEFAULT_APPEND_TO;
        this.aria = { content: 'describedby' };
        this.arrow = true;
        this.content = '';
        this.delay = 0;
        this.disabled = false;
        this.duration = 300;
        this.followCursor = false;
        this.getReferenceClientRect = null;
        this.hideOnClick = true;
        this.ignoreAttributes = false;
        this.inertia = false;
        this.inlinePositioning = true;
        this.interactive = false;
        this.interactiveBorder = 2;
        this.interactiveDebounce = 0;
        this.isMounted = false;
        this.maxWidth = 350;
        this.moveTransition = '';
        this.offset = [0, 10];
        this.placement = 'top';
        this.plugins = [];
        this.popperOptions = {};
        this.role = 'tooltip';
        this.showOnCreate = false;
        this.sticky = false;
        this.theme = '';
        this.touch = true;
        this.trigger = 'mouseenter focus';
        this.triggerTarget = null;
        this.zIndex = 9999;
        // 用于标记是否已经初始化
        this.isInitialized = false;
        // 用于存储slot内容的引用
        this.slotContentRef = null;
    }
    // 组件加载完成后初始化
    componentDidLoad() {
        // 只执行一次初始化
        if (!this.isInitialized) {
            this.initializeTippy();
            this.isInitialized = true;
        }
    }
    // 公共方法：禁用工具提示
    async disable() {
        if (this.tippyInstance) {
            this.tippyInstance.disable();
        }
    }
    // 组件卸载时清理
    disconnectedCallback() {
        var _a;
        const contentSlot = this.el.querySelector('[slot="content"]');
        if (contentSlot && this.slotContentRef) {
            while (this.slotContentRef.firstChild) {
                contentSlot.append(this.slotContentRef.firstChild);
            }
            (_a = this.slotContentRef) === null || _a === void 0 ? void 0 : _a.remove();
            this.slotContentRef = null;
        }
        this.destroyTippy();
    }
    // 公共方法：启用工具提示
    async enable() {
        if (this.tippyInstance) {
            this.tippyInstance.enable();
        }
    }
    // 监听属性变化
    handlePropsChange() {
        this.updateTippyInstance();
    }
    // 公共方法：隐藏工具提示
    async hide() {
        if (this.tippyInstance) {
            this.tippyInstance.hide();
        }
    }
    async isFocusInsideContent(event) {
        const popperContent = this.tippyInstance.popper;
        const activeElement = (event === null || event === void 0 ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent === null || popperContent === void 0 ? void 0 : popperContent.contains(activeElement);
    }
    async isVisible() {
        return this.tippyInstance.state.isVisible;
    }
    render() {
        return (h(Host, { key: 'e98a52d71f4e6cbda31fbf0edc7dd34a1ee62320' }, h("slot", { key: '0f17e159bb320d859a4cdc5896d591bddbba740d' }), h("slot", { key: 'eea91de21054af6d248a0ac54a78364743c589b8', name: "content" })));
    }
    // 公共方法：显示工具提示
    async show() {
        if (this.tippyInstance && !this.disabled) {
            this.tippyInstance.show();
        }
    }
    // 销毁Tippy实例
    destroyTippy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
            this.tippyInstance = null;
        }
    }
    // 获取工具提示内容
    getTooltipContent() {
        if (this.content) {
            return this.content;
        }
        // 如果通过slot传递内容
        const contentSlot = this.el.querySelector('[slot="content"]');
        if (contentSlot) {
            this.slotContentRef = div();
            // 直接循环 childNodes
            while (contentSlot.firstChild) {
                this.slotContentRef.append(contentSlot.firstChild);
            }
            return this.slotContentRef;
        }
        return '';
    }
    // 初始化Tippy实例
    initializeTippy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
        }
        if (this.el.children.length === 0) {
            console.warn('Tooltip组件需要一个触发元素作为子元素');
            return;
        }
        this.triggerElement = this.el.children[0];
        let arrow = this.arrow;
        if (this.arrow === 'round') {
            arrow = ROUND_ARROW;
        }
        // 配置Tippy选项
        const options = {
            allowHTML: this.allowHTML,
            animateFill: this.animateFill,
            animation: this.animation,
            appendTo: this.appendTo,
            aria: this.aria,
            arrow,
            content: this.getTooltipContent(),
            delay: this.delay,
            duration: this.duration,
            followCursor: this.followCursor,
            getReferenceClientRect: this.getReferenceClientRect,
            hideOnClick: this.hideOnClick,
            ignoreAttributes: this.ignoreAttributes,
            inertia: this.inertia,
            inlinePositioning: this.inlinePositioning,
            interactive: this.interactive,
            interactiveBorder: this.interactiveBorder,
            interactiveDebounce: this.interactiveDebounce,
            maxWidth: this.maxWidth,
            moveTransition: this.moveTransition,
            offset: this.offset,
            onClickOutside: (instance) => {
                this.zaneClickOutside.emit(instance);
            },
            onHidden: (instance) => {
                this.zaneHidden.emit(instance);
            },
            onHide: (instance) => {
                this.zaneHide.emit(instance);
                return undefined;
            },
            onMount: (instance) => {
                this.isMounted = true;
                this.zaneMount.emit(instance);
            },
            onShow: (instance) => {
                this.zaneShow.emit(instance);
                return undefined;
            },
            placement: this.placement,
            plugins: this.plugins,
            popperOptions: this.popperOptions,
            role: this.role,
            showOnCreate: this.showOnCreate,
            sticky: this.sticky,
            theme: this.theme,
            touch: this.touch,
            trigger: this.trigger,
            triggerTarget: this.triggerTarget,
            zIndex: this.zIndex,
        };
        if (this.tippyRender) {
            this.tippyRender.$$tippy = true;
            options.render = this.tippyRender;
        }
        // 创建Tippy实例
        this.tippyInstance = tippy(this.triggerElement, options);
        // 禁用状态处理
        if (this.disabled) {
            this.tippyInstance.disable();
        }
    }
    // 更新Tippy实例
    updateTippyInstance() {
        if (!this.tippyInstance)
            return;
        // 更新其他属性
        const props = {
            animation: this.animation,
            arrow: this.arrow,
            delay: this.delay,
            interactive: this.interactive,
            maxWidth: this.maxWidth,
            offset: this.offset,
            placement: this.placement,
            theme: this.theme,
            trigger: this.trigger,
        };
        this.tippyInstance.setProps(props);
        // 更新禁用状态
        if (this.disabled) {
            this.tippyInstance.disable();
        }
        else {
            this.tippyInstance.enable();
        }
    }
    static get is() { return "zane-tooltip"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-tooltip.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-tooltip.css"]
        };
    }
    static get properties() {
        return {
            "allowHTML": {
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
                "attribute": "allow-h-t-m-l",
                "defaultValue": "true"
            },
            "animateFill": {
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
                "attribute": "animate-fill",
                "defaultValue": "false"
            },
            "animation": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "boolean | string",
                    "resolved": "boolean | string",
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
                "attribute": "animation",
                "defaultValue": "'fade'"
            },
            "appendTo": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'parent' | ((ref: Element) => Element) | Element",
                    "resolved": "\"parent\" | ((ref: Element) => Element) | Element",
                    "references": {
                        "Element": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Element",
                            "referenceLocation": "Element"
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
                "attribute": "append-to",
                "defaultValue": "TIPPY_DEFAULT_APPEND_TO"
            },
            "aria": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "{\n    content?: 'auto' | 'describedby' | 'labelledby' | null;\n    expanded?: 'auto' | boolean;\n  }",
                    "resolved": "{ content?: \"auto\" | \"describedby\" | \"labelledby\"; expanded?: boolean | \"auto\"; }",
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
                "defaultValue": "{ content: 'describedby' }"
            },
            "arrow": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "boolean | DocumentFragment | string | SVGElement",
                    "resolved": "DocumentFragment | SVGElement | boolean | string",
                    "references": {
                        "DocumentFragment": {
                            "location": "global",
                            "id": "global::DocumentFragment"
                        },
                        "SVGElement": {
                            "location": "global",
                            "id": "global::SVGElement"
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
                "attribute": "arrow",
                "defaultValue": "true"
            },
            "content": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Content",
                    "resolved": "((ref: Element) => string | Element | DocumentFragment) | DocumentFragment | Element | string",
                    "references": {
                        "Content": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Content",
                            "referenceLocation": "Content"
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
                "attribute": "content",
                "defaultValue": "''"
            },
            "delay": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "[null | number, null | number] | number",
                    "resolved": "[number, number] | number",
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
                "attribute": "delay",
                "defaultValue": "0"
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
            "duration": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "[null | number, null | number] | number",
                    "resolved": "[number, number] | number",
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
                "attribute": "duration",
                "defaultValue": "300"
            },
            "followCursor": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'horizontal' | 'initial' | 'vertical' | boolean",
                    "resolved": "\"horizontal\" | \"initial\" | \"vertical\" | boolean",
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
                "attribute": "follow-cursor",
                "defaultValue": "false"
            },
            "getReferenceClientRect": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "GetReferenceClientRect | null",
                    "resolved": "GetReferenceClientRect",
                    "references": {
                        "GetReferenceClientRect": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::GetReferenceClientRect",
                            "referenceLocation": "GetReferenceClientRect"
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
                "defaultValue": "null"
            },
            "hideOnClick": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'toggle' | boolean",
                    "resolved": "\"toggle\" | boolean",
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
                "attribute": "hide-on-click",
                "defaultValue": "true"
            },
            "ignoreAttributes": {
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
                "attribute": "ignore-attributes",
                "defaultValue": "false"
            },
            "inertia": {
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
                "attribute": "inertia",
                "defaultValue": "false"
            },
            "inlinePositioning": {
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
                "attribute": "inline-positioning",
                "defaultValue": "true"
            },
            "interactive": {
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
                "attribute": "interactive",
                "defaultValue": "false"
            },
            "interactiveBorder": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "interactive-border",
                "defaultValue": "2"
            },
            "interactiveDebounce": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "interactive-debounce",
                "defaultValue": "0"
            },
            "maxWidth": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "number | string",
                    "resolved": "number | string",
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
                "attribute": "max-width",
                "defaultValue": "350"
            },
            "moveTransition": {
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
                "attribute": "move-transition",
                "defaultValue": "''"
            },
            "offset": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "| (({\n        placement,\n        popper,\n        reference,\n      }: {\n        placement: Placement;\n        popper: PopperRect;\n        reference: PopperRect;\n      }) => [number, number])\n    | [number, number]",
                    "resolved": "(({ placement, popper, reference, }: { placement: Placement; popper: Rect; reference: Rect; }) => [number, number]) | [number, number]",
                    "references": {
                        "Placement": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Placement",
                            "referenceLocation": "Placement"
                        },
                        "PopperRect": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::PopperRect",
                            "referenceLocation": "PopperRect"
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
                "defaultValue": "[0, 10]"
            },
            "placement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Placement",
                    "resolved": "\"auto\" | \"auto-end\" | \"auto-start\" | \"bottom\" | \"bottom-end\" | \"bottom-start\" | \"left\" | \"left-end\" | \"left-start\" | \"right\" | \"right-end\" | \"right-start\" | \"top\" | \"top-end\" | \"top-start\"",
                    "references": {
                        "Placement": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Placement",
                            "referenceLocation": "Placement"
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
                "attribute": "placement",
                "defaultValue": "'top'"
            },
            "plugins": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Plugin<unknown>[]",
                    "resolved": "Plugin<unknown>[]",
                    "references": {
                        "Plugin": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Plugin",
                            "referenceLocation": "Plugin"
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
                "defaultValue": "[]"
            },
            "popperOptions": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Partial<PopperOptions>",
                    "resolved": "{ placement: Placement; modifiers: Partial<Modifier<any, any>>[]; strategy: PositioningStrategy; onFirstUpdate?: (arg0: Partial<State>) => void; }",
                    "references": {
                        "Partial": {
                            "location": "global",
                            "id": "global::Partial"
                        },
                        "PopperOptions": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::PopperOptions",
                            "referenceLocation": "PopperOptions"
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
                "defaultValue": "{}"
            },
            "role": {
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
                "attribute": "role",
                "defaultValue": "'tooltip'"
            },
            "showOnCreate": {
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
                "attribute": "show-on-create",
                "defaultValue": "false"
            },
            "sticky": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'popper' | 'reference' | boolean",
                    "resolved": "\"popper\" | \"reference\" | boolean",
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
                "attribute": "sticky",
                "defaultValue": "false"
            },
            "theme": {
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
                "attribute": "theme",
                "defaultValue": "''"
            },
            "tippyRender": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "| ((instance: Instance) => {\n        onUpdate?: (prevProps: Props, nextProps: Props) => void;\n        popper: PopperElement;\n      })\n    | null",
                    "resolved": "(instance: Instance<Props>) => { onUpdate?: (prevProps: Props, nextProps: Props) => void; popper: PopperElement<Props>; }",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        },
                        "PopperElement": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::PopperElement",
                            "referenceLocation": "PopperElement"
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
                "setter": false
            },
            "touch": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "'hold' | ['hold', number] | boolean",
                    "resolved": "\"hold\" | [\"hold\", number] | boolean",
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
                "attribute": "touch",
                "defaultValue": "true"
            },
            "trigger": {
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
                "attribute": "trigger",
                "defaultValue": "'mouseenter focus'"
            },
            "triggerTarget": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "Element | Element[] | null",
                    "resolved": "Element | Element[]",
                    "references": {
                        "Element": {
                            "location": "import",
                            "path": "@stencil/core",
                            "id": "node_modules::Element",
                            "referenceLocation": "Element"
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
                "defaultValue": "null"
            },
            "zIndex": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "z-index",
                "defaultValue": "9999"
            }
        };
    }
    static get states() {
        return {
            "isMounted": {}
        };
    }
    static get events() {
        return [{
                "method": "zaneClickOutside",
                "name": "zClickOutside",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Instance<Props>",
                    "resolved": "Instance<Props>",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        }
                    }
                }
            }, {
                "method": "zaneHidden",
                "name": "zHidden",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Instance<Props>",
                    "resolved": "Instance<Props>",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        }
                    }
                }
            }, {
                "method": "zaneHide",
                "name": "zHide",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Instance<Props>",
                    "resolved": "Instance<Props>",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        }
                    }
                }
            }, {
                "method": "zaneMount",
                "name": "zMount",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Instance<Props>",
                    "resolved": "Instance<Props>",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        }
                    }
                }
            }, {
                "method": "zaneShow",
                "name": "zShow",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "Instance<Props>",
                    "resolved": "Instance<Props>",
                    "references": {
                        "Instance": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Instance",
                            "referenceLocation": "Instance"
                        },
                        "Props": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/tooltip/types.ts::Props",
                            "referenceLocation": "Props"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "disable": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "enable": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "hide": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "isFocusInsideContent": {
                "complexType": {
                    "signature": "(event?: FocusEvent) => Promise<boolean>",
                    "parameters": [{
                            "name": "event",
                            "type": "FocusEvent",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "FocusEvent": {
                            "location": "global",
                            "id": "global::FocusEvent"
                        },
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
                        },
                        "Node": {
                            "location": "global",
                            "id": "global::Node"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "isVisible": {
                "complexType": {
                    "signature": "() => Promise<boolean>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "show": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "content",
                "methodName": "handlePropsChange"
            }, {
                "propName": "placement",
                "methodName": "handlePropsChange"
            }, {
                "propName": "trigger",
                "methodName": "handlePropsChange"
            }, {
                "propName": "maxWidth",
                "methodName": "handlePropsChange"
            }, {
                "propName": "arrow",
                "methodName": "handlePropsChange"
            }, {
                "propName": "delay",
                "methodName": "handlePropsChange"
            }, {
                "propName": "disabled",
                "methodName": "handlePropsChange"
            }];
    }
}
