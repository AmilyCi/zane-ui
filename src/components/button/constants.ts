import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { ButtonGroupContext } from "./types";

export const buttonTypes = [
  'default',
  'primary',
  'success',
  'warning',
  'info',
  'danger',
  '',
] as const;

export const buttonNativeTypes = ['button', 'submit', 'reset'] as const;

export const buttonGroupContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<ButtonGroupContext>
>();
