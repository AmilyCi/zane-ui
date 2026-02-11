import {
  Component,
  Event,
  h,
  Prop,
  State,
  Element,
  type EventEmitter,
  Watch,
  Method,
} from "@stencil/core";

import { useNamespace } from "../../hooks";
import type { ComponentSize } from "../../types";
import classNames from "classnames";
import {
  debugWarn,
  getEventCode,
  getEventKey,
  isNumber,
  isString,
  isUndefined,
  throwError,
  type ReactiveObject,
} from "../../utils";
import type { FormContext, FormItemContext } from "../form/types";
import type { ConfigProviderContext } from "../config-provider/types";
import { getFormContext, getFormItemContext } from "../form/utils";
import { getConfigProviderContext } from "../config-provider/utils";
import state from "../../global/store";
import { isNil } from "../../utils/is/isNil";
import { EVENT_CODE } from "../../constants";

const ns = useNamespace("input-number");

const SCOPE = "zane-input-number";

type Data = {
  currentValue: number | null | undefined;
  userInput: null | number | string;
};

@Component({
  styleUrl: "zane-input-number.scss",
  tag: "zane-input-number",
})
export class ZaneInputNumber {
  @Element() el: HTMLElement;

  @Prop({ attribute: "id" }) zId: string = undefined;

  @Prop() step: number = 1;

  @Prop() stepStrictly: boolean;

  @Prop() max: number = Number.MAX_SAFE_INTEGER;

  @Prop() min: number = Number.MIN_SAFE_INTEGER;

  @Prop({ mutable: true }) value: number | null | undefined = null;

  @Prop() readonly: boolean;

  @Prop() disabled: boolean = undefined;

  @Prop() size: ComponentSize;

  @Prop() controls: boolean = true;

  @Prop() controlsPosition: "right" | "" = "";

  @Prop() valueOnClear: "min" | "max" | number | null = null;

  @Prop() name: string;

  @Prop() placeholder: string;

  @Prop() precision: number;

  @Prop() validateEvent: boolean = true;

  @Prop() ariaLabel: string;

  @Prop({ attribute: "inputmode" }) zInputMode:
    | "decimal"
    | "email"
    | "none"
    | "numeric"
    | "search"
    | "tel"
    | "text"
    | "url";

  @Prop() align: "left" | "right" | "center" = "center";

  @Prop() disabledScientific: boolean;

  @Event({ eventName: "zChange" }) changeEvent: EventEmitter<
    number | undefined
  >;

