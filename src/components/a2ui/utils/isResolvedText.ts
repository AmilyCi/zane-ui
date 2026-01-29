import { isObject } from "../../../utils";
import { isStringValue } from "./isStringValue";
import type { ResolvedText } from "../types/components/ResolvedText";

export function isResolvedText(props: unknown): props is ResolvedText {
  return isObject(props) && 'text' in props && isStringValue(props.text);
}
