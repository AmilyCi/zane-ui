'use strict';

var index = require('./index-ziNpORbs.js');
var forwardRef = require('./forward-ref-xik_RVwH.js');
var findAllLegitChildren = require('./findAllLegitChildren-BeFgQwjQ.js');
var isObject = require('./isObject-EfaeaXJ_.js');
var error = require('./error-Bs0gfBMl.js');
require('./uuid-avdvDRhA.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');
require('./isString-D2n3i_b0.js');
require('./toObjectString-rn-pSGT_.js');

const NAME = 'ZaneOnlyChild';
const OnlyChild = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * 是否启用调试模式，启用后会输出警告信息
         */
        this.debug = false;
        /**
         * 是否启用严格模式，启用后如果有多个有效子节点会抛出错误
         */
        this.strict = false;
        this.findFirstLegitChild = (node) => {
            const children = findAllLegitChildren.findAllLegitChildren(node);
            const len = children.length;
            if (len === 0) {
                return [null, 0];
            }
            for (const child of children) {
                if (isObject.isObject(child)) {
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
                context = forwardRef.forwardRefContexts.get(parent);
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
        return index.h(index.Host, { key: 'f09d1a7efd07fa9462d7bb0c0681a23f782f9e3c' });
    }
    processChildren() {
        var _a;
        const [firstLegitNode, length] = this.findFirstLegitChild(this.el);
        if (!firstLegitNode) {
            error.debugWarn(NAME, 'no valid child node found');
            return null;
        }
        if (length > 1) {
            error.debugWarn(NAME, 'requires exact only one valid child.');
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
        const ns = useNamespace.useNamespace('only-child');
        const wrapper = document.createElement('span');
        wrapper.className = ns.e('content');
        wrapper.textContent = content;
        return wrapper;
    }
    get el() { return index.getElement(this); }
};

exports.zane_only_child = OnlyChild;
