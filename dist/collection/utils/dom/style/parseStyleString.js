import { toCamelCase } from "../../string";
/**
 * 解析样式字符串为对象
 * @param styleString 样式字符串，如 "color: red; font-size: 16px;"
 * @returns 样式对象
 */
export function parseStyleString(styleString) {
    const styleObject = {};
    if (!styleString || styleString.trim() === '') {
        return styleObject;
    }
    // 按分号分割样式规则
    const rules = styleString.split(';').filter((rule) => rule.trim() !== '');
    for (const rule of rules) {
        // 按冒号分割属性和值
        const [property, ...valueParts] = rule.split(':');
        if (property && valueParts.length > 0) {
            const propName = property.trim();
            const propValue = valueParts.join(':').trim(); // 处理值中可能包含冒号的情况
            if (propName && propValue) {
                // 将CSS属性名转换为驼峰命名（可选，根据需求）
                const camelCaseProp = toCamelCase(propName);
                styleObject[camelCaseProp] = propValue;
            }
        }
    }
    return styleObject;
}
