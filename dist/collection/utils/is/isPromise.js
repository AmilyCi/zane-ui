import { isFunction } from "./isFunction";
import { isObject } from "./isObject";
export const isPromise = (val) => {
    return ((isObject(val) || isFunction(val)) &&
        isFunction(val.then) &&
        isFunction(val.catch));
};
