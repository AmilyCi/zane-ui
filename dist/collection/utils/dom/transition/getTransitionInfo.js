import { ANIMATION, TRANSITION } from "../../../constants";
import { getTimeout } from "./getTimeout";
export function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    const getStyleProperties = (key) => (styles[key] || '').split(', ');
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        if (timeout > 0) {
            type = transitionTimeout > animationTimeout ? TRANSITION : ANIMATION;
        }
        else {
            type = null;
        }
        if (type) {
            propCount =
                type === TRANSITION
                    ? transitionDurations.length
                    : animationDurations.length;
        }
        else {
            propCount = 0;
        }
    }
    const hasTransform = type === TRANSITION &&
        /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
    return {
        hasTransform,
        propCount,
        timeout,
        type,
    };
}
