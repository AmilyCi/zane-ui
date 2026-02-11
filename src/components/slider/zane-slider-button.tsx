import type { Placement } from '@popperjs/core';
import { Component, h, Prop, State, Element, Method, Event, Watch, type EventEmitter } from '@stencil/core';
import classNames from 'classnames';
import { useNamespace } from '../../hooks';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { SliderContext } from './types';
import { getSliderContext } from './utils';
import debounce from 'lodash-es/debounce';
import clamp from 'lodash-es/clamp';
import { getEventCode, nextFrame } from '../../utils';
import { EVENT_CODE } from 'src/constants';

const ns = useNamespace('slider');

@Component({
  tag: 'zane-slider-button',
  styleUrl: 'zane-slider-button.scss'
})
export class ZaneSliderButton {
  @Element() el: HTMLElement;

  @Prop() vertical: boolean;

  @Prop({ mutable: true }) value: number = 0;

  @Prop() placement: Placement = 'top';

  @State() hovering: boolean = false;

  @State() dragging: boolean = false;

  @State() isClick: boolean = false;

  @State() startX: number = 0;

  @State() startY: number = 0;

  @State() currentX: number = 0;

  @State() currentY: number = 0;

  @State() startPosition: number = 0;

  @State() newPosition: number = 0;

  @State() oldValue: number = 0;

  @Event({ eventName: 'zChange' }) changeEvent: EventEmitter<number>;

  private buttonRef: HTMLDivElement;

  private tooltipRef: HTMLZaneTooltipElement;

  private sliderContext: ReactiveObject<SliderContext>;

  @Watch('dragging')
  handleWatchingDragging(newValue: boolean) {
    this.sliderContext?.value.updateDragging(newValue);
  }

  @Method()
  async onButtonDown(e: MouseEvent) {
    this.handleMouseDown(e);
  }

  @Method()
  async onKeyDown(e: KeyboardEvent) {
    this.handleKeyDown(e);
  }

  @Method()
  async isHovering() {
    return this.hovering;
  }

  @Method()
  async isDragging() {
    return this.dragging;
  }

  private displayTooltip = debounce(() => {
    if (this.sliderContext?.value.showTooltip) {
      this.tooltipRef.show();
    }
  }, 50)

  private hideTooltip = debounce(() => {
    this.tooltipRef.hide();
  }, 50)

  private handleMouseEnter = () => {
    this.hovering = true;
    this.displayTooltip();
  }

  private handleMouseLeave = () => {
    this.hovering = false;
    if (!this.dragging) {
      this.hideTooltip();
    }
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (this.sliderContext?.value.disabled) return;
    e.preventDefault();
    this.onDragStart(e);
    window.addEventListener('mousemove', this.onDragging);
    window.addEventListener('mouseup', this.onDragEnd);
    window.addEventListener('touchmove', this.onDragging);
    window.addEventListener('touchend', this.onDragEnd);
    window.addEventListener('contextmenu', this.onDragEnd);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const code = getEventCode(e);
    let isPreventDefault = true;
    switch(code) {
      case EVENT_CODE.left:
      case EVENT_CODE.down:
        this.onLeftKeyDown();
        break;
      case EVENT_CODE.right:
      case EVENT_CODE.up:
        this.onRightKeyDown();
        break;
      case EVENT_CODE.home:
        this.onHomeKeyDown();
        break;
      case EVENT_CODE.end:
        this.onEndKeyDown();
        break;
      case EVENT_CODE.pageDown:
        this.onPageDownKeyDown();
        break;
      case EVENT_CODE.pageUp:
        this.onPageUpKeyDown();
        break;
      default:
        isPreventDefault = false;
        break;
    }

    if (isPreventDefault) {
      e.preventDefault();
    }
  }

  private getClientXY = (e: MouseEvent | TouchEvent) => {
    let clientX: number;
    let clientY: number;
    if (e.type.startsWith('touch')) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    return { clientX, clientY };
  }

  private onDragStart = (e: MouseEvent | TouchEvent) => {
    this.dragging = true;
    this.isClick = true;
    const { clientX, clientY } = this.getClientXY(e);
    if (this.vertical) {
      this.startY = clientY;
    } else {
      this.startX = clientX;
    }
    const { min = 0, max = 100 } = this.sliderContext?.value || {};
    const currentPosition = `${
      ((this.value - min) / (max - min)) * 100
    }%`;
    this.startPosition = Number.parseFloat(currentPosition);
    this.newPosition = this.startPosition;
  }

  private onDragging = (e: MouseEvent | TouchEvent) => {
    if (!this.dragging) return;

    this.isClick = false;
    this.displayTooltip();
    this.sliderContext?.value.resetSize();

    let diff: number;
    const { clientX, clientY } = this.getClientXY(e);
    const { sliderSize = 1 } = this.sliderContext?.value || {};
    if (this.vertical) {
      this.currentY = clientY;
      diff = ((this.startY - this.currentY) / sliderSize) * 100;
    } else {
      this.currentX = clientX;
      diff = ((this.currentX - this.startX) / sliderSize) * 100;
    }
    this.newPosition = this.startPosition + diff;
    this.setPosition(this.newPosition);
  }

