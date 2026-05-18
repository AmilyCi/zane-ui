import { Component, Element, h, Host, Prop, Watch } from '@stencil/core'

import type { BreadcrumbContext } from './types'
import { useNamespace } from '../../hooks'
import { hasRawParent, ReactiveObject } from '../../utils'
import { breadcrumbContexts } from './constants'

const ns = useNamespace('breadcrumb')

@Component({
  tag: 'zane-breadcrumb',
  styleUrl: 'zane-breadcrumb.scss',
})
export class ZaneBreadcrumb {
  @Element() el!: HTMLElement

  @Prop() separator: string = '/'

  @Prop() separatorIcon?: string

  private context!: ReactiveObject<BreadcrumbContext>

  componentWillLoad() {
    this.context = new ReactiveObject<BreadcrumbContext>({
      separator: this.separator,
      separatorIcon: this.separatorIcon,
    })
    breadcrumbContexts.set(this.el, this.context)
  }

  componentDidLoad() {
    const items = this.el.querySelectorAll(`.${ns.e('item')}`)
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page')
    }
  }

  disconnectedCallback() {
    if (!hasRawParent(this.el)) {
      breadcrumbContexts.delete(this.el)
    }
  }

  @Watch('separator')
  onSeparatorChange() {
    this.context.value.separator = this.separator
  }

  @Watch('separatorIcon')
  onSeparatorIconChange() {
    this.context.value.separatorIcon = this.separatorIcon
  }

  render() {
    return (
      <Host class={ns.b()} role="navigation" aria-label="breadcrumb">
        <slot />
      </Host>
    )
  }
}
