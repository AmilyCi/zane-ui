import { Component, h, Host, Element } from '@stencil/core';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { SelectContext, SelectOptionValue } from './types';
import { getSelectContext } from './utils';


@Component({
  tag: 'zane-select-options',
})
export class ZaneSelectOptions {
  @Element() el: HTMLElement;

  private selectContext: ReactiveObject<SelectContext>;

  componentWillLoad() {
    this.selectContext = getSelectContext(this.el);

    if (this.selectContext) {
      const valueList: SelectOptionValue[] = [];
      const options = this.el.querySelectorAll('zane-select-option');
      options.forEach((item) => {
        valueList.push(item.value);
      });

      this.selectContext.value.options = Array.from(options);
      this.selectContext.value.optionValues = valueList;
    }
  }

  render() {
    return (
      <Host><slot></slot></Host>
    );
  }
}
