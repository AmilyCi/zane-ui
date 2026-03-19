import { Component, h, Element, Host, State } from '@stencil/core';
import { useNamespace } from '../../hooks';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { SelectContext } from './types';
import { getSelectContext } from './utils';
import classNames from 'classnames';
import { BORDER_HORIZONTAL_WIDTH } from '../../constants';

const ns = useNamespace('select');

@Component({
  tag: 'zane-select-dropdown',
  styleUrl: 'zane-select-dropdown.scss'
})
export class ZaneSelectDropdown {
  @Element() el: HTMLElement;

  @State() multiple = false;

  @State() fitInputWidth = false;

  @State() minWidth = '';

  private selectContext: ReactiveObject<SelectContext>;

  private hasHeaderSlot = false;

  private hasFooterSlot = false;

  private updateMinWidth = () => {
    const offsetWidth = this.selectContext?.value.selectRef?.offsetWidth;
    if (offsetWidth) {
      this.minWidth = `${offsetWidth - BORDER_HORIZONTAL_WIDTH}px`;
    } else {
      this.minWidth = '';
    }
  }

  componentWillLoad() {
    this.hasHeaderSlot = !!this.el.querySelector('[slot="header"]');
    this.hasFooterSlot = !!this.el.querySelector('[slot="footer"]');

    this.selectContext = getSelectContext(this.el);
    this.multiple = this.selectContext?.value.multiple;
    this.fitInputWidth = this.selectContext?.value.fitInputWidth;

    this.updateMinWidth();

    this.selectContext?.change$.subscribe(({ key, value }) => {
      if (key === 'multiple') {
        this.multiple = value;
      }
      if (key === 'fitInputWidth') {
        this.fitInputWidth = value;
      }
      if (key === 'selectRef') {
        this.updateMinWidth();
      }
    });
  }

  render() {
    return (
      <Host
        class={classNames(ns.b('dropdown'), ns.is('multiple'))}
        style={{
          [this.fitInputWidth ? 'width' : 'minWidth']: this.minWidth
        }}
      >
        {
          this.hasHeaderSlot && (<div class={ns.be('dropdown', 'header')}>
            <slot name="header"></slot>
          </div>)
        }
        <slot></slot>
        {
          this.hasFooterSlot && (<div class={ns.be('dropdown', 'footer')}>
            <slot name="footer"></slot>
          </div>)
        }
      </Host>
    );
  }
}
