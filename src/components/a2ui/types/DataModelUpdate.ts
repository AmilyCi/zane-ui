import type { ValueMap } from "./ValueMap";

export interface DataModelUpdate {
  surfaceId: string;
  path?: string;
  contents: ValueMap[];
}
