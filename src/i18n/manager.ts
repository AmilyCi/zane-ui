import type {
  I18nConfig,
  I18nOptions,
  I18nResource,
  LanguageChangeEvent,
  LanguageLoadState,
  LanguageRegistrationOptions,
  TranslationEntry,
} from "./types";

/**
 * 国际化管理器
 * @class I18nManager
 * @description 国际化系统的核心单例类，负责管理语言包、处理翻译、事件通知等
 * @example
 * const i18n = I18nManager.getInstance();
 * i18n.t('button.submit');
 */
export class I18nManager {
  /** 单例实例 */
  private static instance: I18nManager;

  /** 当前语言代码 */
  private currentLang: string;

  /** 内置语言包存储（组件库默认提供） */
  private builtInResources: Map<string, I18nResource> = new Map();

  /** 外部注册语言包存储（使用者注册，优先级高于内置包） */
  private externalResources: Map<string, I18nResource> = new Map();

  /** 远程加载语言包存储 */
  private remoteResources: Map<string, I18nResource> = new Map();

  /** 事件监听器集合 */
  private listeners: Set<(lang: string) => void> = new Set();

  /** 配置选项 */
  private config: I18nConfig;

  /** 加载中的语言包Promise映射（避免重复加载） */
  private pendingLoads: Map<string, Promise<boolean>> = new Map();

  /** 语言包加载状态记录 */
  private loadStates: Map<string, LanguageLoadState> = new Map();

  /** 翻译缓存（提高性能） */
  private translationCache: Map<string, string> = new Map();

  /** 最后一次缓存清理时间 */
  private lastCacheCleanup: number = Date.now();

  /**
   * 私有构造函数，确保单例模式
   * @param config - 国际化配置
   */
  private constructor(config?: Partial<I18nConfig>) {
    // 合并默认配置
    this.config = {
      defaultLang: "en",
      fallbackLang: "en",
      storageKey: "zane-ui-i18n-lang",
      debug: false,
      autoDetect: true,
      ...config,
    };

    // 初始化当前语言
    this.currentLang = this.detectInitialLanguage();

    // 设置缓存清理定时器（每小时清理一次）
    setInterval(() => this.cleanupCache(), 60 * 60 * 1000);

    this.logDebug("I18nManager initialized", {
      currentLang: this.currentLang,
      config: this.config,
    });
  }

