/**
 * 转换为驼峰命名
 * @param str 如 "font-size"
 * @returns 驼峰命名的属性名，如 "fontSize"
 */
function toCamelCase(str) {
    return str.replaceAll(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 解析样式字符串为对象
 * @param styleString 样式字符串，如 "color: red; font-size: 16px;"
 * @returns 样式对象
 */
function parseStyleString(styleString) {
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

/**
 * 将样式值转换为对象格式
 * @param style 样式值，可以是字符串或对象
 * @returns 标准化后的样式对象
 */
function normalizeStyle(style) {
    // 如果已经是对象，直接返回（可以深拷贝避免副作用，这里简单返回）
    if (typeof style === 'object' && style !== null) {
        return Object.assign({}, style);
    }
    // 如果是字符串，进行解析
    if (typeof style === 'string') {
        return parseStyleString(style);
    }
    // 其他情况返回空对象
    return {};
}

export { normalizeStyle as n };
