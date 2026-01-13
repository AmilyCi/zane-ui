import type { AnimationType } from '../../../types';

import { getTransitionInfo } from './getTransitionInfo';

export function whenTransitionEnds(
  el: HTMLElement & { _endId?: number },
  expectedType: AnimationType | undefined,
  explicitTimeout: null | number,
  resolve: () => void,
) {
  const id = (el._endId = (el._endId || 0) + 1);
  const resolveIfNotStale = () => {
    if (id === el._endId) resolve();
  };

  if (explicitTimeout !== null) {
    setTimeout(resolveIfNotStale, explicitTimeout);
    return;
  }

  const { propCount, timeout, type } = getTransitionInfo(el, expectedType);
  if (!type) {
    resolve();
    return;
  }

  const endEvent = `${type}end`;
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e: Event) => {
    if (e.target === el && ++ended >= propCount) end();
  };

  setTimeout(() => {
    if (ended < propCount) end();
  }, timeout + 1);

  el.addEventListener(endEvent, onEnd);
}
