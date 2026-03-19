import type { ReactiveObject } from "../../utils";
import type { SelectContext, SelectGroupContext, SelectOptionProps } from "./types";

export const defaultProps: SelectOptionProps = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  options: 'options',
}

export const selectContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<SelectContext>
>();

export const selectGroupContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<SelectGroupContext>
>()
