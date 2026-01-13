import { Component, Element, h, Host, Prop } from '@stencil/core';

import { useNamespace } from '../../hooks';
import { findAllLegitChildren } from '../../utils';

const ns = useNamespace('divider');

@Component({
  styleUrl: 'zane-divider.scss',
  tag: 'zane-divider',
})
export class ZaneDivider {
  @Prop() borderStyle: CSSStyleDeclaration['borderStyle'] = 'solid';

  @Prop() contentPosition: 'center' | 'left' | 'right' = 'center';

  @Prop() direction: 'horizontal' | 'vertical' = 'horizontal';

  @Element() el: HTMLElement;

  render() {
    const dividerStyle = ns.cssVar({
      'border-style': this.borderStyle,
    });

    const $hasContent = findAllLegitChildren(this.el).length > 0;

    return (
      <Host>
        <div
          class={[ns.b(), ns.m(this.direction)].join(' ')}
          role="separator"
          style={dividerStyle}
        >
          {$hasContent && this.direction !== 'vertical' && (
            <div class={[ns.e('text'), ns.is(this.contentPosition)].join(' ')}>
              <slot />
            </div>
          )}
        </div>
      </Host>
    );
  }
}
