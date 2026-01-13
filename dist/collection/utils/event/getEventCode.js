import { EVENT_CODE } from "../../constants";
import { getEventKey } from "./getEventKey";
export const getEventCode = (event) => {
    if (event.code && event.code !== 'Unidentified')
        return event.code;
    // On android, event.code is always '' (see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#browser_compatibility)
    const key = getEventKey(event);
    if (key) {
        if (Object.values(EVENT_CODE).includes(key))
            return key;
        switch (key) {
            case ' ': {
                return EVENT_CODE.space;
            }
            default: {
                return '';
            }
        }
    }
    return '';
};
