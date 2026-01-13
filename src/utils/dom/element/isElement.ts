import { isType } from './isType';

export function isElement(value: unknown): value is DocumentFragment | Element {
  return ['Element', 'Fragment'].some((type) => isType(value, type));
}
