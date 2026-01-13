import { dangerouslySetInnerHTML, div, isElement } from "../../../utils";
import { ARROW_CLASS, SVG_ARROW_CLASS } from "../constants";
export function createArrowElement(value) {
    const arrow = div();
    if (value === true) {
        arrow.className = ARROW_CLASS;
    }
    else {
        arrow.className = SVG_ARROW_CLASS;
        if (isElement(value)) {
            arrow.append(value);
        }
        else {
            dangerouslySetInnerHTML(arrow, value);
        }
    }
    return arrow;
}
