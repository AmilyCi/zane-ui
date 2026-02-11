import { isNumber, throwError } from "src/utils";
import { ALIGNMENT_AUTO, ALIGNMENT_CENTER, ALIGNMENT_END, ALIGNMENT_SMART, ALIGNMENT_START } from "./constants";
import type { VirtualGridHelper } from "./types";

export const fixedSizeGrid: VirtualGridHelper = {
  getColumnPosition: ({ columnWidth }, index) => {
    return [columnWidth, index * columnWidth];
  },

  getRowPosition: ({ rowHeight }, index) => {
    return [rowHeight, index * rowHeight];
  },

  getEstimatedTotalHeight: ({ rowHeight, totalRow }) => {
    return rowHeight * totalRow;
  },

  getEstimatedTotalWidth: ({ columnWidth, totalColumn }) => {
    return columnWidth * totalColumn;
  },

  getColumnOffset: (
    { totalColumn, columnWidth, width },
    columnIndex,
    alignment,
    scrollLeft,
    _,
    scrollbarWidth
  ) => {
    width = Number(width);
    const lastColumnOffset = Math.max(
      0,
      totalColumn * columnWidth - width
    );
    const maxOffset = Math.min(
      lastColumnOffset,
      columnIndex * columnWidth
    );
    const minOffset = Math.max(
      0,
      columnIndex * columnWidth - width + scrollbarWidth + columnWidth
    );

    if (alignment === 'smart') {
      if (scrollLeft >= minOffset - width && scrollLeft <= maxOffset + width) {
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
        if (middleOffset < Math.ceil(width / 2)) {
          return 0;
        } else if (middleOffset > lastColumnOffset + Math.floor(width / 2)) {
          return lastColumnOffset;
        } else {
          return middleOffset;
        }
      }
      case ALIGNMENT_AUTO:
      default: {
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollLeft < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
      }
    }
  },

  getRowOffset: (
    { rowHeight, totalRow, height },
    rowIndex,
    align,
    scrollTop,
    _,
    scrollbarWidth,
  ) => {
    height = Number(height);
    const lastRowOffset = Math.max(0, totalRow * rowHeight - height);
    const maxOffset = Math.min(lastRowOffset, rowIndex * rowHeight);
    const minOffset = Math.max(
      0,
      rowIndex * rowHeight - height + scrollbarWidth + rowHeight
    );

    if (align === ALIGNMENT_SMART) {
      if (scrollTop >= minOffset - height && scrollTop <= maxOffset + height) {
        align = ALIGNMENT_AUTO;
      } else {
        align = ALIGNMENT_CENTER;
      }
    }

    switch(align) {
      case ALIGNMENT_START: {
        return maxOffset;
      }
      case ALIGNMENT_END: {
        return minOffset;
      }
      case ALIGNMENT_CENTER: {
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (middleOffset < Math.ceil(height / 2)) {
          return 0;
        } else if (middleOffset > lastRowOffset + Math.floor(height / 2)) {
          return lastRowOffset;
        } else {
          return middleOffset;
        }
      }
      case ALIGNMENT_AUTO:
      default: {
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop;
        } else if (minOffset > maxOffset) {
          return minOffset;
        } else if (scrollTop < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
      }
    }
  },

  getColumnStartIndexForOffset: (
    { columnWidth, totalColumn },
    scrollLeft,
  ) => {
    return Math.max(
      0,
      Math.min(totalColumn - 1, Math.floor(scrollLeft / columnWidth))
    );
  },

  getColumnStopIndexForStartIndex: (
    { columnWidth, totalColumn, width },
    startIndex,
    scrollLeft,
  ) => {
    const left = startIndex * columnWidth;
    const visibleColumnsCount = Math.ceil(
      (width + scrollLeft - left) / columnWidth
    );
    return Math.max(
      0,
      Math.min(totalColumn - 1, startIndex + visibleColumnsCount - 1)
    );
  },

  getRowStartIndexForOffset: (
    { rowHeight, totalRow },
    scrollTop
  ) => {
    return Math.max(
      0,
      Math.min(totalRow - 1, Math.floor(scrollTop / rowHeight))
    )
  },

  getRowStopIndexForStartIndex: (
    { rowHeight, totalRow, height },
    startIndex,
    scrollTop
  ) => {
    const top = startIndex * rowHeight;
    const visibleRowsCount = Math.ceil((height + scrollTop - top) / rowHeight);
    return Math.max(
      0,
      Math.min(totalRow - 1, startIndex + visibleRowsCount - 1)
    );
  },

  initCache: () => undefined as any,

  clearCache: true,

  validateProps: ({ columnWidth, rowHeight }) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!isNumber(columnWidth)) {
        throwError(
          'FixedSizeGrid',
          `"columnWidth" must be passed as number, instead ${typeof columnWidth} was given.`
        )
      }
      if (!isNumber(rowHeight)) {
        throwError(
          'FixedSizeGrid',
          `"rowHeight" must be passed as number, instead ${typeof rowHeight} was given.`
        )
      }
    }
  }
}
