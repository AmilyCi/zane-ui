import { Component, h, Element, Prop, State, Host, Method } from '@stencil/core';
import { useNamespace } from '../../hooks';
import { hasRawParent, ReactiveObject } from '../../utils';
import type { SelectGroupContext } from './types';
import { selectGroupContexts } from './constants';
import debounce from 'lodash-es/debounce';

const ns = useNamespace('select');

@Component({
  tag: 'zane-select-option-group',
  styleUrl: 'zane-select-option-group.scss'
})
export class ZaneSelectOptionGroup {
  @Element() el: HTMLElement;

  @Prop() label: string;

  @Prop() disabled: boolean = undefined;

  @State() visible: boolean = true;

  private context: ReactiveObject<SelectGroupContext>;

  private handleUpdateVisible = async () => {
    const children = Array.from(this.el.querySelectorAll('zane-select-option'));
    const visibilityPromises = children.map(opt => opt.getVisible());
    const visibilityResults = await Promise.all(visibilityPromises);
    this.visible = visibilityResults.some((result) => result === true);
  }

  @Method()
  async getContext() {
    return this.context;
  }

  componentWillLoad() {
    this.context = new ReactiveObject<SelectGroupContext>({
      label: this.label,
      disabled: this.disabled,
      updateVisible: debounce(() => {
        this.handleUpdateVisible();
      }, 100)
    });
    selectGroupContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    if (!hasRawParent(this.el)) {
      selectGroupContexts.delete(this.el);
      this.getContext = null;
    }
  }

  render() {
    return (
      <Host class={ns.b('group')}>
        <div
          class={ns.be('group', 'wrap')}
          style={{
            display: this.visible ? undefined : 'none',
          }}
        >
          <div class={ns.be('group', 'title')}>{this.label}</div>
          <div>
            <div class={ns.b('group')}>
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
