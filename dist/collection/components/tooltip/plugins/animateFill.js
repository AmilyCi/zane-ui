import { div } from "../../../utils";
import { BACKDROP_CLASS } from "../constants";
import { getChildren, setVisibilityState } from "../utils";
function createBackdropElement() {
    const backdrop = div();
    backdrop.className = BACKDROP_CLASS;
    setVisibilityState([backdrop], 'hidden');
    return backdrop;
}
const animateFill = {
    defaultValue: false,
    fn(instance) {
        var _a;
        if (!((_a = instance.props.render) === null || _a === void 0 ? void 0 : _a.$$tippy)) {
            return {};
        }
        const { box, content } = getChildren(instance.popper);
        const backdrop = instance.props.animateFill
            ? createBackdropElement()
            : null;
        return {
            onCreate() {
                if (backdrop) {
                    box.insertBefore(backdrop, box.firstElementChild);
                    box.dataset.animatefill = '';
                    box.style.overflow = 'hidden';
                    instance.setProps({ animation: 'shift-away', arrow: false });
                }
            },
            onHide() {
                if (backdrop) {
                    setVisibilityState([backdrop], 'hidden');
                }
                return undefined;
            },
            onMount() {
                if (backdrop) {
                    const { transitionDuration } = box.style;
                    const duration = Number(transitionDuration.replace('ms', ''));
                    // The content should fade in after the backdrop has mostly filled the
                    // tooltip element. `clip-path` is the other alternative but is not
                    // well-supported and is buggy on some devices.
                    content.style.transitionDelay = `${Math.round(duration / 10)}ms`;
                    backdrop.style.transitionDuration = transitionDuration;
                    setVisibilityState([backdrop], 'visible');
                }
            },
            onShow() {
                if (backdrop) {
                    backdrop.style.transitionDuration = '0ms';
                }
                return undefined;
            },
        };
    },
    name: 'animateFill',
};
export default animateFill;
