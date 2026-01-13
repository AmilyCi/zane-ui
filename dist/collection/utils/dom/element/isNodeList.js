import { isType } from "./isType";
export function isNodeList(value) {
    return isType(value, 'NodeList');
}
