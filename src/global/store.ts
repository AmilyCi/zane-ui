import type { ConfigProviderContext, IdInjectionContext } from '../interfaces';
import type { ComponentSize } from '../types';

import { createStore } from '@stencil/store';

import { zhCn } from '../locale';

export interface ZaneUiStore {
  configProviderContext: ConfigProviderContext;
  idInjection: IdInjectionContext;
  size: ComponentSize;
}

const defaultIdInjection = {
  current: 0,
  prefix: Math.floor(Math.random() * 10_000),
};

const initialState: ZaneUiStore = {
  configProviderContext: {
    button: {},
    card: {},
    locale: zhCn,
  },
  idInjection: defaultIdInjection,
  size: '',
};

const { onChange, state } = createStore<ZaneUiStore>(initialState);

const getGlobalConfig = (
  key?: keyof ConfigProviderContext,
  defaultValue = undefined,
) => {
  return key
    ? (state.configProviderContext[key] ?? defaultValue)
    : state.configProviderContext;
};

export default state;

export { getGlobalConfig, onChange };
