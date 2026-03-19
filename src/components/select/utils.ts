import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import { selectContexts, selectGroupContexts } from "./constants";
import type { SelectContext, SelectGroupContext } from "./types";

export const getSelectContext = (el: HTMLElement): ReactiveObject<SelectContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-SELECT') {
      context = selectContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}

export const getSelectGroupContext = (el: HTMLElement): ReactiveObject<SelectGroupContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-SELECT-OPTION-GROUP') {
      context = selectGroupContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}
