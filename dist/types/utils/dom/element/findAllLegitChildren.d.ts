/**
 * 查找 HTMLElement 的所有有效子节点
 * @param el - 要遍历的父级 HTMLElement
 * @returns 包含所有有效子节点的数组（元素节点、非空文本节点、CDATA节点等）
 *
 * @remarks
 * 有效子节点包括：
 * - 元素节点 (ELEMENT_NODE)
 * - 非空文本节点 (TEXT_NODE)，包含空白字符但非完全空白的文本节点会被保留
 * - CDATA节点 (CDATA_SECTION_NODE)
 * - 文档片段节点 (DOCUMENT_FRAGMENT_NODE)
 *
 * 被过滤的节点包括：
 * - 注释节点 (COMMENT_NODE)
 * - 空文本节点（无内容或仅空白字符）
 * - 文档类型节点 (DOCUMENT_TYPE_NODE)
 * - 处理指令节点 (PROCESSING_INSTRUCTION_NODE)
 */
export declare function findAllLegitChildren(el: HTMLElement): ChildNode[];
