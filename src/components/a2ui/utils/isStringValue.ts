import { isObject } from "../../../utils";
import type { StringValue } from "../types/primitives";

export function isStringValue(value: unknown): value is StringValue {
  return (
    isObject(value) &&
    ("path" in value ||
      ("literal" in value && typeof value.literal === "string") ||
      "literalString" in value)
  );
}
