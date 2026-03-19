import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { TreeContext } from "./types";
import { treeContexts } from "./constants";

export const getTreeContext = (el: HTMLElement): ReactiveObject<TreeContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-TREE') {
      context = treeContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}
