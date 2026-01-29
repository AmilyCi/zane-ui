import { initI18n, type I18nAPI } from '../i18n';
import type { IdInjectionContext } from '../interfaces';
import type { ComponentSize } from '../types';

import { createStore } from '@stencil/store';

export interface ZaneUiStore {
  idInjection: IdInjectionContext;
  size: ComponentSize;
  i18n: I18nAPI;
}

const defaultIdInjection = {
  current: 0,
  prefix: Math.floor(Math.random() * 10_000),
};

// 初始化国际化
const i18n = initI18n({
  defaultLang: 'zh-CN',
  fallbackLang: 'en',
  debug: process.env.NODE_ENV === 'development'
});


const initialState: ZaneUiStore = {
  idInjection: defaultIdInjection,
  size: '',
  i18n,
};

const { onChange, state } = createStore<ZaneUiStore>(initialState);

export default state;

export { onChange };
