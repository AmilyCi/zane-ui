import { normalizeToArray } from "../../array";
export function getOwnerDocument(elementOrElements) {
    var _a;
    const [element] = normalizeToArray(elementOrElements);
    // Elements created via a <template> have an ownerDocument with no reference to the body
    return ((_a = element === null || element === void 0 ? void 0 : element.ownerDocument) === null || _a === void 0 ? void 0 : _a.body) ? element.ownerDocument : document;
}
