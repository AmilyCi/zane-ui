import type { ResolvedText } from "../components";
import type { BaseComponentNode } from "./BaseComponentNode";

export interface TextNode extends BaseComponentNode {
  type: 'Text';
  properties: ResolvedText;
}
