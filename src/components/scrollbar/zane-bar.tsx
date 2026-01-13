import type { ScrollbarContext } from '../../interfaces/ScrollbarContext';

import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { GAP, scrollbarContexts } from '../../constants';

@Component({
  tag: 'zane-bar',
})
export class ZaneBar {
  @Prop() always: boolean;

  @Element() el: HTMLElement;

  @Prop() minSize: number;

  @State() moveX: number = 0;

  @State() moveY: number = 0;

  @State() ratioX: number = 1;

  @State() ratioY: number = 1;

  @State() sizeHeight: string = '';

  @State() sizeWidth: string = '';

  get scrollbarContext(): ScrollbarContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-SCROLLBAR') {
        context = scrollbarContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  @Method()
  async handleScroll(wrap: HTMLDivElement) {
    if (wrap) {
      const offsetHeight = wrap.offsetHeight - GAP;
      const offsetWidth = wrap.offsetWidth - GAP;

      this.moveY = ((wrap.scrollTop * 100) / offsetHeight) * this.ratioY;
      this.moveX = ((wrap.scrollLeft * 100) / offsetWidth) * this.ratioX;
    }
  }

  render() {
    return (
      <Host>
        <zane-thumb
          always={this.always}
          move={this.moveX}
          ratio={this.ratioX}
          size={this.sizeWidth}
        ></zane-thumb>
        <zane-thumb
          always={this.always}
          move={this.moveY}
          ratio={this.ratioY}
          size={this.sizeHeight}
          vertical
        ></zane-thumb>
      </Host>
    );
  }

  @Method()
  async update() {
    const wrap = this.scrollbarContext?.wrapElement;
    if (!wrap) return;
    const offsetHeight = wrap.offsetHeight - GAP;
    const offsetWidth = wrap.offsetWidth - GAP;

    const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
    const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
    const height = Math.max(originalHeight, this.minSize);
    const width = Math.max(originalWidth, this.minSize);

    this.ratioY =
      originalHeight /
      (offsetHeight - originalHeight) /
      (height / (offsetHeight - height));

    this.ratioX =
      originalWidth /
      (offsetWidth - originalWidth) /
      (width / (offsetWidth - width));

    this.sizeHeight = height + GAP < offsetHeight ? `${height}px` : '';
    this.sizeWidth = width + GAP < offsetWidth ? `${width}px` : '';
  }
}
