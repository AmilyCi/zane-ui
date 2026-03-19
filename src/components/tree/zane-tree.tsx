import { Component, Event, h, Prop, Element, type EventEmitter, Host, State, Watch, Method } from '@stencil/core';
import { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type {
  CheckedInfo,
  FilterMethod,
  Tree,
  TreeContext,
  TreeData,
  TreeKey,
  TreeNode,
  TreeNodeData,
  TreeOptionProps
} from './types';
import { useNamespace } from '../../hooks';
import { hasRawParent, isFunction, isObject, nextFrame } from '../../utils';
import { treeContexts } from './constants';
import classNames from 'classnames';
import type { CheckboxValueType } from '../checkbox/types';
import state from '../../global/store';

const { t } = state.i18n;

const ns = useNamespace('tree');

@Component({
  tag: 'zane-tree',
  styleUrl: 'zane-tree.scss'
})
export class ZaneTree {
  @Element() el: HTMLElement;

  @Prop() data: TreeData = [];

  @Prop() emptyText: string;

  @Prop() height: number = 200;

  @Prop() props: TreeOptionProps = {
    children: 'children',
    label: 'label',
    disabled: 'disabled',
    value: 'id',
    class: '',
  };

  @Prop() highlightCurrent: boolean = false;

  @Prop() showCheckbox: boolean = false;

  @Prop() defaultCheckedKeys: TreeKey[] = [];

  @Prop() defaultExpandedKeys: TreeKey[] = [];

  @Prop() checkStrictly: boolean = false;

  @Prop() indent: number = 16;

  @Prop() itemSize: number = 26;

  @Prop() icon: string;

  @Prop() expandOnClickNode: boolean = true;

  @Prop() checkOnClickNode: boolean = false;

  @Prop() checkOnClickLeaf: boolean = true;

  @Prop() currentNodeKey: TreeKey;

  @Prop() accordion: boolean = false;

  @Prop() filterMethod: FilterMethod;

  @Prop() perfMode: boolean = true;

  @Prop() scrollbarAlwaysOn: boolean = false;

  @Prop() itemRender: (data: {
    data: any[];
    index: number;
    isScrolling: boolean;
    style: Record<string, any>;
  }) => any

  @Event({ eventName: 'zNodeClick', bubbles: false })
  nodeClickEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
    event: MouseEvent
  }>;

  @Event({ eventName: 'zNodeDrop', bubbles: false })
  nodeDropEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
    event: DragEvent
  }>;

  @Event({ eventName: 'zNodeExpand', bubbles: false })
  nodeExpandEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
  }>;

  @Event({ eventName: 'zNodeCollapse', bubbles: false })
  nodeCollapseEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
  }>;

  @Event({ eventName: 'zCurrentChange', bubbles: false })
  currentChangeEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
  }>;

  @Event({ eventName: 'zNodeCheck', bubbles: false })
  nodeCheckEvent: EventEmitter<{
    data: TreeNodeData
    checkedInfo: CheckedInfo
  }>;

  @Event({ eventName: 'zNodeCheckChange', bubbles: false })
  nodeCheckChangeEvent: EventEmitter<{
    data: TreeNodeData
    checked: CheckboxValueType
  }>;

  @Event({ eventName: 'zNodeContextMenu', bubbles: false })
  nodeContextMenuEvent: EventEmitter<{
    data: TreeNodeData
    node: TreeNode
    event: Event
  }>;

  @State() valueKey: string;

  @State() childrenKey: string;

  @State() disabledKey: string;

  @State() labelKey: string;

  @State() expandedKeys: TreeKey[] = [];

  @State() currentKey: TreeKey = undefined;

  @State() tree: Tree = undefined;

  @State() flattenTree: TreeNode[] = [];

  @State() checkedKeys: TreeKey[] = [];

  @State() indeterminateKeys: TreeKey[] = [];

  @State() hiddenNodeKeys: TreeKey[] = [];

  @State() hiddenExpandIconKeys: TreeKey[] = [];

  @State() isNotEmpty = false;

  private context: ReactiveObject<TreeContext>;

  private listRef: HTMLZaneVirtualListElement;

  @Watch('currentNodeKey')
  watchCurrentNodeKeyHandler() {
    this.currentKey = this.currentNodeKey;
  }

  @Watch('defaultExpandedKeys')
  watchDefaultExpandedKeysHandler() {
    this.expandedKeys = this.defaultExpandedKeys;
  }

  @Watch('props')
  watchPropsHandler() {
    this.valueKey = this.props.value || 'id';
    this.childrenKey = this.props.children || 'children';
    this.disabledKey = this.props.disabled || 'disabled';
    this.labelKey = this.props.label || 'label';
  }

  @Watch('data')
  watchDataHandler() {
    this.setData(this.data);
  }

  @Watch('tree')
  @Watch('expandedKeys')
  @Watch('hiddenNodeKeys')
  handleUpdateFlattenTree() {
    const flattenNodes: TreeNode[] = [];
    const nodes = this.tree?.treeNodes || [];
    const stack: TreeNode[] = [];
    for (let i = nodes.length - 1; i >= 0; --i) {
      stack.push(nodes[i]);
    }

    while(stack.length) {
      const node = stack.pop();
      if (this.hiddenNodeKeys.includes(node.key)) {
        continue;
      }

      flattenNodes.push(node);
      if (node.children && this.expandedKeys.includes(node.key)) {
        for (let i = node.children.length - 1; i >=0; --i) {
          stack.push(node.children[i]);
        }
      }
    }

    this.flattenTree = flattenNodes;
  }

  @Watch('flattenTree')
  watchFlattenTreeHandler() {
    this.isNotEmpty = this.flattenTree.length > 0;
  }

  @Method()
  async getContext() {
    return this.context;
  }

  @Method()
  async getCheckedKeys(leafOnly = false): Promise<TreeKey[]> {
    return this.getChecked(leafOnly).checkedKeys;
  }

  @Method()
  async getCheckedNodes(leafOnly = false): Promise<TreeNodeData[]> {
    return this.getChecked(leafOnly).checkedNodes;
  }

  @Method()
  async getHalfCheckedKeys(): Promise<TreeKey[]> {
    return this.getHalfChecked().halfCheckedKeys;
  }

  @Method()
  async getHalfCheckedNodes(): Promise<TreeNodeData[]> {
    return this.getHalfChecked().halfCheckedNodes;
  }

  @Method()
  async setChecked(key: TreeKey, isChecked: boolean) {
    if (this.tree && this.showCheckbox) {
      const node = this.tree.treeNodeMap.get(key);
      if (node) {
        this.toggleCheckbox(node, isChecked, false);
      }
    }
  }

  @Method()
  async setCheckedKeys(keys: TreeKey[]) {
    this.checkedKeys = [];
    this.indeterminateKeys = [];
    nextFrame(() => {
      this.$setCheckedKeys(keys);
    });
  }

  @Method()
  async filter(query: string) {
    const keys = this.doFilter(query);
    if (keys) {
      this.expandedKeys = keys;
    }
  }


  @Method()
  async toggleCheckbox(
    node: TreeNode,
    isChecked: CheckboxValueType,
    nodeClick = true,
    immediateUpdate = true
  ) {
    const checkedKeySet = new Set<TreeKey>(this.checkedKeys);
    if (!this.checkStrictly && nodeClick && node.children?.length) {
      isChecked = node.children.some((node) => !node.isEffectivelyChecked);
    }

    const toggle = (node: TreeNode, checked: CheckboxValueType) => {
      checkedKeySet[checked ? 'add' : 'delete'](node.key);
      const children = node.children;
      if (!this.checkStrictly && children) {
        children.forEach((childNode) => {
          if (!childNode.disabled || childNode.children) {
            toggle(childNode, checked);
          }
        });
      }
    }

    toggle(node, isChecked);

    this.checkedKeys = Array.from(checkedKeySet);

    if (immediateUpdate) {
      this.updateCheckedKeys();
    }
    if (nodeClick) {
      this.afterNodeCheck(node, isChecked);
    }
  }

  @Method()
  async getNode(data: TreeKey | TreeNodeData): Promise<TreeNode> {
    const key = isObject(data) ? this.getKey(data) : data;
    return this.tree?.treeNodeMap.get(key);
  }

  @Method()
  async getCurrentNode(): Promise<TreeNodeData | undefined> {
    if (!this.currentKey) {
      return undefined;
    }
    return this.tree?.treeNodeMap.get(this.currentKey)?.data;
  }

  @Method()
  async getCurrentKey(): Promise<TreeKey | undefined> {
    return this.currentKey;
  }

  @Method()
  async setCurrentKey(key: TreeKey) {
    this.currentKey = key;
  }

  @Method()
  async setData(data: TreeData) {
    this.tree = this.createTree(data);
  }

  @Method()
  async toggleExpand(node: TreeNode) {
    if (this.expandedKeys.includes(node.key)) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
  }

  @Method()
  async collapseNode(node: TreeNode) {
    const expandedKeySet = new Set<TreeKey>(this.expandedKeys);
    expandedKeySet.delete(node.key);
    this.expandedKeys = Array.from(expandedKeySet);

    const $node = await this.getNode(node.key);
    if ($node) {
      $node.expanded = false;
      this.nodeCollapseEvent.emit({
        data: $node.data,
        node: $node
      });
    }
  }

  @Method()
  async expandNode(node: TreeNode) {
    const expandedKeySet = new Set<TreeKey>(this.expandedKeys);
    if (this.tree && this.accordion) {
      const { treeNodeMap } = this.tree;
      expandedKeySet.forEach((key) => {
        const treeNode = treeNodeMap.get(key);
        if (node && node.level === treeNode?.level) {
          expandedKeySet.delete(key);
          treeNode.expanded = false;
        }
      });
    }
    expandedKeySet.add(node.key);
    this.expandedKeys = Array.from(expandedKeySet);

    const $node = await this.getNode(node.key);
    if ($node) {
      $node.expanded = true;
      this.nodeExpandEvent.emit({
        data: $node.data,
        node: $node
      });
    }
  }

  @Method()
  async zScrollToNode(key: TreeKey, strategy: 'auto' | 'smart' | 'center' | 'start' | 'end' = 'auto') {
    const node = await this.getNode(key);
    if (node && this.listRef) {
      this.listRef.zScrollToItem(this.flattenTree.indexOf(node), strategy);
    }
  }

  @Method()
  async zScrollTo(offset: number) {
    this.listRef?.zScrollTo(offset);
  }

  componentWillLoad() {
    this.watchCurrentNodeKeyHandler();
    this.watchDefaultExpandedKeysHandler();
    this.watchPropsHandler();
    this.watchDataHandler();

    this.context = new ReactiveObject<TreeContext>({
      treeProps: this.props,
      indent: this.indent ?? 16,
      icon: this.icon ?? 'arrow-right-s-fill'
    });
    treeContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    if (!hasRawParent(this.el)) {
      treeContexts.delete(this.el);
      this.context = null;
    }
  }

  private updateCheckedKeys = () => {
    if (!this.tree || !this.showCheckbox || this.checkStrictly) {
      return;
    }

    const { levelTreeNodeMap, maxLevel } = this.tree;
    const indeterminateKeySet = new Set<TreeKey>();
    const checkedKeySet = new Set<TreeKey>(this.checkedKeys);

    for (let level = maxLevel; level >=1; --level) {
      const nodes = levelTreeNodeMap.get(level);
      if (!nodes) {
        continue;
      }

      nodes.forEach((node: TreeNode) => {
        const children = node.children;
        let isEffectivelyChecked = !node.isLeaf || node.disabled || checkedKeySet.has(node.key);
        if (children) {
          let allChecked = true;
          let hasChecked = false;
          for (const childNode of children) {
            const key = childNode.key;
            if (!childNode.isEffectivelyChecked) {
              isEffectivelyChecked = false;
            }
            if (checkedKeySet.has(key)) {
              hasChecked = true;
            } else if (indeterminateKeySet.has(key)) {
              allChecked = false;
              hasChecked = true
            } else {
              allChecked = false;
            }
          }

          if (allChecked) {
            checkedKeySet.add(node.key);
          } else if (hasChecked) {
            indeterminateKeySet.add(node.key);
            checkedKeySet.delete(node.key);
          } else {
            checkedKeySet.delete(node.key);
            indeterminateKeySet.delete(node.key);
          }
        }
        node.isEffectivelyChecked = isEffectivelyChecked;
      });
    }
    this.indeterminateKeys = Array.from(indeterminateKeySet);
    this.checkedKeys = Array.from(checkedKeySet);
  }

  private isChecked = (node: TreeNode) => {
    return this.checkedKeys.includes(node.key);
  }

  private isIndeterminate = (node: TreeNode) => {
    return this.indeterminateKeys.includes(node.key);
  }

  private isDisabled = (node: TreeNode) => {
    return !!node.disabled;
  }

  private isCurrent = (node: TreeNode) => {
    const current = this.currentKey;
    return current !== undefined && current === node.key;
  }

  private afterNodeCheck = (
    node: TreeNode,
    checked: CheckboxValueType
  ) => {
    const { checkedNodes, checkedKeys } = this.getChecked();
    const { halfCheckedNodes, halfCheckedKeys } = this.getHalfChecked();
    this.nodeCheckEvent.emit({
      data: node.data,
      checkedInfo: {
        checkedKeys,
        checkedNodes,
        halfCheckedKeys,
        halfCheckedNodes,
      }
    });
    this.nodeCheckChangeEvent.emit({
      data: node.data,
      checked
    });
  }

  private getChecked = (leafOnly = false): {
    checkedKeys: TreeKey[]
    checkedNodes: TreeNodeData[]
  } => {
    const nodes: TreeNodeData[] = [];
    const keys: TreeKey[] = [];
    if (this.tree && this.showCheckbox) {
      const { treeNodeMap } = this.tree;
      this.checkedKeys.forEach((key) => {
        const node = treeNodeMap.get(key);
        if (node && (!leafOnly || (leafOnly && node.isLeaf))) {
          keys.push(key);
          nodes.push(node.data);
        }
      });
    }
    return {
      checkedKeys: keys,
      checkedNodes: nodes,
    }
  }

  private getHalfChecked = (): {
    halfCheckedKeys: TreeKey[]
    halfCheckedNodes: TreeNodeData[]
  } => {
    const nodes: TreeNodeData[] = [];
    const keys: TreeKey[] = [];
    if (this.tree && this.showCheckbox) {
      const { treeNodeMap } = this.tree;
      this.indeterminateKeys.forEach((key) => {
        const node = treeNodeMap.get(key);
        if (node) {
          keys.push(key);
          nodes.push(node.data);
        }
      });
    }
    return {
      halfCheckedKeys: keys,
      halfCheckedNodes: nodes,
    }
  }

  private $setCheckedKeys = (keys: TreeKey[]) => {
    if (this.tree) {
      const { treeNodeMap } = this.tree;
      if (this.showCheckbox && treeNodeMap && keys?.length > 0) {
        for (const key of keys) {
          const node = treeNodeMap.get(key);
          if (node && !this.isChecked(node)) {
            this.toggleCheckbox(node, true, false, false);
          }
        }
        this.updateCheckedKeys();
      }
    }
  }

  private getKey = (node: TreeNodeData): TreeKey => {
    if (!node) {
      return '';
    }
    return node[this.valueKey];
  }

  private getLabel = (node: TreeNodeData): string => {
    return node?.[this.labelKey]
  }

  private getDisabled = (node: TreeNodeData): boolean => {
    return !!node?.[this.disabledKey];
  }

  private getChildren = (node: TreeNodeData): TreeNodeData[] => {
    return node?.[this.childrenKey];
  }

  private createTree = (data: TreeData): Tree => {
    const treeNodeMap: Map<TreeKey, TreeNode> = new Map();
    const levelTreeNodeMap: Map<number, TreeNode[]> = new Map();
    let maxLevel = 1;
    const traverse = (
      nodes: TreeData,
      level = 1,
      parent: TreeNode | undefined = undefined
    ): TreeNode[] => {
      const siblings: TreeNode[] = [];
      for (const rawNode of nodes) {
        const value = this.getKey(rawNode);
        const node: TreeNode = {
          level,
          key: value,
          data: rawNode
        };
        node.label = this.getLabel(rawNode);
        node.parent = parent;

        const children = this.getChildren(rawNode);
        node.disabled = this.getDisabled(rawNode);
        node.isLeaf = !children || children.length === 0;
        node.expanded = this.expandedKeys.includes(value);
        if (children && children.length) {
          node.children = traverse(children, level + 1, node);
        }
        siblings.push(node);
        treeNodeMap.set(value, node);
        if (!levelTreeNodeMap.has(level)) {
          levelTreeNodeMap.set(level, [])
        }
        levelTreeNodeMap.get(level)?.push(node);
      }
      if (level > maxLevel) {
        maxLevel = level;
      }
      return siblings;
    }

    const treeNodes: TreeNode[] = traverse(data);
    return {
      treeNodeMap,
      levelTreeNodeMap,
      maxLevel,
      treeNodes,
    }
  }

  private doFilter = (query: string) => {
    if (!isFunction(this.filterMethod)) {
      return;
    }

    const expandKeySet = new Set<TreeKey>();
    const hiddenExpandIconKeySet = new Set<TreeKey>(this.hiddenExpandIconKeys);
    const hiddenKeySet = new Set<TreeKey>(this.hiddenNodeKeys);
    const family: TreeNode[] = [];
    const nodes = this.tree.treeNodes || [];
    const filter = this.filterMethod;
    hiddenKeySet.clear();

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        family.push(node);
        if (filter?.(query, node.data, node)) {
          family.forEach((member) => {
            expandKeySet.add(member.key);
            member.expanded = true;
          });
        } else {
          node.expanded = false;
          if (node.isLeaf) {
            hiddenKeySet.add(node.key);
          }
        }
        const children = node.children;
        if (children) {
          traverse(children);
        }
        if (!node.isLeaf) {
          if (!expandKeySet.has(node.key)) {
            hiddenKeySet.add(node.key);
          } else if (children) {
            let allHidden = true;
            for (const childNode of children) {
              if (!hiddenKeySet.has(childNode.key)) {
                allHidden = false;
                break;
              }
            }
            if (allHidden) {
              hiddenExpandIconKeySet.add(node.key);
            } else {
              hiddenExpandIconKeySet.delete(node.key);
            }
          }
        }
        family.pop();
      });
    };
    traverse(nodes);
    this.hiddenNodeKeys = Array.from(hiddenKeySet);
    this.hiddenExpandIconKeys = Array.from(hiddenExpandIconKeySet);
    return Array.from(expandKeySet);
  }

  private isForceHiddenExpandIcon = (node: TreeNode): boolean => {
    return this.hiddenExpandIconKeys.includes(node.key);
  }

  private handleCurrentChange = (node: TreeNode) => {
    if (!this.isCurrent(node)) {
      this.currentKey = node.key;
      this.currentChangeEvent.emit({
        data: node.data,
        node,
      });
    }
  }

  private handleNodeClick = (e: CustomEvent<{
    node: TreeNode,
    event: MouseEvent
  }>) => {
    const { node, event } = e.detail;
    this.nodeClickEvent.emit({
      data: node.data,
      node,
      event,
    });
    this.handleCurrentChange(node);
    if (this.expandOnClickNode) {
      this.toggleExpand(node);
    }
    if (
      this.showCheckbox
      && (this.checkOnClickNode || (node.isLeaf && this.checkOnClickLeaf))
      && !node.disabled
    ) {
      this.toggleCheckbox(node, !this.isChecked(node), true);
    }
  }

  private handleNodeToggleExpand = (e: CustomEvent<{
    node: TreeNode
  }>) => {
    const { node } = e.detail;
    this.toggleExpand(node);
  }

  private handleNodeCheck = (e: CustomEvent<{
    node: TreeNode,
    checked: CheckboxValueType
  }>) => {
    const { node, checked } = e.detail;
    this.toggleCheckbox(node, checked);
  }

  private handleNodeDrop = (e: CustomEvent<{
    node: TreeNode,
    event: DragEvent
  }>) => {
    const { node, event } = e.detail;
    this.nodeDropEvent.emit({
      data: node.data,
      node,
      event,
    });
  }

  private handleItemRender = (params: {
    data: any[];
    index: number;
    isScrolling: boolean;
    style: Record<string, any>;
  }) => {
    if (this.itemRender) {
      return this.itemRender(params);
    }
    const { data, index, style } = params;
    const treeNode = data[index];
    return (<zane-tree-node
      key={treeNode.key}
      style={style}
      node={treeNode}
      expanded={treeNode.expanded}
      showCheckbox={this.showCheckbox}
      checked={this.isChecked(treeNode)}
      indeterminate={this.isIndeterminate(treeNode)}
      itemSize={this.itemSize}
      disabled={this.isDisabled(treeNode)}
      current={this.isCurrent(treeNode)}
      hiddenExpandIcon={this.isForceHiddenExpandIcon(treeNode)}
      onZClick={this.handleNodeClick}
      onZToggle={this.handleNodeToggleExpand}
      onZCheck={this.handleNodeCheck}
      onZDrop={this.handleNodeDrop}
    ></zane-tree-node>);
  }

  render() {
    return (
      <Host
        class={classNames(
          ns.b(),
          {
            [ns.m('highlight-current')]: this.highlightCurrent
          }
        )}
        role="tree"
      >
        {
          this.isNotEmpty
            ? (
              <zane-virtual-list
                ref={(el) => (this.listRef = el)}
                isSized={true}
                wrapperClass={ns.b('virtual-list')}
                data={this.flattenTree}
                total={this.flattenTree.length}
                height={this.height}
                itemSize={this.itemSize}
                perfMode={this.perfMode}
                scrollbarAlwaysOn={this.scrollbarAlwaysOn}
                itemRender={this.handleItemRender}
              ></zane-virtual-list>
            )
            : (
              <div class={ns.e('empty-block')}>
                <slot name="empty">
                  <span class={ns.e('empty-text')}>
                    { this.emptyText ?? t('tree.emptyText')}
                  </span>
                </slot>
              </div>
            )
        }

      </Host>
    );
  }
}
