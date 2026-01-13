/**
 * 转换为驼峰命名
 * @param str 如 "font-size"
 * @returns 驼峰命名的属性名，如 "fontSize"
 */
export function toCamelCase(str: string): string {
  return str.replaceAll(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
