import { Component, h, Prop, Element, State, Event, type EventEmitter, Watch, Method } from '@stencil/core';
import type { MentionOption } from './types';
import { useNamespace } from '../../hooks';
import state from '../../global/store';
import classNames from 'classnames';
import { nextFrame, scrollIntoView } from '../../utils';

const ns = useNamespace('mention');

@Component({
  tag: 'zane-mention-dropdown',
})
export class ZaneMentionDropdown {
  @Element() el: HTMLElement;

  @Prop() options: MentionOption[] = [];

  @Prop() loading: boolean;

  @Prop() disabled: boolean;

  @Prop() ariaLabel: string;

  @Prop({ mutable: true}) hoveringIndex: number = -1;

  @Event({ eventName: 'zSelect', bubbles: false })
  selectEvent: EventEmitter<MentionOption>;

  @State() filteredAllDisabled: boolean;

  private dropdownRef: HTMLDivElement;

  private scrollbarRef: HTMLZaneScrollbarElement;

  private optionRefs: HTMLElement[] = [];

  private hasHeaderSlot: boolean;

  private hasFooterSlot: boolean;

  @Watch('options')
  @Watch('filteredAllDisabled')
  handleUpdateHoveringIndex() {
    this.resetHoveringIndex();
  }

  @Watch('options')
  @Watch('disabled')
  handleUpdateFilteredAllDisabled() {
    this.filteredAllDisabled = this.disabled || this.options.every((item) => item.disabled);
  }

  @Method()
  async navigateOptions(direction: 'next' | 'prev') {
    if (this.options.length === 0 || this.filteredAllDisabled) {
      return;
    }

    if (direction === 'next') {
      this.hoveringIndex++;
      if (this.hoveringIndex === this.options.length) {
        this.hoveringIndex = 0;
      }
    } else if (direction === 'prev') {
      this.hoveringIndex--;
      if (this.hoveringIndex < 0) {
        this.hoveringIndex = this.options.length - 1;
      }
    }

    const option = this.options[this.hoveringIndex];
    if (option.disabled) {
      this.navigateOptions(direction);
      return;
    }

    nextFrame(() => {
      this.scrollToOption(option);
    });
  }

  @Method()
  async selectHoverOption() {
    const hoverOption = this.options[this.hoveringIndex]
    if (!hoverOption) {
      return;
    }
    this.selectEvent.emit(hoverOption);
  }

  private scrollToOption = (option: MentionOption) => {
    const index = this.options.findIndex((item) => item.value === option.value);
    const target = this.optionRefs[index];

    if (target) {
      const menu = this.dropdownRef?.querySelector(`.${ns.be('dropdown', 'wrap')}`);
      if (menu) {
        scrollIntoView(menu as HTMLElement, target);
      }
    }

    this.scrollbarRef?.handleScroll();
  }

  private resetHoveringIndex = () => {
    if (this.filteredAllDisabled || this.options.length === 0) {
      this.hoveringIndex = -1;
    } else {
      this.hoveringIndex = 0;
    }
  }

  private getOptionKls = (item: MentionOption, index: number) => {
    return classNames(
      ns.be('dropdown', 'item'),
      ns.is('hovering', this.hoveringIndex === index),
      ns.is('disabled', item.disabled || this.disabled)
    );
  }

  private handleMouseEnter = (index: number) => {
    this.hoveringIndex = index;
  }

  private handleSelect = (item: MentionOption) => {
    if (item.disabled || this.disabled) {
      return;
    }
    this.selectEvent.emit(item);
  }

  componentWillLoad() {
    this.hasHeaderSlot = !!this.el.querySelector('[slot="header"]');
    this.hasFooterSlot = !!this.el.querySelector('[slot="footer"]');

    this.handleUpdateFilteredAllDisabled();
    this.handleUpdateHoveringIndex();
  }

  componentWillRender() {
    this.optionRefs = [];
  }

  render() {
    const { t } = state.i18n;

    return (
      <div ref={(el) => this.dropdownRef = el} class={ns.b('dropdown')}>
        {
          this.hasHeaderSlot && (<div class={ns.be('dropdown', 'header')}>
            <slot name='header'></slot>
          </div>)
        }
        <zane-scrollbar
          style={{display: this.options.length > 0 && !this.loading ? undefined : 'none'}}
          ref={(el) => this.scrollbarRef = el}
          wrapClass={ns.be('dropdown', 'wrap')}
          viewClass={ns.be('dropdown', 'list')}
          role="listbox"
          ariaLabel={this.ariaLabel}
          ariaOrientation="vertical"
        >
          {
            this.options?.map((option, index) => (<div
              key={index}
              ref={(el) => this.optionRefs[index] = el}
              class={this.getOptionKls(option, index)}
              role="option"
              ariaDisabled={option.disabled || this.disabled || undefined}
              ariaSelected={this.hoveringIndex === index}
              onMouseMove={() => this.handleMouseEnter(index)}
              onClick={() => this.handleSelect(option)}
            >
              <span>{ option.label ?? option.value }</span>
            </div>))
          }
        </zane-scrollbar>
        {
          this.loading && (<div class={ns.be('dropdown', 'loading')}>
            <slot name='loading'>
              { t('mention.loading') }
            </slot>
          </div>)
        }
        {
          this.hasFooterSlot && (<div class={ns.be('dropdown', 'footer')}>
            <slot name='footer'></slot>
          </div>)
        }
      </div>
    );
  }
}
