import { Component, Event, h, Host, Method, Prop, State, Watch, type EventEmitter } from '@stencil/core';
import { useNamespace } from '../../hooks';
import { BAR_MAP } from '../scrollbar/constants';
import { HORIZONTAL, ScrollbarDirKey } from './constants';
import { cAF } from '../../utils/raf/cAF';
import { rAF } from '../../utils/raf/rAF';
import { renderThumbStyle } from './utils';
import classNames from 'classnames';

const ns = useNamespace('virtual-scrollbar');
const nsScrollbar = useNamespace('scrollbar');

@Component({
  tag: 'zane-virtual-scrollbar',
  styleUrl: 'zane-virtual-scrollbar.scss'
})
export class ZaneVirtualScrollbar {
  @Prop() alwaysOn: boolean;

  @Prop() layout: 'horizontal' | 'vertical' = 'vertical';

  @Prop() wrapperClass: string;

  @Prop() total: number;

  @Prop() ratio: number;

  @Prop() clientSize: number;

  @Prop() scrollFrom: number;

  @Prop() scrollbarSize: number = 6;

  @Prop() startGap: number = 0;

  @Prop() endGap: number = 2;

  @Prop() visible: boolean;

  @Event({ eventName: 'zScroll', bubbles: false })
  scrollEvent: EventEmitter<{
    distance: number;
    totalSteps: number
  }>;

  @Event({ eventName: 'zStartMove', bubbles: false })
  startMoveEvent: EventEmitter<void>;

  @Event({ eventName: 'zStopMove', bubbles: false })
  stopMoveEvent: EventEmitter<void>;

  @State() GAP: number;

  @State() isDragging: boolean = false;

  @State() traveled: number = 0;

  @State() bar: any;

  @State() trackSize: number = 0;

  @State() thumbSize: number = 0;

  @State() totalSteps: number = 0;

  @State() state: any = {};

  private trackRef: HTMLElement;

  private thumbRef: HTMLElement;

  private frameHandle: number | null = null;

  private onSelectStartStore: null | typeof document.onselectstart = null;

  @Watch('startGap')
  @Watch('endGap')
  handleUpdateGAP() {
    this.GAP = this.startGap + this.endGap;
  }

  @Watch('layout')
  handleUpdateBar() {
    this.bar = BAR_MAP[this.layout];
  }

  @Watch('clientSize')
  @Watch('GAP')
  handleUpdateTrackSize() {
    this.trackSize = this.clientSize - this.GAP;
  }

  @Watch('clientSize')
  @Watch('thumbSize')
  @Watch('GAP')
  handleUpdateTotalSteps() {
    this.totalSteps = Math.ceil(this.clientSize - this.thumbSize - this.GAP);
  }


  @Watch('ratio')
  @Watch('trackSize')
  handleUpdateThumbSize() {
    const ratio = this.ratio;
    if (ratio >= 100) {
      return Number.POSITIVE_INFINITY;
    }
    if (ratio >= 50) {
      return (ratio * this.trackSize) / 100;
    }
    const SCROLLBAR_MAX_SIZE = this.trackSize / 3;
    this.thumbSize = Math.floor(
      Math.min(
        Math.max((ratio * this.trackSize) / 100, SCROLLBAR_MAX_SIZE),
        SCROLLBAR_MAX_SIZE
      )
    )
  }

  @Watch('scrollFrom')
  handleWatchScrollFrom() {
    if (this.isDragging) {
      return;
    }
    this.traveled = Math.ceil(this.scrollFrom * this.totalSteps);
  }

  private handleClickTrack = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const offset = Math.abs(
      (event.target as HTMLElement).getBoundingClientRect()[this.bar.direction] - event[this.bar.client]
    );
    const thumbHalf = this.thumbRef[this.bar.offset] / 2;
    const distance = offset - thumbHalf;

