import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import { sliderContexts } from "./constants";
import type { SliderContext } from "./types";

export const getSliderContext = (el: HTMLElement): ReactiveObject<SliderContext> | null => {
  let parent = el.parentElement;
  let context = null;
  while (parent) {
    if (parent.tagName === 'ZANE-SLIDER') {
      context = sliderContexts.get(parent);
      break;
    }
    parent = parent.parentElement;
  }
  return context;
}
