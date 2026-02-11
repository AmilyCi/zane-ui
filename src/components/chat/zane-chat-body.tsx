import { Component, Host, h, State, Prop, Element, Watch } from '@stencil/core';
import type { ChatBodyThemes, ChatContext } from './types';
import type { ReactiveObject } from '../../utils';
import { getChatContext } from './utils';
import { useNamespace } from '../../hooks/useNamespace';
import merge from 'lodash-es/merge';

const ns = useNamespace('chat-body');

@Component({
  tag: 'zane-chat-body',
  styleUrl: 'zane-chat-body.scss',
})
export class ZaneChatBody {
  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ChatBodyThemes> = {};

  @State() isBottom: boolean = true;

  private bodyRef!: HTMLDivElement;

  private bodyToolsRef!: HTMLDivElement;

  private chatContext: ReactiveObject<ChatContext>;

  @Watch('theme')
  watchThemeHandler() {
    this.updateTheme();
  }

  private onScrollHandler = () => {
    if (this.bodyRef && this.bodyRef.scrollTop + this.bodyRef.clientHeight >= this.bodyRef.scrollHeight - 10) {
      this.isBottom = true;
    } else {
      this.isBottom = false;
    }
  };

  componentDidLoad() {
    this.chatContext = getChatContext(this.el);
    this.chatContext.change$.subscribe(({ key }) => {
      if (key === 'theme') {
        this.updateTheme();
      }
    });

    this.updateTheme();
    this.bodyRef?.addEventListener('scroll', this.onScrollHandler);
  }

  disconnectedCallback() {
    this.bodyRef?.removeEventListener('scroll', this.onScrollHandler);
    this.bodyRef = undefined;
    this.bodyToolsRef = undefined;
  }

  updateTheme() {
    const bodyTheme = merge({}, this.chatContext.value.theme.body, this.theme);

    if (this.bodyRef) {
      this.bodyRef.style.setProperty('--zane-chat-body-color', bodyTheme.color);
      this.bodyRef.style.setProperty('--zane-chat-body-width', bodyTheme.width);
      this.bodyRef.style.setProperty('--zane-chat-body-max-width', bodyTheme.maxWidth);
      this.bodyRef.style.setProperty('--zane-chat-body-backdrop-filter', bodyTheme.backdropFilter);
      this.bodyRef.style.setProperty('--zane-chat-body-padding', bodyTheme.padding);
      this.bodyRef.style.setProperty('--zane-chat-body-margin', bodyTheme.margin);
    }

    if (this.bodyToolsRef) {
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-color', bodyTheme.toBottomColor);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-size', bodyTheme.toBottomSize);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-border-radius', bodyTheme.toBottomBorderRadius);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-color-hover', bodyTheme.toBottomColorHover);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-text-color', bodyTheme.toBottomTextColor);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-text-color-hover', bodyTheme.toBottomTextColorHover);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-border-color', bodyTheme.toBottomBorderColor);
      this.bodyToolsRef.style.setProperty('--zane-chat-to-bottom-border-color-hover', bodyTheme.toBottomBorderColorHover);
    }
  }

  render() {
    return (
      <Host>
        <div class={ns.b()} ref={(el) => this.bodyRef = el}>
          <slot></slot>
        </div>
        <div class={ns.b('tools')} ref={(el) => this.bodyToolsRef = el}>
          <slot name="tool">
            <div
              class="to-bottom"
              style={{
                top: this.isBottom ? '0px' : '-40px',
                opacity: this.isBottom ? '0' : '1',
                pointerEvents: this.isBottom ? 'none' : 'auto',
              }}
            >
              <slot name="toBottomIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <g
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <path d="m3 4 5 5 5-5M3 12.5h10"></path>
                  </g>
                </svg>
              </slot>
            </div>
          </slot>
        </div>
      </Host>
    );
  }
}
