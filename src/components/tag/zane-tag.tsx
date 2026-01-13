import type { EventEmitter } from '@stencil/core';

import type { ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';
import type { FormItemContext } from '../form/FormItemContext';

import { Component, Element, Event, h, Host, Prop } from '@stencil/core';

import state from '../../global/store';
import { useNamespace } from '../../hooks';
import { formContexts, formItemContexts } from '../form/constants';

const ns = useNamespace('tag');

@Component({
  styleUrl: 'zane-tag.scss',
  tag: 'zane-tag',
})
export class ZaneTag {
  @Event({ eventName: 'zClick' }) clickEvent: EventEmitter<MouseEvent>;

  @Prop({ reflect: true }) closeable: boolean;

  @Event({ eventName: 'zClose' }) closeEvent: EventEmitter<MouseEvent>;

  @Prop() color: string;

  @Prop() effect: 'dark' | 'light' | 'plain' = 'light';

  @Element() el: HTMLElement;

  @Prop() hit: boolean;

  @Prop() round: boolean;

  @Prop() size: ComponentSize;

  @Prop() type: 'danger' | 'info' | 'primary' | 'success' | 'warning' =
    'primary';

  get formContext(): FormContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-FORM') {
        context = formContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  get formItemContext(): FormItemContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-FORM-ITEM') {
        context = formItemContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
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
              type="botton"
            >
              <zane-icon name="close"></zane-icon>
            </button>
          )}
        </span>
      </Host>
    );
  }

  private getTagSize() {
    return (
      this.size ||
      this.formItemContext?.size ||
      this.formContext?.size ||
      state.size ||
      ''
    );
  }

  private handleClick = (event: MouseEvent) => {
    this.clickEvent.emit(event);
  };

  private handleClose = (event: MouseEvent) => {
    event.stopPropagation();
    this.closeEvent.emit();
  };
}
