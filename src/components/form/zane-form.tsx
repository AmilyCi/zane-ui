import type { ComponentSize } from '../../types';
import type { FormRules } from './types';

import { Component, Element, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';

const ns = useNamespace('form');

@Component({
  styleUrl: 'zane-form.scss',
  tag: 'zane-form',
})
export class ZaneForm {
  @Prop() disabled: boolean;

  @Element() el: HTMLElement;

  @Prop() hideRequiredAsterisk: boolean;

  @Prop() inline: boolean;

  @Prop() inlineMessage: boolean;

  @Prop() labelPosition: 'left' | 'right' | 'top' = 'right';

  @Prop() labelSuffix: string = '';

  @Prop() labelWidth: number | string = '';

  @Prop() model: Record<string, any>;

  @Prop() requireAsteriskPosition: 'left' | 'right' = 'left';

  @Prop() rules: FormRules;

  @Prop() scrollIntoViewOptions: boolean | ScrollIntoViewOptions = true;

  @Prop() scrollToError: boolean;

  @Prop() showMessage: boolean = true;

  @Prop() size: ComponentSize;

  @Prop() statusIcon: boolean;

  @Prop() validateOnRuleChange: boolean = true;

  // private formRef: HTMLFormElement;

  render() {
    const formClasses = {
      [ns.b()]: true,
      [ns.m('inline')]: this.inline,
      [ns.m(`label-${this.labelPosition}`)]: this.labelPosition,
      [ns.m(this.size || 'default')]: true,
    };

    return (
      <Host className={formClasses}>
        <form>
          <slot />
        </form>
      </Host>
    );
  }
}
