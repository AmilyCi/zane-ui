import { Component, h, Prop } from '@stencil/core';
import { useNamespace } from '../../hooks';
import { isString } from '../../utils';

const ns = useNamespace('slider')

@Component({
  tag: 'zane-slider-marker',
})
export class ZaneSliderMarker {

  @Prop() mark: string | { style: Record<string, any>, label: any};

  render() {
    const label = isString(this.mark) ? this.mark : this.mark.label;
    const style = isString(this.mark) ? undefined : this.mark.style;

    return (
      <div class={ns.e('marks-text')} style={style}>{label}</div>
    );
  }
}
