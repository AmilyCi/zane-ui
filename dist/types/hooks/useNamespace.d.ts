/**
 * 默认命名空间常量
 * @type {string}
 * @default 'zane'
 */
export declare const defaultNamespace = "zane";
/**
 * 获取派生命名空间
 * @param {string|undefined} namespaceOverrides - 覆盖的命名空间
 * @returns {string} 最终使用的命名空间
 */
export declare const useGetDerivedNamespace: (namespaceOverrides?: string | undefined) => string;
/**
 * BEM 类名生成钩子函数
 * @param {string} block - 块名称
 * @param {string|undefined} namespaceOverrides - 可选的命名空间覆盖
 * @returns {object} BEM 相关的方法集合
 * @property {Function} b - 生成块类名
 * @property {Function} e - 生成元素类名
 * @property {Function} m - 生成修饰符类名
 * @property {Function} be - 生成带后缀的块和元素类名
 * @property {Function} em - 生成元素和修饰符类名
 * @property {Function} bm - 生成带后缀的块和修饰符类名
 * @property {Function} bem - 生成完整的 BEM 类名
 * @property {Function} is - 生成状态类名
 * @property {Function} cssVar - 生成 CSS 变量对象
 * @property {Function} cssVarBlock - 生成带块名的 CSS 变量对象
 * @property {Function} cssVarBlockName - 生成带块名的 CSS 变量名称
 * @property {Function} cssVarName - 生成 CSS 变量名称
 * @property {string} namespace - 当前使用的命名空间
 */
export declare const useNamespace: (block: string, namespaceOverrides?: string | undefined) => {
    b: (blockSuffix?: string) => string;
    be: (blockSuffix?: string, element?: string) => string;
    bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
    bm: (blockSuffix?: string, modifier?: string) => string;
    cssVar: (object: Record<string, string>) => Record<string, string>;
    cssVarBlock: (object: Record<string, string>) => Record<string, string>;
    cssVarBlockName: (name: string) => string;
    cssVarName: (name: string) => string;
    e: (element?: string) => string;
    em: (element?: string, modifier?: string) => string;
    is: (name: string, ...args: [] | [boolean | undefined]) => string;
    m: (modifier?: string) => string;
    namespace: string;
};
/**
 * useNamespace 的返回值类型
 * @typedef {ReturnType<typeof useNamespace>} UseNamespaceReturn
 */
export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
