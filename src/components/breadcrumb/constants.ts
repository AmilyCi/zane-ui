import type { ReactiveObject } from '../../utils/reactive/ReactiveObject'
import type { BreadcrumbContext } from './types'

export const breadcrumbContexts = new WeakMap<
  HTMLElement,
  ReactiveObject<BreadcrumbContext>
>()
