import { h, Host } from "@stencil/core";
import { forwardRefContexts } from "../../constants";
import { useNamespace } from "../../hooks";
import { debugWarn, findAllLegitChildren, isObject } from "../../utils";
const NAME = 'ZaneOnlyChild';
export class OnlyChild {
    constructor() {
        /**
         * 是否启用调试模式，启用后会输出警告信息
         */
        this.debug = false;
        /**
         * 是否启用严格模式，启用后如果有多个有效子节点会抛出错误
         */
        this.strict = false;
        this.findFirstLegitChild = (node) => {
            const children = findAllLegitChildren(node);
            const len = children.length;
            if (len === 0) {
                return [null, 0];
            }
            for (const child of children) {
                if (isObject(child)) {
                    switch (child.nodeType) {
                        // 注释节点
                        case Node.COMMENT_NODE: {
                            continue;
                        }
                        case Node.TEXT_NODE: {
                            return [this.wrapTextContent(child.textContent), len];
                        }
                        case Node.DOCUMENT_FRAGMENT_NODE: {
                            return this.findFirstLegitChild(child);
                        }
                        default: {
                            return [child, len];
                        }
                    }
                }
                return [this.wrapTextContent(child), len];
            }
            return [null, 0];
        };
    }
    get forwardRefContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-FORWARD-REF') {
                context = forwardRefContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentDidLoad() {
        this.processChildren();
    }
    componentDidUpdate() {
        this.processChildren();
    }
    render() {
        return h(Host, { key: 'f09d1a7efd07fa9462d7bb0c0681a23f782f9e3c' });
    }
    processChildren() {
        var _a;
        const [firstLegitNode, length] = this.findFirstLegitChild(this.el);
        if (!firstLegitNode) {
            debugWarn(NAME, 'no valid child node found');
            return null;
        }
        if (length > 1) {
            debugWarn(NAME, 'requires exact only one valid child.');
        }
        (_a = this.forwardRefContext) === null || _a === void 0 ? void 0 : _a.setForwardRef(firstLegitNode);
        // 清空所有子节点
        this.el.innerHTML = '';
        this.el.append(firstLegitNode);
    }
    /**
     * 包装文本内容
     */
    wrapTextContent(content) {
        const ns = useNamespace('only-child');
        const wrapper = document.createElement('span');
        wrapper.className = ns.e('content');
        wrapper.textContent = content;
        return wrapper;
    }
    static get is() { return "zane-only-child"; }
    static get properties() {
        return {
            "debug": {
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
                    "text": "\u662F\u5426\u542F\u7528\u8C03\u8BD5\u6A21\u5F0F\uFF0C\u542F\u7528\u540E\u4F1A\u8F93\u51FA\u8B66\u544A\u4FE1\u606F"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "debug",
                "defaultValue": "false"
            },
            "strict": {
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
                    "text": "\u662F\u5426\u542F\u7528\u4E25\u683C\u6A21\u5F0F\uFF0C\u542F\u7528\u540E\u5982\u679C\u6709\u591A\u4E2A\u6709\u6548\u5B50\u8282\u70B9\u4F1A\u629B\u51FA\u9519\u8BEF"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "strict",
                "defaultValue": "false"
            }
        };
    }
    static get elementRef() { return "el"; }
}
