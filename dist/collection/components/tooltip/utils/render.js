import { div } from "../../../utils";
import { BOX_CLASS, CONTENT_CLASS } from "../constants";
import { createArrowElement } from "./createArrowElement";
import { getChildren } from "./getChildren";
import { setContent } from "./setContent";
export function render(instance) {
    const popper = div();
    const box = div();
    box.className = BOX_CLASS;
    box.dataset.state = 'hidden';
    box.setAttribute('tabindex', '-1');
    const content = div();
    content.className = CONTENT_CLASS;
    content.dataset.state = 'hidden';
    setContent(content, instance.props);
    popper.append(box);
    box.append(content);
    onUpdate(instance.props, instance.props);
    function onUpdate(prevProps, nextProps) {
        const { arrow, box, content } = getChildren(popper);
        if (nextProps.theme) {
            box.dataset.theme = nextProps.theme;
        }
        else {
            delete box.dataset.theme;
        }
        if (typeof nextProps.animation === 'string') {
            box.dataset.animation = nextProps.animation;
        }
        else {
            delete box.dataset.animation;
        }
        if (nextProps.inertia) {
            box.dataset.inertia = '';
        }
        else {
            delete box.dataset.inertia;
        }
        box.style.maxWidth =
            typeof nextProps.maxWidth === 'number'
                ? `${nextProps.maxWidth}px`
                : nextProps.maxWidth;
        if (nextProps.role) {
            box.setAttribute('role', nextProps.role);
        }
        else {
            box.removeAttribute('role');
        }
        if (prevProps.content !== nextProps.content ||
            prevProps.allowHTML !== nextProps.allowHTML) {
            setContent(content, instance.props);
        }
        if (nextProps.arrow) {
            if (!arrow) {
                box.append(createArrowElement(nextProps.arrow));
            }
            else if (prevProps.arrow !== nextProps.arrow) {
                arrow.remove();
                box.append(createArrowElement(nextProps.arrow));
            }
        }
        else if (arrow) {
            arrow === null || arrow === void 0 ? void 0 : arrow.remove();
        }
    }
    return {
        onUpdate,
        popper,
    };
}
// Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away
render.$$tippy = true;
