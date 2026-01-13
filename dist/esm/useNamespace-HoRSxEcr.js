/**
 * 默认命名空间常量
 * @type {string}
 * @default 'zane'
 */
const defaultNamespace = 'zane';
/**
 * 状态类名前缀
 * @type {string}
 * @default 'is-'
 */
const statePrefix = 'is-';
/**
 * BEM 类名生成器核心函数
 * @param {string} namespace - 命名空间
 * @param {string} block - 块名
 * @param {string} blockSuffix - 块后缀
 * @param {string} element - 元素名
 * @param {string} modifier - 修饰符
 * @returns {string} 生成的 BEM 类名
 * @private
 */
const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
        cls += `-${blockSuffix}`;
    }
    if (element) {
        cls += `__${element}`;
    }
    if (modifier) {
        cls += `--${modifier}`;
    }
    return cls;
};
/**
 * 获取派生命名空间
 * @param {string|undefined} namespaceOverrides - 覆盖的命名空间
 * @returns {string} 最终使用的命名空间
 */
const useGetDerivedNamespace = (namespaceOverrides) => {
    return defaultNamespace;
};
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
const useNamespace = (block, namespaceOverrides) => {
    const namespace = useGetDerivedNamespace();
    /**
     * 生成块类名
     * @param {string} [blockSuffix] - 块后缀
     * @returns {string} 类名字符串
     */
    const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '');
    /**
     * 生成元素类名
     * @param {string} [element] - 元素名
     * @returns {string} 类名字符串
     */
    const e = (element) => element ? _bem(namespace, block, '', element, '') : '';
    /**
     * 生成修饰符类名
     * @param {string} [modifier] - 修饰符
     * @returns {string} 类名字符串
     */
    const m = (modifier) => modifier ? _bem(namespace, block, '', '', modifier) : '';
    /**
     * 生成带后缀的块和元素类名
     * @param {string} [blockSuffix] - 块后缀
     * @param {string} [element] - 元素名
     * @returns {string} 类名字符串
     */
    const be = (blockSuffix, element) => blockSuffix && element
        ? _bem(namespace, block, blockSuffix, element, '')
        : '';
    /**
     * 生成元素和修饰符类名
     * @param {string} [element] - 元素名
     * @param {string} [modifier] - 修饰符
     * @returns {string} 类名字符串
     */
    const em = (element, modifier) => element && modifier ? _bem(namespace, block, '', element, modifier) : '';
    /**
     * 生成带后缀的块和修饰符类名
     * @param {string} [blockSuffix] - 块后缀
     * @param {string} [modifier] - 修饰符
     * @returns {string} 类名字符串
     */
    const bm = (blockSuffix, modifier) => blockSuffix && modifier
        ? _bem(namespace, block, blockSuffix, '', modifier)
        : '';
    /**
     * 生成完整的 BEM 类名
     * @param {string} [blockSuffix] - 块后缀
     * @param {string} [element] - 元素名
     * @param {string} [modifier] - 修饰符
     * @returns {string} 类名字符串
     */
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier
        ? _bem(namespace, block, blockSuffix, element, modifier)
        : '';
    /**
     * 生成状态类名
     * @param {string} name - 状态名称
     * @param {...(boolean|undefined)} args - 状态值参数
     * @returns {string} 状态类名字符串
     */
    const is = (name, ...args) => {
        const state = args.length >= 1 ? args[0] : true;
        return name && state ? `${statePrefix}${name}` : '';
    };
    /**
     * 生成 CSS 变量对象
     * @param {Record<string, string>} object - CSS 变量键值对
     * @returns {Record<string, string>} 样式对象
     */
    const cssVar = (object) => {
        const styles = {};
        for (const key in object) {
            if (object[key]) {
                styles[`--${namespace}-${key}`] = object[key];
            }
        }
        return styles;
    };
    /**
     * 生成带块名的 CSS 变量对象
     * @param {Record<string, string>} object - CSS 变量键值对
     * @returns {Record<string, string>} 样式对象
     */
    const cssVarBlock = (object) => {
        const styles = {};
        for (const key in object) {
            if (object[key]) {
                styles[`--${namespace}-${block}-${key}`] = object[key];
            }
        }
        return styles;
    };
    /**
     * 生成 CSS 变量名称
     * @param {string} name - 变量名
     * @returns {string} CSS 变量名称
     */
    const cssVarName = (name) => `--${namespace}-${name}`;
    /**
     * 生成带块名的 CSS 变量名称
     * @param {string} name - 变量名
     * @returns {string} CSS 变量名称
     */
    const cssVarBlockName = (name) => `--${namespace}-${block}-${name}`;
    return {
        b,
        be,
        bem,
        bm,
        cssVar,
        cssVarBlock,
        cssVarBlockName,
        cssVarName,
        e,
        em,
        is,
        m,
        namespace,
    };
};

export { useNamespace as u };
