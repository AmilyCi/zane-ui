type WhenMouseHandler = (e: PointerEvent) => any;
export const whenMouse = (handler: WhenMouseHandler): WhenMouseHandler => {
  return (e: PointerEvent) =>
    e.pointerType === 'mouse' ? handler(e) : undefined;
};
