import { isString } from '../is';

export const toNumber = (val: any): any => {
  const n = isString(val) ? Number(val) : Number.NaN;
  return Number.isNaN(n) ? val : n;
};
