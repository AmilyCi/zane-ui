import { isElement } from "../../utils";
import { defaultProps, mountedInstances } from "./constants";
import { bindGlobalEventListeners, createTippy, currentInput, getArrayOfElements, isReferenceElement, setDefaultProps, } from "./utils";
export const hideAll = ({ duration, exclude: excludedReferenceOrInstance, } = {}) => {
    mountedInstances.forEach((instance) => {
        let isExcluded = false;
        if (excludedReferenceOrInstance) {
            isExcluded = isReferenceElement(excludedReferenceOrInstance)
                ? instance.reference === excludedReferenceOrInstance
                : instance.popper === excludedReferenceOrInstance.popper;
        }
        if (!isExcluded) {
            const originalDuration = instance.props.duration;
            instance.setProps({ duration });
            instance.hide();
            if (!instance.state.isDestroyed) {
                instance.setProps({ duration: originalDuration });
            }
        }
    });
};
function tippy(targets, optionalProps = {}) {
    const plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    bindGlobalEventListeners();
    const passedProps = Object.assign(Object.assign({}, optionalProps), { plugins });
    const elements = getArrayOfElements(targets);
    const instances = elements.reduce((acc, reference) => {
        const instance = reference && createTippy(reference, passedProps);
        if (instance) {
            acc.push(instance);
        }
        return acc;
    }, []);
    return isElement(targets) ? instances[0] : instances;
}
tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
export default tippy;
