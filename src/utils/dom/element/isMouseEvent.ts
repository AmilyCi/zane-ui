import { isType } from './isType';

export function isMouseEvent(value: unknown): value is MouseEvent {
  return isType(value, 'MouseEvent');
}
