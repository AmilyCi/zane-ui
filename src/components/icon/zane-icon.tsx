import { Component, h, Host, Prop } from '@stencil/core';
import classNameFun from 'classnames';

import { useNamespace } from '../../hooks/useNamespace';

import '@zanejs/icons';

const ns = useNamespace('icon');

@Component({
  styleUrl: 'zane-icon.scss',
  tag: 'zane-icon',
})
export class ZaneIcon {
  @Prop() classNames: string = '';
  @Prop() color: string;
  @Prop() name: string;

  @Prop() rotate: number;

  @Prop() size: string;

  @Prop() spin: boolean;

  @Prop() styles: object;

  render() {
    const style = Object.assign(
      {
        color: this.color,
      },
      this.styles || {},
    ) as Record<string, string>;

    if (this.size) {
      const value = Number.isNaN(Number(this.size))
        ? this.size
        : `${this.size}px`;
      style.width = value;
      style.height = value;
    }

    if (this.rotate && Number.isSafeInteger(this.rotate)) {
      style.transform = `rotate(${this.rotate}deg)`;
    }

    const IconName = this.name ? `zane-icon-${this.name}` : 'slot';

    return (
      <Host class={ns.b()}>
        <IconName
          class={classNameFun(this.classNames, ns.is('spin', this.spin))}
          style={style}
        />
      </Host>
    );
  }
}
