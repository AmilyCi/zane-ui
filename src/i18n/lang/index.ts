import type { I18nResource } from "../types";
import { en_US } from "./en_US";
import { zh_CN } from "./zh_CN";

/**
 * 所有默认语言包的映射
 * @constant
 */
export const DEFAULT_LANGUAGES: Record<string, I18nResource> = {
  'en': en_US,
  'en-US': en_US,
  'zh-CN': zh_CN,
};

/**
 * 初始化默认语言包
 * @param i18nManager - I18nManager实例
 */
export function initDefaultLanguages(i18nManager: any): void {
  Object.entries(DEFAULT_LANGUAGES).forEach(([lang, resources]) => {
    i18nManager.registerLanguage(lang, resources, {
      isExternal: false,
      source: 'built-in'
    });
  });
}
