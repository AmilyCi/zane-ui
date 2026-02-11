import { Component, Event, h, Method, Prop, State, Watch, type EventEmitter } from '@stencil/core';
import type { Alignment, GridCache, GridItemKeyGetter, Indices, ItemSize, VirtualGridHelper } from './types';
import { useNamespace } from '../../hooks';
import { isClient, isNumber, isUndefined, nextFrame } from '../../utils';
import { getRTLOffsetType, getScrollDir, isRTL } from './utils';
import { RTL_OFFSET_NAG, RTL_OFFSET_POS_DESC, FORWARD, RTL, RTL_OFFSET_POS_ASC, BACKWARD, ALIGNMENT_AUTO } from './constants';
import { fixedSizeGrid } from './fixed-size-grid';
import { dynamicSizeGrid } from './dynamic-size-grid';
import memoize from 'lodash-es/memoize';
import memoizeOne from 'memoize-one';
import { cAF } from '../../utils/raf/cAF';
import { rAF } from '../../utils/raf/rAF';
import { getScrollbarWidth } from 'src/utils/dom/element/getScrollbarWidth';

const ns = useNamespace('vl');

@Component({
  tag: 'zane-virtual-grid',
  styleUrl: 'zane-virtual-grid.scss'
})
export class ZaneVirtualGrid {
  @Prop() columnCache: number = 2;

  @Prop() columnWidth: number | ItemSize;

  @Prop() estimatedColumnWidth: number;

  @Prop() estimatedRowHeight: number;

  @Prop() initScrollLeft: number = 0;

  @Prop() initScrollTop: number = 0;

  @Prop() itemKey: GridItemKeyGetter = ({columnIndex, rowIndex}) => `${columnIndex}-${rowIndex}`;

  @Prop() rowCache: number = 2;

  @Prop() rowHeight: number | ItemSize;

  @Prop() totalColumn: number;

  @Prop() totalRow: number;

  @Prop() hScrollbarSize: number = 6;

  @Prop() vScrollbarSize: number = 6;

  @Prop() scrollbarStartGap: number = 0;

  @Prop() scrollbarEndGap: number = 2;

  @Prop() role: string;

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

  @Prop() scrollbarAlwaysOn: boolean;

  @Prop() isSized: boolean;

  @Prop() itemRender: (
    data: {
      columnIndex: number,
      data: any[],
      isScrolling: boolean,
      style: Record<string, string>,
      rowIndex: number,
      key: string | number,
    }
  ) => HTMLElement

  @Event({ eventName: 'zItemRendered'}) itemRenderedEvent: EventEmitter<{
    columnCacheStart: number;
    columnCacheEnd: number;
    columnVisibleStart: number;
    columnVisibleEnd: number;
    rowCacheStart: number;
    rowCacheEnd: number;
    rowVisibleStart: number;
    rowVisibleEnd: number;
  }>;

  @Event({ eventName: 'zScroll'}) scrollEvent: EventEmitter<{
    scrollLeft: number;
    scrollTop: number;
    updateRequested: boolean;
    xAxisScrollDir: string;
    yAxisScrollDir: string;
  }>;

  @State() states = {
    isScrolling: false,
    scrollLeft: isNumber(this.initScrollLeft) ? this.initScrollLeft : 0,
    scrollTop: isNumber(this.initScrollTop) ? this.initScrollTop : 0,
    updateRequested: false,
    xAxisScrollDir: FORWARD,
    yAxisScrollDir: FORWARD,
  }

  @State() itemStyleCache: any;

  @State() columnsToRender: [number, number, number, number] = [0, 0, 0, 0];

  @State() rowsToRender: [number, number, number, number] = [0, 0, 0, 0];

  @State() touchStartX: number = 0;

  @State() touchStartY: number = 0;

  private frameHandle: number | undefined = undefined;

  private estimatedTotalWidth: number;

  private estimatedTotalHeight: number;

  private windowRef: HTMLElement;

  private innerRef: HTMLElement;

  private hScrollbar: HTMLZaneVirtualScrollbarElement;

