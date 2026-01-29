/**
 * 国际化系统类型定义
 * @module i18n/types
 */

/**
 * 翻译资源对象类型
 * @interface I18nResource
 * @description 支持嵌套结构的翻译资源，键可以是字符串或嵌套对象
 * @example
 * {
 *   "button": {
 *     "submit": "Submit",
 *     "cancel": "Cancel"
 *   }
 * }
 */
export interface I18nResource {
  [key: string]: string | I18nResource;
}

/**
 * 国际化配置选项
 * @interface I18nConfig
 */
export interface I18nConfig {
  /** 默认语言代码，如 'en', 'zh-CN' */
  defaultLang: string;
  /** 后备语言代码，当首选语言加载失败时使用 */
  fallbackLang: string;
  /** 本地存储中保存语言选择的键名 */
  storageKey?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 是否自动检测浏览器语言 */
  autoDetect?: boolean;
}

/**
 * 翻译函数选项
 * @interface I18nOptions
 */
export interface I18nOptions {
  /** 指定使用的语言代码，覆盖当前语言 */
  locale?: string;
  /** 模板参数，用于替换翻译中的占位符 {key} */
  params?: Record<string, string | number | boolean | Date>;
  /** 当翻译不存在时的后备文本 */
  fallback?: string;
  /** 是否跳过警告日志 */
  silent?: boolean;
}

/**
 * 语言包注册选项
 * @interface LanguageRegistrationOptions
 */
export interface LanguageRegistrationOptions {
  /** 是否为外部注册的语言包（优先级高于内置包） */
  isExternal?: boolean;
  /** 是否合并到现有语言包（false则替换） */
  merge?: boolean;
  /** 语言包来源标识，用于调试 */
  source?: string;
}

/**
 * 语言变更事件详情
 * @interface LanguageChangeEvent
 */
export interface LanguageChangeEvent {
  /** 变更前的语言代码 */
  from: string;
  /** 变更后的语言代码 */
  to: string;
  /** 变更是否成功 */
  success: boolean;
  /** 错误信息（如果有） */
  error?: string;
}

/**
 * 语言包加载状态
 * @interface LanguageLoadState
 */
export interface LanguageLoadState {
  /** 语言代码 */
  lang: string;
  /** 是否已加载 */
  loaded: boolean;
  /** 加载时间戳 */
  timestamp?: number;
  /** 语言包来源 */
  source: 'built-in' | 'external' | 'remote' | 'unknown';
}

/**
 * 翻译键值对（扁平化结构）
 * @interface TranslationEntry
 */
export interface TranslationEntry {
  /** 翻译键名（如 'button.submit'） */
  key: string;
  /** 翻译文本 */
  value: string;
  /** 语言代码 */
  lang: string;
}
