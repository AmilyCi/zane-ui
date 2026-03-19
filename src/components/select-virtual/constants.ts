import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { SelectContext } from "./types";

export const selectContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<SelectContext>
>();
