'use strict';

var isNumber = require('./isNumber-CJR0doT9.js');
var isString = require('./isString-D2n3i_b0.js');

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
const isStringNumber = (value) => {
    // 首先必须是字符串
    if (!isString.isString(value))
        return false;
    // 排除空字符串和纯空白字符串
    if (value.trim().length === 0)
        return false;
    // 尝试转换为数字
    const num = Number(value);
    // 检查是否为有效数字（非NaN）
    return !Number.isNaN(num);
};

function addUnit(value, defaultUnit = 'px') {
    if (!value)
        return '';
    if (isNumber.isNumber(value) || isStringNumber(value)) {
        return `${value}${defaultUnit}`;
    }
    else if (isString.isString(value)) {
        return value;
    }
}

exports.addUnit = addUnit;
