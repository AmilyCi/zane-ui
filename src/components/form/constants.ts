import type { FormContext } from './FormContext';
import type { FormItemContext } from './FormItemContext';

export const formItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const;

export const formContexts = new WeakMap<HTMLElement, FormContext>();

export const formItemContexts = new WeakMap<HTMLElement, FormItemContext>();
