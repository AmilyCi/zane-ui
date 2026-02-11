import { isClient } from "../../../utils/is";

let scrollbarWidth: number;

export const getScrollbarWidth = (namespace: string): number => {
  if (!isClient) return 0;
  if (scrollbarWidth !== undefined) {
    return scrollbarWidth;
  }

  const outer = document.createElement('div');
  outer.className = `${namespace}-scrollbar__wrap`;
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = outer.offsetWidth;
  outer.parentNode?.removeChild(outer);

  scrollbarWidth = widthNoScroll - widthWithScroll;

  return scrollbarWidth;
}
