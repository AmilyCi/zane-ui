import { throwError } from "../../utils";
import {
  ALIGNMENT_AUTO,
  ALIGNMENT_CENTER,
  ALIGNMENT_END,
  ALIGNMENT_SMART,
  ALIGNMENT_START,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE
} from "./constants";
import type { ListCache, ListItem, VirtualListHelper } from "./types";
import { isHorizontal } from "./utils";

const getItemFromCache = (
  props: any,
  index: number,
  listCache: ListCache,
): ListItem => {
  const { itemSize } = props;
  const { items, lastVisitedIndex } = listCache;

  if (index > lastVisitedIndex) {
    let offset = 0;
    if (lastVisitedIndex >= 0) {
      const item = items[lastVisitedIndex];
      offset = item.offset + item.size;
    }

    for (let i = lastVisitedIndex + 1; i <= index; i++) {
      const size = itemSize(i);

      items[i] = { offset, size };
      offset += size;
    }

    listCache.lastVisitedIndex = index;
  }

  return items[index];
}

const bs = (
  props: any,
  listCache: ListCache,
  low: number,
  high: number,
  offset: number
) => {
  while(low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const currentOffset = getItemFromCache(props, mid, listCache).offset;

    if (currentOffset === offset) {
      return mid;
    } else if (currentOffset < offset) {
      low = mid + 1;
    } else if (currentOffset > offset) {
      high = mid - 1;
    }
  }
  return Math.max(0, low - 1);
}

const es = (
  props: any,
  listCache: ListCache,
  index: number,
  offset: number
) => {
  const { total } = props;

  let exponent = 1;

  while(
    index < total &&
    getItemFromCache(props, index, listCache).offset < offset
  ) {
    index += exponent;
    exponent *= 2;
  }

  return bs(
    props,
    listCache,
    Math.floor(index / 2),
    Math.min(index, total - 1),
    offset
  );
}

const findItem = (
  props: any,
  listCache: ListCache,
  offset: number
) => {
  const { items, lastVisitedIndex } = listCache;

  const lastVisitedOffset = lastVisitedIndex > 0 ? items[lastVisitedIndex].offset : 0;
  if (lastVisitedOffset >= offset) {
    return bs(props, listCache, 0, lastVisitedIndex, offset);
  }
  return es(props, listCache, Math.max(0, lastVisitedIndex), offset);
}

const getEstimatedTotalSize = (
  { total }: any,
  { items, estimatedItemSize, lastVisitedIndex }: ListCache
) => {
  let totalSizeOfMeasuredItems = 0;

  if (lastVisitedIndex >= total) {
    lastVisitedIndex = total - 1;
  }

  if (lastVisitedIndex >= 0) {
    const item = items[lastVisitedIndex];
    totalSizeOfMeasuredItems = item.offset + item.size;
  }

  const numUnmeasuredItems = total - lastVisitedIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize;
  return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
}

export const dynamicSizeList: VirtualListHelper = {

  getItemOffset: (
    props,
    index,
    listCache 
  ) => {
    return getItemFromCache(props, index, listCache).offset;
  },

  getItemSize: (_, index, { items }) => items[index].size,
  
  getEstimatedTotalSize,

  getOffset: (
    props,
    index,
    alignment,
    scrollOffset,
    listCache
  ) => {
    const { height, layout, width } = props;
    const size = (isHorizontal(layout) ? width : height) as number;
    const item = getItemFromCache(props, index, listCache);
    const estimatedTotalSize = getEstimatedTotalSize(props, listCache);
    const maxOffset = Math.max(0, Math.min(estimatedTotalSize - size, item.offset));
    const minOffset = Math.max(0, item.offset - size + item.size);

    if (alignment === ALIGNMENT_SMART) {
      if (scrollOffset >= minOffset -size && scrollOffset <= maxOffset + size) {
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
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
      }
    }
  },

  getStartIndexForOffset: (
    props,
    offset,
    listCache
  ) => {
    return findItem(props, listCache, offset);
  },

  getStopIndexForStartIndex: (
    props,
    startIndex,
    scrollOffset,
    listCache
  ) => {
    const { height, layout, width, total } = props;
    const size = (isHorizontal(layout) ? width : height) as number;
    const item = getItemFromCache(props, startIndex, listCache);
    const maxOffset = scrollOffset + size;

    let offset = item.offset + item.size;
    let stopIndex = startIndex;

    while (stopIndex < total -1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, stopIndex, listCache).size;
    }

    return stopIndex;
  },

  initCache: (
    {
      estimatedItemSize = DEFAULT_DYNAMIC_LIST_ITEM_SIZE
    },
    instance
  ) => {
    const cache = {
      items: {},
      estimatedItemSize,
      lastVisitedIndex: -1
    } as ListCache;

    cache.clearCacheAfterIndex = (index: number, forceUpdate = true) => {
      cache.lastVisitedIndex = Math.min(cache.lastVisitedIndex, index - 1);
      instance.itemStyleCache(-1);

      if (forceUpdate) {
        instance.render();
      }
    }

    return cache;
  },

  clearCache: false,

  validateProps: ({ itemSize }) => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'function') {
        throwError(
          'DynamicSizeList',
          `"itemSize" is required and must be a function, but the given value was ${typeof itemSize}.`
        );
      }
    }
  }
}
