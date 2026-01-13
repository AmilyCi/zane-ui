import type { SplitterRootContext } from '../interfaces';

export const splitterRootContexts = new WeakMap<
  HTMLElement,
  SplitterRootContext
>();
