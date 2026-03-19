import { Component, Element, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import type {
  TreeSelectOptionValue,
  TreeSelectOptionProps,
  TagTooltipProps,
  TreeData,
  TreeKey,
  FilterMethod,
  TreeNodeData,
  TreeNode
} from './types';
import type { Props } from 'tippy.js';
import type { ComponentSize } from '../../types';
import { defaultProps } from './constants';
import { useNamespace } from '../../hooks';
import tippy from 'tippy.js';
import { escapeStringRegexp, isValidValue, toValidArray, treeFind } from './utils';
import type { CheckedInfo } from '../tree/types';
import type { CheckboxValueType } from '../checkbox/types';
import { nextFrame } from '../../utils';
import isEqual from 'lodash-es/isEqual';

const ns = useNamespace('tree-select')

@Component({
  tag: 'zane-tree-select',
  styleUrl: 'zane-tree-select.scss'
})
export class ZaneTreeSelect {
  @Element() el: HTMLElement;

  @Prop() name: string;

  @Prop({ attribute: 'id' }) zId: string;

  @Prop({ mutable: true })
  value: TreeSelectOptionValue | TreeSelectOptionValue[] = undefined;

  @Prop() autocomplete: string = 'off';

  @Prop() automaticDropdown: boolean;

  @Prop() size: ComponentSize;

  @Prop() disabled: boolean = undefined;

  @Prop() clearable: boolean;

  @Prop() clearIcon: string = 'close-circle-line';

  @Prop() allowCreate: boolean;

  @Prop() loading: boolean;

  @Prop() popperTheme: string;

  @Prop() popperOptions: Props['popperOptions'] = {};

  @Prop() debounce: number = 300;

  @Prop() loadingText: string;

  @Prop() noMatchText: string;

  @Prop() noDataText: string;

  @Prop() remote: boolean;

  @Prop() remoteMethod: (query) => any;

  @Prop() filterable: boolean;

  @Prop() filterMethod: (query) => any;

  @Prop() multiple: boolean;

  @Prop() multipleLimit: number = 0;

  @Prop() placeholder: string;

  @Prop() defaultFirstOption: boolean;

  @Prop() reserveKeyword: boolean = true;

  @Prop() valueKey: string = 'value';

  @Prop() collapseTags: boolean;

  @Prop() collapseTagsTooltip: boolean;

  @Prop() tagTooltip: TagTooltipProps = {};

  @Prop() maxCollapseTags: number = 1;

  @Prop() fitInputWidth: boolean;

  @Prop() suffixIcon: string = 'arrow-down-s-line';

  @Prop() tagType: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'info';

  @Prop() tagEffect: 'dark' | 'light' | 'plain' = 'light';

  @Prop() validateEvent: boolean = true;

  @Prop() remoteShowSuffix: boolean;

  @Prop() showArrow: boolean = false;

  @Prop() offset: Props['offset'] = tippy.defaultProps.offset;

  @Prop() placement: Props['placement'] = 'bottom-start';

  @Prop({ attribute: 'tabIndex'}) zTabIndex: number = 0;

  @Prop() appendTo: Props['appendTo'] = tippy.defaultProps.appendTo;

  @Prop() options: Record<string, any>[];

  @Prop() props: TreeSelectOptionProps = { ...defaultProps };

  @Prop() emptyValues: any[];

  @Prop() valueOnClear: any = undefined;

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @Prop() data: TreeData = [];

  @Prop() cacheData: TreeData = [];

  @Prop() emptyText: string;

  @Prop() height: number;

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

  @Prop() perfMode: boolean = true;

  @Prop() scrollbarAlwaysOn: boolean = false;

  @Prop() filterNodeMethod: FilterMethod;

  @Prop() tagRender: () => HTMLElement;

  @Prop() tagLabelRender: (
    label: string | number | boolean,
    value: TreeSelectOptionValue,
    index: number
  ) => HTMLElement;

  @Event({ eventName: 'zChange', bubbles: false })
  changeEvent: EventEmitter<any>;

  @Event({ eventName: 'zRemoveTag', bubbles: false })
  removeTagEvent: EventEmitter<any>;

  @Event({ eventName: 'zClear', bubbles: false })
  clearEvent: EventEmitter<any>;

  @Event({ eventName: 'zFocus', bubbles: false })
  focusEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zPopupScroll', bubbles: false })
  popupScrollEvent: EventEmitter<{scrollTop: number; scrollLeft: number}>;

  @Event({ eventName: 'zBlur', bubbles: false })
  blurEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zVisibleChange', bubbles: false })
  visibleChangeEvent: EventEmitter<boolean>;

  @Event({ eventName: "zCompositionEnd", bubbles: false })
  compositionendEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionStart", bubbles: false })
  compositionstartEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionUpdate", bubbles: false })
  compositionupdateEvent: EventEmitter<CompositionEvent>;

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

  @State() propsMap: TreeSelectOptionProps;

  private selectRef: HTMLZaneSelectElement;

  private treeRef: HTMLZaneTreeElement;

  private hasPrefixSlot = false;

  private hasHeaderSlot = false;

  private hasLoadingSlot = false;

  private hasFooterSlot = false;

  @Watch('props')
  @Watch('valueKey')
  handleUpdatePropsMap() {
    this.propsMap = {
      value: this.valueKey || 'value',
      label: 'label',
      disabled: 'disabled',
      isLeaf: 'isLeaf',
      ...this.props,
    }
  }

  @Watch('value')
  handleWatchValue() {
    if (this.showCheckbox) {
      nextFrame(async () => {
        if (this.treeRef) {
          const checkedKeys = await this.treeRef.getCheckedKeys();
          if (!isEqual(checkedKeys, toValidArray(this.value))) {
            this.treeRef.setCheckedKeys(toValidArray(this.value));
          }
        }
      });
    }
  }

  private getNodeValByProp = (
    prop: 'value' | 'label' | 'children' | 'disabled' | 'isLeaf',
    data: TreeNodeData
  ) => {
    const propVal = this.propsMap[prop]
    return data[propVal as string]
  }

  private handleNodeClick = (e: CustomEvent<{
    data: TreeNodeData
    node: TreeNode
    event: MouseEvent
  }>) => {
    this.nodeClickEvent.emit(e.detail);
    const { node, data } = e.detail;
    if (this.showCheckbox && this.checkOnClickNode) {
      return;
    }

    if (!this.showCheckbox && (this.checkStrictly || node.isLeaf)) {
      if (!this.getNodeValByProp('disabled', data)) {
        this.selectRef?.handleOptionSelect({
          value: this.getNodeValByProp('value', data),
          label: this.getNodeValByProp('label', data),
        });
      }
    }
  }

  private handleNodeExpand = () => {

  }

  private handleNodeCheck = () => {

  }

  componentWillLoad() {
    this.hasPrefixSlot = !!this.el.querySelector('[slot="prefix"]');
    this.hasHeaderSlot = !!this.el.querySelector('[slot="header"]');
    this.hasFooterSlot = !!this.el.querySelector('[slot="footer"]');
    this.hasLoadingSlot = !!this.el.querySelector('[slot="loading"]');

    this.handleUpdatePropsMap();
  }

  async componentDidRender() {
    const selectContext = await this.selectRef?.getContext();
    console.log(selectContext)
    if (selectContext) {

    }
  }

  render() {
    const defaultExpandedParentKeys = toValidArray(this.value).map((value) => {
      return treeFind(
        this.data || [],
        (data) => this.getNodeValByProp('value', data) === value,
        (data) => this.getNodeValByProp('children', data),
        (_, __, ___, parent) => {
          return parent && this.getNodeValByProp('value', parent)
        }
      )
    }).filter((item) => isValidValue(item));
    return (
      <zane-select
        ref={(el) => (this.selectRef = el)}
        class={ns.b()}
        zId={this.zId}
        name={this.name}
        value={this.value}
        autocomplete={this.autocomplete}
        automaticDropdown={this.automaticDropdown}
        size={this.size}
        disabled={this.disabled}
        clearable={this.clearable}
        clearIcon={this.clearIcon}
        allowCreate={this.allowCreate}
        loading={this.loading}
        loadingText={this.loadingText}
        popperTheme={this.popperTheme}
        popperOptions={this.popperOptions}
        popperBoxClass={ns.b('tippy-box')}
        popperContentClass={ns.b('tippy-content')}
        debounce={this.debounce}
        noMatchText={this.noMatchText}
        noDataText={this.noDataText}
        remote={this.remote}
        remoteMethod={this.remoteMethod}
        filterable={this.filterable}
        filterMethod={(keyword = '') => {
          if (this.filterMethod) {
            this.filterMethod(keyword);
          } else if (this.remoteMethod) {
            this.remoteMethod(keyword);
          } else {
            this.treeRef?.filter(keyword);
          }
        }}
        multiple={this.multiple}
        multipleLimit={this.multipleLimit}
        placeholder={this.placeholder}
        defaultFirstOption={this.defaultFirstOption}
        reserveKeyword={this.reserveKeyword}
        valueKey={this.valueKey}
        collapseTags={this.collapseTags}
        collapseTagsTooltip={this.collapseTagsTooltip}
        tagTooltip={this.tagTooltip}
        maxCollapseTags={this.maxCollapseTags}
        fitInputWidth={this.fitInputWidth}
        suffixIcon={this.suffixIcon}
        tagType={this.tagType}
        tagEffect={this.tagEffect}
        validateEvent={this.validateEvent}
        remoteShowSuffix={this.remoteShowSuffix}
        showArrow={this.showArrow}
        offset={this.offset}
        placement={this.placement}
        zTabIndex={this.zTabIndex}
        appendTo={this.appendTo}
        props={this.props}
        emptyValues={this.emptyValues}
        valueOnClear={this.valueOnClear}
        label={this.label}
        ariaLabel={this.ariaLabel}
        tagRender={this.tagRender}
        tagLabelRender={this.tagLabelRender}
        onZChange={(e) => {
          this.value = e.detail;
          this.changeEvent.emit(e.detail);
        }}
        onZRemoveTag={(e) => this.removeTagEvent.emit(e.detail)}
        onZClear={(e) => this.clearEvent.emit(e.detail)}
        onZFocus={(e) => this.focusEvent.emit(e.detail)}
        onZPopupScroll={(e) => this.popupScrollEvent.emit(e.detail)}
        onZBlur={(e) => this.blurEvent.emit(e.detail)}
        onZVisibleChange={(e) => {
          this.visibleChangeEvent.emit(e.detail);
          this.treeRef?.zScrollTo(0);
        }}
        onZCompositionEnd={(e) => this.compositionendEvent.emit(e.detail)}
        onZCompositionStart={(e) => this.compositionstartEvent.emit(e.detail)}
        onZCompositionUpdate={(e) => this.compositionupdateEvent.emit(e.detail)}
      >
        {
          this.hasPrefixSlot && <slot name="prefix" slot="prefix"></slot>
        }
        {
          this.hasHeaderSlot && <slot name="header" slot="header"></slot>
        }
        {
          this.hasLoadingSlot && <slot name="loading" slot="loading"></slot>
        }
        {
          this.hasFooterSlot && <slot name="footer" slot="footer"></slot>
        }
        <div
          style={{ display: 'none' }}
        >
          <zane-select-option></zane-select-option>
        </div>
        <zane-tree
          ref={(el) => (this.treeRef = el)}
          data={this.data}
          emptyText={this.emptyText}
          height={this.height}
          props={this.props}
          highlightCurrent={this.highlightCurrent}
          showCheckbox={this.showCheckbox}
          defaultCheckedKeys={this.defaultCheckedKeys}
          defaultExpandedKeys={
            this.defaultExpandedKeys
              ? this.defaultExpandedKeys.concat(defaultExpandedParentKeys)
              : defaultExpandedParentKeys
          }
          checkStrictly={this.checkStrictly}
          indent={this.indent}
          itemSize={this.itemSize}
          icon={this.icon}
          expandOnClickNode={!this.checkStrictly && this.expandOnClickNode}
          checkOnClickNode={this.checkOnClickNode}
          checkOnClickLeaf={this.checkOnClickLeaf}
          currentNodeKey={this.currentNodeKey}
          accordion={this.accordion}
          filterMethod={(value, data, node) => {
            if (this.filterNodeMethod) {
              return this.filterNodeMethod(value, data, node);
            }
            if (!value) {
              return true;
            }
            const regexp = new RegExp(escapeStringRegexp(value), 'i')
            return regexp.test(this.getNodeValByProp('label', data) || '')
          }}
          onZNodeClick={this.handleNodeClick}
          onZNodeCheck={this.handleNodeCheck}
          onZNodeExpand={this.handleNodeExpand}
        ></zane-tree>
      </zane-select>
    );
  }
}
