import { defaultProps } from "../constants";
export function getExtendedPassedProps(passedProps) {
    const plugins = passedProps.plugins || [];
    const pluginProps = plugins.reduce((acc, plugin) => {
        var _a;
        const { defaultValue, name } = plugin;
        if (name) {
            acc[name] =
                passedProps[name] === undefined
                    ? ((_a = defaultProps[name]) !== null && _a !== void 0 ? _a : defaultValue)
                    : passedProps[name];
        }
        return acc;
    }, {});
    return Object.assign(Object.assign({}, passedProps), pluginProps);
}
