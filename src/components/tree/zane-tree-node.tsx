import { Component, Event, h, Prop, Element, type EventEmitter, Host } from '@stencil/core';
import type { TreeContext, TreeNode } from './types';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { CheckboxValueType } from '../checkbox/types';
import { mutable } from '../../types';
import { useNamespace } from '../../hooks';
import { EMPTY_NODE } from './constants';
import classNames from 'classnames';
import { getTreeContext } from './utils';
import { isFunction, isString } from '../../utils';

const ns = useNamespace('tree');

@Component({
  tag: 'zane-tree-node',
})
export class ZaneTreeNode {
  @Element() el: HTMLElement;

  @Prop() node: TreeNode = mutable(EMPTY_NODE);

  @Prop() expanded: boolean;

  @Prop() checked: boolean;

  @Prop() indeterminate: boolean;

  @Prop() showCheckbox: boolean;

  @Prop() disabled: boolean;

  @Prop() current: boolean;

  @Prop() hiddenExpandIcon: boolean;

  @Prop() itemSize: number = 26;

  @Event({ eventName: 'zClick', bubbles: false })
  clickEvent: EventEmitter<{
    node: TreeNode,
    event: MouseEvent,
  }>;

  @Event({ eventName: 'zDrop', bubbles: false })
  dropEvent: EventEmitter<{
    node: TreeNode,
    event: DragEvent,
  }>;

  @Event({ eventName: 'zToggle', bubbles: false })
  toggleEvent: EventEmitter<{
    node: TreeNode,
  }>;

  @Event({ eventName: 'zCheck', bubbles: false })
  checkEvent: EventEmitter<{
    node: TreeNode,
    checked: CheckboxValueType,
  }>;

  private treeContext: ReactiveObject<TreeContext>;


  componentWillLoad() {
    this.treeContext = getTreeContext(this.el);
  }

  private getNodeClass = (node: TreeNode) => {
    const nodeClassFunc = this.treeContext?.value.treeProps.class;
    if (!nodeClassFunc) {
      return {};
    }

    let className;
    if (isFunction(nodeClassFunc)) {
      const { data } = node;
      className = nodeClassFunc(data, node);
    } else {
      className = nodeClassFunc;
    }

    return isString(className) ? { [className]: true } : className;
  }

  private handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    this.clickEvent.emit({
      node: this.node,
      event,
    });
  }

  private handleExpandIconClick = (event: MouseEvent) => {
    event.stopPropagation();
    this.toggleEvent.emit({
      node: this.node,
    })
  }

  private handleCheckChange = (event: CustomEvent<CheckboxValueType>) => {
    this.checkEvent.emit({
      node: this.node,
      checked: event.detail,
    });
  }

  render() {
    const indent = this.treeContext?.value.indent ?? 16;
    const icon = this.treeContext?.value.icon;
    return (
      <Host
        class={classNames(
          ns.b('node'),
          ns.is('expanded', this.expanded),
          ns.is('current', this.current),
          ns.is('focusable', !this.disabled),
          ns.is('checked', !this.disabled && this.checked),
          this.getNodeClass(this.node),
        )}
        role="treeitem"
        tabindex="-1"
        aria-expanded={this.expanded}
        aria-disabled={this.disabled}
        aria-checked={this.checked}
        data-key={this.node?.key}
        onClick={this.handleClick}
      >
        <div
          class={ns.be('node', 'content')}
          style={{
            paddingLeft: `${(this.node.level - 1) * indent}px`,
            height: this.itemSize + 'px',
          }}
        >
          {
            icon && (
            <zane-icon
              class={classNames(
                ns.is('leaf', !!this.node.isLeaf),
                ns.is('hidden', this.hiddenExpandIcon),
                {
                  expanded: !this.node.isLeaf && this.expanded
                },
                ns.be('node', 'expand-icon')
              )}
              name={icon}
              onClick={this.handleExpandIconClick}
            ></zane-icon>
            )
          }
          {
            this.showCheckbox && (
              <zane-checkbox
                value={this.checked}
                indeterminate={this.indeterminate}
                disabled={this.disabled}
                onZChange={this.handleCheckChange}
                onClick={(e) => {e.stopPropagation()}}
              ></zane-checkbox>
            )
          }
          <zane-tree-node-content
            node={{
              ...this.node,
              expanded: this.expanded
            }}
          ></zane-tree-node-content>
        </div>
      </Host>
    );
  }
}
