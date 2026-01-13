import type { RowAlignType, RowJustifyType } from '../../types';

import { Component, Element, h, Host, Prop } from '@stencil/core';

import { rowContexts } from '../../constants';
import { useNamespace } from '../../hooks';

const ns = useNamespace('row');

@Component({
  styleUrl: 'zane-row.scss',
  tag: 'zane-row',
})
export class ZaneRow {
  @Prop({ attribute: 'align', reflect: true })
  align?: RowAlignType;

  @Element() el: HTMLElement;

  @Prop({ attribute: 'gutter', reflect: true })
  gutter: number = 0;

  @Prop({ attribute: 'justify', reflect: true })
  justify: RowJustifyType = 'start';

  get rowKls() {
    return [
      ns.b(),
      ns.is(`justify-${this.justify}`, this.justify !== 'start'),
      ns.is(`align-${this.align}`, !!this.align),
    ].join(' ');
  }

  get style() {
    const styles = {} as Record<string, string>;
    if (!this.gutter) {
      return styles;
    }

    styles.marginRight = styles.marginLeft = `-${this.gutter / 2}px`;
    return styles;
  }

  componentWillLoad() {
    rowContexts.set(this.el, { gutter: this.gutter });
  }

  render() {
    return (
      <Host class={this.rowKls} style={this.style}>
        <slot />
      </Host>
    );
  }
}