  private onDragEnd = () => {
    if (!this.dragging) return;

    setTimeout(() => {
      this.dragging = false;
      if (!this.hovering) {
        this.hideTooltip();
      }
      if (!this.isClick) {
        this.setPosition(this.newPosition);
      }
      this.sliderContext?.value.emitChange();
    }, 0);

    window.removeEventListener('mousemove', this.onDragging);
    window.removeEventListener('mouseup', this.onDragEnd);
    window.removeEventListener('touchmove', this.onDragging);
    window.removeEventListener('touchend', this.onDragEnd);
    window.removeEventListener('contextmenu', this.onDragEnd);
  }

  private onLeftKeyDown = () => {
    this.incrementPosition(this.sliderContext?.value.step * -1 || -1);
  }

  private onRightKeyDown = () => {
    this.incrementPosition(this.sliderContext?.value.step || 1);
  }

  private onPageDownKeyDown = () => {
    this.incrementPosition((this.sliderContext?.value.step || 1) * -4);
  }

  private onPageUpKeyDown = () => {
    this.incrementPosition((this.sliderContext?.value.step || 1) * 4);
  }

  private onHomeKeyDown = () => {
    if (this.sliderContext?.value.disabled) {
      return;
    }
    this.setPosition(0);
    this.sliderContext?.value.emitChange();
  }

  private onEndKeyDown = () => {
    if (this.sliderContext?.value.disabled) {
      return;
    }
    this.setPosition(100);
    this.sliderContext?.value.emitChange();
  }

  private incrementPosition = (amount: number) => {
    if (this.sliderContext?.value.disabled) {
      return;
    }
    const { min = 0, max = 100 } = this.sliderContext?.value || {};
    const currentPosition = `${
      ((this.value - min) / (max - min)) * 100
    }%`;
    this.newPosition = Number.parseFloat(currentPosition) + (amount / (max - min)) * 100;
    this.setPosition(this.newPosition);
    this.sliderContext?.value.emitChange();
  }

  @Method()
  async setPosition(newPosition: number) {
    if (newPosition === null || Number.isNaN(+newPosition)) {
      return;
    }

    newPosition = clamp(newPosition, 0, 100);
    const { min = 0, max = 100, step = 1, precision = 0 } = this.sliderContext?.value || {};
    const fullSteps = Math.floor((max - min) / step);
    const fullRangePercentage = ((fullSteps * step) / (max - min)) * 100;
    const threshold = fullRangePercentage + (100 - fullRangePercentage) / 2;

    let value: number;
    if (newPosition < fullRangePercentage) {
      const valueBetween = fullRangePercentage / fullSteps;
      const steps = Math.round(newPosition / valueBetween);
      value = min + steps * step;
    } else if (newPosition < threshold) {
      value = max + fullSteps * step;
    } else {
      value = max;
    }
    value = Number.parseFloat(value.toFixed(precision));
    if (value !== this.value) {
      this.value = value;
      this.changeEvent.emit(this.value);
    }

    if (!this.dragging && this.value !== this.oldValue) {
      this.oldValue = this.value;
    }

    nextFrame(() => {
      if (this.dragging) {
        this.displayTooltip();
      }
      this.tooltipRef.updateTippyInstance();
    });
  }

  componentWillLoad() {
    this.sliderContext = getSliderContext(this.el);
    this.buttonRef?.addEventListener('touchstart', this.handleMouseDown, { passive: false });
  }

  disconnectedCallback() {
    this.buttonRef?.removeEventListener('touchstart', this.handleMouseDown);
  }

  render() {
    const {
      min = 0,
      max = 100,
      disabled = false,
      showTooltip = true,
      formatTooltip,
    } = this.sliderContext?.value || {};

    const currentPosition = `${
      ((this.value - min) / (max - min)) * 100
    }%`;

    const wrapperStyle = this.vertical ? { bottom: currentPosition } : { left: currentPosition };

    let formatValue: string | number = this.value;
    if ((formatTooltip instanceof Function) && formatTooltip(this.value)) {
      formatValue = formatTooltip(this.value);
    }

    return (
      <div
        ref={el => this.buttonRef = el}
        class={classNames(
          ns.e('button-wrapper'),
          {
            hover: this.hovering,
            dragging: this.dragging
          }
        )}
        style={wrapperStyle}
        tabIndex={disabled ? undefined : 0}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeave}
        onKeyDown={this.handleKeyDown}
      >
        <zane-tooltip
          ref={el => this.tooltipRef = el}
          placement={this.placement}
          disabled={!showTooltip}
        >
          <div
            class={classNames(
              ns.e('button'), {
                dragging: this.dragging,
                hovering: this.hovering
              }
            )}
          ></div>
          <div slot="content">
            { formatValue }
          </div>
        </zane-tooltip>
      </div>
    );
  }
}
