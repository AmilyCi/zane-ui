import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('link');

@Component({
  shadow: true,
  styleUrl: 'zane-link.scss',
  tag: 'zane-link',
})
export class ZaneLink {
  @Event({ eventName: 'zClick' }) clickEvent: EventEmitter<MouseEvent>;

  @Prop() disabled: boolean;

  @Element() el: HTMLElement;

  @Prop() href: string = '';

  @Prop() icon: string;

  @Prop() target: '_blank' | '_parent' | '_self' | '_top' | string = '_self';

  @Prop() type:
    | 'danger'
    | 'default'
    | 'info'
    | 'primary'
    | 'success'
    | 'warning';

  @Prop() underline: 'always' | 'hover' | 'never' | boolean;

  render() {
    const linkKls = [
      ns.b(),
      ns.m(this.type ?? 'default'),
      ns.is('disabled', this.disabled),
      ns.is('underline', this.underline === 'always'),
      ns.is('hover-underline', this.underline === 'hover' && !this.disabled),
    ].join(' ');

    const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');

    return (
      <Host>
        <a
          class={linkKls}
          href={this.disabled || !this.href ? undefined : this.href}
          onClick={this.handleClick}
          target={this.disabled || !this.href ? undefined : this.target}
        >
          {hasIcon && this.icon ? (
            <zane-icon name={this.icon}></zane-icon>
          ) : (
            <slot name="icon" />
          )}
          <slot></slot>
        </a>
      </Host>
    );
  }

  private handleClick = (event: MouseEvent) => {
    if (!this.disabled) this.clickEvent.emit(event);
  };
}
