import { isType } from "./isType";
export function isElement(value) {
    return ['Element', 'Fragment'].some((type) => isType(value, type));
}
