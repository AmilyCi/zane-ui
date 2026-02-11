import { isString, throwError } from "../../utils";
import { ALIGNMENT_AUTO, ALIGNMENT_CENTER, ALIGNMENT_END, ALIGNMENT_SMART, ALIGNMENT_START } from "./constants";
import type { VirtualListHelper } from "./types";
import { isHorizontal } from "./utils";

export const fixedSizeList: VirtualListHelper = {

  getItemOffset: ({ itemSize }, index ) => index * (itemSize as number),

  getItemSize: ({ itemSize }) => itemSize as number,

  getEstimatedTotalSize: ({ itemSize, total }) => (itemSize as number) * total,

  getOffset: (
    { height, total, itemSize, layout, width },
    index,
    alignment,
    scrollOffset,
  ) => {
    const size = (isHorizontal(layout) ? width : height) as number;
    if (process.env.NODE_ENV !== 'production' && isString(size)) {
      throwError(
        'FixedSizeList',
        `You should set width/height to number when your layout is horizontal/vertical.`
      );
    }
    const lastItemOffset = Math.max(0, total * (itemSize as number) - size);
    const maxOffset = Math.min(lastItemOffset, index * (itemSize as number));
    const minOffset = Math.max(0, (index + 1) * (itemSize as number) - size);

    if (alignment === ALIGNMENT_SMART) {
      if (
        scrollOffset >= minOffset - size &&
        scrollOffset <= maxOffset + size
      ) {
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
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(size / 2)) {
          return 0;
        } else if (middleOffset > lastItemOffset + Math.ceil(size / 2)) {
          return lastItemOffset;
        }
        return middleOffset;
      }
      case ALIGNMENT_AUTO: 
      default:{
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
    { itemSize, total },
    offset
  ) => {
    return Math.max(0, Math.min(total -1, Math.floor(offset / (itemSize as number))));
  },

  getStopIndexForStartIndex: (
    { itemSize, total, height, width, layout },
    startIndex,
    scrollOffset,
  ) => {
    const offset = startIndex * (itemSize as number);
    const size = isHorizontal(layout) ? width : height;
    const numVisibleItems = Math.ceil(
      ((size as number) + scrollOffset - offset) / (itemSize as number)
    );
    return Math.max(
      0,
      Math.min(
        total - 1,
        startIndex + numVisibleItems - 1
      )
    );
  },

  initCache: () => undefined as any,

  clearCache: true,

  validateProps: () => {}
}
