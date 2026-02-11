import { Component, h, Prop } from '@stencil/core';
import { useNamespace } from '../../hooks';

const ns = useNamespace('select');

@Component({
  tag: 'zane-select-group-item',
  styleUrl: 'zane-select-group-item.scss'
})
export class ZaneSelectGroupItem {

  @Prop() item: any;

  @Prop({ attribute: 'style' }) zStyle: Record<string, any>;

  @Prop({ attribute: 'height' }) zHeight: number;

  render() {
    return (
      <div
        class={ns.be('group', 'title')}
        style={{
          ...this.zStyle,
          lineHeight: `${this.zHeight}px`
        }}
      >
        {this.item?.label}
      </div>
    );
  }
}
