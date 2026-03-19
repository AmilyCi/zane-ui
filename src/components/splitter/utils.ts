import { isObject, isString, type ReactiveObject } from "../../utils";
import { splitterRootContexts } from "./constants";
import type { PanelItemState, SplitterRootContext } from "./types";

export function getCollapsible(
  collapsible: boolean | { end?: boolean; start?: boolean }
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
  panel: null | undefined | PanelItemState,
  size: number,
  nextPanel: null | undefined | PanelItemState,
  nextSize: number
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
  itemSize: number | string | undefined
): itemSize is string {
  return isString(itemSize) && itemSize.endsWith("%");
}

export function isPx(
  itemSize: number | string | undefined
): itemSize is string {
  return isString(itemSize) && itemSize.endsWith("px");
}

export function getPx(str: string) {
  return Number(str.slice(0, -2));
}

export function getPct(str: string) {
  return Number(str.slice(0, -1)) / 100;
}

export const getSplitterContext = (el: HTMLElement): ReactiveObject<SplitterRootContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === "ZANE-SPLITTER") {
      context = splitterRootContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
};
