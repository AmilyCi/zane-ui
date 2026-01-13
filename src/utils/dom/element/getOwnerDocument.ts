import { normalizeToArray } from '../../array';

export function getOwnerDocument(
  elementOrElements: Element | Element[],
): Document {
  const [element] = normalizeToArray(elementOrElements);

  // Elements created via a <template> have an ownerDocument with no reference to the body
  return element?.ownerDocument?.body ? element.ownerDocument : document;
}
