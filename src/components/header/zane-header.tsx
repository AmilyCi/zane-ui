import { Component, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('header');

@Component({
  styleUrl: 'zane-header.scss',
  tag: 'zane-header',
})
export class ZaneHeader {
  @Prop() height: string;

  render() {
    const style = this.height
      ? ns.cssVarBlock({
          height: this.height,
        })
      : {};
    return (
      <Host class={ns.b()} style={style}>
        <slot />
      </Host>
    );
  }
}
