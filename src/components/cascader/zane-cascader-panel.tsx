import type { CascaderNode } from './node';

import { Component, h, Host, Method, Prop } from '@stencil/core';

@Component({
  tag: 'zane-cascader-panel',
})
export class ZaneCascaderPanel {
  @Prop({ mutable: true }) checkedNodes: CascaderNode[] = [];

  @Method()
  async clearCheckedNodes() {}

  render() {
    return <Host></Host>;
  }

  @Method()
  async scrollToExpandingNode() {}
}
