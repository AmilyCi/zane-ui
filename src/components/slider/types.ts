
export type SliderContext = {
  min: number;
  max: number;
  step: number;
  showTooltip: boolean;
  precision: number;
  sliderSize: number;
  formatTooltip: (value: number) => string | number;
  emitChange: () => void;
  resetSize: () => void;
  updateDragging: (dragging: boolean) => void;
  disabled: boolean;
}
