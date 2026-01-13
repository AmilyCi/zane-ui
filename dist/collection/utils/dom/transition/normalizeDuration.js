import { isObject } from "../../is";
import { toNumber } from "../../number";
export function normalizeDuration(duration) {
    if (duration === null) {
        return null;
    }
    else if (isObject(duration)) {
        return [toNumber(duration.enter), toNumber(duration.leave)];
    }
    else {
        const n = toNumber(duration);
        return [n, n];
    }
}
