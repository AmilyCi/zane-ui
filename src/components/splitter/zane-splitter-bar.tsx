import { Component, Element, h, Host, State } from '@stencil/core';

import { useNamespace } from '../../hooks';
import { nextFrame, throwError, type ReactiveObject } from '../../utils';
import { getSplitterContext, isCollapsible } from './utils';
import type { SplitterRootContext } from './types';

const ns = useNamespace('splitter-bar');

const COMPONENT_NAME = 'zane-splitter-bar';

@Component({
  tag: 'zane-splitter-bar',
})
export class ZaneSplitterBar {
  @Element() el: HTMLElement;

  @State() endCollapsible: boolean;

  @State() startCollapsible: boolean;

  @State() startPos: [x: number, y: number] | null = null;

  @State() resizable: boolean;

  @State() index: number;

  @State() layout: 'horizontal' | 'vertical';

  @State() lazy: boolean;

  private splitterContext: ReactiveObject<SplitterRootContext>;

  private updateStartAndEndCollapsible = () => {
    const panel = this.splitterContext.value.panels[this.index];
    const panelSize = this.splitterContext.value.pxSizes[this.index];
    const nextPanel = this.splitterContext.value.panels[this.index + 1];
    const nextPanelSize = this.splitterContext.value.pxSizes[this.index + 1];

    this.startCollapsible = isCollapsible(
      panel?.value,
      panelSize,
      nextPanel?.value,
      nextPanelSize,
    );
    this.endCollapsible = isCollapsible(
      nextPanel?.value,
      nextPanelSize,
      panel?.value,
      panelSize,
    );
  }

  async componentWillLoad() {
    this.splitterContext = getSplitterContext(this.el);
    if (!this.splitterContext) {
      throwError(
        COMPONENT_NAME,
        'usage: <zane-splitter><zane-splitter-panel /></zane-splitter>',
      );
    }

    this.resizable = this.el.previousElementSibling &&
      this.el.previousElementSibling.tagName === 'ZANE-SPLITTER-PANEL' &&
      this.el.nextElementSibling &&
      this.el.nextElementSibling.tagName === 'ZANE-SPLITTER-PANEL';
        
    this.index = await  (this.el.previousElementSibling as HTMLZaneSplitterPanelElement).getIndex();
    this.layout = this.splitterContext.value.layout;
    this.lazy = this.splitterContext.value.lazy;

    this.updateStartAndEndCollapsible();

    this.splitterContext.change$.subscribe((change) => {
      if (change.key === 'layout') {
        this.layout = change.value;
      }
      if (change.key === 'lazy') {
        this.lazy = change.value;
      }
      if (change.key === 'panels') {
        nextFrame(async () => {
          this.resizable = this.el.previousElementSibling &&
            this.el.previousElementSibling.tagName === 'ZANE-SPLITTER-PANEL' &&
            this.el.nextElementSibling &&
            this.el.nextElementSibling.tagName === 'ZANE-SPLITTER-PANEL';

          this.index = await  (this.el.previousElementSibling as HTMLZaneSplitterPanelElement).getIndex();
          this.updateStartAndEndCollapsible();
        });
      }
    });
  }

  render() {
    const prefix = ns.e('dragger');
    const barWrapStyles =
      this.layout === 'horizontal'
        ? { width: '0' }
        : { height: '0' };

    const draggerStyles = {
      cursor: this.resizable
        ? // eslint-disable-next-line unicorn/no-nested-ternary
          this.layout === 'horizontal'
          ? 'ew-resize'
          : 'ns-resize'
        : 'auto',
      height: this.layout === 'horizontal' ? '100%' : '16px',
      touchAction: 'none',
      width: this.layout === 'horizontal' ? '16px' : '100%',
    };

    return (
      <Host class={ns.b()} style={barWrapStyles}>
        {this.startCollapsible && (
          <div
            class={[
              ns.e('collapse-icon'),
              ns.e(`${this.layout}-collapse-icon-start`),
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
              this.layout === 'horizontal',
            [`${prefix}-vertical`]:
              this.layout !== 'horizontal',
            [ns.e('dragger')]: true,
            [ns.is('disabled', !this.resizable)]: true,
            [ns.is('lazy', this.resizable && this.lazy)]: true,
          }}
          onMouseDown={this.onMousedown}
          onTouchStart={this.onTouchStart}
          style={draggerStyles}
        />

        {this.endCollapsible && (
          <div
            class={[
              ns.e('collapse-icon'),
              ns.e(`${this.layout}-collapse-icon-end`),
            ].join(' ')}
            onClick={() => this.onCollapse('end')}
          >
            <slot name="end-collapsible">{this.renderEndIcon()}</slot>
          </div>
        )}
      </Host>
    );
  }

  private onCollapse = (type: 'end' | 'start') => {
    this.splitterContext.value.onCollapse(this.index, type);
    nextFrame(() => {
      this.updateStartAndEndCollapsible();
    });
  };

  private onMousedown = (e: MouseEvent) => {
    if (!this.resizable) return;
    this.startPos = [e.pageX, e.pageY];
    this.splitterContext.value.onMoveStart(this.index);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  };

  private onMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const offsetX = pageX - this.startPos[0];
    const offsetY = pageY - this.startPos[1];
    const offset =
      this.layout === 'horizontal' ? offsetX : offsetY;
    this.splitterContext.value.onMoving(this.index, offset);
  };

  private onMouseUp = () => {
    this.startPos = null;
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.splitterContext.value.onMoveEnd(this.index);
  };

  private onTouchEnd = () => {
    this.startPos = null;
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchmove', this.onTouchMove);
    this.splitterContext.value.onMoveEnd(this.index);
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const offsetX = touch.pageX - this.startPos[0];
      const offsetY = touch.pageY - this.startPos[1];
      const offset =
        this.layout === 'horizontal' ? offsetX : offsetY;
      this.splitterContext.value.onMoving(this.index, offset);
    }
  };

  private onTouchStart = (e: TouchEvent) => {
    if (this.resizable && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      this.startPos = [touch.pageX, touch.pageY];
      this.splitterContext.value.onMoveStart(this.index);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchmove', this.onTouchMove);
    }
  };

  private renderEndIcon() {
    return (
      <zane-icon
        name={
          this.layout === 'horizontal'
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
          this.layout === 'horizontal'
            ? 'arrow-left'
            : 'arrow-up'
        }
        size="12px"
      ></zane-icon>
    );
  }

}
