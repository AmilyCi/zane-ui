import type { ComponentInterface } from '@stencil/core';

import { tryOnScopeDispose } from '../utils';

export function useTimeout(component: ComponentInterface) {
  let timeoutHandle: number;

  const registerTimeout = (fn: (...args: any[]) => any, delay: number) => {
    cancelTimeout();
    timeoutHandle = window.setTimeout(fn, delay);
  };
  const cancelTimeout = () => window.clearTimeout(timeoutHandle);

  tryOnScopeDispose(component, () => cancelTimeout());

  return {
    cancelTimeout,
    registerTimeout,
  };
}
