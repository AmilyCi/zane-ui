import type { ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';

import { Component, Element, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';
import { formContexts } from '../form/constants';

const ns = useNamespace('text');

@Component({
  styleUrl: 'zane-text.scss',
  tag: 'zane-text',
})
export class ZaneText {
  @Element() el: HTMLElement;

  @Prop() lineClamp: string;

  @Prop() size: ComponentSize = '';

  @Prop() truncated: boolean;

  @Prop() type: '' | 'danger' | 'info' | 'primary' | 'success' | 'warning' = '';

  get formContext(): FormContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-FORM') {
        context = formContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  get textSize() {
    return this.size || this.formContext?.size || 'default';
  }

  componentDidLoad() {
    this.bindTitle();
  }

  componentDidUpdate() {
    this.bindTitle();
  }

  render() {
    const textKls = [
      ns.b(),
      ns.m(this.type),
      ns.m(this.textSize),
      ns.is('truncated', this.truncated),
      ns.is('line-clamp', this.lineClamp !== undefined),
    ].join(' ');

    return (
      <Host class={textKls} style={{ '-webkit-line-clamp': this.lineClamp }}>
        <slot></slot>
      </Host>
    );
  }

  private bindTitle() {
    if (this.el.title) {
      return;
    }
    let shouldAddTitle = false;
    const text = this.el.textContent || '';

    if (this.truncated) {
      const width = this.el.offsetWidth;
      const scrollWidth = this.el.scrollWidth;
      if (width && scrollWidth && scrollWidth > width) {
        shouldAddTitle = true;
      }
    } else if (this.lineClamp !== undefined) {
      const height = this.el.offsetHeight;
      const scrollHeight = this.el.scrollHeight;
      if (height && scrollHeight && scrollHeight > height) {
        shouldAddTitle = true;
      }
    }

    if (shouldAddTitle) {
      this.el.setAttribute('title', text);
    } else {
      this.el.removeAttribute('title');
    }
  }
}
