import type { AnyComponentNode } from "./node/AnyComponentNode";
import type { ResolvedArray } from "./ResolvedArray";
import type { ResolvedMap } from "./ResolvedMap";

export type ResolvedValue =
  | string
  | number
  | boolean
  | null
  | AnyComponentNode
  | ResolvedMap
  | ResolvedArray;
