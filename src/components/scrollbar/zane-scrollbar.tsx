import type { ComponentInterface, EventEmitter } from '@stencil/core';

import type { ScrollbarDirection } from '../../types';

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

import { scrollbarContexts } from '../../constants';
import { useEventListener, useNamespace, useResizeObserver } from '../../hooks';
import {
  addUnit,
  debugWarn,
  isNumber,
  nextFrame,
  normalizeStyle,
} from '../../utils';
import { ScrollbarContext } from './scrollbar-context';

const ns = useNamespace('scrollbar');

const COMPONENT_NAME = 'zane-scrollbar';

const DIRECTION_PAIRS: Record<ScrollbarDirection, ScrollbarDirection> = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom',
};

@Component({
  styleUrl: 'zane-scrollbar.scss',
  tag: 'zane-scrollbar',
})
export class ZaneScrollbar {
  @Prop() always: boolean;

  @Prop() distance: number = 0;

  @State() distanceScrollState = {
    bottom: false,
    left: false,
    right: false,
    top: false,
  };

  @Element() el: HTMLElement;

  @Event({ eventName: 'end-reached' })
  endReachedEvent: EventEmitter<ScrollbarDirection>;

  @Prop({ reflect: true }) height: number | string = '';

  @Prop() maxHeight: number | string = '';

  @Prop() minSize: number = 20;

  @Prop() native: boolean;

  @Prop() noresize: boolean;

  @Prop() role: string;

  @Event({ eventName: 'zScroll' }) scrollEvent: EventEmitter<{
    scrollLeft: number;
    scrollTop: number;
  }>;

  @Prop() tag: string = 'div';

  @Prop() viewClass: string = '';

  @Prop() viewStyle: Record<string, string> = {};

  @Prop() wrapClass: string = '';

  @Prop() wrapStyle: Record<string, string> = {};

  private barRef: ComponentInterface;

  private context = new ScrollbarContext();

  private direction: ScrollbarDirection = 'right';

  private resizeRef: HTMLDivElement;

  private stopResizeListener: (() => void) | undefined = undefined;

  private stopResizeObserver: (() => void) | undefined = undefined;

  private stopWrapResizeObserver: (() => void) | undefined = undefined;

  private wrapRef: HTMLDivElement;
  private wrapScrollLeft: number = 0;

  private wrapScrollTop: number = 0;

