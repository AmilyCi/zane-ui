import { Component, Element, Event, h, Prop, type EventEmitter } from '@stencil/core';
import type { Option, SelectContext } from './types';
import type { ReactiveObject } from '../../utils';
import { getSelectContext } from './utils';
import classnames from 'classnames';
import { useNamespace } from '../../hooks';

const ns = useNamespace('select');

@Component({
  tag: 'zane-select-option-item',
  styleUrl: 'zane-select-option-item.scss'
})
export class ZaneSelectOptionItem {
  @Element() el: HTMLElement;

  @Prop() data: any[];

  @Prop() disabled: boolean;

  @Prop() hovering: boolean;

  @Prop() item: Option;

  @Prop() index: number;

  @Prop({ attribute: 'style' }) zStyle: Record<string, any>;

  @Prop() selected: boolean;

  @Prop() created: boolean;

  @Prop() optionRender: (item: Option, index: number, disabled: boolean) => HTMLElement;

  @Event({ eventName: 'zHover' }) hoverEvent: EventEmitter<number>;

  @Event({ eventName: 'zSelect' }) selectEvent: EventEmitter<{
    value: Option,
    index: number
  }>;

  private selectContext: ReactiveObject<SelectContext>;

  private itemWrapperRef: HTMLDivElement;

  private handleHoverItem = () => {
    if (!this.disabled) {
      this.hoverEvent.emit(this.index);
    }
  }

  private handleOptionClick = () => {
    if (!this.disabled) {
      this.selectEvent.emit({
        value: this.item,
        index: this.index
      });
    }
  }

  private handleOptionRender = (item: Option, index: number, disabled: boolean) => {
    if (this.optionRender) {
      const optionRenderResult = this.optionRender(item, index, disabled);
      if (optionRenderResult) {
        this.itemWrapperRef.appendChild(optionRenderResult);
      }
    }
  }

  componentWillLoad() {
    this.selectContext = getSelectContext(this.el);
  }

  render() {
    return (
      <div
        ref={(el) => this.itemWrapperRef = el}
        id={`${this.selectContext?.value.contentId}-${this.index}`}
        role="option"
        ariaSelected={this.selected}
        ariaDisabled={this.disabled || undefined}
        style={this.zStyle}
        class={classnames(
          ns.be('dropdown', 'item'),
          ns.is('selected', this.selected),
          ns.is('disabled', this.disabled),
          ns.is('created', this.created),
          ns.is('hovering', this.hovering)
        )}
        onMouseMove={this.handleHoverItem}
        onClick={this.handleOptionClick}
      >
        {
          this.optionRender
            ? this.handleOptionRender(this.item, this.index, this.disabled)
            : (<span>{this.item.label}</span>)
        }
      </div>
    );
  }
}
