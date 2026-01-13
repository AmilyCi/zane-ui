export const isSelectable = (element) => {
    return element instanceof HTMLInputElement && 'select' in element;
};
