/**
 * 国际化系统主入口
 * @module i18n
 */

export { I18nManager } from './manager';
export { initI18n, createTranslator, type I18nAPI } from './utils';
export { DEFAULT_LANGUAGES, initDefaultLanguages } from './lang';

// 类型导出
export type {
  I18nResource,
  I18nConfig,
  I18nOptions,
  LanguageRegistrationOptions,
  LanguageChangeEvent,
  LanguageLoadState,
  TranslationEntry
} from './types';
