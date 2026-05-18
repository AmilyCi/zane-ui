import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core'

import type { ReactiveObject } from '../../utils'
import { useNamespace } from '../../hooks'
import type { BreadcrumbContext } from './types'
import { getBreadcrumbContext, resolveTo } from './utils'

const ns = useNamespace('breadcrumb')

@Component({
  tag: 'zane-breadcrumb-item',
  styleUrl: 'zane-breadcrumb.scss',
})
export class ZaneBreadcrumbItem {
  @Element() el!: HTMLElement

  @Prop() to?: string | Record<string, unknown>

  @Prop() replace: boolean = false

  @Event({ eventName: 'zClick' })
  clickEvent!: EventEmitter<{ to?: string; replace: boolean }>

  @State() hasLink: boolean = false

  private breadcrumbContext?: ReactiveObject<BreadcrumbContext>

  componentWillLoad() {
    this.breadcrumbContext = getBreadcrumbContext(this.el!)
    this.hasLink = !!this.to
  }

  @Watch('to')
  onToChange() {
    this.hasLink = !!this.to
  }

  private handleClick = (event: Event) => {
    const url = resolveTo(this.to)
    this.clickEvent.emit({ to: url, replace: this.replace })

    // 如果宿主应用调用了 event.preventDefault()，则不执行默认导航
    // 这样 SPA 框架可以在 zClick 事件监听器中自行处理路由跳转
    if (event.defaultPrevented) return
    if (!url) return
    if (this.replace) {
      window.location.replace(url)
    } else {
      window.location.href = url
    }
  }

  render() {
    const separator = this.breadcrumbContext?.value.separator ?? '/'
    const separatorIcon = this.breadcrumbContext?.value.separatorIcon

    return (
      <Host class={ns.e('item')}>
        <span
          class={`${ns.e('inner')} ${ns.is('link', this.hasLink)}`}
          role="link"
          onClick={this.handleClick}
        >
          <slot />
        </span>
        {separatorIcon ? (
          <zane-icon name={separatorIcon} class={ns.e('separator')} />
        ) : (
          <span class={ns.e('separator')} role="presentation">
            {separator}
          </span>
        )}
      </Host>
    )
  }
}
