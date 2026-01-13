import { Component, h, Host } from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('main');

@Component({
  styleUrl: 'zane-main.scss',
  tag: 'zane-main',
})
export class ZaneMain {
  render() {
    return (
      <Host class={ns.b()}>
        <slot />
      </Host>
    );
  }
}
