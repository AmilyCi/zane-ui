import type { EventEmitter } from '@stencil/core';

import type { SplitterRootContext } from './splitter-context';

import {
  Component,
  Element,
  Event,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { splitterRootContexts } from '../../constants/splitter';
import { useNamespace } from '../../hooks';
import { buildUUID, throwError } from '../../utils';
import { getPct, getPx, isPct, isPx } from './utils';

const ns = useNamespace('splitter-panel');

const COMPONENT_NAME = 'zane-splitter-panel';

@Component({
  styleUrl: 'zane-splitter-panel.scss',
  tag: 'zane-splitter-panel',
})
export class ZaneSplitterPanel {
  @Prop() collapsible: boolean | { end?: boolean; start?: boolean };

  @Element() el: HTMLElement;

  @State() isResizable: boolean;

  @Prop() max?: number | string;

  @Prop() min?: number | string;

  @State() panelSize: number;

  @Prop() resizable: boolean = true;

  @Prop({ mutable: true }) size: number | string;

  @Event({ eventName: 'updateSize' }) updateSizeEvent: EventEmitter<number>;

  @Prop({ mutable: true }) uuid: string;

  get splitterContext(): SplitterRootContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-SPLITTER') {
        context = splitterRootContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  componentWillLoad() {
    if (!this.splitterContext)
      throwError(
        COMPONENT_NAME,
        'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>',
      );

    this.uuid = buildUUID();
    this.splitterContext.addPercentSizesChangeListener(
      this.onPercentSizesUpdate,
    );
    this.splitterContext.registerPanel(this);
  }

  disconnectedCallback() {
    this.splitterContext.removePercentSizesChangeListener(
      this.onPercentSizesUpdate,
    );
    this.splitterContext.unregisterPanel(this);
  }

  @Watch('size')
  handleSizeChange() {
    const size = this.sizeToPx(this.size);
    const maxSize = this.sizeToPx(this.max);
    const minSize = this.sizeToPx(this.min);

    const finalSize = Math.min(Math.max(size, minSize || 0), maxSize || size);

    this.updateSizeEvent.emit(finalSize);
    this.panelSize = finalSize;
  }

  render() {
    return (
      <Host class={ns.b()} style={{ flexBasis: `${this.panelSize}px` }}>
        <slot></slot>
      </Host>
    );
  }

  private onPercentSizesUpdate = () => {
    this.update();
  };

  private sizeToPx(str: number | string | undefined) {
    if (isPct(str)) {
      return getPct(str) * this.splitterContext.containerSize || 0;
    } else if (isPx(str)) {
      return getPx(str);
    }
    return str ?? 0;
  }

  private update = () => {
    this.panelSize =
      this.splitterContext.pxSizes[this.splitterContext.getPanelIndex(this.el)];
  };
}
