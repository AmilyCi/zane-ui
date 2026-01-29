import type { ComponentSize } from '../../types';

import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { useNamespace } from '../../hooks';
import type { ButtonGroupContext, ButtonType } from './types';
import { ReactiveObject } from '../../utils';
import { buttonGroupContexts } from './constants';

const ns = useNamespace('button');

@Component({
  styleUrl: 'zane-button-group.scss',
  tag: 'zane-button-group',
})
export class ZaneButtonGroup {
  @Element() el: HTMLElement;
  @Prop() size: ComponentSize;

  @Prop() type: ButtonType;

  @Prop() disabled: boolean;

  private context: ReactiveObject<ButtonGroupContext>;

  componentWillLoad() {
    this.context = new ReactiveObject<ButtonGroupContext>({
      size: this.size,
      type: this.type,
      disabled: this.disabled,
    });
    buttonGroupContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    buttonGroupContexts.delete(this.el);
  }

  @Watch('size')
  handleWatchSize() {
    this.context.value.size = this.size;
  }

  @Watch('type')
  handleWatchType() {
    this.context.value.type = this.type;
  }

  @Watch('disabled')
  handleWatchDisabled() {
    this.context.value.disabled = this.disabled;
  }

  render() {
    return (
      <Host class={ns.b('group')}>
        <slot></slot>
      </Host>
    );
  }
}
