import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";
import type { FormContext, FormItemContext } from "./types";

export const formItemValidateStates = [
  "",
  "error",
  "validating",
  "success",
] as const;

export const formContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<FormContext>
>();

export const formItemContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<FormItemContext>
>();
