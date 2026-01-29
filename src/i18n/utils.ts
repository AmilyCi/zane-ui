/**
 * 国际化工具函数
 * @module i18n/utils
 */

import { I18nManager } from './manager';
import { initDefaultLanguages } from './lang';
import { I18nConfig, I18nOptions, LanguageRegistrationOptions } from './types';

/**
 * 国际化API接口
 * @interface I18nAPI
 */
export interface I18nAPI {
  /** 翻译函数 */
  t: (key: string, options?: I18nOptions) => string;
  /** 设置当前语言 */
  setLanguage: (lang: string, options?: { persist?: boolean }) => Promise<any>;
  /** 注册语言包 */
  register: (lang: string, resources: any, options?: LanguageRegistrationOptions) => boolean;
  /** 批量注册语言包 */
  registerAll: (languageMap: Record<string, any>, options?: LanguageRegistrationOptions) => number;
  /** 从URL加载语言包 */
  loadFromUrl: (lang: string, url: string, options?: Partial<LanguageRegistrationOptions>) => Promise<boolean>;
  /** 获取当前语言 */
  getCurrentLang: () => string;
  /** 获取支持的语言列表 */
  getSupportedLanguages: () => string[];
  /** 检查是否支持某语言 */
  hasLanguage: (lang: string) => boolean;
  /** 订阅语言变更 */
  subscribe: (listener: (lang: string) => void) => () => void;
  /** 获取管理器实例（高级用法） */
  getManager: () => I18nManager;
}

/**
 * 初始化国际化系统
 * @param config - 国际化配置
 * @returns 国际化API实例
 * @example
 * const i18n = initI18n({
 *   defaultLang: 'zh-CN',
 *   debug: true
 * });
 */
export function initI18n(config?: Partial<I18nConfig>): I18nAPI {
  // 获取管理器单例
  const manager = I18nManager.getInstance(config);
  
  // 初始化默认语言包
  initDefaultLanguages(manager);
  
  // 返回封装好的API
  return {
    t: (key: string, options?: I18nOptions) => manager.t(key, options),
    
    setLanguage: (lang: string, options?: { persist?: boolean }) => 
      manager.setLanguage(lang, options),
    
    register: (lang: string, resources: any, options?: LanguageRegistrationOptions) => 
      manager.registerLanguage(lang, resources, options),
    
    registerAll: (languageMap: Record<string, any>, options?: LanguageRegistrationOptions) => 
      manager.registerLanguages(languageMap, options),
    
    loadFromUrl: (lang: string, url: string, options?: Partial<LanguageRegistrationOptions>) => 
      manager.loadLanguageFromUrl(lang, url, options),
    
    getCurrentLang: () => manager.getCurrentLang(),
    
    getSupportedLanguages: () => manager.getSupportedLanguages(),
    
    hasLanguage: (lang: string) => manager.hasLanguage(lang),
    
    subscribe: (listener: (lang: string) => void) => manager.subscribe(listener),
    
    getManager: () => manager
  };
}

/**
 * 创建翻译函数（无状态版本）
 * @param config - 国际化配置
 * @returns 翻译函数
 */
export function createTranslator(config?: Partial<I18nConfig>) {
  const i18n = initI18n(config);
  return i18n.t;
}

/**
 * 格式化带参数的翻译文本
 * @param text - 原始文本
 * @param params - 参数对象
 * @returns 格式化后的文本
 * @example
 * formatTranslation('Hello, {name}!', { name: 'World' }); // 'Hello, World!'
 */
export function formatTranslation(text: string, params: Record<string, any>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

/**
 * 提取翻译键名
 * @param text - 包含翻译键的文本
 * @returns 提取的键名数组
 * @example
 * extractKeys('t("button.submit")'); // ['button.submit']
 */
export function extractKeys(text: string): string[] {
  const regex = /t\(['"]([^'"]+)['"]/g;
  const keys: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    keys.push(match[1]);
  }
  
  return keys;
}

/**
 * 验证语言代码格式
 * @param lang - 语言代码
 * @returns 是否有效
 */
export function isValidLanguageCode(lang: string): boolean {
  return /^[a-zA-Z]{2,10}(-[a-zA-Z0-9]{2,10})?$/.test(lang);
}

/**
 * 获取浏览器偏好语言列表
 * @returns 语言代码数组
 */
export function getBrowserLanguages(): string[] {
  if (typeof navigator === 'undefined') return [];
  
  const languages: string[] = [];
  
  if (navigator.languages) {
    languages.push(...navigator.languages);
  }
  
  if ((navigator as any).userLanguage) {
    languages.push((navigator as any).userLanguage);
  }
  
  if ((navigator as any).browserLanguage) {
    languages.push((navigator as any).browserLanguage);
  }
  
  if ((navigator as any).systemLanguage) {
    languages.push((navigator as any).systemLanguage);
  }
  
  // 去重并过滤无效的
  return [...new Set(languages)].filter(isValidLanguageCode);
}

/**
 * 创建语言包合并工具
 * @param base - 基础语言包
 * @param overrides - 覆盖语言包
 * @returns 合并后的语言包
 */
export function mergeLanguageResources(
  base: Record<string, any>,
  overrides: Record<string, any>
): Record<string, any> {
  const result = { ...base };
  
  const mergeDeep = (target: any, source: any) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };
  
  mergeDeep(result, overrides);
  return result;
}
