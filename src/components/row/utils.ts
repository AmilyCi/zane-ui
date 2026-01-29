import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import { rowContexts } from "./constants";
import type { RowContext } from "./types";

export const getRowContext = (el: HTMLElement): ReactiveObject<RowContext> => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === "ZANE-ROW") {
      context = rowContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
};
