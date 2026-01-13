import { createStore } from "@stencil/store";
import { zhCn } from "../locale";
const defaultIdInjection = {
    current: 0,
    prefix: Math.floor(Math.random() * 10000),
};
const initialState = {
    configProviderContext: {
        button: {},
        card: {},
        locale: zhCn,
    },
    idInjection: defaultIdInjection,
    size: '',
};
const { onChange, state } = createStore(initialState);
const getGlobalConfig = (key, defaultValue = undefined) => {
    var _a;
    return key
        ? ((_a = state.configProviderContext[key]) !== null && _a !== void 0 ? _a : defaultValue)
        : state.configProviderContext;
};
export default state;
export { getGlobalConfig, onChange };
