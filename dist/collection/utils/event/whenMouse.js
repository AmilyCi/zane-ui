export const whenMouse = (handler) => {
    return (e) => e.pointerType === 'mouse' ? handler(e) : undefined;
};
