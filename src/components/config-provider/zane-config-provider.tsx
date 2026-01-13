import type { ButtonConfigContext, CardConfigContext } from '../../interfaces';
import type { Language } from '../../locale';

import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  styleUrl: 'zane-config-provider.scss',
  tag: 'zane-config-provider',
})
export class ZaneConfigProvider {
  @Prop() button: ButtonConfigContext;

  @Prop() card: CardConfigContext;

  @Element() el: HTMLElement;

  @Prop() locale: Language;

  @Prop() zIndex: number;

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
