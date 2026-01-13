import { toObjectString } from "../object/toObjectString";
/**
 * 检查输入值是否为数字类型
 * @param {unknown} value - 需要检查的输入值
 * @returns {value is number} 类型谓词，如果输入是数字类型则返回 true，否则返回 false
 * @example
 * // 返回 true
 * isNumber(42);
 * isNumber(new Number(42));
 * // 返回 false
 * isNumber('42');
 * isNumber(null);
 */
export const isNumber = (value) => toObjectString(value) === '[object Number]';