  /**
   * 获取I18nManager单例实例
   * @param config - 可选配置，仅在第一次调用时生效
   * @returns I18nManager实例
   */
  static getInstance(config?: Partial<I18nConfig>): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager(config);
    }
    return I18nManager.instance;
  }

  /**
   * 检测初始语言
   * @private
   * @returns 初始语言代码
   */
  private detectInitialLanguage(): string {
    // 1. 检查本地存储
    if (this.config.storageKey) {
      try {
        const stored = localStorage.getItem(this.config.storageKey);
        if (stored && this.isValidLanguageCode(stored)) {
          this.logDebug("Language detected from localStorage", stored);
          return stored;
        }
      } catch (error) {
        this.logDebug("Failed to read from localStorage", error);
      }
    }

    // 2. 自动检测浏览器语言
    if (this.config.autoDetect && typeof navigator !== "undefined") {
      const browserLang = this.getBrowserLanguage();
      if (browserLang && this.isValidLanguageCode(browserLang)) {
        this.logDebug("Language detected from browser", browserLang);
        return browserLang;
      }
    }

    // 3. 使用配置的默认语言
    this.logDebug("Using default language", this.config.defaultLang);
    return this.config.defaultLang;
  }

  /**
   * 获取浏览器语言偏好
   * @private
   * @returns 浏览器语言代码
   */
  private getBrowserLanguage(): string | null {
    if (typeof navigator === "undefined") return null;

    // 尝试多种属性获取语言
    const languages = [
      navigator.language,
      (navigator as any).userLanguage,
      (navigator as any).browserLanguage,
      (navigator as any).systemLanguage,
    ];

    // 返回第一个有效的语言代码
    for (const lang of languages) {
      if (lang && this.isValidLanguageCode(lang)) {
        return lang; // 只取主要语言部分
      }
    }

    return null;
  }

  /**
   * 验证语言代码格式
   * @private
   * @param lang - 语言代码
   * @returns 是否有效
   */
  private isValidLanguageCode(lang: string): boolean {
    // 简单验证：2-10个字母数字字符，可包含连字符
    return /^[a-zA-Z]{2,10}(-[a-zA-Z0-9]{2,10})?$/.test(lang);
  }

  /**
   * 注册语言包
   * @param lang - 语言代码
   * @param resources - 翻译资源
   * @param options - 注册选项
   * @returns 是否成功
   */
  registerLanguage(
    lang: string,
    resources: I18nResource,
    options: LanguageRegistrationOptions = {}
  ): boolean {
    if (!this.isValidLanguageCode(lang)) {
      this.logError(`Invalid language code: ${lang}`);
      return false;
    }

    if (!resources || typeof resources !== "object") {
      this.logError(`Invalid resources for language: ${lang}`);
      return false;
    }

    const { isExternal = false, merge = true, source = "manual" } = options;

    // 确定目标存储
    const targetMap = isExternal
      ? this.externalResources
      : this.builtInResources;

    // 如果不需要合并或目标不存在，直接设置
    if (!merge || !targetMap.has(lang)) {
      targetMap.set(lang, resources);
    } else {
      // 深度合并资源
      const existing = targetMap.get(lang)!;
      this.deepMergeResources(existing, resources);
      targetMap.set(lang, existing);
    }

    // 更新加载状态
    this.loadStates.set(lang, {
      lang,
      loaded: true,
      timestamp: Date.now(),
      source: isExternal ? "external" : "built-in",
    });

    // 清理缓存（因为资源已更新）
    this.clearCacheForLanguage(lang);

    this.logDebug(`Language registered: ${lang}`, {
      isExternal,
      merge,
      source,
      keyCount: this.countKeys(resources),
    });

    // 如果注册的是当前语言，通知监听器
    if (lang === this.currentLang) {
      this.notifyListeners(lang);
    }

    return true;
  }

  /**
   * 批量注册语言包
   * @param languageMap - 语言包映射对象
   * @param options - 注册选项
   * @returns 成功注册的语言数量
   */
  registerLanguages(
    languageMap: Record<string, I18nResource>,
    options?: LanguageRegistrationOptions
  ): number {
    let successCount = 0;

    Object.entries(languageMap).forEach(([lang, resources]) => {
      if (this.registerLanguage(lang, resources, options)) {
        successCount++;
      }
    });

    this.logDebug(`Batch registered ${successCount} language(s)`);
    return successCount;
  }

  /**
   * 从URL加载远程语言包
   * @param lang - 语言代码
   * @param url - 语言包URL
   * @param options - 附加选项
   * @returns Promise<boolean> 是否加载成功
   */
  async loadLanguageFromUrl(
    lang: string,
    url: string,
    options?: Partial<LanguageRegistrationOptions>
  ): Promise<boolean> {
    // 验证输入
    if (!this.isValidLanguageCode(lang)) {
      this.logError(`Invalid language code: ${lang}`);
      return false;
    }

    if (!url || typeof url !== "string") {
      this.logError(`Invalid URL for language: ${lang}`);
      return false;
    }

    // 避免重复加载
    const cacheKey = `${lang}:${url}`;
    if (this.pendingLoads.has(cacheKey)) {
      this.logDebug(`Already loading language: ${lang} from ${url}`);
      return this.pendingLoads.get(cacheKey)!;
    }

    // 创建加载Promise
    const loadPromise = (async (): Promise<boolean> => {
      try {
        this.logDebug(`Loading language from URL: ${url}`);

        // 发起请求
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // 可选：添加超时处理
          signal: AbortSignal.timeout?.(10000),
        } as RequestInit);

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // 解析JSON
        const resources = await response.json();

        // 验证资源格式
        if (!resources || typeof resources !== "object") {
          throw new Error("Invalid JSON format");
        }

        // 注册语言包
        const success = this.registerLanguage(lang, resources, {
          isExternal: true,
          source: `remote:${url}`,
          ...options,
        });

        if (success) {
          // 更新为远程资源存储
          this.remoteResources.set(lang, resources);
          this.logDebug(`Successfully loaded language from URL: ${url}`);
        }

        return success;
      } catch (error) {
        this.logError(`Failed to load language from ${url}:`, error);

        // 更新加载状态为失败
        this.loadStates.set(lang, {
          lang,
          loaded: false,
          source: "remote",
        });

        return false;
      } finally {
        // 清理pending状态
        this.pendingLoads.delete(cacheKey);
      }
    })();

    // 存储Promise以便去重
    this.pendingLoads.set(cacheKey, loadPromise);

    return loadPromise;
  }

  /**
   * 设置当前语言
   * @param lang - 目标语言代码
   * @param options - 附加选项
   * @returns Promise<LanguageChangeEvent> 语言变更事件详情
   */
  async setLanguage(
    lang: string,
    options?: {
      persist?: boolean;
      forceReload?: boolean;
    }
  ): Promise<LanguageChangeEvent> {
    const { persist = true, forceReload = false } = options || {};

    const previousLang = this.currentLang;
    const event: LanguageChangeEvent = {
      from: previousLang,
      to: lang,
      success: false,
    };

    // 验证语言代码
    if (!this.isValidLanguageCode(lang)) {
      event.error = `Invalid language code: ${lang}`;
      this.logError(event.error);
      return event;
    }

    // 检查是否与当前语言相同
    if (lang === previousLang && !forceReload) {
      event.success = true;
      this.logDebug(`Language already set to: ${lang}`);
      return event;
    }

    try {
      // 检查语言是否已加载
      const isLoaded = this.hasLanguage(lang);

      // 如果未加载且不是当前语言，尝试加载后备语言
      if (!isLoaded && lang !== this.config.fallbackLang) {
        this.logDebug(`Language ${lang} not loaded, trying fallback`);
        return this.setLanguage(this.config.fallbackLang, options);
      }

      // 更新当前语言
      this.currentLang = lang;

      // 持久化存储
      if (persist && this.config.storageKey) {
        try {
          localStorage.setItem(this.config.storageKey, lang);
        } catch (error) {
          this.logDebug("Failed to persist language to localStorage", error);
        }
      }

      // 清理翻译缓存
      this.clearCache();

      // 通知所有监听器
      this.notifyListeners(lang);

      event.success = true;
      this.logDebug(`Language changed: ${previousLang} -> ${lang}`);
    } catch (error) {
      event.error = error instanceof Error ? error.message : "Unknown error";
      this.logError("Failed to change language:", error);
    }

    return event;
  }

  /**
   * 翻译文本
   * @param key - 翻译键名
   * @param options - 翻译选项
   * @returns 翻译后的文本
   */
  t(key: string, options?: I18nOptions): string {
    if (!key || typeof key !== "string") {
      return options?.fallback || key || "";
    }

    const {
      locale = this.currentLang,
      params,
      fallback,
      silent = false,
    } = options || {};

    // 生成缓存键
    const cacheKey = this.generateCacheKey(key, locale, params);

    // 检查缓存
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    // 查找翻译文本（优先级：外部 > 远程 > 内置）
    let translation: string | undefined;

    // 1. 尝试外部资源
    translation = this.findTranslation(key, locale, this.externalResources);

    // 2. 尝试远程资源
    if (translation === undefined) {
      translation = this.findTranslation(key, locale, this.remoteResources);
    }

    // 3. 尝试内置资源
    if (translation === undefined) {
      translation = this.findTranslation(key, locale, this.builtInResources);
    }

    // 4. 如果当前不是后备语言，尝试后备语言
    if (translation === undefined && locale !== this.config.fallbackLang) {
      return this.t(key, { ...options, locale: this.config.fallbackLang });
    }

    // 5. 如果仍然未找到，使用后备文本或键名本身
    if (translation === undefined) {
      if (!silent) {
        this.logWarn(`Translation not found: ${key} for language ${locale}`);
      }
      translation = fallback || key;
    }

    // 6. 替换参数
    if (params && Object.keys(params).length > 0) {
      translation = this.replaceParams(translation, params);
    }

    // 7. 缓存结果（仅当不是后备键名时）
    if (translation !== key) {
      this.translationCache.set(cacheKey, translation);
    }

    return translation;
  }

  /**
   * 在指定资源映射中查找翻译
   * @private
   * @param key - 翻译键名
   * @param lang - 语言代码
   * @param resourceMap - 资源映射
   * @returns 翻译文本或undefined
   */
  private findTranslation(
    key: string,
    lang: string,
    resourceMap: Map<string, I18nResource>
  ): string | undefined {
    const resource = resourceMap.get(lang);
    if (!resource) return undefined;

    // 支持点分隔的嵌套键名
    const keys = key.split(".");
    let current: any = resource;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    // 确保最终结果是字符串
    return typeof current === "string" ? current : undefined;
  }

  /**
   * 替换模板参数
   * @private
   * @param text - 原始文本
   * @param params - 参数对象
   * @returns 替换后的文本
   */
  private replaceParams(
    text: string,
    params: Record<string, string | number | boolean | Date>
  ): string {
    return text.replace(/\{(\w+)\}/g, (match, paramKey) => {
      const value = params[paramKey];

      if (value === undefined || value === null) {
        return match; // 保持原样
      }

      // 根据类型格式化
      if (value instanceof Date) {
        return value.toLocaleDateString(this.currentLang);
      }

      return String(value);
    });
  }

  /**
   * 生成缓存键
   * @private
   * @param key - 翻译键名
   * @param lang - 语言代码
   * @param params - 参数对象
   * @returns 缓存键
   */
  private generateCacheKey(
    key: string,
    lang: string,
    params?: Record<string, any>
  ): string {
    let cacheKey = `${lang}:${key}`;

    if (params) {
      const paramStr = JSON.stringify(params);
      cacheKey += `:${paramStr}`;
    }

    return cacheKey;
  }

  /**
   * 深度合并资源对象
   * @private
   * @param target - 目标对象
   * @param source - 源对象
   */
  private deepMergeResources(target: I18nResource, source: I18nResource): void {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        // 如果是嵌套对象
        if (!target[key] || typeof target[key] !== "object") {
          target[key] = {};
        }
        this.deepMergeResources(
          target[key] as I18nResource,
          source[key] as I18nResource
        );
      } else {
        // 如果是叶子节点（字符串）
        target[key] = source[key];
      }
    }
  }

  /**
   * 统计资源中的键数量
   * @private
   * @param resource - 资源对象
   * @returns 键数量
   */
  private countKeys(resource: I18nResource): number {
    let count = 0;

    const countRecursive = (obj: I18nResource) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          count++;
        } else if (obj[key] && typeof obj[key] === "object") {
          countRecursive(obj[key] as I18nResource);
        }
      }
    };

    countRecursive(resource);
    return count;
  }

  /**
   * 检查是否支持指定语言
   * @param lang - 语言代码
   * @param includeExternal - 是否包含外部语言包
   * @returns 是否支持
   */
  hasLanguage(lang: string, includeExternal = true): boolean {
    const hasBuiltIn = this.builtInResources.has(lang);
    const hasExternal = includeExternal
      ? this.externalResources.has(lang) || this.remoteResources.has(lang)
      : false;

    return hasBuiltIn || hasExternal;
  }

  /**
   * 获取当前语言
   * @returns 当前语言代码
   */
  getCurrentLang(): string {
    return this.currentLang;
  }

  /**
   * 获取支持的语言列表
   * @returns 语言代码数组
   */
  getSupportedLanguages(): string[] {
    const languages = new Set<string>();

    // 收集所有语言
    this.builtInResources.forEach((_, lang) => languages.add(lang));
    this.externalResources.forEach((_, lang) => languages.add(lang));
    this.remoteResources.forEach((_, lang) => languages.add(lang));

    return Array.from(languages);
  }

  /**
   * 订阅语言变更事件
   * @param listener - 监听函数
   * @returns 取消订阅的函数
   */
  subscribe(listener: (lang: string) => void): () => void {
    this.listeners.add(listener);

    // 返回取消订阅的函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 通知所有监听器
   * @private
   * @param lang - 当前语言
   */
  private notifyListeners(lang: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(lang);
      } catch (error) {
        this.logError("Error in language change listener:", error);
      }
    });
  }

  /**
   * 清理指定语言的缓存
   * @private
   * @param lang - 语言代码
   */
  private clearCacheForLanguage(lang: string): void {
    const keysToDelete: string[] = [];

    this.translationCache.forEach((_, key) => {
      if (key.startsWith(`${lang}:`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.translationCache.delete(key));
  }

  /**
   * 清理所有缓存
   */
  clearCache(): void {
    this.translationCache.clear();
    this.lastCacheCleanup = Date.now();
  }

  /**
   * 定期清理缓存
   * @private
   */
  private cleanupCache(): void {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;

    if (this.lastCacheCleanup < hourAgo) {
      const oldSize = this.translationCache.size;
      this.clearCache();
      this.logDebug(`Cache cleaned: ${oldSize} entries removed`);
    }
  }

  /**
   * 获取语言包加载状态
   * @param lang - 语言代码（可选，不传则返回所有）
   * @returns 加载状态
   */
  getLoadStates(lang?: string): LanguageLoadState | LanguageLoadState[] {
    if (lang) {
      return (
        this.loadStates.get(lang) || {
          lang,
          loaded: false,
          source: "unknown",
        }
      );
    }

    return Array.from(this.loadStates.values());
  }

  /**
   * 获取翻译键列表
   * @param lang - 语言代码（可选，默认当前语言）
   * @returns 翻译键数组
   */
  getTranslationKeys(lang?: string): TranslationEntry[] {
    const targetLang = lang || this.currentLang;
    const entries: TranslationEntry[] = [];

    // 合并所有资源的函数
    const collectEntries = (resource: I18nResource, prefix = "") => {
      for (const key in resource) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = resource[key];

        if (typeof value === "string") {
          entries.push({
            key: fullKey,
            value,
            lang: targetLang,
          });
        } else if (value && typeof value === "object") {
          collectEntries(value as I18nResource, fullKey);
        }
      }
    };

    // 收集外部资源（优先级高）
    const externalResource = this.externalResources.get(targetLang);
    if (externalResource) {
      collectEntries(externalResource);
    }

    // 收集远程资源
    const remoteResource = this.remoteResources.get(targetLang);
    if (remoteResource) {
      collectEntries(remoteResource);
    }

    // 收集内置资源
    const builtInResource = this.builtInResources.get(targetLang);
    if (builtInResource) {
      collectEntries(builtInResource);
    }

    return entries;
  }

  /**
   * 调试日志
   * @private
   */
  private logDebug(...args: any[]): void {
    if (this.config.debug) {
      console.debug("[I18nManager]", ...args);
    }
  }

  /**
   * 警告日志
   * @private
   */
  private logWarn(...args: any[]): void {
    console.warn("[I18nManager]", ...args);
  }

  /**
   * 错误日志
   * @private
   */
  private logError(...args: any[]): void {
    console.error("[I18nManager]", ...args);
  }
}
