import { isObject } from "../../../utils";
import type { ComponentArrayReference } from "../types";

export function isComponentArrayReference(value: unknown): value is ComponentArrayReference {
  if (!isObject(value)) return false;
  return 'explicitList' in value || 'template' in value;
}
