import type { Targets } from '../types';

import { arrayFrom, isElement, isNodeList } from '../../../utils';

export function getArrayOfElements(value: Targets): Element[] {
  if (isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value) as Element[];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
