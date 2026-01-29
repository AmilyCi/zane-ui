
import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { BAR_MAP, scrollbarContexts } from './constants';
import { useNamespace } from '../../hooks';
import { isClient } from '../../utils';
import type { ScrollbarContext } from './scrollbar-context';

const ns = useNamespace('scrollbar');

@Component({
  tag: 'zane-thumb',
})
export class ZaneBar {
  @Prop() always: boolean;

  @Element() el: HTMLElement;

  @Prop() move: number;

  @Prop() ratio: number;

  @Prop() size: string;

  @State() thumbState: Partial<Record<'X' | 'Y', number>> = {};

  @Prop() vertical: boolean;

  @State() visible = false;

  get bar() {
    return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
  }

  get offsetRatio() {
    if (
      !this.instanceRef ||
      !this.thumbRef ||
      !this.scrollbarContext.wrapElement
    ) {
      return 1;
    }
    return (
      this.instanceRef[this.bar.offset] ** 2 /
      this.scrollbarContext.wrapElement[this.bar.scrollSize] /
      this.ratio /
      this.thumbRef[this.bar.offset]
    );
  }

  get scrollbarContext(): ScrollbarContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-SCROLLBAR') {
        context = scrollbarContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  private baseScrollHeight: number = 0;

  private baseScrollWidth: number = 0;

  private cursorDown: boolean = false;

  private cursorLeave: boolean = false;

  private instanceRef: HTMLDivElement;

  private originalOnSelectStart = isClient ? document.onselectstart : null;

  private thumbRef: HTMLDivElement;

  componentDidLoad() {
    this.scrollbarContext.scrollbarElement?.addEventListener(
      'mousemove',
      this.mouseMoveScrollbarHandler,
    );

    this.scrollbarContext.scrollbarElement?.addEventListener(
      'mouseleave',
      this.mouseLeaveScrollbarHandler,
    );
  }

  disconnectedCallback() {
    this.restoreOnselectstart();
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
    this.scrollbarContext?.scrollbarElement?.removeEventListener(
      'mousemove',
      this.mouseMoveScrollbarHandler,
    );

    this.scrollbarContext?.scrollbarElement?.removeEventListener(
      'mouseleave',
      this.mouseLeaveScrollbarHandler,
    );
  }

  render() {
    const thumbStyle = {
      [this.bar.size]: this.size,
      transform: `translate${this.bar.axis}(${this.move}%)`,
    };

    return (
      <Host class={ns.b('fade')}>
        <div
          class={[ns.e('bar'), ns.is(this.bar.key)].join(' ')}
          onClick={this.clickHandler}
          onMouseDown={this.clickTrackHandler}
          ref={(el) => (this.instanceRef = el)}
          style={{ display: this.always || this.visible ? '' : 'none' }}
        >
          <div
            class={ns.e('thumb')}
            onMouseDown={this.clickThumbHandler}
            ref={(el) => (this.thumbRef = el)}
            style={thumbStyle}
          />
        </div>
      </Host>
    );
  }

  private clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  private clickThumbHandler = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || [1, 2].includes(e.button)) return;

    window.getSelection()?.removeAllRanges();
    this.startDrag(e);

    const el = e.currentTarget as HTMLDivElement;
    if (!el) return;

    this.thumbState[this.bar.axis] =
      el[this.bar.offset] -
      (e[this.bar.client] - el.getBoundingClientRect()[this.bar.direction]);
  };

  private clickTrackHandler = (e: MouseEvent) => {
    if (
      !this.thumbRef ||
      !this.instanceRef ||
      !this.scrollbarContext.wrapElement
    )
      return;

    const offset = Math.abs(
      (e.target as HTMLElement).getBoundingClientRect()[this.bar.direction] -
        e[this.bar.client],
    );
    const thumbHalf = this.thumbRef[this.bar.offset] / 2;
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100 * this.offsetRatio) /
      this.instanceRef[this.bar.offset];

    this.scrollbarContext.wrapElement[this.bar.scroll] =
      (thumbPositionPercentage *
        this.scrollbarContext.wrapElement[this.bar.scrollSize]) /
      100;
  };

  private mouseLeaveScrollbarHandler = () => {
    this.cursorLeave = true;
    this.visible = this.cursorDown;
  };

  private mouseMoveDocumentHandler = (e: MouseEvent) => {
    if (!this.instanceRef || !this.thumbRef) return;
    if (this.cursorDown === false) return;

    const prevPage = this.thumbState[this.bar.axis];
    if (!prevPage) return;

    const offset =
      (this.instanceRef.getBoundingClientRect()[this.bar.direction] -
        e[this.bar.client]) *
      -1;
    const thumbClickPosition = this.thumbRef[this.bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * this.offsetRatio) /
      this.instanceRef[this.bar.offset];

    this.scrollbarContext.wrapElement[this.bar.scroll] =
      this.bar.scroll === 'scrollLeft'
        ? (thumbPositionPercentage * this.baseScrollWidth) / 100
        : (thumbPositionPercentage * this.baseScrollHeight) / 100;
  };

  private mouseMoveScrollbarHandler = () => {
    this.cursorLeave = false;
    this.visible = !!this.size;
  };

  private mouseUpDocumentHandler = () => {
    this.cursorDown = false;
    this.thumbState[this.bar.axis] = 0;
    document.removeEventListener('mousemove', this.mouseMoveDocumentHandler);
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler);
    this.restoreOnselectstart();
    if (this.cursorLeave) this.visible = false;
  };

  private restoreOnselectstart = () => {
    if (document.onselectstart !== this.originalOnSelectStart)
      document.addEventListener('selectstart', this.originalOnSelectStart);
  };

  private startDrag = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    this.cursorDown = true;
    this.baseScrollHeight = this.scrollbarContext.wrapElement.scrollHeight;
    this.baseScrollWidth = this.scrollbarContext.wrapElement.scrollWidth;
    document.addEventListener('mousemove', this.mouseMoveDocumentHandler);
    document.addEventListener('mouseup', this.mouseUpDocumentHandler);
    this.originalOnSelectStart = document.onselectstart;
    document.addEventListener('selectstart', () => false);
  };
}
