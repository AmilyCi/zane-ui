import { Component, Host, h, Element, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { useNamespace } from '../../hooks';
import type { ChatContext, ChatHeaderThemes } from './types';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import { getChatContext } from './utils';
import merge from 'lodash-es/merge';

const ns = useNamespace('chat-header');

@Component({
  tag: 'zane-chat-header',
  styleUrl: 'zane-chat-header.scss',
  shadow: true,
})
export class ZaneChatHeader {

  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ChatHeaderThemes> = {};

  /**
   * 主标题, 当使用 title 插槽时该参数无效
   */
  @Prop() cTitle!: string;

  /**
   * 副标题, 当使用 subtitle 插槽时该参数无效
   */
  @Prop() subtitle!: string;

  /**
   * 额外的文本信息，当使用 extra 插槽时该参数无效
   */
  @Prop() extra!: string;

  /**
   * 是否显示返回按钮
   */
  @Prop() showBack: boolean = false;

  @Event({eventName: 'back', bubbles: false})
  backEvent: EventEmitter;

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
  }

  updateTheme() {
    const headerTheme = merge({}, this.chatContext.value.theme.header, this.theme);

    this.el.style.setProperty('--zane-chat-header-color', headerTheme.color);
    this.el.style.setProperty('--zane-chat-header-font-size', headerTheme.fontSize);
    this.el.style.setProperty('--zane-chat-header-font-weight', headerTheme.fontWeight);
    this.el.style.setProperty('--zane-chat-header-border-color', headerTheme.borderColor);
    this.el.style.setProperty('--zane-chat-header-border-size', headerTheme.borderSize);
    this.el.style.setProperty('--zane-chat-header-border-radius', headerTheme.borderRadius);
    this.el.style.setProperty('--zane-chat-header-box-shadow', headerTheme.boxShadow);
    this.el.style.setProperty('--zane-chat-header-padding', headerTheme.padding);
    this.el.style.setProperty('--zane-chat-header-title-font-size', headerTheme.titleFontSize);
    this.el.style.setProperty('--zane-chat-header-title-font-weight', headerTheme.titleFontWeight);
    this.el.style.setProperty('--zane-chat-header-title-text-color', headerTheme.titleTextColor);
    this.el.style.setProperty('--zane-chat-header-subtitle-text-color', headerTheme.subtitleTextColor);
    this.el.style.setProperty('--zane-chat-header-back-size', headerTheme.backSize);
    this.el.style.setProperty('--zane-chat-header-back-color', headerTheme.backColor);
    this.el.style.setProperty('--zane-chat-header-back-color-hover', headerTheme.backColorHover);
    this.el.style.setProperty('--zane-chat-header-back-color-pressed', headerTheme.backColorPressed);
  }

  render() {
    return (
      <Host class={ns.b()}>
        <slot>
          <div class="zane-chat-header__main">
            <slot name="back">
              {
                this.showBack && (
                  <div class="zane-chat-header__back" onClick={() => this.backEvent.emit()}>
                    <i class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>
                        <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
                      </svg>
                    </i>
                  </div>
                )
              }
            </slot>
            <slot name="avatar"></slot>
            <slot name="title">
              {
                this.cTitle && (
                  <div class="zane-chat-header__title">
                    {this.cTitle}
                  </div>
                )
              }
            </slot>
            <slot name="subtitle">
              {
                this.subtitle && (
                  <div class="zane-chat-header__subtitle">
                    {this.subtitle}
                  </div>
                )
              }
            </slot>
          </div>
          <slot name="extra">
            {
              this.extra && (
                <div class="zane-chat-header__extra">
                  {this.extra}
                </div>
              )
            }
          </slot>
        </slot>
      </Host>
    );
  }
}
