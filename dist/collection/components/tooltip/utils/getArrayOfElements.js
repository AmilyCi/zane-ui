import { arrayFrom, isElement, isNodeList } from "../../../utils";
export function getArrayOfElements(value) {
    if (isElement(value)) {
        return [value];
    }
    if (isNodeList(value)) {
        return arrayFrom(value);
    }
    if (Array.isArray(value)) {
        return value;
    }
    return arrayFrom(document.querySelectorAll(value));
}
