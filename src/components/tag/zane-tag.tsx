import type { EventEmitter } from '@stencil/core';

import type { ComponentSize } from '../../types';

import { Component, Element, Event, h, Host, Prop } from '@stencil/core';

import state from '../../global/store';
import { useNamespace } from '../../hooks';
import { formContexts, formItemContexts } from '../form/constants';
import type { FormContext, FormItemContext } from '../form/types';
import type { ReactiveObject } from '../../utils';

const ns = useNamespace('tag');

@Component({
  styleUrl: 'zane-tag.scss',
  tag: 'zane-tag',
})
export class ZaneTag {
  @Event({ eventName: 'zClick', bubbles: false })
  clickEvent: EventEmitter<MouseEvent>;

  @Prop({ reflect: true }) closeable: boolean;

  @Event({ eventName: 'zClose', bubbles: false })
  closeEvent: EventEmitter<MouseEvent>;

  @Prop() color: string;

  @Prop() effect: 'dark' | 'light' | 'plain' = 'light';

  @Element() el: HTMLElement;

  @Prop() hit: boolean;

  @Prop() round: boolean;

  @Prop() size: ComponentSize;

  @Prop() type: 'danger' | 'info' | 'primary' | 'success' | 'warning' =
    'primary';

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  componentWillLoad() {
    this.formContext = formContexts.get(this.el);
    this.formItemContext = formItemContexts.get(this.el);
  }

  render() {
    const containerKls = [
      ns.b(),
      ns.is('closeable', this.closeable),
      ns.m(this.type || 'primary'),
      ns.m(this.getTagSize()),
      ns.m(this.effect),
      ns.is('hit', this.hit),
      ns.is('round', this.round),
    ].join(' ');
    return (
      <Host>
        <span
          class={containerKls}
          onClick={this.handleClick}
          style={{ backgroundColor: this.color }}
        >
          <span class={ns.e('content')}>
            <slot></slot>
          </span>
          {this.closeable && (
            <button
              class={ns.e('close')}
              onClick={this.handleClose}
              type="button"
            >
              <zane-icon name="close-line"></zane-icon>
            </button>
          )}
        </span>
      </Host>
    );
  }

  private getTagSize() {
    return (
      this.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      state.size ||
      ''
    );
  }

  private handleClick = (event: MouseEvent) => {
    this.clickEvent.emit(event);
  };

  private handleClose = (event: MouseEvent) => {
    event.stopPropagation();
    this.closeEvent.emit(event);
  };
}
