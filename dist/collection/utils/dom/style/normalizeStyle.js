import { parseStyleString } from "./parseStyleString";
/**
 * 将样式值转换为对象格式
 * @param style 样式值，可以是字符串或对象
 * @returns 标准化后的样式对象
 */
export function normalizeStyle(style) {
    // 如果已经是对象，直接返回（可以深拷贝避免副作用，这里简单返回）
    if (typeof style === 'object' && style !== null) {
        return Object.assign({}, style);
    }
    // 如果是字符串，进行解析
    if (typeof style === 'string') {
        return parseStyleString(style);
    }
    // 其他情况返回空对象
    return {};
}
