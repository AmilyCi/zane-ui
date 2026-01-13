export interface FromPairsOptions {
    /**
     * 键转换函数
     */
    keyTransformer?: (key: PropertyKey) => PropertyKey;
    /**
     * 是否跳过 null 或 undefined 的值
     */
    skipNullish?: boolean;
    /**
     * 值转换函数
     */
    valueTransformer?: <T>(value: T) => T;
}
/**
 * 增强版的 fromPairs 函数
 */
export declare function fromPairs<T = any>(pairs: Array<[PropertyKey, T]> | Iterable<[PropertyKey, T]> | null | undefined, options?: FromPairsOptions): Record<PropertyKey, T>;
