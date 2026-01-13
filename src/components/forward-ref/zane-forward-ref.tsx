import type { ForwardRefSetter } from '../../types';

import { Component, Element, h, Prop } from '@stencil/core';

import { forwardRefContexts } from '../../constants';
import { ForwardRefContext } from './forwardRefContext';

@Component({
  shadow: false,
  tag: 'zane-forward-ref',
})
export class ZaneForwardRef {
  @Element() el!: HTMLElement;

  // 接收外部传递的 ref 设置函数
  @Prop() setForwardRef!: ForwardRefSetter;

  componentWillLoad() {
    const context = new ForwardRefContext();
    context.setForwardRef = this.setForwardRef;
    forwardRefContexts.set(this.el, context);
  }

  disconnectedCallback() {
    forwardRefContexts.delete(this.el);
  }

  render() {
    return <slot></slot>;
  }
}
