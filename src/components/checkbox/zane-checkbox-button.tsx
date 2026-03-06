import {
  Component,
  h,
  Element,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
} from "@stencil/core";
import { useNamespace } from "../../hooks";
import classNames from "classnames";
import type { FormContext, FormItemContext } from "../form/types";
import type { CheckboxGroupContext } from "./types";
import type { ComponentSize } from "../../types";
import type { ConfigProviderContext } from "../config-provider/types";
import { getFormContext, getFormItemContext } from "../form/utils";
import { getCheckboxGroupContext } from "./utils";
import { getConfigProviderContext } from "../config-provider/utils";
import { isBoolean, type ReactiveObject } from "../../utils";
import { isPropAbsent } from "../../utils/is/isPropAbsent";

const ns = useNamespace("checkbox");

@Component({
  styleUrl: "zane-checkbox-button.scss",
  tag: "zane-checkbox-button",
})
export class ZaneCheckboxButton {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) value:
    | number
    | string
    | boolean;

  @Prop() label: any;

  @Prop() indeterminate: boolean;

  @Prop() disabled: boolean = undefined;

  @Prop() checked: boolean;

  @Prop() name: string;

  @Prop() trueValue: string | number = undefined;

  @Prop() falseValue: string | number = undefined;

  @Prop() trueLabel: string | number = undefined;

  @Prop() falseLabel: string | number = undefined;

  @Prop({ attribute: "id", mutable: true }) zId: string;

  @Prop() border: boolean;

  @Prop() size: ComponentSize;

  @Prop({ attribute: "tabindex" }) zTabIndex: number;

  @Prop() validateEvent: boolean = true;

  @Prop() ariaLabel: string;

  @Prop() ariaControls: string;

  @Event({ eventName: "zChange", bubbles: false })
  changeEvent: EventEmitter<any>;

  @State() isFocused: boolean = false;

  @State() actualValue: string | number | boolean;

  @State() checkboxButtonSize: ComponentSize;

  @State() isDisabled: boolean;

  @State() isChecked: boolean;

  @State() isLimitDisabled: boolean;

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private checkboxGroupContext: ReactiveObject<CheckboxGroupContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private hasDefaultSlot = false;

  @Watch('isLimitDisabled')
  handleIsLimitDisabledChange() {
    this.updateIsDisabled();
  }

  @Watch('value')
  @Watch('label')
  handleValueOrLabelChange() {
    this.updateActualValue();
  }

  @Watch('actualValue')
  handleActualValueChange() {
    this.updateIsChecked();
  }

  private updateActualValue() {
    this.actualValue = !isPropAbsent(this.value) ? this.value : this.label;
  };

  private updateCheckboxButtonSize = () => {
    this.checkboxButtonSize = this.checkboxGroupContext?.value.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }

  private updateIsDisabled() {
    if (this.disabled !== undefined) {
      this.isDisabled = this.disabled;
    } else {
      const limitDisabled = this.isLimitDisabled;
      if (!this.checkboxGroupContext) {
        this.isDisabled = this.formContext?.value.disabled ?? limitDisabled;
      } else {
        this.isDisabled =
          this.checkboxGroupContext?.value.disabled || limitDisabled;
      }
    }
  };

  private updateIsChecked() {
    const value = this.checkboxGroupContext?.value?.value ?? this.value;
    if (isBoolean(value)) {
      this.isChecked = value;
    } else if (Array.isArray(value)) {
      this.isChecked = value.includes(this.actualValue);
    } else if (value !== null && value !== undefined) {
      this.isChecked = value === this.trueValue || value === this.trueLabel;
    } else {
      this.isChecked = !!value;
    }
  };

  private updateIsLimitDisabled() {
    const max = this.checkboxGroupContext?.value.max;
    const min = this.checkboxGroupContext?.value.min;
    const checked = this.isChecked;
    this.isLimitDisabled = (
      (max !== undefined &&
        this.checkboxGroupContext?.value?.value.length >= max &&
        !checked) ||
      (min !== undefined &&
        this.checkboxGroupContext?.value?.value.length <= min &&
        checked)
    );
  };

  private getInputBindings = () => {
    if (
      this.trueValue ||
      this.falseValue ||
      this.trueLabel ||
      this.falseLabel
    ) {
      return {
        trueValue: this.trueValue ?? this.trueLabel ?? true,
        falseValue: this.falseValue ?? this.falseLabel ?? false,
      }
    }
    return {
      trueValue: this.actualValue,
    }
  }

  private getLabeledValue = (value: string | number | boolean) => {
    return [true, this.trueValue, this.trueLabel].includes(value)
      ? this.trueValue ?? this.trueLabel ?? true
      : this.falseValue ?? this.falseLabel ?? false;
  };

  private handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const v = this.getLabeledValue(target.checked);
    if (this.checkboxGroupContext) {
      const value = [...this.checkboxGroupContext.value.value];
      const aVal = this.actualValue;
      const index = value.indexOf(aVal);
      if (target.checked) {
        if (index === -1) {
          value.push(aVal)
        }
      } else {
        if (index > -1) {
          value.splice(index, 1)
        }
      }
      this.checkboxGroupContext.value.changeEvent(value);
    } else {
      this.value = v;
    }
    this.changeEvent.emit(v);
  };

  componentWillLoad() {
    this.configProviderContext = getConfigProviderContext(this.el);
    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.checkboxGroupContext = getCheckboxGroupContext(this.el);
    this.hasDefaultSlot = Array.from(this.el.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim().length > 0;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return true;
      }
      return false;
    });

    this.updateCheckboxButtonSize();
    this.updateActualValue();
    this.updateIsChecked();
    this.updateIsLimitDisabled();
    this.updateIsDisabled();

    this.checkboxGroupContext?.change$.subscribe((change) => {
      if (change.key === "value") {
        this.updateIsChecked();
        this.updateIsLimitDisabled();
      }
      if (change.key === 'size') {
        this.updateCheckboxButtonSize();
      }
      if (change.key === 'max' || change.key === 'min') {
        this.updateIsLimitDisabled();
      }
    })
  }

  render() {
    const labelKls = classNames(
      ns.b('button'),
      ns.bm("button", this.checkboxButtonSize),
      ns.is("disabled", this.isDisabled),
      ns.is("checked", this.isChecked),
      ns.is("focus", this.isFocused)
    );
    const fillValue = this.checkboxGroupContext?.value.fill ?? "";
    const activeStyle = {
      backgroundColor: fillValue,
      borderColor: fillValue,
      color: this.checkboxGroupContext?.value.textColor ?? "",
      boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : undefined,
    };

    return (
      <label class={labelKls}>
        <input
          type="checkbox"
          class={ns.be("button", "original")}
          name={this.name}
          tabIndex={this.zTabIndex}
          disabled={this.isDisabled}
          onChange={this.handleChange}
          onFocus={() => (this.isFocused = true)}
          onBlur={() => (this.isFocused = false)}
          onClick={(e) => e.stopPropagation()}
          {...this.getInputBindings()}
        />
        {(this.hasDefaultSlot || this.label) && (
          <span
            class={ns.be("button", "inner")}
            style={this.isChecked ? activeStyle : undefined}
          >
            <slot>{this.label}</slot>
          </span>
        )}
      </label>
    );
  }
}
