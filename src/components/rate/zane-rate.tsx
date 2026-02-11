
import { Component, h, Element, Prop, Watch, State, Event, type EventEmitter } from '@stencil/core';
import type { ComponentSize } from '../../types';
import { useNamespace } from '../../hooks';
import state from '../../global/store';
import { inLabel } from '../../utils/component/inLabel';
import type { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import type { FormContext, FormItemContext } from '../form/types';
import type { ConfigProviderContext } from '../config-provider/types';
import { getFormContext, getFormItemContext } from '../form/utils';
import { getConfigProviderContext } from '../config-provider/utils';
import classNames from 'classnames';
import { getEventCode, isObject } from '../../utils';
import { EVENT_CODE } from '../../constants';
import clamp from 'lodash-es/clamp'

const ns = useNamespace('rate');

@Component({
  tag: 'zane-rate',
  styleUrl: 'zane-rate.scss'
})
export class ZaneRate {
  @Element() el: HTMLElement;

  @Prop({ attribute: 'id' }) zId: string = undefined;

  @Prop({ mutable: true }) value: number = 0;

  @Prop() lowThreshold: number = 2;

  @Prop() highThreshold: number = 4;

  @Prop() max: number = 5;

  @Prop() colors: string[] | Record<number, string> = ['', '', ''];

  @Prop() voidColor: string = '';

  @Prop() disabledVoidColor: string = '';

  @Prop() icons: string[] | Record<number, string> = ['star-fill', 'star-fill', 'star-fill'];

  @Prop() voidIcon: string = 'star-line'

  @Prop() disabledVoidIcon: string = 'star-fill';

  @Prop() disabled: boolean = undefined;

  @Prop() allowHalf: boolean;

  @Prop() showText: boolean;

  @Prop() showScore: boolean;

  @Prop() textColor: string = '';

  @Prop() texts: string[] = ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'];

  @Prop() scoreTemplate: string = '{value}';

  @Prop() size: ComponentSize;

  @Prop() clearable: boolean;

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @State() inputId: string;

  @State() rateSize: ComponentSize;

  @State() rateDisabled: boolean;

  @State() isLabeledByFormItem: boolean = false;

  @State() currentValue: number = this.value;

  @State() valueDecimal: number = 0;

  @State() text: string = '';

  @State() activeColor: string;

  @State() colorMap: Record<number, any> = {};

  @State() componentMap: Record<number, any> = {};

  @State() hoverIndex: number = -1;

  @State() pointerAtLeftHalf = true;

  @Event({ eventName: 'zChange' }) changeEvent: EventEmitter<number>;

  private iconRefs: HTMLElement[] = [];

  private iconClientWidths: number[] = [];
  
  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  @Watch('zId')
  handleWatchId() {
    const newId = this.zId ?? `${ns.namespace}-id-${state.idInjection.prefix}-${state.idInjection.current++}`;
    if (this.inputId !== newId) {
      if (this.formItemContext?.value.removeInputId && !inLabel(this.el)) {
        if (this.inputId) {
          this.formItemContext.value.removeInputId(this.inputId);
        }
        this.formItemContext?.value.addInputId(newId);
      }
      this.inputId = newId;
    }
  }
  
  @Watch("size")
  handleUpdateSize() {
    this.rateSize =
      this.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }
  
  @Watch("disabled")
  handleUpdateDisabled() {
    this.rateDisabled =
      this.disabled ?? this.formContext?.value.disabled ?? false;
  }

  @Watch('currentValue')
  @Watch('colorMap')
  handleUpdateActiveColor() {
    this.activeColor = this.getValueFromMap(this.currentValue, this.colorMap);
  }

  @Watch('value')
  handleUpdateValueDecimal() {
    this.valueDecimal = this.value * 100 - Math.floor(this.value) * 100;
    this.currentValue = this.value;
    this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
  }

  @Watch('showScore')
  @Watch('showText')
  @Watch('scoreTemplate')
  @Watch('value')
  @Watch('currentValue')
  handleUpdateText() {
    let result = '';
    if (this.showScore) {
      result = this.scoreTemplate.replace(
        /\{\s*value\s*\}/,
        this.rateDisabled ? `${this.value}` : `${this.currentValue}`
      );
    } else if (this.showText) {
      result = this.texts[Math.ceil(this.currentValue) - 1];
    }
    this.text = result;
  }

  @Watch('colors')
  handleUpdateColorMap() {
    this.colorMap = Array.isArray(this.colors)
      ? {
        [this.lowThreshold]: this.colors[0],
        [this.highThreshold]: {
          value: this.colors[1],
          excluded: true,
        },
        [this.max]: this.colors[2]
      }
      : this.colors;
  }

  @Watch('icons')
  handleUpdateComponentMap() {
    let icons = Array.isArray(this.icons) ? [...this.icons] : {...this.icons};
    this.componentMap = Array.isArray(icons)
     ? {
      [this.lowThreshold]: icons[0],
      [this.highThreshold] : {
        value: icons[1],
        excluded: true,
      },
      [this.max]: icons[2]
     }
     : icons;
  }

  private setCurrentValue = (value: number, event?: MouseEvent) => {
    if (this.rateDisabled) {
      return;
    }
    if (this.allowHalf && event) {
      this.pointerAtLeftHalf = event.offsetX * 2 < this.iconClientWidths[value - 1];
      this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
    } else {
      this.currentValue = value;
    }
    this.hoverIndex = value;
  }

  private resetCurrentValue = () => {
    if (this.rateDisabled) {
      return;
    }
    if (this.allowHalf) {
      this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
    }
    this.currentValue = this.value;
    this.hoverIndex = -1;
  }

  private selectValue = (value: number) => {
    if (this.rateDisabled) {
      return;
    }
    let newVal = this.allowHalf && this.pointerAtLeftHalf ? this.currentValue: value;
    if (this.clearable && newVal === this.value) {
      newVal = 0;
    }
    if (newVal !== this.value) {
      this.value = newVal;
      this.changeEvent.emit(newVal);
    }
  }

  private getValueFromMap<T>(
    value: number, 
    map: Record<number, T | { excluded?: boolean; value: T}>
  ) {
    const isExcludedObject = (val: unknown): 
      val is { excluded?: boolean} & Record<any, unknown> => isObject(val)

    const matchedKeys = Object.keys(map)
      .map((key) => +key)
      .filter((key) => {
        const val = map[key];
        const excluded = isExcludedObject(val) ? val.excluded : false;
        return excluded ? value < key : value <= key;
      })
      .sort((a, b) => {
        return a-b;
      });

    const matchedValue = map[matchedKeys[0]];
    if (isExcludedObject(matchedValue)) {
      return matchedValue.value;
    }
    return matchedValue;
  }

  private showDecimalIcon(item: number) {
    const showWhenDisabled = this.rateDisabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
    const showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && item - 0.5 <= this.currentValue && item > this.currentValue;
    return showWhenDisabled || showWhenAllowHalf;
  }

  private handleKey = (e: KeyboardEvent) => {
    if (this.rateDisabled) {
      return;
    }
    const code = getEventCode(e);
    const step = this.allowHalf ? 0.5 : 1;
    let _currentValue = this.currentValue;

    switch(code) {
      case EVENT_CODE.up:
      case EVENT_CODE.right:
        _currentValue += step;
        break;
      case EVENT_CODE.left:
      case EVENT_CODE.down:
        _currentValue -= step;
        break;
    }

    _currentValue = clamp(_currentValue, 0, this.max);

    if (_currentValue === this.currentValue) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.value = _currentValue;
    this.changeEvent.emit(_currentValue);
    return _currentValue;
  }

  componentWillLoad() {
    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);

    this.isLabeledByFormItem = !!(
      !(this.label || this.ariaLabel) &&
      this.formItemContext &&
      this.formItemContext.value.inputIds &&
      this.formItemContext.value.inputIds?.length <= 1
    )

    this.handleWatchId();
    this.handleUpdateSize();
    this.handleUpdateDisabled();
    this.handleUpdateColorMap();
    this.handleUpdateComponentMap();
    this.handleUpdateActiveColor();
    this.handleUpdateText();
    this.handleUpdateValueDecimal();

    
    this.formContext?.change$.subscribe(({key}) => {
      if (key === 'disabled') {
        this.handleUpdateDisabled();
      }
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });

    this.formItemContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });

    this.configProviderContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });
  }

  componentWillRender() {
    this.iconRefs = [];
    this.iconClientWidths = [];
  }

  componentDidRender() {
    this.iconClientWidths = this.iconRefs.map((el) => el?.clientWidth || 0);
  }


  render() {
    const rateStyles = ns.cssVarBlock({
      'void-color': this.voidColor,
      'disabled-void-color': this.disabledVoidColor,
      'fill-color': this.activeColor
    });

    let width = '';

    if (this.rateDisabled) {
      width = `${this.valueDecimal}%`
    } else if (this.allowHalf) {
      width = '50%';
    }

    const decimalStyle = {
      color: this.activeColor,
      width,
    }

    const activeIcon = this.getValueFromMap(this.currentValue, this.componentMap);

    const voidIcon = this.rateDisabled 
      ? this.disabledVoidIcon
      : this.voidIcon;

    const decimalIcon = this.getValueFromMap(this.value, this.componentMap);

    return (
      <div
        id={this.inputId}
        class={classNames(
          ns.b(),
          ns.m(this.rateSize),
          ns.is('disabled', this.rateDisabled)
        )}
        role="slider"
        aria-label={!this.isLabeledByFormItem ? this.ariaLabel || 'rating' : undefined}
        aria-labelledby={this.isLabeledByFormItem ? this.formItemContext?.value.labelId : undefined}
        aria-valuenow={this.currentValue}
        aria-valuetext={this.text || undefined}
        aria-valuemin={0}
        aria-valuemax={this.max}
        tabindex={0}
        style={rateStyles}
        onKeyDown={this.handleKey}
      >
        {
          Array.from({ length: this.max }, (_, i) => i + 1).map((item) => (
            <span
              key={item}
              class={ns.e('item')}
              onMouseMove={(e) => this.setCurrentValue(item, e)}
              onMouseLeave={this.resetCurrentValue}
              onClick={() => this.selectValue(item)}
            >
              <span
                ref={(el) => this.iconRefs[item] = el}
                class={classNames(
                  ns.e('icon'),
                  {
                    hover: this.hoverIndex === item,
                  },
                  ns.is('active', item <= this.currentValue),
                  ns.is('focus-visible', item === Math.ceil(this.currentValue || 1))
                )}
              >
                <zane-icon
                  style={{
                    display: !this.showDecimalIcon(item) && item <= this.currentValue ? undefined : 'none'
                  }}
                  name={ activeIcon }
                ></zane-icon>
                <zane-icon
                  style={{
                    display: !this.showDecimalIcon(item) && item > this.currentValue ? undefined : 'none'
                  }}
                  name={ voidIcon }
                ></zane-icon>
                <zane-icon
                  style={{
                    display: this.showDecimalIcon(item) ? undefined : 'none'
                  }}
                  class={classNames(ns.em('decimal', 'box'))}
                  name={ voidIcon }
                ></zane-icon>
                <zane-icon
                  style={{
                    ...decimalStyle,
                    display: this.showDecimalIcon(item) ? undefined : 'none'
                  }}
                  class={classNames(ns.e('icon'), ns.e('decimal'))}
                  name={ decimalIcon }
                ></zane-icon>
              </span>
            </span>
          ))
        }
        {
          (this.showText || this.showScore) && (
            <span
              class={ns.e('text')}
              style={{ color: this.textColor }}
            >
              { this.text }
            </span>
          )
        }
      </div>
    );
  }
}
