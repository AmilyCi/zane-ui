import type { ButtonGroupContext } from '../../interfaces';
import type { ButtonNativeType, ButtonType, ComponentSize } from '../../types';

import { TinyColor } from '@ctrl/tinycolor';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { buttonGroupContexts } from '../../constants';
import state from '../../global/store';
import { useNamespace } from '../../hooks';
import { darken, findAllLegitChildren } from '../../utils';

const ns = useNamespace('button');

@Component({
  styleUrl: 'zane-button.scss',
  tag: 'zane-button',
})
export class ZaneButton {
  @State() _disabled: boolean;

  @State() _plain: boolean;

  @State() _round: boolean;

  @State() _size: string;

  @State() _text: boolean;

  @State() _type: string;

  @Prop() autofocus: boolean = false;

  @Prop() autoInsertSpace: boolean;

  @Prop() bg: boolean = false;

  @State() buttonStyle: Record<string, string> = {};

  @Prop() circle: boolean = false;

  @Event({ eventName: 'zClick' }) clickEvent: EventEmitter<MouseEvent>;

  @Prop() color: string;

  @Prop() dark: boolean = false;

  @Prop() disabled: boolean = false;

  @Element() el: HTMLElement;

  @Prop() icon: string;

  @Prop({ reflect: true }) link: boolean = false;

  @Prop() loading: boolean = false;

  @Prop() nativeType: ButtonNativeType = 'button';

  @Prop() plain: boolean;

  @Prop() round: boolean;

  @State() shouldAddSpace: boolean = false;

  @Prop() size: ComponentSize;

  @Prop() text: boolean;

  @Prop() type: ButtonType = '';

  get buttonKls() {
    return [
      ns.b(),
      ns.m(this._type),
      ns.m(this._size),
      this.el.className,
      ns.is('disabled', this._disabled),
      ns.is('loading', this.loading),
      ns.is('plain', this._plain),
      ns.is('round', this._round),
      ns.is('circle', this.circle),
      ns.is('text', this._text),
      ns.is('link', this.link),
      ns.is('has-bg', this.bg),
    ].join(' ');
  }

  get groupContext(): ButtonGroupContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-BUTTON-GROUP') {
        context = buttonGroupContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  private onGroupUpdateSize: () => void;

  private onGroupUpdateType: () => void;

  componentWillLoad() {
    this.onGroupUpdateSize = () => {
      this.updateInternalState();
    };
    this.onGroupUpdateType = () => {
      this.updateInternalState();
    };
    this.groupContext?.addSizeChangeListener(this.onGroupUpdateSize);
    this.groupContext?.addTypeChangeListener(this.onGroupUpdateType);
    this.updateInternalState();
    this.updateCustomStyle();
  }

  handleClick = (evt: MouseEvent) => {
    if (this.loading || this.disabled) return;
    this.clickEvent.emit(evt);
  };

  @Watch('size')
  @Watch('type')
  @Watch('disabled')
  @Watch('plain')
  @Watch('round')
  @Watch('text')
  @Watch('color')
  @Watch('dark')
  onPropChange() {
    this.updateInternalState();
    this.updateCustomStyle();
  }

  render() {
    const hasContent = findAllLegitChildren(this.el).length > 0;
    return (
      <Host>
        <button
          autofocus={this.autofocus}
          class={this.buttonKls}
          disabled={this.disabled}
          onClick={this.handleClick}
          style={this.buttonStyle}
          type={this.nativeType}
        >
          {this.renderIcon()}

          {hasContent && (
            <span class={{ [ns.em('text', 'expand')]: this.shouldAddSpace }}>
              <slot />
            </span>
          )}
        </button>
      </Host>
    );
  }

  renderIcon() {
    const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');

    if (this.loading) {
      return (
        <slot name="loading">
          <svg
            class="mr-2"
            height="1em"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              fill="currentColor"
              opacity=".25"
            />
            <path
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
              fill="currentColor"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        </slot>
      );
    } else if (hasIcon) {
      return this.icon ? (
        <zane-icon name={this.icon}></zane-icon>
      ) : (
        <slot name="icon" />
      );
    }
    return null;
  }

  updateCustomStyle() {
    let styles: Record<string, string> = {};

    let buttonColor = this.color;

    if (buttonColor) {
      const match = (buttonColor as string).match(/var\((.*?)\)/);
      if (match) {
        buttonColor = window
          .getComputedStyle(window.document.documentElement)
          .getPropertyValue(match[1]);
      }
      const color = new TinyColor(buttonColor);
      const activeBgColor = this.dark
        ? color.tint(20).toString()
        : darken(color, 20);

      if (this.plain) {
        styles = ns.cssVarBlock({
          'active-bg-color': activeBgColor,
          'active-border-color': activeBgColor,
          'active-text-color': `var(${ns.cssVarName('color-white')})`,
          'bg-color': this.dark ? darken(color, 90) : color.tint(90).toString(),
          'border-color': this.dark
            ? darken(color, 50)
            : color.tint(50).toString(),
          'hover-bg-color': buttonColor,
          'hover-border-color': buttonColor,
          'hover-text-color': `var(${ns.cssVarName('color-white')})`,
          'text-color': buttonColor,
        });

        if (this.disabled) {
          styles[ns.cssVarBlockName('disabled-bg-color')] = this.dark
            ? darken(color, 90)
            : color.tint(90).toString();
          styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
            ? darken(color, 50)
            : color.tint(50).toString();
          styles[ns.cssVarBlockName('disabled-border-color')] = this.dark
            ? darken(color, 80)
            : color.tint(80).toString();
        }
      } else {
        const hoverBgColor = this.dark
          ? darken(color, 30)
          : color.tint(30).toString();
        const textColor = color.isDark()
          ? `var(${ns.cssVarName('color-white')})`
          : `var(${ns.cssVarName('color-black')})`;
        styles = ns.cssVarBlock({
          'active-bg-color': activeBgColor,
          'active-border-color': activeBgColor,
          'bg-color': buttonColor,
          'border-color': buttonColor,
          'hover-bg-color': hoverBgColor,
          'hover-border-color': hoverBgColor,
          'hover-text-color': textColor,
          'text-color': textColor,
        });

        if (this.disabled) {
          const disabledButtonColor = this.dark
            ? darken(color, 50)
            : color.tint(50).toString();
          styles[ns.cssVarBlockName('disabled-bg-color')] = disabledButtonColor;
          styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
            ? 'rgba(255, 255, 255, 0.5)'
            : `var(${ns.cssVarName('color-white')})`;
          styles[ns.cssVarBlockName('disabled-border-color')] =
            disabledButtonColor;
        }
      }
    }

    this.buttonStyle = {
      ...styles,
      ...this.el.style,
    } as any;
  }

  updateInternalState() {
    const globalButtonConfig = state.configProviderContext.button;

    const autoInsertSpace =
      this.autoInsertSpace ?? globalButtonConfig.autoInsertSpace ?? false;

    this._size = this.size || this.groupContext?.size || state.size || '';

    this._type =
      this.type || this.groupContext?.type || globalButtonConfig.type || '';

    this._disabled = this.disabled;

    this._plain = this.plain ?? globalButtonConfig.plain ?? false;

    this._round = this.round ?? globalButtonConfig.round ?? false;

    this._text = this.text ?? globalButtonConfig.text ?? false;

    if (autoInsertSpace) {
      const slot = this.el.querySelector('span');
      if (slot) {
        const text = slot.textContent;
        this.shouldAddSpace = /^\p{Unified_Ideograph}{2}$/u.test(text);
      }
    }

    this.shouldAddSpace = false;
  }
}
