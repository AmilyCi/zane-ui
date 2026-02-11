import { Component, Host, h, Element, Prop, Watch } from '@stencil/core';
import type { ChatBubbleThemes, ChatContext } from './types';
import type { ReactiveObject } from '../../utils';
import { getChatContext } from './utils';
import merge from 'lodash-es/merge';
import { bubbleContentRenderers, type RendererType } from './renderer';

@Component({
  tag: 'zane-chat-bubble',
  styleUrl: 'zane-chat-bubble.scss',
})
export class ZaneChatBubble {

  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ChatBubbleThemes> = {};

  /**
   * 聊天气泡类型（发送气泡、接收气泡）
   */
  @Prop() type: 'send' | 'receive' = 'send';

  /**
   * 消息数据
   */
  @Prop() message!: string;

  /**
   * 消息状态（加载中、运行中、完成）
   */
  @Prop() status: 'loading' | 'running' | 'finish' = 'loading';

  /**
   * 是否发送气泡靠左排版
   */
  @Prop() isSendLeft!: boolean;

  /**
   * 气泡中的文本和头像的布局方式（上下布局、左右布局）
   */
  @Prop() isVertical!: boolean;

  /**
   * 气泡左对齐
   */
  @Prop() isLeftAlign!: boolean;

  /**
   * 消息气泡美容的渲染方法，默认为: markdown
   */
  @Prop() renderer: string = 'markdown';

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

  /**
   * 获取对齐方式的属性。
   *
   * 根据当前对象的属性值计算并返回对齐方式。
   * - 如果 `isLeftAlign` 为真，则根据 `isSendLeft` 返回 'align-right' 或 'align-left'。
   * - 如果 `isLeftAlign` 为假，则根据消息类型 `type` 和 `isSendLeft` 返回不同的对齐方式。
   *
   * @returns {string} 返回计算后的对齐方式字符串，例如 'align-left' 或 'align-right'。
   */
  get align() {
    if (this.isLeftAlign) {
      return this.isSendLeft ? 'align-right' : 'align-left';
    } else {
      return this.type === 'send'
        ? this.isSendLeft
            ? 'align-left'
            : 'align-right'
        : this.isSendLeft
          ? 'align-right'
          : 'align-left';
    }
  }

  updateTheme() {
    const bubbleTheme = merge({}, this.chatContext.value.theme.bubble, this.theme);

    this.el.style.setProperty('--zane-chat-bubble-send-color', bubbleTheme.sendColor);
    this.el.style.setProperty('--zane-chat-bubble-send-text-color', bubbleTheme.sendTextColor);
    this.el.style.setProperty('--zane-chat-bubble-respond-color', bubbleTheme.respondColor);
    this.el.style.setProperty('--zane-chat-bubble-respond-text-color', bubbleTheme.respondTextColor);
    this.el.style.setProperty('--zane-chat-bubble-avatar-size', bubbleTheme.avatarSize);
    this.el.style.setProperty('--zane-chat-bubble-avatar-padding', bubbleTheme.avatarPadding);
    this.el.style.setProperty('--zane-chat-bubble-avatar-margin', bubbleTheme.avatarMargin);
    this.el.style.setProperty('--zane-chat-bubble-avatar-border-color', bubbleTheme.avatarBorderColor);
    this.el.style.setProperty('--zane-chat-bubble-avatar-border-size', bubbleTheme.avatarBorderSize);
    this.el.style.setProperty('--zane-chat-bubble-avatar-box-shadow', bubbleTheme.avatarBoxShadow);
    this.el.style.setProperty('--zane-chat-bubble-avatar-border-radius', bubbleTheme.avatarBorderRadius);
    this.el.style.setProperty('--zane-chat-bubble-border-color', bubbleTheme.borderColor);
    this.el.style.setProperty('--zane-chat-bubble-border-size', bubbleTheme.borderSize);
    this.el.style.setProperty('--zane-chat-bubble-box-shadow', bubbleTheme.boxShadow);
    this.el.style.setProperty('--zane-chat-bubble-border-radius', bubbleTheme.borderRadius);
    this.el.style.setProperty('--zane-chat-bubble-padding', bubbleTheme.padding);
    this.el.style.setProperty('--zane-chat-bubble-margin', bubbleTheme.margin);
    this.el.style.setProperty('--zane-chat-bubble-backdrop-filter',  bubbleTheme.backdropFilter);
  }

  render() {
    const bubbleContentRenderer = bubbleContentRenderers[this.renderer as RendererType];
    return (
      <Host>
        <div class={`zane-chat-bubble ${this.type} ${this.align} ${this.isVertical ? 'align-vertical' : 'align-horizontal'}`}>
          <div class="zane-chat-bubble__avatar">
            <slot name="avatar"></slot>
          </div>
          <div class="zane-chat-bubble__content">
            <div class="zane-chat-bubble__content_top_tool">
              <slot name="topTool"></slot>
            </div>
            <div class="zane-chat-bubble__content_message">
              <slot>
                {
                  this.type === 'send'
                    ? this.message
                    : bubbleContentRenderer
                      ? bubbleContentRenderer({ content: this.message })
                      : <span>{this.message}</span>
                }
              </slot>
              <div class="zane-chat-bubble__content_msg_tool">
                <slot name="msgTool"></slot>
              </div>
            </div>
            <div class="zane-chat-bubble__content_bottom_tool">
              <slot name="bottomTool"></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
