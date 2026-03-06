import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { TreeContext } from "./types";

export const treeContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<TreeContext>
>();

export const EMPTY_NODE = {
  key: -1,
  level: -1,
  data: {}
} as const;
