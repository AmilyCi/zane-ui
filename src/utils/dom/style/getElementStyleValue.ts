import { toCamelCase } from "../../../utils/string"
import { isClient } from "../../../utils/is/isClient"

/**
 * 获取HTML元素的指定CSS样式值
 * @param {HTMLElement} element - 目标DOM元素
 * @param {string} styleName - CSS样式属性名称
 * @returns {string} 样式属性值，如果无法获取则返回空字符串
 */
export const getElementStyleValue = (
  element: HTMLElement,
  styleName: string
): string => {
  // 检查是否为客户端环境、元素和样式名称是否有效
  if (!isClient || !element || !styleName) return ''

  // 将样式名称转换为驼峰格式以匹配JavaScript样式属性命名
  let key = toCamelCase(styleName)
  // 特殊处理'float'属性，因为在JavaScript中需要使用'cssFloat'
  if (key === 'float') key = 'cssFloat'
  
  try {
    // 首先尝试获取元素的内联样式
    const style = (element.style as any)[key]
    if (style) return style
    
    // 如果内联样式不存在，则获取计算后的样式值
    const computed: any = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  } catch {
    // 发生异常时回退到获取内联样式
    return (element.style as any)[key]
  }
}
