import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { CheckboxGroupContext, CheckboxOptionProps } from "./types";

export const checkboxGroupContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<CheckboxGroupContext>
>();

export const checkboxDefaultProps: Required<CheckboxOptionProps> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
}
