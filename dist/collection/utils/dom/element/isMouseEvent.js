import { isType } from "./isType";
export function isMouseEvent(value) {
    return isType(value, 'MouseEvent');
}
