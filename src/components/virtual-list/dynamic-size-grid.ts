import { isFunction, throwError } from "../../utils";
import {
  ACCESS_LAST_VISITED_KEY_MAP,
  ACCESS_SIZER_KEY_MAP,
  ALIGNMENT_AUTO,
  ALIGNMENT_CENTER,
  ALIGNMENT_END,
  ALIGNMENT_SMART,
  ALIGNMENT_START,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE
} from "./constants";
import type { Alignment, CacheItemType, GridCache, ItemSize, VirtualGridHelper } from "./types";

const getItemFromCache = (
  props: any,
  index: number,
  gridCache: GridCache,
  type: CacheItemType
) => {
  const cachedItems = gridCache[type];
  const sizer = props[ACCESS_SIZER_KEY_MAP[type]] as ItemSize;
  const lastVisited = gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]];

  if (index > lastVisited) {
    let offset = 0;
    if (lastVisited >= 0) {
      const item = cachedItems[lastVisited];
      offset = item.offset + item.size;
    }

    for (let i = lastVisited + 1; i <= index; i++) {
      const size = sizer(i);
      cachedItems[i] = {
        size,
        offset: offset
      };
      offset += size;
    }
    gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]] = index;
  }
  return cachedItems[index];
}

const getEstimatedTotalHeight = (
  { totalRow }: any,
  { estimatedRowHeight, lastVisitedRowIndex, row}: GridCache
) => {
  let sizeOfVisitedRows = 0;

  if (lastVisitedRowIndex >= totalRow) {
    lastVisitedRowIndex = totalRow - 1;
  }

  if (lastVisitedRowIndex >= 0) {
    const item = row[lastVisitedRowIndex];
    sizeOfVisitedRows = item.offset + item.size;
  }

  const unvisitedItems = totalRow - lastVisitedRowIndex - 1;
  const sizeOfUnvisitedItems = unvisitedItems * estimatedRowHeight;

  return sizeOfVisitedRows + sizeOfUnvisitedItems;
}

const getEstimatedTotalWidth = (
  { totalColumn }: any,
  { estimatedColumnWidth, lastVisitedColumnIndex, column}: GridCache
) => {
  let sizeOfVisitedColumns = 0;

  if (lastVisitedColumnIndex > totalColumn) {
    lastVisitedColumnIndex = totalColumn - 1;
  }

  if (lastVisitedColumnIndex >= 0) {
    const item = column[lastVisitedColumnIndex];
    sizeOfVisitedColumns = item.offset + item.size;
  }

  const unvisitedItems = totalColumn - lastVisitedColumnIndex - 1;
  const sizeOfUnvisitedItems = unvisitedItems * estimatedColumnWidth;

  return sizeOfVisitedColumns + sizeOfUnvisitedItems;
}

const getOffset = (
  props: any,
  index: number,
  alignment: Alignment,
  scrollOffset: number,
  cache: GridCache,
  type: CacheItemType,
  scrollbarWidth: number
) => {
  const size = type === 'row' ? props.height : props.width;
  const estimatedSizeAssociates = type === 'row' 
    ? getEstimatedTotalHeight
    : getEstimatedTotalWidth;

  const item = getItemFromCache(props, index, cache, type);
  const estimatedSize = estimatedSizeAssociates(props, cache);
  const maxOffset = Math.max(0, Math.min(estimatedSize - size, item.offset));
  const minOffset = Math.max(0, item.offset - size + scrollbarWidth + item.size);

  if (alignment === ALIGNMENT_SMART) {
    if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
      alignment = ALIGNMENT_AUTO;
    } else {
      alignment = ALIGNMENT_CENTER;
    }
  }

  switch(alignment) {
    case ALIGNMENT_START: {
      return maxOffset;
    }
    case ALIGNMENT_END: {
      return minOffset;
    }
    case ALIGNMENT_CENTER: {
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    }
    case ALIGNMENT_AUTO:
    default: {
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
    }
  }
}