    this.traveled = Math.max(0, Math.min(distance, this.totalSteps));
  }

  private handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    this.handleThumbMouseDown(event);
  }

  private handleThumbMouseDown = (event: Event | KeyboardEvent | MouseEvent) => {
    event.stopImmediatePropagation();
    if (
      (event as KeyboardEvent).ctrlKey ||
      [1, 2].includes((event as MouseEvent).button)
    ) {
      return;
    }

    this.isDragging = true;

    const currentTarget = event.currentTarget as HTMLElement;
    const currentTargetRect = currentTarget.getBoundingClientRect();
    this.state = {
      ...this.state,
      [this.bar.axis]: currentTarget[this.bar.offset] - (
        (event as MouseEvent)[this.bar.client] - currentTargetRect[this.bar.direction]
      )
    };

    this.startMoveEvent.emit();
    this.attachEvents();
  }

  private onMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!this.isDragging) {
      return;
    }
    if (!this.thumbRef || !this.trackRef) {
      return;
    }

    const prevPage = this.state[this.bar.axis];
    if (!prevPage) {
      return;
    }

    cAF(this.frameHandle!);

    const trackRect = this.trackRef.getBoundingClientRect();
    const offset = (trackRect[this.bar.direction] - (event as MouseEvent)[this.bar.client]) * -1;
    const thumbClickPosition = this.thumbRef[this.bar.offset] - (prevPage as number);
    const distance = offset - thumbClickPosition;
    this.frameHandle = rAF(() => {
      this.traveled = Math.max(0, Math.min(distance, this.totalSteps));
      this.scrollEvent.emit({
        distance,
        totalSteps: this.totalSteps
      })
    })
  }

  @Method()
  async onZMouseUp() {
    this.isDragging = false;
    this.state = {
      ...this.state,
      [this.bar.axis]: 0
    };

    this.stopMoveEvent.emit();
    this.detachEvents();
  }

  private _onMouseUp = this.onZMouseUp.bind(this);

  private attachEvents = () => {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);

    if (!this.thumbRef) {
      return;
    }

    this.onSelectStartStore = document.onselectstart;
    document.onselectstart = () => false;

    this.thumbRef.addEventListener('touchmove', this.onMouseMove);
    this.thumbRef.addEventListener('touchend', this._onMouseUp);
  }

  private detachEvents = () => {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);

    document.onselectstart = this.onSelectStartStore;
    this.onSelectStartStore = null;

    if (!this.thumbRef) {
      return;
    }

    this.thumbRef.removeEventListener('touchmove', this.onMouseMove);
    this.thumbRef.removeEventListener('touchend', this._onMouseUp);
  }

  componentWillLoad() {
    this.handleUpdateGAP();
    this.handleUpdateBar();
    this.handleUpdateTrackSize();
    this.handleUpdateThumbSize();
    this.handleUpdateTotalSteps();
  }

  disconnectedCallback() {
    this.detachEvents();
  }

  render() {
    const trackStyle = {
      position: 'absolute',
      width: `${HORIZONTAL === this.layout ? this.trackSize : this.scrollbarSize}px`,
      height: `${HORIZONTAL === this.layout ? this.scrollbarSize : this.trackSize}px`,
      [ScrollbarDirKey[this.layout]]: '2px',
      right: '2px',
      bottom: '2px',
      borderRadius: '4px',
    };

    let thumbStyle;
    if (!Number.isFinite(this.thumbSize)) {
      thumbStyle = {
        display: 'none'
      }
    } else {
      const thumb = `${this.thumbSize}px`;

      thumbStyle = renderThumbStyle(
        {
          bar: this.bar,
          size: thumb,
          move: this.traveled
        },
        this.layout
      );
    }

    return (
      <Host
        class={classNames(
          ns.b(),
          nsScrollbar.b(),
          this.wrapperClass,
          (this.alwaysOn || this.isDragging) && 'always-on'
        )}
        style={trackStyle}
      >
        <div
          role="presentation"
          ref={(el) => this.trackRef = el}
          onMouseDown={this.handleClickTrack}
          onTouchStart={this.handleTouchStart}
        >
          <div
            ref={(el) => this.thumbRef = el}
            class={nsScrollbar.e('thumb')}
            style={thumbStyle}
            onMouseDown={this.handleThumbMouseDown}
          >
          </div>
        </div>
      </Host>
    );
  }
}
