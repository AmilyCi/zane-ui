import { BACKWARD, FORWARD, HORIZONTAL, LTR, RTL, RTL_OFFSET_NAG, RTL_OFFSET_POS_ASC, RTL_OFFSET_POS_DESC } from "./constants";
import type { Direction, RTLOffsetType } from "./types";

type RenderThumbStyleParams = {
  bar: {
    size: 'height' | 'width'
    axis: 'x' | 'y'
  },
  size: string;
  move: number;
}

export const renderThumbStyle = (
  { move, size, bar}: RenderThumbStyleParams,
  layout: string
) => {
  const style: any = {};
  const translate = `translate${bar.axis.toUpperCase()}(${move}px)`;
  style[bar.size] = size;
  style.transform = translate;
  if (layout === 'horizontal') {
    style.height = '100%';
  } else {
    style.width = '100%';
  }
  return style;
}

export const isRTL = (dir: Direction) => dir === RTL;

export const isHorizontal = (dir: string) => 
  dir === LTR || dir === RTL || dir === HORIZONTAL;

export const getScrollDir = (prev: number, cur: number) => {
  return prev  < cur ? FORWARD : BACKWARD
}

let cachedRTLResult: RTLOffsetType | null = null;

export const getRTLOffsetType = (recalculate = false): RTLOffsetType => {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement('div');
    const outerStyle = outerDiv.style;
    outerStyle.width = '50px';
    outerStyle.height = '50px';
    outerStyle.overflow = 'scroll';
    outerStyle.direction = 'rtl';

    const innerDiv = document.createElement('div');
    const innerStyle = innerDiv.style;
    innerStyle.width = '100px';
    innerStyle.height = '100px';

    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = RTL_OFFSET_POS_DESC;
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = RTL_OFFSET_NAG;
      } else {
        cachedRTLResult = RTL_OFFSET_POS_ASC;
      }
    }

    document.body.removeChild(outerDiv);

    return cachedRTLResult;
  }

  return cachedRTLResult;
}

