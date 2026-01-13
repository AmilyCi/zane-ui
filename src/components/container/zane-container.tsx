import { Component, Element, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';
import { findAllLegitChildren } from '../../utils';

const ns = useNamespace('container');

@Component({
  styleUrl: 'zane-container.scss',
  tag: 'zane-container',
})
export class ZaneContainer {
  @Prop() direction: string;

  @Element() el: HTMLElement;

  isVertical = () => {
    if (this.direction === 'vertical') {
      return true;
    } else if (this.direction === 'horizontal') {
      return false;
    }
    const children = findAllLegitChildren(this.el);
    return children.some((child: HTMLElement) => {
      return child.tagName === 'ZANE-HEADER' || child.tagName === 'ZANE-FOOTER';
    });
  };

  render() {
    return (
      <Host class={[ns.b(), ns.is('vertical', this.isVertical())].join(' ')}>
        <slot />
      </Host>
    );
  }
}
