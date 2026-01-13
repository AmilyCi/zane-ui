export interface DeepCloneOptions {
  cloneAttributes?: boolean;
  cloneEvents?: boolean;
  cloneStyles?: boolean;
  deepCloneChildren?: boolean;
}

export function deepCloneElement<T extends HTMLElement>(
  element: T,
  options: DeepCloneOptions = {},
): T {
  const {
    cloneAttributes = true,
    cloneEvents = true,
    cloneStyles = true,
    deepCloneChildren = true,
  } = options;

  // 1. 克隆元素本身（包括属性和子元素）
  const clone = element.cloneNode(deepCloneChildren) as T;

  // 2. 克隆样式
  if (cloneStyles) {
    // 2.1. 克隆内联样式
    const sourceStyle = element.style;
    const targetStyle = clone.style;

    for (let i = 0; i < sourceStyle.length; i++) {
      const propertyName = sourceStyle[i];
      const propertyValue = sourceStyle.getPropertyValue(propertyName);
      const priority = sourceStyle.getPropertyPriority(propertyName);

      targetStyle.setProperty(propertyName, propertyValue, priority);
    }

    // 2.2. 克隆计算样式（需要处理跨域限制）
    try {
      const computedStyle = window.getComputedStyle(element);

      // 获取所有计算样式属性
      for (let i = 0; i < computedStyle.length; i++) {
        const propertyName = computedStyle[i];

        // 过滤掉浏览器前缀和只读属性
        if (
          !propertyName.startsWith('-webkit-') &&
          !propertyName.startsWith('-moz-') &&
          !propertyName.startsWith('-ms-') &&
          !propertyName.startsWith('-o-')
        ) {
          const value = computedStyle.getPropertyValue(propertyName);

          // 只设置与默认值不同的样式
          if (value && value !== '' && value !== 'none') {
            clone.style.setProperty(propertyName, value);
          }
        }
      }
    } catch (error) {
      console.warn('无法复制计算样式（可能是跨域元素）:', error);
    }
  }

  // 3. 克隆自定义属性和 dataset
  if (cloneAttributes) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];

      // 跳过一些特殊属性
      if (attr.name !== 'style' && attr.name !== 'id') {
        clone.setAttribute(attr.name, attr.value);
      }
    }

    // 复制 dataset
    if (element.dataset) {
      Object.keys(element.dataset).forEach((key) => {
        clone.dataset[key] = element.dataset[key];
      });
    }

    // 获取元素的所有属性（包括自定义的）
    for (const key in element) {
      // 检查是否是自定义属性（以 data- 开头或非标准属性）
      if (
        key.startsWith('data-') ||
        (!(key in HTMLElement.prototype) &&
          typeof element[key] !== 'function' &&
          key !== 'style' &&
          key !== 'classList')
      ) {
        try {
          clone[key] = element[key];
        } catch {
          // 有些属性可能是只读的
        }
      }
    }
  }

  // 4. 克隆事件监听器
  if (cloneEvents) {
    // 复制内联事件属性（如 onclick, onchange 等）
    for (const key in element) {
      if (key.startsWith('on') && typeof element[key] === 'function') {
        clone[key] = element[key];
      }
    }
  }

  // 5. 递归克隆子元素（如果启用且元素有子元素）
  if (deepCloneChildren && element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      deepCloneElement(element.children[i] as HTMLElement, options);
    }
  }

  return clone;
}
