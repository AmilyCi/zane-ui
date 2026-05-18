import type { ReactiveObject } from '../../utils'
import type { BreadcrumbContext } from './types'
import { breadcrumbContexts } from './constants'

export const getBreadcrumbContext = (
  el: HTMLElement,
): ReactiveObject<BreadcrumbContext> | undefined => {
  let parent: any = el.parentElement
  let context = undefined
  while (parent) {
    if (parent.tagName === 'ZANE-BREADCRUMB') {
      context = breadcrumbContexts.get(parent)
      break
    }
    parent = parent.rawParent ?? parent.parentElement
  }
  return context
}

/** 将 to 转为字符串形式的 URL，兼容 vue-router 的 { path: '/' } 对象格式 */
export const resolveTo = (
  to?: string | Record<string, unknown>,
): string | undefined => {
  if (!to) return undefined
  if (typeof to === 'string') {
    // 解析 JSON 字符串（HTML 属性传递对象时会被序列化为字符串）
    try {
      const parsed = JSON.parse(to)
      if (parsed && typeof parsed === 'object') {
        return (parsed as Record<string, unknown>).path as string | undefined
      }
    } catch {
      // 非 JSON 字符串，直接作为 URL 返回
    }
    return to
  }
  return (to as Record<string, unknown>)?.path as string | undefined
}
