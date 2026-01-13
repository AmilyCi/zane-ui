import { isHidden } from './isHidden';

export const getVisibleElement = (
  elements: HTMLElement[],
  container: HTMLElement,
) => {
  for (const element of elements) {
    if (!isHidden(element, container)) return element;
  }
  return null;
};
