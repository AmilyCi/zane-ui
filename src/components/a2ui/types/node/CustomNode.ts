import type { CustomNodeProperties } from "../CustomNodeProperties";
import type { BaseComponentNode } from "./BaseComponentNode";

export interface CustomNode extends BaseComponentNode {
  type: string;
  properties: CustomNodeProperties;
}
