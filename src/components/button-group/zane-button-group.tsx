import type { ButtonType, ComponentSize } from '../../types';

import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { buttonGroupContexts } from '../../constants';
import { useNamespace } from '../../hooks';
import { ButtonGroupContext } from './button-group-context';

const ns = useNamespace('button');

@Component({
  styleUrl: 'zane-button-group.scss',
  tag: 'zane-button-group',
})
export class ZaneButtonGroup {
  @Element() el: HTMLElement;
  @Prop() size: ComponentSize;

  @Prop() type: ButtonType;

  componentWillLoad() {
    const context = new ButtonGroupContext();
    context.updateSize(this.size);
    context.updateType(this.type);
    buttonGroupContexts.set(this.el, context);
  }

  disconnectedCallback() {
    buttonGroupContexts.delete(this.el);
  }

  @Watch('size')
  handleWatchSize() {
    buttonGroupContexts.get(this.el)?.updateSize(this.size);
  }

  @Watch('type')
  handleWatchType() {
    buttonGroupContexts.get(this.el)?.updateType(this.type);
  }

  render() {
    return (
      <Host class={ns.b('group')}>
        <slot></slot>
      </Host>
    );
  }
}
