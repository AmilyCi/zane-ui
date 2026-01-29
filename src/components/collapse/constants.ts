import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { CollapseContext } from "./types";

export const collapseContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<CollapseContext>
>();
