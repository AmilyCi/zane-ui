import { toCamelCase } from "../../../utils/string/toCamelCase"
import { isObject } from "../../../utils/is/isObject"

/**
 * 设置HTML元素的CSS样式属性
 * @param {HTMLElement} element - 要设置样式的目标DOM元素
 * @param {string | Record<string, string | number>} styleName - CSS样式属性名称或包含多个样式的对象
 * @param {string | number} [value] - 样式属性的值（当styleName为单个属性时使用）
 * @returns {void}
 * @example
 * // 设置单个样式
 * setElementStyleValue(element, 'backgroundColor', '#f0f0f0')
 * // 设置多个样式
 * setElementStyleValue(element, { backgroundColor: '#f0f0f0', fontSize: '14px' })
 */
export const setElementStyleValue  = (
  element: HTMLElement,
  styleName: string | Record<string, string | number>,
  value?: string | number
) => {
  // 参数验证：确保元素和样式名称存在
  if (!element || !styleName) return

  // 如果styleName是对象类型，表示要设置多个样式
  if (isObject(styleName)) {
    // 遍历对象中的每个样式属性并递归调用setElementStyleValue
    Object.entries(styleName).forEach(([prop, value]) =>
      setElementStyleValue(element, prop, value as string)
    )
  } else {
    // 处理单个样式属性的情况
    // 将样式名转换为驼峰格式以匹配JavaScript样式属性命名
    const key: any = toCamelCase(styleName)
    // 直接将值赋给元素的style属性
    element.style[key] = value as any
  }
}
