/**
 * 获取值的内部对象类型标签
 * @param {unknown} value 需要检测的值
 * @returns {string} 对象的内部 [[Class]] 属性字符串表示
 *
 * @description
 * 此函数通过调用 Object.prototype.toString 方法，
 * 返回格式为 "[object Type]" 的字符串，其中 Type 是对象的类型。
 * 这是检测内置类型最可靠的方式，可以区分：
 * - 普通对象 ("[object Object]")
 * - 数组 ("[object Array]")
 * - 函数 ("[object Function]")
 * - 异步函数 ("[object AsyncFunction]")
 * - 其他内置类型
 *
 * @example
 * ```typescript
 * toObjectString({})          // "[object Object]"
 * toObjectString([])          // "[object Array]"
 * toObjectString(() => {})    // "[object Function]"
 * toObjectString(async () => {}) // "[object AsyncFunction]"
 * toObjectString(new Date())  // "[object Date]"
 * ```
 */
const toObjectString = (value) => Object.prototype.toString.call(value);

export { toObjectString as t };
