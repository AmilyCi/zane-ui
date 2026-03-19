import type { ReactiveObject } from "../../utils";
import { radioGroupContexts } from "./constants";
import type { RadioGroupContext } from "./types";

export const getRadioGroupContext = (el: HTMLElement): ReactiveObject<RadioGroupContext> | null => {
  let parent: any = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === "ZANE-RADIO-GROUP") {
      context = radioGroupContexts.get(parent);
      break;
    }
    parent = parent.rawParent ?? parent.parentElement;
  }
  return context;
}
