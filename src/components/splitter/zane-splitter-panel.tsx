import type { EventEmitter } from '@stencil/core';

import type { PanelItemState, SplitterRootContext } from './types';

import {
  Component,
  Element,
  Event,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { useNamespace } from '../../hooks';
import { buildUUID, ReactiveObject, throwError } from '../../utils';
import { getCollapsible, getSplitterContext } from './utils';

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

  @State() index: number = -1;

  private panel: ReactiveObject<PanelItemState>;

  private splitterContext: ReactiveObject<SplitterRootContext>;

  private setIndex = (val: number) => {
    this.index = val;
  };

  @Watch('index')
  handleIndexChange(val: number) {
    const panel = this.splitterContext.value.panels[val];
    if (panel) {
      this.panelSize = this.splitterContext.value.pxSizes[val] ?? 0;
    } else {
      this.panelSize = 0;
    }

    panel.change$.subscribe(({ key, value }) => {
      if (key === 'size') {
        this.panelSize = value;
      }
    });
  }

  @Method()
  async getIndex() {
    return this.index;
  }

  componentWillLoad() {
    this.splitterContext = getSplitterContext(this.el);
    if (!this.splitterContext)
      throwError(
        COMPONENT_NAME,
        'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>',
      );

    this.uuid = buildUUID();

    this.panel = new ReactiveObject<PanelItemState>({
      el: this.el,
      uuid: this.uuid,
      max: this.max,
      min: this.min,
      resizable: this.resizable,
      size: this.size,
      setIndex: this.setIndex,
      collapsible: getCollapsible(this.collapsible),
    });
    this.splitterContext.value.registerPanel(this.panel);

    this.splitterContext.change$.subscribe(({ key, value }) => {
      if (key === 'pxSizes') {
        this.panelSize = value[this.index];
      }
    });
  }

  disconnectedCallback() {
    this.splitterContext?.value.unregisterPanel(this.panel);
    this.panel = null;
  }

  render() {
    return (
      <Host class={ns.b()} style={{ flexBasis: `${this.panelSize}px` }}>
        <slot></slot>
      </Host>
    );
  }
}
