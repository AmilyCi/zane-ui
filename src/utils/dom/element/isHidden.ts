export const isHidden = (element: HTMLElement, container: HTMLElement) => {
  if (getComputedStyle(element).visibility === 'hidden') return true;

  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (container && currentElement === container) return false;
    if (getComputedStyle(currentElement).display === 'none') return true;
    currentElement = currentElement.parentElement;
  }

  return false;
};
