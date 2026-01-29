import { Component, Element, h, Host, Prop } from "@stencil/core";

import { useNamespace } from "../../hooks";
import {
  debugWarn,
  findAllLegitChildren,
  isObject,
  type ReactiveObject,
} from "../../utils";
import type { ForwardRefContext } from "../forward-ref/types";
import { getForwardRefContext } from "../forward-ref/utils";

const NAME = "ZaneOnlyChild";

@Component({
  shadow: false,
  tag: "zane-only-child",
})
export class OnlyChild {
  @Element() el: HTMLElement;
  /**
   * 是否启用调试模式，启用后会输出警告信息
   */
  @Prop() debug: boolean = false;

  /**
   * 是否启用严格模式，启用后如果有多个有效子节点会抛出错误
   */
  @Prop() strict: boolean = false;

  private forwardRefContext: ReactiveObject<ForwardRefContext>;

  componentWillLoad() {
    this.forwardRefContext = getForwardRefContext(this.el);
  }

  componentDidLoad() {
    this.processChildren();
  }

  componentDidUpdate() {
    this.processChildren();
  }

  render() {
    return <Host></Host>;
  }

  private findFirstLegitChild = (node: HTMLElement): [HTMLElement, number] => {
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
            return this.findFirstLegitChild(child as HTMLElement);
          }
          default: {
            return [child as HTMLElement, len];
          }
        }
      }
      return [this.wrapTextContent(child), len];
    }
    return [null, 0];
  };

  private processChildren() {
    const [firstLegitNode, length] = this.findFirstLegitChild(this.el);
    if (!firstLegitNode) {
      debugWarn(NAME, "no valid child node found");
      return null;
    }
    if (length > 1) {
      debugWarn(NAME, "requires exact only one valid child.");
    }
    this.forwardRefContext?.value.setForwardRef(firstLegitNode);
    // 清空所有子节点
    this.el.innerHTML = "";
    this.el.append(firstLegitNode);
  }

  /**
   * 包装文本内容
   */
  private wrapTextContent(content: string): HTMLElement {
    const ns = useNamespace("only-child");
    const wrapper = document.createElement("span");
    wrapper.className = ns.e("content");
    wrapper.textContent = content;
    return wrapper;
  }
}
