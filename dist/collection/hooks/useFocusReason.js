import { isSelectable } from "../utils";
let focusReason;
let lastUserFocusTimestamp = 0;
let lastAutomatedFocusTimestamp = 0;
let focusReasonUserCount = 0;
const notifyFocusReasonPointer = () => {
    focusReason = 'pointer';
    lastUserFocusTimestamp = window.performance.now();
};
const notifyFocusReasonKeydown = () => {
    focusReason = 'keyboard';
    lastUserFocusTimestamp = window.performance.now();
};
export const useFocusReason = () => {
    const connect = () => {
        if (focusReasonUserCount === 0) {
            document.addEventListener('mousedown', notifyFocusReasonPointer);
            document.addEventListener('touchstart', notifyFocusReasonPointer);
            document.addEventListener('keydown', notifyFocusReasonKeydown);
        }
        focusReasonUserCount++;
    };
    const disconnect = () => {
        focusReasonUserCount--;
        if (focusReasonUserCount <= 0) {
            document.removeEventListener('mousedown', notifyFocusReasonPointer);
            document.removeEventListener('touchstart', notifyFocusReasonPointer);
            document.removeEventListener('keydown', notifyFocusReasonKeydown);
        }
    };
    const isFocusCausedByUserEvent = () => {
        return lastUserFocusTimestamp > lastAutomatedFocusTimestamp;
    };
    const tryFocus = (element, shouldSelect) => {
        if (element && 'focus' in element) {
            const prevFocusedElement = document.activeElement;
            element.focus({ preventScroll: true });
            lastAutomatedFocusTimestamp = window.performance.now();
            if (element !== prevFocusedElement &&
                isSelectable(element) &&
                shouldSelect) {
                element.select();
            }
        }
    };
    return {
        connect,
        disconnect,
        getFocusReason: () => focusReason,
        getLastAutomatedFocusTimestamp: () => lastAutomatedFocusTimestamp,
        getLastUserFocusTimestamp: () => lastUserFocusTimestamp,
        isFocusCausedByUserEvent,
        tryFocus,
    };
};