  @Event({ eventName: "zBlur" }) blurEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: "zFocus" }) focusEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: "zInput" }) inputEvent: EventEmitter<
    number | null | undefined
  >;

  @State() inputNumberSize: ComponentSize = "";

  @State() inputNumberDisabled: boolean = false;

  @State() controlsAtRight: boolean = false;

  @State() minDisabled: boolean;

  @State() maxDisabled: boolean;

  @State() data: Data;

  @State() displayValue: string | number;

  @State() numPrecision: number;

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private inputRef: HTMLZaneInputElement;

  @Watch("size")
  handleUpdateSize() {
    this.inputNumberSize =
      this.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }

  @Watch("disabled")
  handleUpdateDisabled() {
    this.inputNumberDisabled =
      this.disabled ?? this.formContext?.value.disabled ?? false;
  }

  @Watch("controls")
  @Watch("controlsPosition")
  handleUpdateControlsAtRight() {
    this.controlsAtRight = this.controls && this.controlsPosition === "right";
  }

  @Watch("value")
  handleValueChange() {
    this.minDisabled = isNumber(this.value) && this.value <= this.min;
    this.maxDisabled = isNumber(this.value) && this.value >= this.max;
  }

  @Watch("data")
  handleUpdateDisplayValue() {
    if (this.data.userInput !== null) {
      this.displayValue = this.data.userInput;
    }

    let currentValue: number | string | undefined | null =
      this.data.currentValue;
    if (isNil(currentValue)) {
      this.displayValue = "";
      return;
    }
    if (isNumber(currentValue)) {
      if (Number.isNaN(currentValue)) {
        this.displayValue = "";
        return;
      }
      if (!isUndefined(this.precision)) {
        currentValue = currentValue.toFixed(this.precision);
      }
    }
    this.displayValue = currentValue;
  }

  @Watch("step")
  @Watch("precision")
  @Watch("value")
  updateNumPrecision() {
    const stepPrecision = this.getPrecision(this.step);
    if (!isUndefined(this.precision)) {
      if (stepPrecision > this.precision) {
        debugWarn(
          SCOPE,
          "precision should not be less than decimal places of step",
        );
      }
      this.numPrecision = this.precision;
    } else {
      this.numPrecision = Math.max(
        this.getPrecision(this.value),
        stepPrecision,
      );
    }
  }

  @Watch('value', { immediate: true })
  handleWatchValue(val, oldVal) {
    const newVal = this.verifyValue(val, true);
    if (!this.data) {
      this.data = {
        currentValue: newVal,
        userInput: null,
      };
    }
    if (this.data.userInput === null && newVal !== oldVal) {
      this.data = {
        ...this.data,
        currentValue: newVal
      };
    }
  }

  @Watch('precision')
  handleWatchPrecision() {
    this.data = {
      ...this.data,
      currentValue: this.verifyValue(this.value)
    }
  }

  @Method()
  async zFocus() {
    this.inputRef.zFocus();
  }

  @Method()
  async zBlur() {
    this.inputRef.zBlur();
  }

  private toPrecision = (num: number, pre?: number) => {
    if (isUndefined(pre)) {
      pre = this.numPrecision;
    }
    if (pre === 0) {
      return Math.round(num);
    }
    let sNum = String(num);
    const pointPos = sNum.indexOf(".");
    if (pointPos === -1) {
      return num;
    }
    const nums = sNum.replace(".", "").split("");
    const datum = nums[pointPos + pre];
    if (!datum) {
      return num;
    }

    const length = sNum.length;
    if (sNum.charAt(length - 1) === "5") {
      sNum = `${sNum.slice(0, Math.max(0, length - 1))}6`;
    }
    return Number.parseFloat(Number(sNum).toFixed(pre));
  };

  private getPrecision = (value: number | null | undefined) => {
    if (isNil(value)) {
      return 0;
    }

    const valueString = value.toString();
    const dotPosition = valueString.indexOf(".");

    let precision = 0;
    if (dotPosition !== -1) {
      precision = valueString.length - dotPosition - 1;
    }

    return precision;
  };

  private ensurePrecision = (val: number, coefficient: 1 | -1 = 1) => {
    if (!isNumber(val)) {
      return this.data.currentValue;
    }

    if (val >= Number.MAX_SAFE_INTEGER && coefficient === 1) {
      debugWarn(SCOPE, "The value has reached the maximum safe integer limit.");
      return val;
    } else if (val <= Number.MIN_SAFE_INTEGER && coefficient === -1) {
      debugWarn(SCOPE, "The value has reached the minimum safe integer limit.");
      return val;
    }

    return this.toPrecision(val + this.step * coefficient);
  };

  private verifyValue = (
    value: number | string | null | undefined,
    update?: boolean,
  ): number | null | undefined => {
    if (this.max < this.min) {
      throwError(SCOPE, "min should bot be greater than max.");
    }
    let newVal = Number(value);
    if (isNil(value) || Number.isNaN(newVal)) {
      return null;
    }
    if (value === "") {
      if (this.valueOnClear === null) {
        return null;
      }
      newVal = isString(this.valueOnClear)
        ? { min: this.min, max: this.max }[this.valueOnClear]
        : this.valueOnClear;
    }
    if (this.stepStrictly) {
      newVal = this.toPrecision(
        Math.round(this.toPrecision(newVal / this.step)) * this.step,
        this.precision,
      );

      if (newVal !== value) {
        update && (this.value = newVal);
      }
    }
    if (!isUndefined(this.precision)) {
      newVal = this.toPrecision(newVal, this.precision);
    }
    if (newVal > this.max || newVal < this.min) {
      newVal = newVal > this.max ? this.max : this.min;
      update && (this.value = newVal);
    }
    return newVal;
  };

  private setCurrentValue = (
    value: number | string | null | undefined,
    emitChange: boolean = true,
  ) => {
    const oldVal = this.data.currentValue;
    const newVal = this.verifyValue(value);
    if (!emitChange) {
      this.value = newVal;
      return;
    }
    this.data = {
      ...this.data,
      userInput: null
    }
    if (oldVal === newVal && value) {
      return;
    }
    this.value = newVal;
    if (oldVal !== newVal) {
      this.changeEvent.emit(newVal);
    }
    if (this.validateEvent) {
      this.formItemContext?.value
        .validate?.("change")
        .catch((error) => debugWarn(error));
    }
    this.data = {
      ...this.data,
      currentValue: newVal
    }
  };

  private setCurrentValueToModelValue = () => {
    if (this.data.currentValue !== this.value) {
      this.data = {
        ...this.data,
        currentValue: this.value
      }
    }
  };

  private handleDecrease = () => {
    if (this.readonly || this.inputNumberDisabled || this.minDisabled) {
      return;
    }

    const value = Number(this.displayValue) || 0;
    const newVal = this.ensurePrecision(value, -1);
    this.setCurrentValue(newVal);
    this.inputEvent.emit(this.data.currentValue);
    this.setCurrentValueToModelValue();
  };

  private handleIncrease = () => {
    if (this.readonly || this.inputNumberDisabled || this.maxDisabled) {
      return;
    }

    const value = Number(this.displayValue) || 0;
    const newVal = this.ensurePrecision(value);
    this.setCurrentValue(newVal);
    this.inputEvent.emit(this.data.currentValue);
    this.setCurrentValueToModelValue();
  };

  private handleKeydown = (event: KeyboardEvent | Event) => {
    const code = getEventCode(event as KeyboardEvent);
    const key = getEventKey(event as KeyboardEvent);

    if (this.disabledScientific && ['e', 'E'].includes(key)) {
      event.preventDefault();
      return;
    }

    switch(code) {
      case EVENT_CODE.up: {
        event.preventDefault();
        this.handleIncrease();
        break;
      }
      case EVENT_CODE.down: {
        event.preventDefault();
        this.handleDecrease();
        break;
      }
    }
  }

  private handleBlur = (event: CustomEvent<FocusEvent>) => {
    this.data = {
      ...this.data,
      userInput: null
    }
    if (this.data.currentValue === null && this.inputRef) {
      this.inputRef.value = '';
    }
    this.blurEvent.emit(event.detail);
    if (this.validateEvent) {
      this.formItemContext?.value.validate?.('blur').catch((error) => debugWarn(error));
    }
  }

  private handleFocus = (event: CustomEvent<FocusEvent>) => {
    this.focusEvent.emit(event.detail);
  }

  private handleInput = (event: CustomEvent<string>) => {
    this.data = {
      ...this.data,
      userInput: event.detail
    }
    const newVal = event.detail === '' ? null : Number(event.detail);
    this.inputEvent.emit(newVal);
    this.setCurrentValue(newVal, false);
  }

  private handleInputChange = (event: CustomEvent) => {
    const newVal = event.detail !== '' ? Number(event.detail) : '';
    if ((isNumber(newVal) && !Number.isNaN(newVal)) || newVal === '') {
      this.setCurrentValue(newVal);
    }
    this.setCurrentValueToModelValue();
    this.data = {
      ...this.data,
      userInput: null
    }
  }

  private handleWheel = (event: WheelEvent) => {
    if (event.target === document.activeElement) {
      event.preventDefault();
    }
  }

  componentWillLoad() {
    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);

    this.handleUpdateDisabled();
    this.handleUpdateSize();
    this.handleUpdateControlsAtRight();
    this.handleValueChange();

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

  componentDidLoad() {
    this.inputRef.getInput().then((input) => {
      input?.setAttribute('role', 'spinbutton');
      if (Number.isFinite(this.max)) {
        input.setAttribute('aria-valuemax', String(this.max));
      } else {
        input.removeAttribute('aria-valuemax');
      }
      if (Number.isFinite(this.min)) {
        input.setAttribute('aria-valuemin', String(this.min));
      } else {
        input.removeAttribute('aria-valuemin');
      }
      input.setAttribute(
        'aria-valuenow',
        this.data.currentValue || this.data.currentValue === 0
          ? String(this.data.currentValue)
          : ''
      );
      input.setAttribute('aria-disabled', String(this.inputNumberDisabled))
      if (!isNumber(this.value) && this.value != null) {
        let val: number | null = Number(this.value);
        if (Number.isNaN(val)) {
          val = null;
        }
        this.value = val;
      }

      input.addEventListener('wheel', this.handleWheel, { passive: false })
    });
  }

  componentDidUpdate() {
    this.inputRef.getInput().then((input) => {
      input.setAttribute('aria-valuenow', `${this.data.currentValue ?? ''}`);
    });
  }

  render() {
    const { t } = state.i18n;
    return (
      <div
        class={classNames(
          ns.b(),
          ns.m(this.inputNumberSize),
          ns.is("disabled", this.inputNumberDisabled),
          ns.is("without-controls", !this.controls),
          ns.is("controls-right", this.controlsAtRight),
          ns.is(this.align, !!this.align),
        )}
        onDragStart={(e) => e.preventDefault()}
      >
        {this.controls && (
          <span
            role="button"
            ariaLabel={t("inputNumber.decrease")}
            class={classNames(
              ns.e("decrease"),
              ns.is("disabled", this.minDisabled),
            )}
            onClick={this.handleDecrease}
          >
            <slot name="decrease-icon">
              <zane-icon name={this.controlsAtRight ? 'arrow-down-s-line' : 'subtract-line'}></zane-icon>
            </slot>
          </span>
        )}
        {this.controls && (
          <span
            role="button"
            ariaLabel={t("inputNumber.increase")}
            class={classNames(
              ns.e("increase"),
              ns.is("disabled", this.maxDisabled),
            )}
            onClick={this.handleIncrease}
          >
            <slot name="increase-icon">
              <zane-icon name={this.controlsAtRight ? 'arrow-up-s-line' : 'add-line'}></zane-icon>
            </slot>
          </span>
        )}
        <zane-input
          id={this.zId}
          ref={(el) => (this.inputRef = el)}
          type="number"
          step={this.step}
          value={this.displayValue}
          placeholder={this.placeholder}
          readonly={this.readonly}
          disabled={this.inputNumberDisabled}
          size={this.inputNumberSize}
          max={this.max}
          min={this.min}
          name={this.name}
          ariaLabel={this.ariaLabel}
          validateEvent={false}
          inputmode={this.zInputMode}
          onKeyDown={this.handleKeydown}
          onZBlur={this.handleBlur}
          onZFocus={this.handleFocus}
          onZInput={this.handleInput}
          onZChange={this.handleInputChange}
        ></zane-input>
      </div>
    );
  }
}
