import type { ReactiveObject } from "../../utils";
import type { RadioGroupContext, RadioOptionProp } from "./types";

export const radioGroupContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<RadioGroupContext>
>();

export const radioDefaultProps: Required<RadioOptionProp> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
}
