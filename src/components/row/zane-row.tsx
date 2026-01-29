import { Component, Element, h, Host, Prop } from '@stencil/core';

import { rowContexts } from './constants';
import { useNamespace } from '../../hooks';
import type { RowAlignType, RowContext, RowJustifyType } from './types';
import { ReactiveObject } from '../../utils';
import classNames from 'classnames';

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

  private context: ReactiveObject<RowContext>;

  componentWillLoad() {
    this.context = new ReactiveObject<RowContext>({
      gutter: this.gutter
    });
    rowContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    rowContexts.delete(this.el);
  }

  render() {
    const rowKls = classNames(
      ns.b(),
      ns.is(`justify-${this.justify}`, this.justify !== 'start'),
      ns.is(`align-${this.align}`, !!this.align),
    );

    const styles = {} as Record<string, string>;
    if (!this.gutter) {
      return styles;
    }

    styles.marginRight = styles.marginLeft = `-${this.gutter / 2}px`;

    return (
      <Host class={rowKls} style={styles}>
        <slot />
      </Host>
    );
  }
}
