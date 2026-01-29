import type { DataArray } from "./DataArray";
import type { DataMap } from "./DataMap";
import type { DataObject } from "./DataObject";

export type DataValue =
  | string
  | number
  | boolean
  | null
  | DataMap
  | DataObject
  | DataArray;
