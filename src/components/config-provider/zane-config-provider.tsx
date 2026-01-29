import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import { configProviderContexts } from './constants';
import { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { ButtonConfig, CardConfig, ConfigProviderContext } from './types';
import type { ComponentSize } from '../../types';
import state from '../../global/store';

@Component({
  styleUrl: 'zane-config-provider.scss',
  tag: 'zane-config-provider',
})
export class ZaneConfigProvider {
  @Element() el: HTMLElement;

  @Prop() button: ButtonConfig | undefined;

  @Prop() card: CardConfig | undefined;

  @Prop() locale: string | undefined;

  @Prop() size: ComponentSize | undefined;

  @Prop() valueOnClear: string | number | boolean | Function | null = undefined;

  private context: ReactiveObject<ConfigProviderContext>;

  @Watch('button')
  onButtonChange() {
    this.context.value.button = this.button;
  }

  @Watch('card')
  onCardChange() {
    this.context.value.card = this.card;
  }

  @Watch('locale')
  onLocaleChange() {
    this.context.value.locale = this.locale;
    state.i18n.setLanguage(this.locale);
  }

  @Watch('size')
  onSizeChange() {
    this.context.value.size = this.size;
  }

  @Watch('valueOnClear')
  onValueOnClearChange() {
    this.context.value.valueOnClear = this.valueOnClear;
  }

  componentWillLoad() {
    this.context = new ReactiveObject<ConfigProviderContext>({
      button: this.button,
      card: this.card,
      locale: this.locale,
      size: this.size,
      valueOnClear: this.valueOnClear,
    });
    configProviderContexts.set(this.el, this.context);

    state.i18n.setLanguage(this.locale);
  }

  disconnectedCallback() {
    configProviderContexts.delete(this.el);
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
