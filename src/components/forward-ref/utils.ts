import type { ReactiveObject } from "../../utils";
import { forwardRefContexts } from "./constants";
import type { ForwardRefContext } from "./types";

export const getForwardRefContext = (
  el: HTMLElement
): ReactiveObject<ForwardRefContext> => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === "ZANE-FORWARD-REF") {
      context = forwardRefContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
};
