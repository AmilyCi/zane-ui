import { arrayFrom } from "../../../utils";
import { ARROW_CLASS, BACKDROP_CLASS, CONTENT_CLASS, SVG_ARROW_CLASS, } from "../constants";
export function getChildren(popper) {
    const box = popper.firstElementChild;
    const boxChildren = arrayFrom(box.children);
    return {
        arrow: boxChildren.find((node) => node.classList.contains(ARROW_CLASS) ||
            node.classList.contains(SVG_ARROW_CLASS)),
        backdrop: boxChildren.find((node) => node.classList.contains(BACKDROP_CLASS)),
        box,
        content: boxChildren.find((node) => node.classList.contains(CONTENT_CLASS)),
    };
}
