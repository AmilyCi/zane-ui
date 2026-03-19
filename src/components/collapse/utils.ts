import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { CollapseContext } from "./types";
import { collapseContexts } from "./constants";

export const getCollapseContext = (el: HTMLElement): ReactiveObject<CollapseContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-COLLAPSE') {
      context = collapseContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}
