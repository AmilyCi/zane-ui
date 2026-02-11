import type { ReactiveObject } from "../../utils";
import type { ButtonGroupContext } from "./types";
import { buttonGroupContexts } from "./constants";

export const getButtonGroupContext = (el: HTMLElement): ReactiveObject<ButtonGroupContext> | null => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-BUTTON-GROUP') {
      context = buttonGroupContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
}
