import type { DataObject } from "./DataObject";

export type ValueMap = DataObject & {
  key: string;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: ValueMap[];
}
