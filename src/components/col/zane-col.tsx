import type { ColSize } from '../../types';

import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { rowContexts } from '../../constants';
import { useNamespace } from '../../hooks';
import { mutable } from '../../types';
import { isNumber, isObject } from '../../utils';

const ns = useNamespace('col');

@Component({
  styleUrl: 'zane-col.scss',
  tag: 'zane-col',
})
export class ZaneRow {
  @Element() el: HTMLElement;

  @State() gutter: number = 0;

  @Prop()
  lg: ColSize = mutable({} as const);

  @Prop()
  md: ColSize = mutable({} as const);

  @Prop({ attribute: 'offset', reflect: true })
  offset: number = 0;

  @Prop({ attribute: 'pull', reflect: true })
  pull: number = 0;

  @Prop({ attribute: 'push', reflect: true })
  push: number = 0;

  @Prop()
  sm: ColSize = mutable({} as const);

  @Prop({ attribute: 'span', reflect: true })
  span: number = 24;

  @Prop()
  xl: ColSize = mutable({} as const);

  @Prop()
  xs: ColSize = mutable({} as const);

  get colKls() {
    const classes: string[] = [];
    const pos = ['span', 'offset', 'pull', 'push'] as const;

    pos.forEach((prop) => {
      const size = this[prop];
      if (isNumber(size)) {
        if (prop === 'span') classes.push(ns.b(`${this[prop]}`));
        else if (size > 0) classes.push(ns.b(`${prop}-${this[prop]}`));
      }
    });

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    sizes.forEach((size) => {
      if (isNumber(this[size])) {
        classes.push(ns.b(`${size}-${this[size]}`));
      } else if (isObject(this[size])) {
        Object.entries(this[size]).forEach(([prop, sizeProp]) => {
          classes.push(
            prop === 'span'
              ? ns.b(`${size}-${sizeProp}`)
              : ns.b(`${size}-${prop}-${sizeProp}`),
          );
        });
      }
    });

    // this is for the fix
    if (this.gutter) {
      classes.push(ns.is('guttered'));
    }
    return [ns.b(), ...classes].join(' ');
  }

  get rowContext() {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-ROW') {
        context = rowContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  get style() {
    const styles = {} as Record<string, string>;
    if (this.gutter) {
      styles.paddingLeft = styles.paddingRight = `${this.gutter / 2}px`;
    }
    return styles;
  }

  componentWillLoad() {
    this.gutter = this.rowContext?.gutter ?? 0;
  }

  render() {
    return (
      <Host class={this.colKls} style={this.style}>
        <slot />
      </Host>
    );
  }
}
