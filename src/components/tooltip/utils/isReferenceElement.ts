import type { ReferenceElement } from '../types';

export function isReferenceElement(value: any): value is ReferenceElement {
  return !!(value && value._tippy && value._tippy.reference === value);
}
