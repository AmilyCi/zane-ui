import { isString } from "../is";
export const toNumber = (val) => {
    const n = isString(val) ? Number(val) : Number.NaN;
    return Number.isNaN(n) ? val : n;
};
