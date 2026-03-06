import { Component, h, Prop, Event, EventEmitter, State, Element, Watch, Method } from '@stencil/core';
import type { Alignment, ItemSize, ListCache, VirtualListHelper } from './types';
import { isClient, isNumber, nextFrame } from '../../utils';
import { fixedSizeList } from './fixed-size-list';
import { dynamicSizeList } from './dynamic-size-list';
import { ALIGNMENT_AUTO, BACKWARD, FORWARD, HORIZONTAL, RTL, RTL_OFFSET_NAG, RTL_OFFSET_POS_ASC, RTL_OFFSET_POS_DESC } from './constants';
import { useNamespace } from '../../hooks';
import { getRTLOffsetType, getScrollDir, isHorizontal } from './utils';
import classNames from 'classnames';
import memoize from 'lodash-es/memoize';
import memoizeOne from 'memoize-one';
import { isFirefox } from '../../utils/is/isFirefox';
import { cAF } from '../../utils/raf/cAF';
import { rAF } from '../../utils/raf/rAF';

const ns = useNamespace('vl');

@Component({
  tag: 'zane-virtual-list',
  styleUrl: 'zane-virtual-list.scss'
})
export class ZaneVirtualList {
  @Element() el: HTMLElement;

  @Prop() cache: number = 2;

  @Prop() estimatedItemSize: number;

  @Prop() layout: 'horizontal' | 'vertical' = 'vertical';

  @Prop() initScrollOffset: number = 0;

  @Prop() total: number;

  @Prop() itemSize: number | ItemSize;

  @Prop() wrapperClass: string = '';

  @Prop() containerElement: string = 'div';

  @Prop() data: any[] = [];

  @Prop() direction: 'ltr' | 'rtl' = 'ltr';

  @Prop() height: string | number;

  @Prop() innerElement: string = 'div';

  @Prop() innerProps: Record<string, unknown> = {};

  @Prop() wrapperStyle: Record<string, string>;

  @Prop() useIsScrolling: boolean;

  @Prop() width: number | string;

  @Prop() perfMode: boolean = true;

  @Prop() scrollbarAlwaysOn: boolean = false;

  @Prop() isSized: boolean;

  @Prop() itemRender: (
    data: {
      data: any[],
      index: number,
      isScrolling: boolean,
      style: Record<string, any>
    }
  ) => HTMLElement;

  @Event({ eventName: 'zItemRendered', bubbles: false })
  itemRenderedEvent: EventEmitter<{
    cacheStart: number;
    cacheEnd: number;
    visibleStart: number;
    visibleEnd: number;
  }>;

  @Event({ eventName: 'zScroll', bubbles: false })
  scrollEvent: EventEmitter<{
    scrollDir: string;
    scrollOffset: number;
    updateRequested: boolean;
  }>;

  @State() states = {
    isScrolling: false,
    scrollDir: 'forward',
    scrollOffset: isNumber(this.initScrollOffset) ? this.initScrollOffset : 0,
    updateRequested: false,
    isScrollbarDragging: false,
    scrollbarAlwaysOn: this.scrollbarAlwaysOn,
  }

  @State() itemsToRender: [number, number, number, number] = [0, 0, 0, 0];

  @State() itemStyleCache: any;

  @State() estimatedTotalSize: number = 0;

  @State() clientSize: number;

  private windowRef: HTMLElement;

  private innerRef: HTMLElement;

  private scrollbarRef: HTMLZaneVirtualScrollbarElement;

  private helper: VirtualListHelper;

  private dynamicSizeCache: ListCache;

  private frameHandle: number;

  private offset = 0;

  private _itemStyleCache = (_: any, __: any, ___:any) => ({}) as Record<string, any>;

  @Watch('width')
  @Watch('height')
  @Watch('layout')
  handleUpdateClientSize() {
    const parsedWidth = Number.parseInt(`${this.width}`, 10);
    const parsedHeight = Number.parseInt(`${this.height}`, 10);
    this.clientSize = isHorizontal(this.layout) ? parsedWidth : parsedHeight;
  }

