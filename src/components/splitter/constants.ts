import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { SplitterRootContext } from "./types";

export const splitterRootContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<SplitterRootContext>
>();