  private vScrollbar: HTMLZaneVirtualScrollbarElement;

  private helper: VirtualGridHelper;

  private cache: GridCache;

  private deltaX = 0;

  private deltaY = 0;

  private xOffset = 0;

  private yOffset = 0;

  private _itemStyleCache = (_: any, __: any, ___:any) => ({}) as Record<string, any>;

  @Watch('perfMode')
  handlePerfModeChange() {
    this.itemStyleCache = this.perfMode
      ? memoize(this._itemStyleCache)
      : memoizeOne(this._itemStyleCache);
  }

  @Watch('totalColumn')
  @Watch('totalRow')
  @Watch('columnCache')
  @Watch('columnWidth')
  @Watch('rowHeight')
  @Watch('width')
  @Watch('height')
  @Watch('states')
  handleUpdateColumnsToRender() {
    if (this.totalColumn === 0 || this.totalRow === 0) {
      this.columnsToRender = [0, 0, 0, 0];
      return;
    }
    const startIndex = this.helper.getColumnStartIndexForOffset(
      {
        totalColumn: this.totalColumn,
        totalRow: this.totalRow,
        columnWidth: this.columnWidth,
        rowHeight: this.rowHeight,
        width: this.width,
        height: this.height,
      },
      this.states.scrollLeft,
      this.cache
    );

    const stopIndex = this.helper.getColumnStopIndexForStartIndex(
      {
        totalColumn: this.totalColumn,
        totalRow: this.totalRow,
        columnWidth: this.columnWidth,
        rowHeight: this.rowHeight,
        width: this.width,
        height: this.height,
      },
      startIndex,
      this.states.scrollLeft,
      this.cache
    );

    const cacheBackward = !this.states.isScrolling || this.states.xAxisScrollDir === BACKWARD
      ? Math.max(1, this.columnCache)
      : 1;

    const cacheForward = !this.states.isScrolling || this.states.xAxisScrollDir === FORWARD
      ? Math.max(1, this.columnCache)
      : 1;

    this.columnsToRender = [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(this.totalColumn - 1, stopIndex + cacheForward)),
      startIndex,
      stopIndex
    ];
  }

  @Watch('totalColumn')
  @Watch('totalRow')
  @Watch('columnWidth')
  @Watch('rowHeight')
  @Watch('width')
  @Watch('height')
  @Watch('states')
  handleUpdateRowsToRender() {
    if (this.totalColumn === 0 || this.totalRow === 0) {
      this.rowsToRender = [0, 0, 0, 0];
      return;
    }
    const startIndex = this.helper.getRowStartIndexForOffset(
      {
        totalColumn: this.totalColumn,
        totalRow: this.totalRow,
        columnWidth: this.columnWidth,
        rowHeight: this.rowHeight,
        width: this.width,
        height: this.height,
      },
      this.states.scrollTop,
      this.cache
    );

    const stopIndex = this.helper.getRowStopIndexForStartIndex(
      {
        totalColumn: this.totalColumn,
        totalRow: this.totalRow,
        columnWidth: this.columnWidth,
        rowHeight: this.rowHeight,
        width: this.width,
        height: this.height,
      },
      startIndex,
      this.states.scrollTop,
      this.cache
    );

    const cacheBackward = !this.states.isScrolling || this.states.yAxisScrollDir === BACKWARD
      ? Math.max(1, this.rowCache)
      : 1;

    const cacheForward = !this.states.isScrolling || this.states.yAxisScrollDir === FORWARD
      ? Math.max(1, this.rowCache)
      : 1;

    this.rowsToRender = [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(this.totalRow - 1, stopIndex + cacheForward)),
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
  async getTouchStartX() {
    return this.touchStartX;
  }

  @Method()
  async getTouchStartY() {
    return this.touchStartY;
  }

  @Method()
  async resetAfterColumnIndex(
    columnIndex: number,
    forceUpdate: boolean
  ) {
    this.resetAfter(
      { columnIndex },
      forceUpdate
    );
  }

  @Method()
  async resetAfterRowIndex(
    rowIndex: number,
    forceUpdate: boolean
  ) {
    this.resetAfter(
      { rowIndex },
      forceUpdate
    );
  }

  @Method()
  async resetAfter(
    { columnIndex, rowIndex }: Indices,
    forceUpdate?: boolean
  ) {
    forceUpdate = isUndefined(forceUpdate) ? true : forceUpdate;

    if (isNumber(columnIndex)) {
      this.cache.lastVisitedColumnIndex = Math.min(
        this.cache.lastVisitedColumnIndex,
        columnIndex - 1
      );
    }
    if (isNumber(rowIndex)) {
      this.cache.lastVisitedRowIndex = Math.min(
        this.cache.lastVisitedRowIndex,
        rowIndex - 1
      );
    }

    this.itemStyleCache(-1, null, null);

    if (forceUpdate) {
      this.render();
    }
  }

  private resetIsScrolling = () => {
    this.states = {
      ...this.states,
      isScrolling: false,
    }

    nextFrame(() => {
      this.itemStyleCache(-1, null, null);
    });
  }

  private handleScroll = (event: Event) => {
    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth
    } = event.currentTarget as HTMLElement;

    const states = {...this.states};
    if (
      states.scrollTop === scrollTop &&
      states.scrollLeft === scrollLeft
    ) {
      return;
    }

    let _scrollLeft = scrollLeft;

    if (isRTL(this.direction)) {
      switch(getRTLOffsetType()) {
        case RTL_OFFSET_NAG:
          _scrollLeft = -scrollLeft;
          break;
        case RTL_OFFSET_POS_DESC:
          _scrollLeft = scrollWidth - clientWidth + scrollLeft;
          break;
      }
    }

    this.states = {
      ...this.states,
      isScrolling: true,
      scrollLeft: _scrollLeft,
      scrollTop: Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight)),
      updateRequested: true,
      xAxisScrollDir: getScrollDir(states.scrollLeft, _scrollLeft),
      yAxisScrollDir: getScrollDir(states.scrollTop, scrollTop)
    }

    nextFrame(() => {
      this.resetIsScrolling();
    });

    this.onUpdated();
    this.emitEvents();
  }

  @Method()
  async zScrollTo({
    scrollLeft = this.states.scrollLeft,
    scrollTop = this.states.scrollTop
  }) {
    scrollLeft = Math.max(scrollLeft, 0);
    scrollTop = Math.max(scrollTop, 0);

    const _states = {...this.states};
    if (scrollTop === _states.scrollTop && scrollLeft === _states.scrollLeft) {
      return;
    }

    this.states = {
      ..._states,
      xAxisScrollDir: getScrollDir(_states.scrollLeft, scrollLeft),
      yAxisScrollDir: getScrollDir(_states.scrollTop, scrollTop),
      scrollLeft,
      scrollTop,
      updateRequested: true,
    };

    nextFrame(() => {
      this.resetIsScrolling();
    });

    this.onUpdated();
    this.emitEvents();
  }

  @Method()
  async zScrollToItem(
    rowIndex = 0,
    columnIdx = 0,
    alignment: Alignment = ALIGNMENT_AUTO
  ) {
    columnIdx = Math.max(0, Math.min(columnIdx, this.totalColumn - 1));
    rowIndex = Math.max(0, Math.min(rowIndex, this.totalRow - 1));

    const parsedWidth = Number.parseInt(`${this.width}`, 10);
    const parsedHeight = Number.parseInt(`${this.height}`, 10);

    const scrollbarWidth = getScrollbarWidth(ns.namespace);
    const estimatedHeight = this.helper.getEstimatedTotalHeight(this, this.cache);
    const estimatedWidth = this.helper.getEstimatedTotalWidth(this, this.cache);

    this.zScrollTo({
      scrollLeft: this.helper.getColumnOffset(
        this,
        columnIdx,
        alignment,
        this.states.scrollLeft,
        this.cache,
        estimatedWidth > parsedWidth ? scrollbarWidth : 0
      ),
      scrollTop: this.helper.getRowOffset(
        this,
        rowIndex,
        alignment,
        this.states.scrollTop,
        this.cache,
        estimatedHeight > parsedHeight ? scrollbarWidth : 0
      )
    });
  }

  private onHorizontalScroll = (event: CustomEvent<{distance: number, totalSteps: number}>) => {
    const width = Number.parseInt(`${this.width}`, 10);
    const { totalSteps, distance } = event.detail;
    const offset = ((this.estimatedTotalWidth - width) / totalSteps) * distance;
    this.zScrollTo({
      scrollLeft: Math.min(this.estimatedTotalWidth - width, offset)
    })
  }

  private onVerticalScroll = (event: CustomEvent<{distance: number, totalSteps: number}>) => {
    const height = Number.parseInt(`${this.height}`, 10);
    const { totalSteps, distance } = event.detail;
    const offset = ((this.estimatedTotalHeight - height) / totalSteps) * distance;
    this.zScrollTo({
      scrollTop: Math.min(this.estimatedTotalHeight - height, offset)
    })
  }

  private onUpdated = () => {
    if (this.states.updateRequested && this.windowRef) {
      if (this.direction === RTL) {
        switch(getRTLOffsetType()) {
          case RTL_OFFSET_NAG: {
            this.windowRef.scrollLeft = -this.states.scrollLeft;
            break;
          }
          case RTL_OFFSET_POS_ASC: {
            this.windowRef.scrollLeft = -this.states.scrollLeft;
            break;
          }
          default: {
            const { clientWidth, scrollWidth } = this.windowRef;
            this.windowRef.scrollLeft = scrollWidth - clientWidth - this.states.scrollLeft;
            break;
          }
        }
      } else {
        this.windowRef.scrollLeft = Math.max(0, this.states.scrollLeft);
      }
      this.windowRef.scrollTop = Math.max(0, this.states.scrollTop);
    }
  }

  private hasReachedEdge = (x: number, y: number) => {
    const parsedWidth = Number.parseInt(`${this.width}`, 10);
    const parsedHeight = Number.parseInt(`${this.height}`, 10);
    const atXStartEdge = this.states.scrollLeft <= 0;
    const atXEndEdge = this.states.scrollLeft >= this.estimatedTotalWidth - parsedWidth;
    const atYStartEdge = this.states.scrollTop <= 0;
    const atYEndEdge = this.states.scrollTop >= this.estimatedTotalHeight - parsedHeight;
    const xEdgeReached =
      (x < 0 && atXStartEdge) || (x > 0 && atXEndEdge);
    const yEdgeReached =
      (y < 0 && atYStartEdge) || (y > 0 && atYEndEdge);
    return xEdgeReached || yEdgeReached;
  }

  private onWheelDelta = (x: number, y: number) => {
    this.hScrollbar?.onZMouseUp();
    this.vScrollbar?.onZMouseUp();

    const width = Number.parseInt(`${this.width}`, 10);
    const height = Number.parseInt(`${this.height}`, 10);
    this.zScrollTo({
      scrollLeft: Math.min(
        this.states.scrollLeft + x,
        this.estimatedTotalWidth - width
      ),
      scrollTop: Math.min(
        this.states.scrollTop + y,
        this.estimatedTotalHeight - height
      )
    });
  }

  private onWheel = (event: WheelEvent) => {
    cAF(this.frameHandle);

    let x = event.deltaX;
    let y = event.deltaY;

    if (Math.abs(x) > Math.abs(y)) {
      y = 0;
    } else {
      x = 0;
    }

    if (event.shiftKey && y !== 0) {
      x = y;
      y = 0;
    }

    if (this.hasReachedEdge(x, y)) {
      return;
    }

    this.xOffset += x;
    this.yOffset += y;

    event.preventDefault();

    this.frameHandle = rAF(() => {
      this.onWheelDelta(this.xOffset, this.yOffset);
      this.xOffset = 0;
      this.yOffset = 0;
    });
  }

  @Method()
  async handleTouchStart(event: TouchEvent) {
    cAF(this.frameHandle);
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  @Method()
  async handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    cAF(this.frameHandle);

    this.deltaX += this.touchStartX - event.touches[0].clientX;
    this.deltaY += this.touchStartY - event.touches[0].clientY;

    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;

    this.frameHandle = rAF(() => {
      const parsedWidth = Number.parseInt(`${this.width}`, 10);
      const parsedHeight = Number.parseInt(`${this.height}`, 10);
      const maxScrollLeft = this.estimatedTotalWidth - parsedWidth;
      const maxScrollTop = this.estimatedTotalHeight - parsedHeight;

      const safeScrollLeft = Math.min(
        this.states.scrollLeft + this.deltaX,
        maxScrollLeft,
      );

      const safeScrollTop = Math.min(
        this.states.scrollTop + this.deltaY,
        maxScrollTop,
      );

      this.zScrollTo({
        scrollLeft: safeScrollLeft,
        scrollTop: safeScrollTop
      });

      this.deltaX = 0;
      this.deltaY = 0;
    });
  }

  private emitEvents = () => {
    if (this.totalColumn > 0 && this.totalRow > 0) {
      const [
        columnCacheStart,
        columnCacheEnd,
        columnVisibleStart,
        columnVisibleEnd
      ] = this.columnsToRender;

      const [
        rowCacheStart,
        rowCacheEnd,
        rowVisibleStart,
        rowVisibleEnd
      ] = this.rowsToRender;

      this.itemRenderedEvent.emit({
        columnCacheStart,
        columnCacheEnd,
        columnVisibleStart,
        columnVisibleEnd,
        rowCacheStart,
        rowCacheEnd,
        rowVisibleStart,
        rowVisibleEnd
      })
    }

    const {
      scrollLeft,
      scrollTop,
      updateRequested,
      xAxisScrollDir,
      yAxisScrollDir
    } = this.states;

    this.scrollEvent.emit({
      scrollLeft,
      scrollTop,
      updateRequested,
      xAxisScrollDir,
      yAxisScrollDir
    });
  }

  private getItemStyle = (rowIndex: number, columnIndex: number) => {
    const { columnWidth, rowHeight, direction } = this;
    const _itemStyleCache = this.itemStyleCache(
      this.helper.clearCache && columnWidth,
      this.helper.clearCache && rowHeight,
      this.helper.clearCache && direction
    );

    const key = `${rowIndex},${columnIndex}`;

    if (Object.prototype.hasOwnProperty.call(_itemStyleCache, key)) {
      return _itemStyleCache[key];
    } else {
      const [width, left] = this.helper.getColumnPosition(this, columnIndex, this.cache);
      const [height, top] = this.helper.getRowPosition(this, rowIndex, this.cache);
      const rtl = isRTL(direction);

      _itemStyleCache[key] = {
        position: 'absolute',
        left: rtl ? undefined : `${left}px`,
        right: rtl ? `${left}px` : undefined,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
    }
  }

  private renderItems = () => {
    const [columnStart, columnEnd] = this.columnsToRender;
    const [rowStart, rowEnd] = this.rowsToRender;
    const { data, totalColumn, totalRow, useIsScrolling, itemKey, itemRender } = this;
    if (totalColumn > 0 && totalRow > 0 && itemRender) {
      for (let row = rowStart; row <= rowEnd; row++) {
        for (let column = columnStart; column <= columnEnd; column++) {
          const key = itemKey({
            columnIndex: column,
            data,
            rowIndex: row
          });

          const itemRenderResult = itemRender({
            columnIndex: column,
            rowIndex: row,
            data,
            key,
            isScrolling: useIsScrolling ? this.states.isScrolling : undefined,
            style: this.getItemStyle(row, column),
          });
          this.innerRef.appendChild(itemRenderResult);
        }
      }
    }
  }

  componentWillLoad() {
    this.helper = this.isSized ? fixedSizeGrid : dynamicSizeGrid;
    this.helper.validateProps({
      columnWidth: this.columnWidth,
      rowHeight: this.rowHeight,

    });
    this.cache = this.helper.initCache({
      estimatedColumnWidth: this.estimatedColumnWidth,
      estimatedRowHeight: this.estimatedRowHeight,
    });
    this.estimatedTotalWidth = this.helper.getEstimatedTotalWidth(
      {
        totalColumn: this.totalColumn,
      },
      this.cache
    );
    this.estimatedTotalHeight = this.helper.getEstimatedTotalHeight(
      {
        totalRow: this.totalRow,
      },
      this.cache
    );


    this.handlePerfModeChange();
    this.handleUpdateColumnsToRender();
    this.handleUpdateRowsToRender();
  }

  private _handleTouchStart = this.handleTouchStart.bind(this);
  private _handleTouchMove = this.handleTouchMove.bind(this);

  componentDidLoad() {
    this.windowRef?.addEventListener('wheel', this.onWheel, { passive: false });
    this.windowRef?.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    this.windowRef?.addEventListener('touchmove', this._handleTouchMove, { passive: false });

    if (!isClient) {
      return;
    }

    const { initScrollLeft, initScrollTop } = this;

    if (this.windowRef) {
      if (isNumber(initScrollLeft)) {
        this.windowRef.scrollLeft = initScrollLeft;
      }
      if (isNumber(initScrollTop)) {
        this.windowRef.scrollTop = initScrollTop;
      }
    }

    this.emitEvents();
  }

  disconnectedCallback() {
    this.windowRef?.removeEventListener('wheel', this.onWheel);
    this.windowRef?.removeEventListener('touchstart', this._handleTouchStart);
    this.windowRef?.removeEventListener('touchmove', this._handleTouchMove);
  }

  render() {
    const Container = this.containerElement;
    const Inner = this.innerElement;
    const innerStyle = {
      width: `${this.estimatedTotalWidth}px`,
      height: `${this.estimatedTotalHeight}px`,
      pointerEvents: this.states.isScrolling ? 'none' : undefined,
      margin: 0,
      boxSizing: 'border-box',
    }

    const parsedWidth = Number.parseInt(`${this.width}`, 10);
    const parsedHeight = Number.parseInt(`${this.height}`, 10);

    return (
      <div class={ns.e('wrapper')} role={this.role}>
        <Container
          class={this.wrapperClass}
          style={{
            position: 'relative',
            overflow: 'hidden',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
            direction: this.direction,
            height: isNumber(this.height) ? `${this.height}px` : this.height,
            width: isNumber(this.width) ? `${this.width}px` : this.width,
            ...this.wrapperStyle
          }}
          ref={el => this.windowRef = el as HTMLElement}
          onScroll={this.handleScroll}
        >
          <Inner
            {...this.innerProps}
            ref={el => this.innerRef = el as HTMLElement}
            style={innerStyle}
          >
            { this.renderItems() }
          </Inner>
        </Container>
        <zane-virtual-scrollbar
          ref={(el) => this.hScrollbar = el}
          alwaysOn={this.scrollbarAlwaysOn}
          startGap={this.scrollbarStartGap}
          endGap={this.scrollbarEndGap}
          wrapperClass={ns.e('horizontal')}
          clientSize={parsedWidth}
          layout='horizontal'
          ratio={(parsedWidth * 100) / this.estimatedTotalWidth}
          scrollFrom={this.states.scrollLeft / (this.estimatedTotalWidth - parsedWidth)}
          total={this.totalRow}
          visible={true}
          onZScroll={this.onHorizontalScroll}
        ></zane-virtual-scrollbar>
        <zane-virtual-scrollbar
          ref={(el) => this.vScrollbar = el}
          alwaysOn={this.scrollbarAlwaysOn}
          startGap={this.scrollbarStartGap}
          endGap={this.scrollbarEndGap}
          wrapperClass={ns.e('vertical')}
          clientSize={parsedHeight}
          layout='vertical'
          ratio={(parsedHeight * 100) / this.estimatedTotalHeight}
          scrollFrom={this.states.scrollTop / (this.estimatedTotalHeight - parsedHeight)}
          total={this.totalColumn}
          visible={true}
          onZScroll={this.onVerticalScroll}
        ></zane-virtual-scrollbar>
      </div>
    );
  }
}
