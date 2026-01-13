import type { ZaneSplitterPanel } from './zane-splitter-panel';

import { isObject, isString } from '../../utils';

export function getCollapsible(
  collapsible: boolean | { end?: boolean; start?: boolean },
) {
  if (collapsible && isObject(collapsible)) {
    return collapsible;
  }
  return {
    end: !!collapsible,
    start: !!collapsible,
  };
}

export function isCollapsible(
  panel: null | undefined | ZaneSplitterPanel,
  size: number,
  nextPanel: null | undefined | ZaneSplitterPanel,
  nextSize: number,
) {
  if (getCollapsible(panel?.collapsible).end && size > 0) {
    return true;
  }

  if (
    getCollapsible(nextPanel?.collapsible).start &&
    nextSize === 0 &&
    size > 0
  ) {
    return true;
  }

  return false;
}

export function isPct(
  itemSize: number | string | undefined,
): itemSize is string {
  return isString(itemSize) && itemSize.endsWith('%');
}

export function isPx(
  itemSize: number | string | undefined,
): itemSize is string {
  return isString(itemSize) && itemSize.endsWith('px');
}

export function getPx(str: string) {
  return Number(str.slice(0, -2));
}

export function getPct(str: string) {
  return Number(str.slice(0, -1)) / 100;
}
