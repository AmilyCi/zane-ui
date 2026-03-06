import { Component, h, Prop } from '@stencil/core';
import type { TreeNode } from './types';
import { useNamespace } from '../../hooks';

const ns = useNamespace('tree');

@Component({
  tag: 'zane-tree-node-content',
})
export class ZaneTreeNodeContent {

  @Prop() node: TreeNode;

  render() {
    return (
      <zane-text truncated={true} class={ns.be('node', 'label')}>
        { this.node?.label }
      </zane-text>
    );
  }
}
