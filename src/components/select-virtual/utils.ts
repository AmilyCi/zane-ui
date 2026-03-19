import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import { selectContexts } from "./constants";
import type { SelectContext } from "./types";

export const escapeStringRegexp = (str: string) => {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export const getSelectContext = (el: HTMLElement): ReactiveObject<SelectContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-SELECT-VIRTUAL') {
      context = selectContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}
