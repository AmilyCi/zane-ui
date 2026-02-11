import { Component, Host, h, Element, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';
import type { ChatContext, ChatInputThemes } from './types';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import { getChatContext } from './utils';
import merge from 'lodash-es/merge';

@Component({
  tag: 'zane-chat-input',
  styleUrl: 'zane-chat-input.scss',
})
export class ZaneChatInput {

  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ChatInputThemes> = {};

  @Prop() disabled!: boolean;

  @Prop() sendOnEnter: boolean = true;

  @Prop() placeholder: string = '输入问题';

  @State() message: string = '';

  @Event() send!: EventEmitter;

  private msgInputRef!: HTMLDivElement | undefined;

  private chatContext: ReactiveObject<ChatContext>;

  @Watch('theme')
  watchThemeHandler() {
    this.updateTheme();
  }

  componentWillLoad() {
    this.chatContext = getChatContext(this.el);
    this.chatContext.change$.subscribe(({ key }) => {
      if (key === 'theme') {
        this.updateTheme();
      }
    });
    this.updateTheme();
    this.msgInputRef?.addEventListener('input', this.onInputHandler.bind(this));
    this.msgInputRef?.addEventListener('keydown', this.onKeyDownHandler.bind(this));
  }

  disconnectedCallback() {
    this.msgInputRef?.removeEventListener('input', this.onInputHandler.bind(this));
    this.msgInputRef?.addEventListener('keydown', this.onKeyDownHandler.bind(this));
  }

  onInputHandler(e: Event) {
    this.message = (e.target as HTMLDivElement).innerText;
  }

  onKeyDownHandler(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if ((this.sendOnEnter && !e.shiftKey) || (!this.sendOnEnter && e.shiftKey)) {
        e.preventDefault();
        this.onSendHandler();
      }
    }
  }

  onSendHandler() {
    if (this.message.trim() === '') return;
    this.send.emit(this.message);
    this.message = '';
    if (this.msgInputRef) {
      this.msgInputRef.innerText = '';
    }
  }

  updateTheme() {
    const inputTheme = merge({}, this.chatContext.value.theme.input, this.theme);

    this.el.style.setProperty('--zane-chat-input-color', inputTheme.color);
    this.el.style.setProperty('--zane-chat-input-color-disabled', inputTheme.colorDisabled);
    this.el.style.setProperty('--zane-chat-input-color-focus', inputTheme.colorFocus);
    this.el.style.setProperty('--zane-chat-input-text-color', inputTheme.textColor);
    this.el.style.setProperty('--zane-chat-input-text-color-disabled', inputTheme.textColorDisabled);
    this.el.style.setProperty('--zane-chat-input-text-color-focus', inputTheme.textColorFocus);
    this.el.style.setProperty('--zane-chat-input-input-text-font-size', inputTheme.inputFontSize);
    this.el.style.setProperty('--zane-chat-input-input-text-font-weight', inputTheme.inputFontWeight);
    this.el.style.setProperty('--zane-chat-input-input-padding', inputTheme.inputPadding);
    this.el.style.setProperty('--zane-chat-input-input-border-radius', inputTheme.inputBorderRadius);
    this.el.style.setProperty('--zane-chat-input-input-color', inputTheme.inputColor);
    this.el.style.setProperty('--zane-chat-input-input-color-disabled', inputTheme.inputColorDisabled);
    this.el.style.setProperty('--zane-chat-input-input-text-color', inputTheme.inputTextColor);
    this.el.style.setProperty('--zane-chat-input-input-text-color-disabled', inputTheme.inputTextColorDisabled);
    this.el.style.setProperty('--zane-chat-input-input-text-color-focus', inputTheme.inputTextColorFocus);
    this.el.style.setProperty('--zane-chat-input-placeholder-color', inputTheme.placeholderColor);
    this.el.style.setProperty('--zane-chat-input-placeholder-color-disabled', inputTheme.placeholderColorDisabled);
    this.el.style.setProperty('--zane-chat-input-backdrop-filter', inputTheme.backdropFilter);
    this.el.style.setProperty('--zane-chat-input-width', inputTheme.width);
    this.el.style.setProperty('--zane-chat-input-height', inputTheme.height);
    this.el.style.setProperty('--zane-chat-input-max-width', inputTheme.maxWidth);
    this.el.style.setProperty('--zane-chat-input-max-height', inputTheme.maxHeight);
    this.el.style.setProperty('--zane-chat-input-font-size', inputTheme.fontSize);
    this.el.style.setProperty('--zane-chat-input-line-height', inputTheme.lineHeight);
    this.el.style.setProperty('--zane-chat-input-border', inputTheme.border);
    this.el.style.setProperty('--zane-chat-input-border-hover', inputTheme.borderHover);
    this.el.style.setProperty('--zane-chat-input-border-focus', inputTheme.borderFocus);
    this.el.style.setProperty('--zane-chat-input-border-disabled', inputTheme.borderDisabled);
    this.el.style.setProperty('--zane-chat-input-border-radius', inputTheme.borderRadius);
    this.el.style.setProperty('--zane-chat-input-box-shadow', inputTheme.boxShadow);
    this.el.style.setProperty('--zane-chat-input-box-shadow-focus', inputTheme.boxShadowFocus);
    this.el.style.setProperty('--zane-chat-input-box-shadow-disabled', inputTheme.boxShadowDisabled);
    this.el.style.setProperty('--zane-chat-input-padding', inputTheme.padding);
    this.el.style.setProperty('--zane-chat-input-margin', inputTheme.margin);
  }

  render() {
    return (
      <Host>
        <div class={{"zane-chat-input__header": true, disabled: this.disabled}}>
          <slot name="headerTool"></slot>
        </div>
        <div class={{"zane-chat-input__main": true, disabled: this.disabled}}>
          <div class="zane-chat-input__neck">
            <slot name="neckTool"></slot>
          </div>
          <div class="zane-chat-input__main__top">
            <div class="zane-chat-input__main__left">
              <slot name="leftTool"></slot>
            </div>
            <div class="zane-chat-input__main__center">
              <div
                ref={(el) => this.msgInputRef = el}
                class="textarea"
                contentEditable={!this.disabled}
                data-placeholder={`${this.placeholder}, ${this.sendOnEnter ? 'Shift+Enter换行' : 'Shift+Enter发送'}`}
              ></div>
            </div>
            <div class="zane-chat-input__main__right">
              <slot name="rightToolExtends"></slot>
              <slot name="rightTool">
                <div class={{"send-btn": true, disabled: !this.message}} onClick={() => this.onSendHandler()}>
                  <slot name="sendIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M20.235 5.686c.432-1.195-.726-2.353-1.921-1.92L3.709 9.048c-1.199.434-1.344 2.07-.241 2.709l4.662 2.699l4.163-4.163a1 1 0 0 1 1.414 1.414L9.544 15.87l2.7 4.662c.638 1.103 2.274.957 2.708-.241z"
                        />
                      </g>
                    </svg>
                  </slot>
                </div>
              </slot>
            </div>
          </div>
          <div class="zane-chat-input__main__footer">
            <slot name='footerTool'></slot>
          </div>
        </div>
      </Host>
    );
  }
}
