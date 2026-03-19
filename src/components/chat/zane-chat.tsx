import { Component, Host, Prop, h, Element, Watch, Method } from '@stencil/core';
import type { ThemeTokens, ChatContext } from './types';
import { hasRawParent, ReactiveObject } from '../../utils';
import { chatContexts, defaultTheme } from './constants';
import { useNamespace } from '../../hooks';
import merge from 'lodash-es/merge';

const ns = useNamespace('chat');

@Component({
  tag: 'zane-chat',
  styleUrl: 'zane-chat.scss',
})
export class ZaneChat {

  @Element() el!: HTMLElement;

  @Prop({ reflect: false }) theme: Partial<ThemeTokens> = {};

  private context: ReactiveObject<ChatContext>

  @Watch('theme')
  watchThemeHandler() {
    this.context.value.theme = merge({}, this.context.value.theme, this.theme);
    this.updateTheme();
  }

  @Method()
  async getContext() {
    return this.context;
  }

  componentWillLoad() {
    this.context = new ReactiveObject<ChatContext>({
      theme: merge({}, defaultTheme, this.theme),
    });

    chatContexts.set(this.el, this.context);

    this.updateTheme();
  }

  disconnectedCallback() {
    if (!hasRawParent(this.el)) {
      chatContexts.delete(this.el);
      this.context = undefined;
    }
  }

  updateTheme() {
    const theme = this.context.value.theme;
    this.el.style.setProperty('--zane-chat-bezier', theme.root.bezier);
    this.el.style.setProperty('--zane-chat-primary', theme.root.primary);
    this.el.style.setProperty('--zane-chat-color', theme.root.color);
    this.el.style.setProperty('--zane-chat-border-color', theme.root.borderColor);
    this.el.style.setProperty('--zane-chat-border-size', theme.root.borderSize);
    this.el.style.setProperty('--zane-chat-box-shadow', theme.root.boxShadow);
    this.el.style.setProperty('--zane-chat-border-radius', theme.root.borderRadius);
    this.el.style.setProperty('--zane-chat-padding', theme.root.padding);
  }

  render() {
    return (
      <Host class={ns.b()}>
        <slot></slot>
      </Host>
    );
  }
}
