import { sliderContexts } from "./constants";

export const getSliderContext = (el: HTMLElement) => {
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
