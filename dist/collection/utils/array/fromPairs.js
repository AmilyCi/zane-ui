// 辅助函数：检查是否为可迭代的元组
function isIterableTuple(value) {
    return value !== null && typeof value[Symbol.iterator] === 'function';
}
/**
 * 增强版的 fromPairs 函数
 */
export function fromPairs(pairs, options = {}) {
    // 处理 null 或 undefined 输入
    if (pairs === null) {
        return {};
    }
    const { keyTransformer, skipNullish = false, valueTransformer } = options;
    const result = {};
    // 处理可迭代对象
    for (const pair of pairs) {
        // 检查 pair 是否有效
        if (pair && (Array.isArray(pair) || isIterableTuple(pair))) {
            let [key, value] = pair;
            // 跳过 null 或 undefined 的值
            if (skipNullish && value === null) {
                continue;
            }
            // 跳过无效的键
            if (key === null) {
                continue;
            }
            // 应用键转换
            if (keyTransformer) {
                key = keyTransformer(key);
            }
            // 应用值转换
            if (valueTransformer) {
                value = valueTransformer(value);
            }
            result[key] = value;
        }
    }
    return result;
}