  componentDidLoad() {
    this.context.wrapElement = this.wrapRef;

    this.watchNoresizeHandler();
    if (!this.native) {
      nextFrame(() => {
        this.update();
      });
    }
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillLoad() {
    this.context.scrollbarElement = this.el;
    scrollbarContexts.set(this.el, this.context);
  }

  @Method()
  async handleScroll() {
    if (this.wrapRef) {
      this.barRef?.handleScroll(this.wrapRef);
      const prevTop = this.wrapScrollTop;
      const prevLeft = this.wrapScrollLeft;
      this.wrapScrollTop = this.wrapRef.scrollTop;
      this.wrapScrollLeft = this.wrapRef.scrollLeft;

      const arrivedStates = {
        bottom:
          this.wrapScrollTop + this.wrapRef.clientHeight >=
          this.wrapRef.scrollHeight - this.distance,
        left: this.wrapScrollLeft <= this.distance && prevLeft !== 0,
        right:
          this.wrapScrollLeft + this.wrapRef.clientWidth >=
            this.wrapRef.scrollWidth - this.distance &&
          prevLeft !== this.wrapScrollLeft,
        top: this.wrapScrollTop <= this.distance && prevTop !== 0,
      };

      this.scrollEvent.emit({
        scrollLeft: this.wrapScrollLeft,
        scrollTop: this.wrapScrollTop,
      });

      if (prevTop !== this.wrapScrollTop) {
        this.direction = this.wrapScrollTop > prevTop ? 'bottom' : 'top';
      }
      if (prevLeft !== this.wrapScrollLeft) {
        this.direction = this.wrapScrollLeft > prevLeft ? 'right' : 'left';
      }
      if (this.distance > 0) {
        if (this.shouldSkipDirection(this.direction)) {
          return;
        }
        this.updateTriggerStatus(arrivedStates);
      }
      if (arrivedStates[this.direction]) {
        this.endReachedEvent.emit(this.direction);
      }
    }
  }

  render() {
    const wrapKls = [
      this.wrapClass,
      ns.e('wrap'),
      !this.native && ns.em('wrap', 'hidden-default'),
    ].join(' ');

    const resizeKls = [ns.e('view'), this.viewClass].join(' ');

    const wrapStyle = normalizeStyle(this.wrapStyle);
    if (this.height) {
      wrapStyle.height = addUnit(this.height);
    }

    if (this.maxHeight) {
      wrapStyle.maxHeight = addUnit(this.maxHeight);
    }

    return (
      <Host class={ns.b()}>
        <div
          class={wrapKls}
          onScroll={this.onScrollHandler}
          ref={(el) => (this.wrapRef = el)}
          style={wrapStyle}
          tabindex={this.el.tabIndex}
        >
          <div
            class={resizeKls}
            id={this.el.id}
            ref={(el) => (this.resizeRef = el)}
            role={this.role}
            style={this.viewStyle}
          >
            <slot></slot>
          </div>
        </div>
        <zane-bar
          always={this.always}
          min-size={this.minSize}
          ref={(el) => (this.barRef = el)}
        ></zane-bar>
      </Host>
    );
  }

  @Method()
  async scrollToCoord(xCoord: number, yCoord?: number) {
    this.wrapRef.scrollTo(xCoord, yCoord);
  }

  @Method()
  async setScrollLeft(value: number) {
    if (!isNumber(value)) {
      debugWarn(COMPONENT_NAME, 'value must be a number');
      return;
    }
    this.wrapRef.scrollLeft = value;
  }

  @Method()
  async setScrollTop(value: number) {
    if (!isNumber(value)) {
      debugWarn(COMPONENT_NAME, 'value must be a number');
      return;
    }
    this.wrapRef.scrollTop = value;
  }

  @Method()
  async update() {
    this.barRef?.update();
    this.distanceScrollState[this.direction] = false;
  }

  @Watch('maxHeight')
  @Watch('height')
  watchHeightHandler() {
    if (!this.native)
      nextFrame(() => {
        this.update();
        if (this.wrapRef) {
          this.barRef?.handleScroll(this.wrapRef);
        }
      });
  }

  @Watch('noresize')
  watchNoresizeHandler() {
    if (this.noresize) {
      this.stopResizeListener?.();
      this.stopResizeObserver?.();
      this.stopWrapResizeObserver?.();
    } else {
      this.stopResizeObserver = useResizeObserver(
        this.resizeRef,
        this.onSizeChangeHandler,
      );
      this.stopWrapResizeObserver = useResizeObserver(
        this.wrapRef,
        this.onSizeChangeHandler,
      );
      const { disconnect } = useEventListener(
        document,
        'resize',
        this.onSizeChangeHandler,
      );
      this.stopResizeListener = disconnect;
    }
  }

  private onScrollHandler = () => {
    this.handleScroll();
  };

  private onSizeChangeHandler = () => {
    this.update();
  };

  private shouldSkipDirection = (direction: ScrollbarDirection) => {
    return this.distanceScrollState[direction] ?? false;
  };

  private updateTriggerStatus = (arrivedStates: Record<string, boolean>) => {
    const oppositeDirection = DIRECTION_PAIRS[this.direction];
    if (!oppositeDirection) return;

    const arrived = arrivedStates[this.direction];
    const oppositeArrived = arrivedStates[oppositeDirection];

    if (arrived && !this.distanceScrollState[this.direction]) {
      this.distanceScrollState[this.direction] = true;
    }

    if (!oppositeArrived && this.distanceScrollState[oppositeDirection]) {
      this.distanceScrollState[oppositeDirection] = false;
    }
  };
}
