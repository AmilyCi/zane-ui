import {
  Component,
  Element,
  Prop,
  h,
  Event,
  type EventEmitter,
  State,
  Watch,
} from "@stencil/core";
import type { ComponentSize } from "../../types";
import { useNamespace } from "../../hooks";
import classNames from "classnames";
import type { RadioGroupContext } from "./types";
import { nextFrame, type ReactiveObject } from "../../utils";
import type { FormContext, FormItemContext } from "../form/types";
import type { ConfigProviderContext } from "../config-provider/types";
import { getFormContext, getFormItemContext } from "../form/utils";
import { getConfigProviderContext } from "../config-provider/utils";
import { getRadioGroupContext } from "./utils";
import { isPropAbsent } from "../../utils/is/isPropAbsent";

const ns = useNamespace("radio");

@Component({
  styleUrl: "zane-radio.scss",
  tag: "zane-radio",
})
export class ZaneRadio {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) value: string | number | boolean = undefined;

  @Prop() size: ComponentSize = "";

  @Prop() disabled: boolean = undefined;

  @Prop() label: string | number | boolean;

  @Prop({mutable: true}) name: string = undefined;

  @Prop() border: boolean = undefined;

  @Event({ eventName: "zChange" }) changeEvent: EventEmitter<
    string | number | boolean | undefined
  >;

  @State() actualDisabled: boolean = this.disabled;

  @State() actualSize: string = this.size;

  @State() actualValue: string | number | boolean | undefined;

  @State() focus: boolean = false;

  @State() modelValue: string | number | boolean | undefined;

  private radioRef: HTMLInputElement;

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private radioGroupContext: ReactiveObject<RadioGroupContext>;

  @Watch("value")
  @Watch("label")
  handleValueChange() {
    this.actualValue = !isPropAbsent(this.value) ? this.value : this.label;
  }

  @Watch("disabled")
  handleDisabledChange() {
    this.actualDisabled =
      this.disabled ??
      this.radioGroupContext?.value.disabled ??
      this.formContext?.value.disabled ??
      false;
  }

  @Watch("size")
  handleSizeChange() {
    this.actualSize =
      this.size ||
      this.radioGroupContext?.value.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }

  @Watch("modelValue")
  @Watch("actualValue")
  handleModelValueChange() {
    if (this.radioRef) {
      this.radioRef.checked = this.modelValue === this.actualValue;
    }
  }

  private handleChange = () => {
    if (this.radioGroupContext) {
      this.radioGroupContext.value.changeEvent(this.actualValue);
    }
    this.radioRef.checked = this.modelValue === this.actualValue;
    nextFrame(() => {
      this.changeEvent.emit(this.actualValue);
    });
  };

  componentWillLoad() {
    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);
    this.radioGroupContext = getRadioGroupContext(this.el);

    this.handleDisabledChange();
    this.handleSizeChange();
    this.handleValueChange();

    this.name = this.name ?? this.radioGroupContext?.value.name;

    this.formContext?.change$.subscribe(({ key }) => {
      if (key === "disabled") {
        this.handleDisabledChange();
      }
      if (key === "size") {
        this.handleSizeChange();
      }
    });

    this.formItemContext?.change$.subscribe(({ key }) => {
      if (key === "size") {
        this.handleSizeChange();
      }
    });

    this.radioGroupContext?.change$.subscribe(({ key, value }) => {
      if (key === "disabled") {
        this.handleDisabledChange();
      }
      if (key === "size") {
        this.handleSizeChange();
      }
      if (key === "value") {
        this.modelValue = value;
      }
      if (key === "name") {
        this.name = value;
      }
    });

    this.configProviderContext?.change$.subscribe(({ key }) => {
      if (key === "size") {
        this.handleSizeChange();
      }
    });
  }

  render() {
    return (
      <label
        class={classNames(
          ns.b(),
          ns.is("disabled", this.actualDisabled),
          ns.is("focus", this.focus),
          ns.is("bordered", this.border),
          ns.is("checked", this.modelValue === this.actualValue),
          ns.m(this.actualSize)
        )}
      >
        <span
          class={classNames(
            ns.e("input"),
            ns.is("disabled", this.actualDisabled),
            ns.is("checked", this.modelValue === this.actualValue)
          )}
        >
          <input
            type="radio"
            value={this.actualValue as any}
            ref={(el) => (this.radioRef = el)}
            class={ns.e("original")}
            name={this.name}
            disabled={this.actualDisabled}
            checked={this.modelValue === this.actualValue}
            onFocus={() => (this.focus = true)}
            onBlur={() => (this.focus = false)}
            onChange={this.handleChange}
            onClick={(e) => e.stopPropagation()}
          />
          <span class={ns.e("inner")}></span>
        </span>
        <span class={ns.e("label")} onKeyDown={(e) => e.stopPropagation()}>
          <slot>{this.label}</slot>
        </span>
      </label>
    );
  }
}
