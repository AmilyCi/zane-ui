import { t as toObjectString } from './toObjectString-D4ItlKpz.js';

/**
 * 检查输入是否为字符串类型
 * @type {function(*): boolean}
 * @param {*} input - 需要检查的输入值
 * @returns {boolean} 如果输入是字符串类型则返回 true，否则返回 false
 * @example
 * // 返回 true
 * isString('hello');
 * // 返回 false
 * isString(123);
 */
const isString = (input) => toObjectString(input) === '[object String]';

export { isString as i };
