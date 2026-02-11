import type { ZaneVirtualList } from "./zane-virtual-list";

export type ItemSize = (idx: number) => number;

export type Direction = 'ltr' | 'rtl';

export type Alignment = 'auto' | 'smart' | 'center' | 'start' | 'end';

export type GridItemKeyGetter = <T extends {[key: string | number]: any}>(
  args: {
    columnIndex: number, 
    data: T, 
    rowIndex: number
  }
) => string | number

export type RTLOffsetType = 
  | 'negative'
  | 'positive-descending'
  | 'positive-ascending';

export type ListItem = {
  offset: number
  size: number
};

export type ListCache = {
  items: Record<string, ListItem>
  estimatedItemSize: number
  lastVisitedIndex: number
  clearCacheAfterIndex: (idx: number, forceUpdate?: boolean) => void
}

export type GridCache = {
  column: Record<string, ListItem>
  row: Record<string, ListItem>
  estimatedColumnWidth: number
  estimatedRowHeight: number
  lastVisitedColumnIndex: number
  lastVisitedRowIndex: number
}

export type CacheItemType = 'column' | 'row';

export type Indices = {
  columnIndex?: number
  rowIndex?: number
}

export type VirtualGridHelper = {
  getColumnPosition: (
    props: any,
    index: number,
    cache?: GridCache
  ) => [number, number]
  getRowPosition: (
    props: any,
    index: number,
    cache?: GridCache
  ) => [number, number]
  getColumnOffset: (
    props: any,
    index: number,
    alignment: Alignment,
    scrollLeft: number,
    cache?: GridCache,
    scrollbarWidth?: number
  ) => number
  getRowOffset: (
    props: any,
    index: number,
    alignment: Alignment,
    scrollTop: number,
    cache?: GridCache,
    scrollbarHeight?: number
  ) => number
  getColumnStartIndexForOffset: (
    props: any,
    scrollLeft: number,
    cache?: GridCache
  ) => number
  getColumnStopIndexForStartIndex: (
    props: any,
    startIndex: number,
    scrollLeft: number,
    cache?: GridCache
  ) => number
  getEstimatedTotalHeight: (
    props: any,
    cache?: GridCache
  ) => number
  getEstimatedTotalWidth: (
    props: any,
    cache?: GridCache
  ) => number
  getRowStartIndexForOffset: (
    props: any,
    scrollTop: number,
    cache?: GridCache
  ) => number
  getRowStopIndexForStartIndex: (
    props: any,
    startIndex: number,
    scrollTop: number,
    cache?: GridCache
  ) => number
  initCache: (props?: any, instance?: HTMLZaneVirtualGridElement) => GridCache
  clearCache: boolean,
  validateProps: (props: any) => void
}

export type VirtualListHelper = {
  getItemOffset: (props: any, index: number, cache?: ListCache) => number
  getItemSize: (props: any, index: number, cache?: ListCache) => number
  getEstimatedTotalSize: (props: any, cache?: ListCache) => number
  getOffset: (props: any, index: number, alignment: Alignment, scrollOffset: number, cache?: ListCache) => number
  getStartIndexForOffset: (props: any, offset: number, cache?: ListCache) => number
  getStopIndexForStartIndex: (props: any, startIndex: number, scrollOffset: number, cache?: ListCache) => number
  initCache: (props?: any, instance?: ZaneVirtualList) => ListCache
  clearCache: boolean,
  validateProps: (props: any) => void
}
