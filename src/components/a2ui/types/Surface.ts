import type { ComponentInstance } from "./ComponentInstance";
import type { DataMap } from "./DataMap";
import type { AnyComponentNode } from "./node";

export type Surface = {
  rootComponentId: string | null;
  componentTree: AnyComponentNode | null;
  dataModel: DataMap;
  components: Map<string, ComponentInstance>;
  styles: Record<string, string>;
}
