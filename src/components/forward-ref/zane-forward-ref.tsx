import type { ForwardRefContext, ForwardRefSetter } from './types';

import { Component, Element, h, Method, Prop } from '@stencil/core';

import { forwardRefContexts } from './constants';
import { hasRawParent, ReactiveObject } from '../../utils';

@Component({
  shadow: false,
  tag: 'zane-forward-ref',
})
export class ZaneForwardRef {
  @Element() el!: HTMLElement;

  // 接收外部传递的 ref 设置函数
  @Prop() setForwardRef!: ForwardRefSetter;

  private context: ReactiveObject<ForwardRefContext>

  @Method()
  async getContext() {
    return this.context;
  }

  componentWillLoad() {
    this.context = new ReactiveObject<ForwardRefContext>({
      setForwardRef: this.setForwardRef
    });
    forwardRefContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    if (!hasRawParent(this.el)) {
      forwardRefContexts.delete(this.el);
      this.context = null;
    }
  }

  render() {
    return <slot></slot>;
  }
}
