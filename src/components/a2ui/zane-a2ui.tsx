import { Component, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('a2ui');

@Component({
  styleUrl: 'zane-a2ui.scss',
  tag: 'zane-a2ui',
})
export class ZaneA2uiRoot {

  @Prop() surfaceId: string | null = null;

  render() {

    return (
      <Host class={ns.b()}>
      </Host>
    );
  }
}
