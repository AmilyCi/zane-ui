import { Component, Host, h, Element, Prop, Watch } from '@stencil/core';
import type { ChatContext, ChatFooterThemes } from './types';
import type { ReactiveObject } from '../../utils';
import { getChatContext } from './utils';
import merge from 'lodash-es/merge';
import { useNamespace } from '../../hooks';

const ns = useNamespace('chat-footer');

@Component({
  tag: 'zane-chat-footer',
  styleUrl: 'zane-chat-footer.scss',
  shadow: true,
})
export class ZaneChatFooter {
  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ChatFooterThemes> = {};

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
    const footerTheme = merge({}, this.chatContext.value.theme.footer, this.theme);
    this.el.style.setProperty('--zane-chat-footer-color', footerTheme.color);
    this.el.style.setProperty('--zane-chat-footer-text-color', footerTheme.textColor);
    this.el.style.setProperty('--zane-chat-footer-font-size', footerTheme.fontSize);
    this.el.style.setProperty('--zane-chat-footer-padding', footerTheme.padding);
  }

  render() {
    return (
      <Host class={ns.b()}>
        <slot></slot>
      </Host>
    );
  }
}
