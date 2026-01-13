import { isObject } from './isObject';

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (Array.isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length);
