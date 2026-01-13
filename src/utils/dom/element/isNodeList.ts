import { isType } from './isType';

export function isNodeList(value: unknown): value is NodeList {
  return isType(value, 'NodeList');
}
