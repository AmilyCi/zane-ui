import { defaultKeys, defaultProps } from "../constants";
import { getExtendedPassedProps } from "./getExtendedPassedProps";
export function getDataAttributeProps(reference, plugins) {
    const propKeys = plugins
        ? Object.keys(getExtendedPassedProps(Object.assign(Object.assign({}, defaultProps), { plugins })))
        : defaultKeys;
    const props = propKeys.reduce((acc, key) => {
        const valueAsString = (reference.getAttribute(`data-tippy-${key}`) || '').trim();
        if (!valueAsString) {
            return acc;
        }
        if (key === 'content') {
            acc[key] = valueAsString;
        }
        else {
            try {
                acc[key] = JSON.parse(valueAsString);
            }
            catch (_a) {
                acc[key] = valueAsString;
            }
        }
        return acc;
    }, {});
    return props;
}
