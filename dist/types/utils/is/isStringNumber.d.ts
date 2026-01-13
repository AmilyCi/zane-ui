/**
 * 检查输入值是否为可转换为有效数字的字符串
 * @param {unknown} value - 需要检查的输入值
 * @returns {value is string} 类型谓词，如果输入是可转换为数字的非空字符串则返回 true，否则返回 false
 * @description
 * 此函数检查三个条件：
 * 1. 输入必须是字符串类型
 * 2. 字符串不能为空或仅包含空白字符
 * 3. 字符串必须可以转换为有效的数字（非NaN）
 * @example
 * // 返回 true
 * isStringNumber('42');
 * isStringNumber('-3.14');
 * isStringNumber('0');
 *
 * // 返回 false
 * isStringNumber('');          // 空字符串
 * isStringNumber('   ');       // 空白字符串
 * isStringNumber('abc');       // 非数字字符串
 * isStringNumber(42);          // 数字类型，不是字符串
 * isStringNumber(null);        // 非字符串类型
 */
export declare const isStringNumber: (value: unknown) => value is string;
