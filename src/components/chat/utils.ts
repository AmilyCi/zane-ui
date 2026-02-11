import type { ReactiveObject } from "../../utils";
import { chatContexts } from "./constants";
import type { ChatContext } from "./types";

export const getChatContext = (el: HTMLElement): ReactiveObject<ChatContext> | null => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-CHAT') {
      context = chatContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
}
