import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core'
import { useNamespace } from '../../hooks'

const ns = useNamespace('page-header')

@Component({
  tag: 'zane-page-header',
  styleUrl: 'zane-page-header.scss',
  shadow: false,
})
export class ZanePageHeader {
  @Element() el!: HTMLElement

  @Prop() icon: string = 'arrow-left-line'

  @Prop() backTitle: string = '返回'

  @Prop() content: string = ''

  @Event({ eventName: 'zBack' }) zBack!: EventEmitter<void>

  @State() hasBreadcrumb = false

  @State() hasExtra = false

  @State() hasDefaultContent = false

  private handleBackClick = () => {
    this.zBack.emit()
  }

  componentWillLoad() {
    this.hasBreadcrumb = !!this.el.querySelector('[slot="breadcrumb"]')
    this.hasExtra = !!this.el.querySelector('[slot="extra"]')
    const namedSlots = this.el.querySelectorAll('[slot]')
    this.hasDefaultContent = this.el.children.length > namedSlots.length
  }

  render() {
    const classes = [
      ns.b(),
      ns.is('contentful', this.hasDefaultContent),
      this.hasBreadcrumb ? ns.m('has-breadcrumb') : '',
      this.hasExtra ? ns.m('has-extra') : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Host class={classes}>
        {this.hasBreadcrumb && (
          <div class={ns.e('breadcrumb')}>
            <slot name="breadcrumb" />
          </div>
        )}

        <div class={ns.e('header')}>
          <div class={ns.e('left')}>
            <div
              class={ns.e('back')}
              role="button"
              tabindex="0"
              onClick={this.handleBackClick}
            >
              <div class={ns.e('icon')}>
                <slot name="icon">
                  <zane-icon name={this.icon} />
                </slot>
              </div>
              <div class={ns.e('title')}>
                <slot name="title">{this.backTitle}</slot>
              </div>
            </div>

            <zane-divider direction="vertical" />

            <div class={ns.e('content')}>
              <slot name="content">{this.content}</slot>
            </div>
          </div>

          {this.hasExtra && (
            <div class={ns.e('extra')}>
              <slot name="extra" />
            </div>
          )}
        </div>

        {this.hasDefaultContent && (
          <div class={ns.e('main')}>
            <slot />
          </div>
        )}
      </Host>
    )
  }
}
