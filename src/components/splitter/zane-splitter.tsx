import type { EventEmitter } from '@stencil/core';

import {
  Component,
  Element,
  Event,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { splitterRootContexts } from '../../constants/splitter';
import { useNamespace } from '../../hooks';
import { SplitterRootContext } from './splitter-context';

const ns = useNamespace('splitter');

@Component({
  styleUrl: 'zane-splitter.scss',
  tag: 'zane-splitter',
})
export class ZaneSplitter {
  @Event({ eventName: 'collapse' }) collapseEvent: EventEmitter<{
    index: number;
    type: 'end' | 'start';
  }>;

  @Element() el: HTMLElement;

  @Prop() layout: 'horizontal' | 'vertical' = 'horizontal';

  @Prop() lazy: boolean = false;

  @State() lazyOffset: number = 0;

  @State() movingIndex: { confirmed: boolean; index: number } = null;

  @Event({ eventName: 'zResizeEnd' }) resizeEndEvent: EventEmitter<{
    index: number;
  }>;

  @Event({ eventName: 'zResize' }) resizeEvent: EventEmitter<{
    index: number;
  }>;

  @Event({ eventName: 'zResizeStart' }) resizeStartEvent: EventEmitter<{
    index: number;
  }>;

  private rootContext: SplitterRootContext;

  componentDidLoad() {}

  componentWillLoad() {
    this.rootContext = new SplitterRootContext();
    this.rootContext.containerEl = this.el;
    this.rootContext.layout = this.layout;
    this.rootContext.lazy = this.lazy;
    this.rootContext.onMoveStartCallback = (index: number) => {
      this.resizeStartEvent.emit({
        index,
      });
    };
    this.rootContext.onMovingCallback = (index: number) => {
      this.resizeEvent.emit({
        index,
      });
    };
    this.rootContext.onMoveEndCallback = (index: number) => {
      this.resizeEndEvent.emit({
        index,
      });
    };
    this.rootContext.onCollapseCallback = (
      index: number,
      type: 'end' | 'start',
    ) => {
      this.collapseEvent.emit({
        index,
        type,
      });
    };
    this.rootContext.addLazyOffsetChangeListener(this.lazyOffsetUpdate);
    this.rootContext.addMovingIndexChangeListener(this.movingIndexUpdate);
    // console.log(this.rootContext.uuid);
    splitterRootContexts.set(this.el, this.rootContext);
  }

  disconnectedCallback() {
    this.rootContext = null;
    splitterRootContexts.delete(this.el);
  }

  @Watch('layout')
  handleLayoutChange() {
    this.rootContext.layout = this.layout;
  }

  @Watch('lazy')
  handleLazyChange() {
    this.rootContext.lazy = this.lazy;
    if (this.lazyOffset) {
      const mouseup = new MouseEvent('mouseup', { bubbles: true });
      window.dispatchEvent(mouseup);
    }
  }

  render() {
    const splitterStyles = {
      [ns.cssVarBlockName('bar-offset')]: this.lazy
        ? `${this.lazyOffset}px`
        : undefined,
    };
    return (
      <Host
        class={[ns.b(), ns.e(this.layout)].join(' ')}
        style={splitterStyles}
      >
        <slot />
        {this.movingIndex && (
          <div
            class={[ns.e('mask'), ns.e(`mask-${this.layout}`)].join(' ')}
          ></div>
        )}
      </Host>
    );
  }

  private lazyOffsetUpdate = (val: number) => {
    this.lazyOffset = val;
  };

  private movingIndexUpdate = (
    val: null | { confirmed: boolean; index: number },
  ) => {
    this.movingIndex = val;
  };
}
