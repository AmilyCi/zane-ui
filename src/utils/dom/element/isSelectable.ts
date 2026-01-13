export const isSelectable = (
  element: any,
): element is HTMLInputElement & { select: () => void } => {
  return element instanceof HTMLInputElement && 'select' in element;
};