  @Watch('perfMode')
  handlePerfModeChange() {
    this.itemStyleCache = this.perfMode
      ? memoize(this._itemStyleCache)
      : memoizeOne(this._itemStyleCache);
  }

  @Watch('total')
  @Watch('cache')
  @Watch('states')
  updateItemsToRender() {
    const { total, cache } = this;
    const { isScrolling, scrollDir, scrollOffset} = this.states;

    if (total === 0) {
      this.itemsToRender = [0, 0, 0, 0];
      return;
    }

    const startIndex = this.helper.getStartIndexForOffset(
      this,
      scrollOffset,
      this.dynamicSizeCache,
    );

    const stopIndex = this.helper.getStopIndexForStartIndex(
      this,
      startIndex,
      scrollOffset,
      this.dynamicSizeCache,
    );

    const cacheBackward = !isScrolling || scrollDir === BACKWARD
      ? Math.max(1, cache)
      : 1;

    const cacheForward = !isScrolling || scrollDir === FORWARD
      ? Math.max(1, cache)
      : 1;

    this.itemsToRender = [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(total - 1, stopIndex + cacheForward)),
      startIndex,
      stopIndex
    ];
  }

  @Method()
  async getWindowRef() {
    return this.windowRef;
  }

  @Method()
  async getInnerRef() {
    return this.innerRef;
  }

  @Method()
  async getItemStyleCache() {
    return this.itemStyleCache;
  }

  @Method()
  async getStates() {
    return this.states;
  }

  @Method()
  async resetScrollTop() {
    if (this.windowRef) {
      this.windowRef.scrollTop = 0;
    }
  }

  private getItemStyle = (idx: number) => {
    const { direction, itemSize, layout } = this;

    const itemStyleCache = this.itemStyleCache(
      this.helper.clearCache && itemSize,
      this.helper.clearCache && layout,
      this.helper.clearCache && direction
    );

    let style: Record<string, any>;
    if (Object.prototype.hasOwnProperty.call(itemStyleCache, String(idx))) {
      style = itemStyleCache[idx];
    } else {
      const offset = this.helper.getItemOffset(this, idx, this.dynamicSizeCache);
      const size = this.helper.getItemSize(this, idx, this.dynamicSizeCache);
      const horizontal = isHorizontal(this.layout);

      const isRtl = direction === RTL;
      const offsetHorizontal = horizontal ? offset : 0;

      itemStyleCache[idx] = style = {
        position: 'absolute',
        left: isRtl ? undefined : `${offsetHorizontal}px`,
        right: isRtl ? `${offsetHorizontal}px` : undefined,
        top: !horizontal ? `${offset}px` : '0',
        height: !horizontal ? `${size}px` : '100%',
        width: horizontal ? `${size}px` : '100%',
      }
    }
    return style;
  }

  private renderItems = () => {
    const { itemsToRender, itemRender } = this;
    const children = [];
    if (itemRender && this.total > 0) {
      const [start, end] = itemsToRender;
      for (let i = start; i <= end; i++) {
        children.push(this.itemRender({
          data: this.data,
          index: i,
          isScrolling: this.useIsScrolling ? this.states.isScrolling : undefined,
          style: this.getItemStyle(i)
        }));
      }
    }
    return children;
  }

  private hasReachedEdge = (offset: number) => {
    const atStartEdge = this.states.scrollOffset <= 0;
    const atEndEdge = this.states.scrollOffset >= this.estimatedTotalSize;
    const edgeReached = (offset < 0 && atStartEdge) ||
      (offset > 0 && atEndEdge);
    return edgeReached;
  }

  private resetIsScrolling = () => {
    this.states = {
      ...this.states,
      isScrolling: false,
    }

    nextFrame(() => {
      this.itemStyleCache(-1, null, null)
    });
  }

  @Method()
  async zScrollTo(offset: number) {
    offset = Math.max(offset, 0);

    if (offset === this.states.scrollOffset) {
      return;
    }

    this.states = {
      ...this.states,
      scrollOffset: offset,
      scrollDir: getScrollDir(this.states.scrollOffset, offset),
      updateRequested: true,
    }

    nextFrame(() => {
      this.resetIsScrolling();
    })
  }

  @Method()
  async zScrollToItem(
    idx: number,
    alignment: Alignment = ALIGNMENT_AUTO
  ) {
    const { scrollOffset } = this.states;

    idx = Math.max(0, Math.min(idx, this.total - 1));

    this.zScrollTo(
      this.helper.getOffset(this, idx, alignment, scrollOffset, this.dynamicSizeCache)
    );
  }

  private onWheelDelta = (offset: number) => {
    this.scrollbarRef?.onZMouseUp?.();
    this.zScrollTo(
      Math.min(
        this.states.scrollOffset + offset,
        this.estimatedTotalSize - (this.clientSize || 0)
      )
    )
  }

  private onWheel = (e: WheelEvent) => {
    cAF(this.frameHandle);

    let { deltaX, deltaY } = e;

    if (e.shiftKey && deltaY !== 0) {
      deltaX = deltaY;
      deltaY = 0;
    }

    const newOffset = this.layout === HORIZONTAL ? deltaX : deltaY;

    if (this.hasReachedEdge(newOffset)) {
      return;
    }

    this.offset += newOffset;

    if (!isFirefox() && newOffset !== 0) {
      e.preventDefault();
    }

    this.frameHandle = rAF(() => {
      this.onWheelDelta(this.offset);
      this.offset = 0;
    })
  }

  private onVisibilityChange = () => {
    if (!document.hidden && this.windowRef) {
      this.windowRef.scrollTop = this.states.scrollOffset;
    }
  }

  private onScroll = (e: Event) => {
    isHorizontal(this.layout) ? this.scrollHorizontally(e) : this.scrollVertically(e);
    this.emitEvents();
  }

  private scrollHorizontally = (e: Event) => {
    const { clientWidth, scrollWidth, scrollLeft } = e.currentTarget as HTMLElement;
    if (this.states.scrollOffset === scrollLeft) {
      return;
    }

    let scrollOffset = scrollLeft;

    if (this.direction === RTL) {
      switch(getRTLOffsetType()) {
        case RTL_OFFSET_NAG: {
          scrollOffset = -scrollLeft;
          break;
        }
        case RTL_OFFSET_POS_DESC: {
          scrollOffset = scrollWidth - clientWidth - scrollLeft;
          break;
        }
      }
    }

    scrollOffset = Math.max(
      0,
      Math.min(scrollOffset, scrollWidth - clientWidth)
    );

    this.states = {
      ...this.states,
      isScrolling: true,
      scrollDir: getScrollDir(this.states.scrollOffset, scrollOffset),
      scrollOffset,
      updateRequested: false,
    };

    nextFrame(() => {
      this.resetIsScrolling();
    });
  }

  private scrollVertically = (e: Event) => {
    const { scrollHeight, clientHeight, scrollTop } = e.currentTarget as HTMLElement;

    if (this.states.scrollOffset === scrollTop) {
      return;
    }

    const scrollOffset = Math.max(
      0,
      Math.min(scrollTop, scrollHeight - clientHeight)
    );

    this.states = {
      ...this.states,
      isScrolling: true,
      scrollDir: getScrollDir(this.states.scrollOffset, scrollOffset),
      scrollOffset,
      updateRequested: false,
    };

    nextFrame(() => {
      this.resetIsScrolling();
    });
  }

  private onScrollbarScroll = (event: CustomEvent<{
    distance: number;
    totalSteps: number;
  }>) => {
    const { distance, totalSteps } = event.detail;
    const offset = ((this.estimatedTotalSize - this.clientSize) / totalSteps) * distance;
    this.zScrollTo(Math.min(
      this.estimatedTotalSize - this.clientSize,
      offset
    ));
  }

  private emitEvents = () => {
    const { total } = this;

    if (total > 0) {
      const [cacheStart, cacheEnd, visibleStart, visibleEnd] = this.itemsToRender;
      this.itemRenderedEvent.emit({
        cacheStart,
        cacheEnd,
        visibleStart,
        visibleEnd
      });
    }

    const {scrollDir, scrollOffset, updateRequested } = this.states;
    this.scrollEvent.emit({
      scrollDir,
      scrollOffset,
      updateRequested
    });
  }

  componentWillLoad() {
    this.helper = this.isSized ? fixedSizeList : dynamicSizeList;
    this.helper.validateProps({
      itemSize: this.itemSize,
    });
    this.dynamicSizeCache = this.helper.initCache({
      estimatedItemSize: this.estimatedItemSize
    }, this);

    this.estimatedTotalSize = this.helper.getEstimatedTotalSize(this, this.dynamicSizeCache);

    this.handleUpdateClientSize();
    this.handlePerfModeChange();
    this.updateItemsToRender();
  }

  componentDidLoad() {
    this.windowRef?.addEventListener('wheel', this.onWheel, {passive: false});
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    if (!isClient) {
      return;
    }

    const _isHorizontal = isHorizontal(this.layout)
    const { initScrollOffset } = this;
    if (isNumber(initScrollOffset) && this.windowRef) {
      if (_isHorizontal) {
        this.windowRef.scrollLeft = initScrollOffset;
      } else {
        this.windowRef.scrollTop = initScrollOffset;
      }
    }

    this.emitEvents();
  }

  componentDidUpdate() {
    const { direction, layout } = this;
    const { scrollOffset, updateRequested } = this.states;

    if (updateRequested && this.windowRef) {
      if (layout === HORIZONTAL) {
        if (direction === RTL) {
          switch(getRTLOffsetType()) {
            case RTL_OFFSET_NAG: {
              this.windowRef.scrollLeft = -scrollOffset;
              break;
            }
            case RTL_OFFSET_POS_ASC: {
              this.windowRef.scrollLeft = scrollOffset;
              break;
            }
            default: {
              const { clientWidth, scrollWidth } = this.windowRef;
              this.windowRef.scrollLeft = scrollWidth - clientWidth - scrollOffset;
              break;
            }
          }
        } else {
          this.windowRef.scrollLeft = scrollOffset;
        }
      } else {
        this.windowRef.scrollTop = scrollOffset;
      }
    }
  }

  disconnectedCallback() {
    this.windowRef?.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  render() {

    const Container = this.containerElement;
    const Inner = this.innerElement;

    return (
      <div
        class={classNames(
          ns.e('wrapper'),
          this.states.scrollbarAlwaysOn ? 'always-on' : ''
        )}
      >
        <Container
          ref={(el) => this.windowRef = el}
          class={classNames(ns.e('window'), this.wrapperClass)}
          style={{
            position: 'relative',
            [`overflow-${isHorizontal(this.layout) ? 'x' : 'y'}`]: 'scroll',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
            direction: this.direction,
            width: isNumber(this.width) ? `${this.width}px` : this.width,
            height: isNumber(this.height) ? `${this.height}px` : this.height,
            ...this.wrapperStyle,
          }}
          onScroll={this.onScroll}
        >
          <Inner
            {...this.innerProps}
            ref={(el) => this.innerRef = el}
            style={{
              height: isHorizontal(this.layout) ? '100%' : `${this.estimatedTotalSize}px`,
              width: isHorizontal(this.layout) ? `${this.estimatedTotalSize}px` : '100%',
              pointerEvents: this.states.isScrolling ? 'none': undefined,
              margin: 0,
              boxSizing: 'border-box',
            }}
          >
            { this.renderItems() }
          </Inner>
        </Container>
        <zane-virtual-scrollbar
          ref={(el) => this.scrollbarRef = el}
          clientSize={Number(this.clientSize)}
          layout={this.layout}
          ratio={(this.clientSize * 100) / this.estimatedTotalSize}
          scrollFrom={this.states.scrollOffset / (this.estimatedTotalSize - this.clientSize)}
          total={this.total}
          alwaysOn={this.states.scrollbarAlwaysOn}
          onZScroll={this.onScrollbarScroll}
        ></zane-virtual-scrollbar>
      </div>
    );
  }
}
