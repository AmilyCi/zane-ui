import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { ForwardRefContext } from "./types";

export const forwardRefContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<ForwardRefContext>
>();
