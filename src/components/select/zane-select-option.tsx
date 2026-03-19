import { Component, h, Host, Prop, State, Element, Method, Watch } from '@stencil/core';
import type { SelectContext, SelectGroupContext, SelectOptionValue } from './types';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import { useNamespace } from '../../hooks';
import { getSelectContext, getSelectGroupContext } from './utils';
import { castArray, isObject, throwError } from '../../utils';
import state from '../../global/store';
import classNames from 'classnames';
import get from 'lodash-es/get';
import { escapeStringRegexp } from '../select-virtual/utils';

const ns = useNamespace('select');

const COMPONENT_NAME = 'zane-select-option';

@Component({
  tag: 'zane-select-option',
  styleUrl: 'zane-select-option.scss'
})
export class ZaneSelectOption {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) value: SelectOptionValue;

  @Prop() label: string | number;

  @Prop() created: boolean;

  @Prop() disabled: boolean;

  @State() index = -1;

  @State() visible = true;

  @State() groupDisabled = false;

  @State() hover = false;

  @State() itemSelected = false;

  @State() isDisabled = false;

  @State() currentLabel: string | number | boolean = '';

  private selectContext: ReactiveObject<SelectContext>;

  private selectGroupContext: ReactiveObject<SelectGroupContext>;

  @Watch('disabled')
  handleWatchDisabled() {
    this.updateDisabled();
  }

  @Watch('groupDisabled')
  handleWatchGroupDisabled() {
    this.updateDisabled();
  }

  @Watch('itemSelected')
  handleWatchItemSelected() {
    this.updateDisabled();
  }

  @Watch('value')
  handleWatchValue() {
    this.updateItemSelected();
  }

  @Watch('currentLabel')
  handleWatchCurrentLabel() {
    if (!this.created && !this.selectContext?.value.remote) {
      this.selectContext?.value.setSelected();
    }
  }

  @Watch('visible')
  handleWatchVisible() {
    this.selectGroupContext?.value.updateVisible();
  }

  @Method()
  async getVisible() {
    return this.visible;
  }

  @Method()
  async setHover(hover: boolean) {
    this.hover = hover;
  }

  @Method()
  async getDisabled() {
    return this.isDisabled;
  }

  @Method()
  async getGroupDisabled() {
    return this.groupDisabled;
  }

  @Method()
  async updateOption(query: string) {
    const regexp = new RegExp(escapeStringRegexp(query), 'i');
    this.visible = regexp.test(String(this.currentLabel)) || this.created
  }

  private contains = (arr, target) => {
    if (!isObject(this.value)) {
      return arr && arr.includes(target);
    } else {
      const valueKey = this.selectContext?.value.valueKey;
      return (
        arr &&
        arr.some((item) => get(item, valueKey) === get(target, valueKey))
      )
    }
  }

  private updateItemSelected = () => {
    this.itemSelected = this.contains(castArray(this.selectContext?.value.value), this.value);
  }

  private updateDisabled = () => {
    this.isDisabled = this.disabled || this.groupDisabled || this.getLimitReached();
  }

  private updateCurrentLabel = () => {
    this.currentLabel = this.label ?? (isObject(this.value) ? '' : this.value)
  }

  private updateGroupDisabled  = () => {
    this.groupDisabled = this.selectGroupContext?.value.disabled;
  }

  private getLimitReached = () => {
    if (this.selectContext?.value.multiple) {
      const value = castArray(this.selectContext.value.value ?? []);
      return !this.itemSelected &&
        value.length >= this.selectContext.value.multipleLimit &&
        this.selectContext.value.multipleLimit > 0;
    }
    return false;
  }

  private hoverItem = () => {
    if (!this.isDisabled && this.selectContext) {
      this.selectContext.value.hoveringIndex = this.selectContext.value.optionsArray.indexOf(this.el as HTMLZaneSelectOptionElement)
    }
  }

  private selectOptionClick = () => {
    if (!this.isDisabled) {
      this.selectContext.value.handleOptionSelect(this.el as HTMLZaneSelectOptionElement);
    }
  }

  componentWillLoad() {
    this.selectContext = getSelectContext(this.el);
    this.selectGroupContext = getSelectGroupContext(this.el);

    if (!this.selectContext) {
      throwError(
        COMPONENT_NAME,
        'usage: <zane-select><zane-select-option></zane-select-option></zane-select>'
      );
    };

    this.updateItemSelected();
    this.updateDisabled();
    this.updateItemSelected();
    this.updateCurrentLabel();
    this.updateGroupDisabled();

    this.selectContext?.change$.subscribe(({ key }) => {
      if (key === 'value') {
        this.updateItemSelected();
        this.updateDisabled();
      }
      if (key === 'multiple' || key === 'multipleLimit') {
        this.updateDisabled();
      }
    });

    this.selectGroupContext?.change$.subscribe(({key}) => {
      if (key === 'disabled') {
        this.updateGroupDisabled();
      }
    });
  }

  render() {
    return (
      <Host
        id={`${ns.namespace}-id-${state.idInjection.prefix}-${state.idInjection.current++}`}
        class={classNames(
          ns.be('dropdown', 'item'),
          ns.is('disabled', this.isDisabled),
          ns.is('selected', this.itemSelected),
          ns.is('hovering', this.hover)
        )}
        role="option"
        ariaDisabled={this.disabled || undefined}
        ariaSelected={this.itemSelected}
        style={{
          display: this.visible ? undefined : 'none'
        }}
      >
        <div
          onMouseMove={this.hoverItem}
          onClick={this.selectOptionClick}
        >
          { this.currentLabel }
        </div>
      </Host>
    );
  }
}
