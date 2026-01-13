import type { SplitterRootContext } from './splitter-context';

import { Component, Element, h, Host, State } from '@stencil/core';

import { splitterRootContexts } from '../../constants/splitter';
import { useNamespace } from '../../hooks';
import { nextFrame } from '../../utils';
import { isCollapsible } from './utils';

const ns = useNamespace('splitter-bar');

@Component({
  tag: 'zane-splitter-bar',
})
export class ZaneSplitterBar {
  @Element() el: HTMLElement;

  @State() endCollapsible: boolean;

  @State() startCollapsible: boolean;

  @State() startPos: [x: number, y: number] | null = null;

  get index(): number {
    return this.splitterContext.getPanelIndex(
      this.el.previousElementSibling as HTMLElement,
    );
  }

  get resizable(): boolean {
    return (
      this.el.previousElementSibling &&
      this.el.previousElementSibling.tagName === 'ZANE-SPLITTER-PANEL' &&
      this.el.nextElementSibling &&
      this.el.nextElementSibling.tagName === 'ZANE-SPLITTER-PANEL'
    );
  }

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

  componentDidLoad() {
    this.startCollapsible = this.getStartCollapsible();
    this.endCollapsible = this.getEndCollapsible();
  }

  render() {
    const prefix = ns.e('dragger');
    const barWrapStyles =
      this.splitterContext.layout === 'horizontal'
        ? { width: '0' }
        : { height: '0' };

    const draggerStyles = {
      cursor: this.resizable
        ? // eslint-disable-next-line unicorn/no-nested-ternary
          this.splitterContext.layout === 'horizontal'
          ? 'ew-resize'
          : 'ns-resize'
        : 'auto',
      height: this.splitterContext.layout === 'horizontal' ? '100%' : '16px',
      touchAction: 'none',
      width: this.splitterContext.layout === 'horizontal' ? '16px' : '100%',
    };

    return (
      <Host class={ns.b()} style={barWrapStyles}>
        {this.startCollapsible && (
          <div
            class={[
              ns.e('collapse-icon'),
              ns.e(`${this.splitterContext.layout}-collapse-icon-start`),
            ].join(' ')}
            onClick={() => this.onCollapse('start')}
          >
            <slot name="start-collapsible">{this.renderStartIcon()}</slot>
          </div>
        )}

        <div
          class={{
            [`${prefix}-active`]: !!this.startPos,
            [`${prefix}-horizontal`]:
              this.splitterContext.layout === 'horizontal',
            [`${prefix}-vertical`]:
              this.splitterContext.layout !== 'horizontal',
            [ns.e('dragger')]: true,
            [ns.is('disabled', !this.resizable)]: true,
            [ns.is('lazy', this.resizable && this.splitterContext.lazy)]: true,
          }}
          onMouseDown={this.onMousedown}
          onTouchStart={this.onTouchStart}
          style={draggerStyles}
        />

        {this.endCollapsible && (
          <div
            class={[
              ns.e('collapse-icon'),
              ns.e(`${this.splitterContext.layout}-collapse-icon-end`),
            ].join(' ')}
            onClick={() => this.onCollapse('end')}
          >
            <slot name="end-collapsible">{this.renderEndIcon()}</slot>
          </div>
        )}
      </Host>
    );
  }

  private getEndCollapsible(): boolean {
    const panel = this.splitterContext.panels[this.index];
    const panelSize = this.splitterContext.pxSizes[this.index];
    const nextPanel = this.splitterContext.panels[this.index + 1];
    const nextPanelSize = this.splitterContext.pxSizes[this.index + 1];
    return isCollapsible(nextPanel, nextPanelSize, panel, panelSize);
  }

  private getStartCollapsible(): boolean {
    const panel = this.splitterContext.panels[this.index];
    const panelSize = this.splitterContext.pxSizes[this.index];
    const nextPanel = this.splitterContext.panels[this.index + 1];
    const nextPanelSize = this.splitterContext.pxSizes[this.index + 1];
    return isCollapsible(panel, panelSize, nextPanel, nextPanelSize);
  }

  private onCollapse = (type: 'end' | 'start') => {
    this.splitterContext.onCollapse(this.index, type);
    nextFrame(() => {
      this.startCollapsible = this.getStartCollapsible();
      this.endCollapsible = this.getEndCollapsible();
    });
  };

  private onMousedown = (e: MouseEvent) => {
    if (!this.resizable) return;
    this.startPos = [e.pageX, e.pageY];
    this.splitterContext.onMoveStart(this.index);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  };

  private onMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const offsetX = pageX - this.startPos[0];
    const offsetY = pageY - this.startPos[1];
    const offset =
      this.splitterContext.layout === 'horizontal' ? offsetX : offsetY;
    this.splitterContext.onMoving(this.index, offset);
  };

  private onMouseUp = () => {
    this.startPos = null;
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.splitterContext.onMoveEnd(this.index);
  };

  private onTouchEnd = () => {
    this.startPos = null;
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchmove', this.onTouchMove);
    this.splitterContext.onMoveEnd(this.index);
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const offsetX = touch.pageX - this.startPos[0];
      const offsetY = touch.pageY - this.startPos[1];
      const offset =
        this.splitterContext.layout === 'horizontal' ? offsetX : offsetY;
      this.splitterContext.onMoving(this.index, offset);
    }
  };

  private onTouchStart = (e: TouchEvent) => {
    if (this.resizable && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      this.startPos = [touch.pageX, touch.pageY];
      this.splitterContext.onMoveStart(this.index);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchmove', this.onTouchMove);
    }
  };

  private renderEndIcon() {
    return (
      <zane-icon
        name={
          this.splitterContext.layout === 'horizontal'
            ? 'arrow-right'
            : 'arrow-down'
        }
        size="12px"
      ></zane-icon>
    );
  }

  private renderStartIcon() {
    return (
      <zane-icon
        name={
          this.splitterContext.layout === 'horizontal'
            ? 'arrow-left'
            : 'arrow-up'
        }
        size="12px"
      ></zane-icon>
    );
  }
}
