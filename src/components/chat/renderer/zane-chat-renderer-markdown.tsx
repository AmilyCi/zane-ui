import { Component, h, Host, Prop } from '@stencil/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { useNamespace } from 'src/hooks';

const ns = useNamespace('markdown');

@Component({
  tag: 'zane-chat-renderer-markdown',
  styleUrls: ['zane-chat-renderer-markdown.scss'],
})
export class ZaneChatMarkdownRenderer {

  @Prop() content: string;

  componentWillLoad() {
    marked.use({
      extensions: [{
        name: 'code',
        renderer(token) {
          const lang = token.lang || 'plaintext';
          const highlighted = hljs.highlightAuto(token.text, [lang]).value;
          return `
          <div class="hljs-mac-window">
            <div class="hljs-titlebar">
              <div class="hljs-mac-controls">
                <div class="mac-btn mac-btn-close"></div>
                <div class="mac-btn mac-btn-min"></div>
                <div class="mac-btn mac-btn-max"></div>
              </div>
              <div class="hljs-mac-actions">
                <div class="mac-action-btn copy-btn">复制</div>
              </div>
            </div>
            <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
          </div>`;
        }
      }]
    });
  }

  componentDidLoad() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.parentElement?.querySelector('code');
        navigator.clipboard.writeText(code?.innerText ?? '');
      });
    });
  }

  render() {
    const html = DOMPurify.sanitize(marked.parse(this.content, { async: false, breaks: true }));
    return (
      <Host>
        <div class={ns.b()} innerHTML={html}></div>
      </Host>
    );
  }
}
