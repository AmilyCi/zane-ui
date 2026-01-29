import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { RowContext } from "./types";

export const RowJustify = [
  "start",
  "center",
  "end",
  "space-around",
  "space-between",
  "space-evenly",
] as const;

export const RowAlign = ["top", "middle", "bottom"] as const;

export const rowContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<RowContext>
>();
