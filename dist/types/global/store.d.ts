import type { ConfigProviderContext, IdInjectionContext } from '../interfaces';
import type { ComponentSize } from '../types';
export interface ZaneUiStore {
    configProviderContext: ConfigProviderContext;
    idInjection: IdInjectionContext;
    size: ComponentSize;
}
declare const onChange: import("@stencil/store/dist/types").OnChangeHandler<ZaneUiStore>, state: ZaneUiStore;
declare const getGlobalConfig: (key?: keyof ConfigProviderContext, defaultValue?: any) => any;
export default state;
export { getGlobalConfig, onChange };
