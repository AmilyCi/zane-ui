/**
 * 检查值是否为对象类型（包括数组、函数、日期、正则表达式等，但不包括null）
 * @param val - 要检查的值
 * @returns 如果值是对象类型则返回true，否则返回false
 */
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';
