import { Component, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('footer');

@Component({
  styleUrl: 'zane-footer.scss',
  tag: 'zane-footer',
})
export class ZaneFooter {
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
