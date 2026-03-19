import { Component, Element, h, Prop, State, type FunctionalComponent, Method, Watch } from '@stencil/core';
import type { SelectContext, Option } from './types';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import { getSelectContext } from './utils';
import { useNamespace } from '../../hooks';
import classNames from 'classnames';
import { getEventCode, isIOS, isObject, isUndefined } from '../../utils';
import { EVENT_CODE } from '../../constants';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';

const ns = useNamespace('select');

@Component({
  tag: 'zane-select-menu',
  styleUrl: 'zane-select-menu.scss'
})
export class ZaneSelectMenu {
  @Element() el: HTMLElement;

  @Prop() loading: boolean;

  @Prop() data: any[];

  @Prop() hoveringIndex: number;

  @Prop() width: number;

  @Prop({ attribute: 'id'}) zId: string;

  @Prop() ariaLabel: string;

  @State() cachedHeights: number[] = [];

  @State() size: number;

  @State() multiple: boolean;

  @State() isSized: boolean;

  private selectContext: ReactiveObject<SelectContext>;

  private listRef: HTMLZaneVirtualListElement;


  @Watch('hoveringIndex')
  handleHoveringIndexChange() {

  }

  @Method()
  async getListRef() {
    return this.listRef;
  }

  @Method()
  async getIsSized() {
    return this.isSized;
  }

  @Method()
  async zScrollToItem(index: number) {
    if (this.listRef) {
      this.listRef.zScrollToItem(index);
    }
  }

  private contains = (arr: any[] = [], target: any) => {
    const valueKey = this.selectContext?.value.valueKey;
    if (!isObject(target)) {
      return arr.includes(target);
    }

    return (
      arr &&
      arr.some((item) => {
        return get(item, valueKey) === get(target, valueKey);
      })
    );
  }

  private _isItemSelected = (value, target) => {
    const targetValue = this.selectContext?.value.getValue(target);
    if (this.selectContext?.value.multiple) {
      return this.contains(value, targetValue);
    }
    return isEqual(value, targetValue);
  }

  @Method()
  async isItemSelected(value, target) {
    return this._isItemSelected(value, target);
  }

  private _isItemDisabled = (value, selected) => {
    const disabled = this.selectContext?.value.disabled;
    const multiple = this.selectContext?.value.multiple;
    const multipleLimit = this.selectContext?.value.multipleLimit;

    return (disabled ||
      (!selected && (multiple ? multipleLimit > 0 && value.length >= multipleLimit : false))
    )
  }

  @Method()
  async isItemDisabled(value, selected) {
    return this._isItemDisabled(value, selected);
  }

  private _isItemHovering = (target: number) => {
    return this.hoveringIndex === target;
  }

  @Method()
  async isItemHovering(target) {
    return this._isItemHovering(target);
  }

  @Method()
  async resetScrollTop() {
    if (this.listRef) {
      this.listRef.resetScrollTop();
    }
  }

  private handleItemSelect = (event: CustomEvent<{
    value: Option;
    index: number;
  }>) => {
    this.selectContext?.value.onSelect(event.detail.value);
  }

  private handleItemHover = (event: CustomEvent<number>) => {
    this.selectContext?.value.onHover(event.detail)
  }

  private handleItemRender = (data: {
    data: any[];
    index: number;
    isScrolling: boolean;
    style: Record<string, any>;
  }) => {
    const Item: FunctionalComponent = (props: any) => {
      const { data, index, style } = props;
      const sized = this.isSized;
      const listProps = this.isSized
        ? {
          itemSize: this.selectContext?.value.itemHeight,
        }
        : {
          itemSize: (idx: number) => this.cachedHeights[idx],
          estimatedSize: this.selectContext?.value.estimatedOptionHeight
        }
      const { itemSize, estimatedSize } = listProps;
      const { value } = this.selectContext?.value || {};
      const item = data[index];

      if (item.type === 'Group') {
        return (<zane-select-group-item
          item={item}
          style={style}
          zHeight={sized ? (itemSize as number) : estimatedSize}
        ></zane-select-group-item>);
      }

      const isSelected = this._isItemSelected(value, item);
      const isDisabled = this._isItemDisabled(value, isSelected);
      const isHovering = this._isItemHovering(index);
      const getDisabled = this.selectContext?.value.getDisabled;

      return (<zane-select-option-item
        data={data}
        index={index}
        style={style}
        key={index}
        selected={isSelected}
        disabled={getDisabled?.(item) || isDisabled}
        created={!!item.created}
        hovering={isHovering}
        item={item}
        onZSelect={this.handleItemSelect}
        onZHover={this.handleItemHover}
      ></zane-select-option-item>)
    }
    return <Item {...data}></Item>
  }

  private onEscOrTab = () => { }

  private onForward = () => {
    this.selectContext?.value.onKeyboardNavigate('forward');
  }

  private onBackward = () => {
    this.selectContext?.value.onKeyboardNavigate('backward');
  }

  private onKeydown = (e: KeyboardEvent) => {
    const code = getEventCode(e);

    const { tab, esc, down, up, enter, numpadEnter } = EVENT_CODE;

    if ([esc, down, up, enter, numpadEnter].includes(code)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch(code) {
      case tab:
      case esc:
        this.onEscOrTab();
        break;
      case down:
        this.onForward();
        break;
      case up:
        this.onBackward();
        break;
      case enter:
      case numpadEnter:
        this.selectContext?.value.onKeyboardSelect();
        break;
    }
  }

  componentWillLoad() {
    this.selectContext = getSelectContext(this.el);

    this.multiple = this.selectContext?.value.multiple;
    this.isSized = isUndefined(this.selectContext?.value.estimatedOptionHeight);

    this.selectContext?.change$.subscribe(({ key, value}) => {
      switch(key) {
        case 'multiple':
          this.multiple = value;
          break;
        case 'estimatedOptionHeight':
          this.isSized = isUndefined(value);
          break;
        default:
          break;
      }
    });
  }

  render() {
    const listProps: any = {};
    if (this.isSized) {
      listProps.itemSize = this.selectContext?.value.itemHeight;
    } else {
      listProps.itemSize = (index: number) => this.cachedHeights[index];
      listProps.estimatedSize = this.selectContext?.value.estimatedOptionHeight;
    }

    return (
      <div
        class={classNames(
          ns.b('dropdown'),
          ns.is('multiple', this.multiple)
        )}
        style={{
          width: `${this.width}px`
        }}
      >
        <slot name='header'></slot>
        {
          this.loading
            ? (<slot name='loading'></slot>)
            : !this.data?.length
              ? (<slot name='empty'></slot>)
              : (
                <zane-virtual-list
                  ref={el => this.listRef = el}
                  wrapperClass={ns.be('dropdown', 'list')}
                  scrollbarAlwaysOn={isIOS ? true : this.selectContext?.value.scrollbarAlwaysOn}
                  data={this.data}
                  width={this.width}
                  height={this.selectContext?.value.height}
                  total={this.data.length}
                  isSized={this.isSized}
                  innerElement='div'
                  innerProps={{
                    id: this.zId,
                    role: 'listbox',
                    'aria-label': this.ariaLabel,
                    'aria-orientation': 'vertical'
                  }}
                  {
                    ...listProps
                  }
                  itemRender={this.handleItemRender}
                  onKeyDown={this.onKeydown}
                >
                </zane-virtual-list>
              )
        }
        <slot name='footer'></slot>
      </div>
    );
  }
}