const bs = (
  props: any,
  gridCache: GridCache,
  low: number,
  high: number,
  offset: number,
  type: CacheItemType,
) => {
  while(low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const currentOffset = getItemFromCache(props, mid, gridCache, type).offset;
    if (currentOffset === offset) {
      return mid;
    } else if (currentOffset < offset) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
}

const es = (
  props: any,
  gridCache: GridCache,
  idx: number,
  offset: number,
  type: CacheItemType,
) => {
  const total = type === 'column' ? props.totalColumn : props.totalRow;
  let exponent = 1;
  while(idx < total && getItemFromCache(props, idx, gridCache, type).offset < offset) {
    idx += exponent;
    exponent *= 2;
  }
  return bs(props, gridCache, Math.floor(idx / 2), Math.min(idx, total - 1), offset, type);
}

const findItem = (
  props: any,
  gridCache: GridCache,
  offset: number,
  type: CacheItemType,
) => {
  const cache = gridCache[type];
  const lastVisitedIndex = gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]];
  const lastVisitedItemOffset = lastVisitedIndex > 0 ? cache[lastVisitedIndex].offset : 0;

  if (lastVisitedItemOffset >= offset) {
    return bs(props, gridCache, 0, lastVisitedIndex, offset, type);
  }
  return es(props, gridCache, Math.max(0, lastVisitedIndex), offset, type);
}

export const dynamicSizeGrid: VirtualGridHelper = {
  getColumnPosition: (props, idx, cache) => {
    const item = getItemFromCache(props, idx, cache, 'column');
    return [item.size, item.offset]
  },

  getRowPosition: (props, idx, cache) => {
    const item = getItemFromCache(props, idx, cache, 'row');
    return [item.size, item.offset]
  },

  getColumnOffset: (
    props,
    columnIndex,
    alignment,
    scrollLeft,
    cache,
    scrollbarWidth
  ) => {
    return getOffset(
      props,
      columnIndex,
      alignment,
      scrollLeft,
      cache,
      'column',
      scrollbarWidth
    )
  },

  getRowOffset: (
    props,
    rowIndex,
    alignment,
    scrollTop,
    cache,
    scrollbarWidth
  ) => {
    return getOffset(
      props,
      rowIndex,
      alignment,
      scrollTop,
      cache,
      'row',
      scrollbarWidth
    )
  },

  getColumnStartIndexForOffset: (
    props,
    scrollLeft,
    cache
  ) => {
    return findItem(props, cache, scrollLeft, 'column');
  },

  getColumnStopIndexForStartIndex: (
    props,
    startIndex,
    scrollLeft,
    cache
  ) => {
    const item = getItemFromCache(props, startIndex, cache, 'column');
    const maxOffset = scrollLeft + props.width;

    let offset = item.offset + item.size;
    let stopIndex = startIndex;
    while(stopIndex < props.totalColumn -1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, startIndex, cache, 'column').size
    }
    return stopIndex;
  },

  getEstimatedTotalHeight,

  getEstimatedTotalWidth,

  getRowStartIndexForOffset: (
    props,
    scrollTop,
    cache
  ) => {
    return findItem(props, cache, scrollTop, 'row');
  },

  getRowStopIndexForStartIndex: (
    props,
    startIndex,
    scrollTop,
    cache
  ) => {
    const item = getItemFromCache(props, startIndex, cache, 'row');
    const maxOffset = scrollTop + props.height;

    let offset = item.offset + item.size;
    let stopIndex = startIndex;
    while(stopIndex < props.totalRow -1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, stopIndex, cache, 'row').size
    }
    return stopIndex;
  },

  initCache: (
    {
      estimatedColumnWidth = DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
      estimatedRowHeight = DEFAULT_DYNAMIC_LIST_ITEM_SIZE
    }
  ) => {
    const cache = {
      column: {},
      estimatedColumnWidth,
      estimatedRowHeight,
      lastVisitedColumnIndex: -1,
      lastVisitedRowIndex: -1,
      row: {}
    } as GridCache;

    return cache;
  },

  clearCache: false,

  validateProps: ({ columnWidth, rowHeight }) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!isFunction(columnWidth)) {
        throwError(
          'DynamicSizeGrid',
          `"columnWidth" must be passed as function, instead ${typeof columnWidth} was given.`
        )
      }
      if (!isFunction(rowHeight)) {
        throwError(
          'DynamicSizeGrid',
          `"rowHeight" must be passed as function, instead ${typeof rowHeight} was given.`
        )
      }
    }
  }
};
