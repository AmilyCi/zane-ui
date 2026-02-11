import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { SliderContext } from "./types";

export const sliderContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<SliderContext>
>();
