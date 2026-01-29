import {
  Component,
  Event,
  h,
  Prop,
  Element,
  type EventEmitter,
  Watch,
  State,
} from "@stencil/core";
import type { ComponentSize } from "../../types";
import type {
  CheckboxGroupContext,
  CheckboxGroupValueType,
  CheckboxOption,
  CheckboxOptionProps,
} from "./types";
import type { FormItemContext } from "../form/types";
import { getFormItemContext } from "../form/utils";
import { checkboxDefaultProps, checkboxGroupContexts } from "./constants";
import { isEqual, omit } from "lodash-es";
import { arrayify } from "@zanejs/utils";
import { debugWarn, nextFrame, ReactiveObject } from "../../utils";
import { useNamespace } from "../../hooks";
import state from "../../global/store";

const ns = useNamespace("checkbox");

@Component({
  styleUrl: "zane-checkbox-group.scss",
  tag: "zane-checkbox-group",
})
export class ZaneCheckboxGroup {
  @Element() el: HTMLElement;

  @Prop({ attribute: "id", mutable: true }) zId: string;

  @Prop({ mutable: true }) value: (string | number)[] = [];

  @Prop() disabled: boolean = undefined;

  @Prop() min: number = undefined;

  @Prop() max: number = undefined;

  @Prop() size: ComponentSize;

  @Prop() fill: string;

  @Prop() textColor: string;

  @Prop() tag: string = "div";

  @Prop() validateEvent: boolean = true;

  @Prop() options: CheckboxOption[];

  @Prop() props: CheckboxOptionProps = {
    label: "label",
    value: "value",
    disabled: "disabled",
  };

  @Prop() type: "checkbox" | "button" = "checkbox";

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @Event({ eventName: "zChange" }) changeEvent: EventEmitter;

  @State() isLimitExceeded: boolean = false;

  private formItemContext: ReactiveObject<FormItemContext>;

  private context: ReactiveObject<CheckboxGroupContext>;

  @Watch("value")
  onValueChange(newValue: (string | number)[], oldValue: (string | number)[]) {
    if (this.validateEvent && !isEqual(newValue, oldValue)) {
      this.formItemContext?.value.validate("change").catch((err) => debugWarn(err));
    }
    this.context.value.value = newValue;
    nextFrame(() => {
      this.changeEvent.emit(newValue);
    });
  }

  @Watch("zId", { immediate: true })
  onIdChange(newId: string, oldId: string) {
    if (newId !== oldId) {
      if (this.formItemContext?.value.removeInputId && !this.inLabel()) {
        oldId && this.formItemContext?.value.removeInputId(oldId);
        if (newId) {
          this.formItemContext?.value.addInputId(newId);
        }
      }
    }
  }

  private inLabel = () => {
    let parent = this.el.parentElement;
    while (parent) {
      if (parent.tagName === "ZANE-FORM-ITEM") {
        return false;
      }
      if (parent.tagName === "ZANE-FORM-LABEL-WRAP") {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  };

  private isLabeledByFormItem = () => {
    return !!(
      !(this.label || this.ariaLabel) &&
      this.formItemContext &&
      this.formItemContext?.value.inputIds &&
      this.formItemContext?.value.inputIds.length <= 1
    );
  };

  private onChange = async (value: CheckboxGroupValueType) => {
    this.isLimitExceeded = this.max !== undefined && value.length > this.max;
    if (this.isLimitExceeded === false) {
      this.value = value;
    }
  };

  componentWillLoad() {
    this.formItemContext = getFormItemContext(this.el);

    if (!this.zId) {
      const id = state.idInjection.current++;
      const prefix = state.idInjection.prefix;
      this.zId = `${ns.namespace}-id-${prefix}-${id}`;
    }

    const value = arrayify(this.value);

    this.context = new ReactiveObject<CheckboxGroupContext>({
      size: this.size,
      min: this.min,
      max: this.max,
      value,
      disabled: this.disabled,
      fill: this.fill,
      textColor: this.textColor,
      changeEvent: this.onChange,
    });
    checkboxGroupContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    checkboxGroupContexts.delete(this.el);
  }

  render() {
    const Tag = this.tag;
    const OptionComponent =
      this.type === "button" ? "zane-checkbox-button" : "zane-checkbox";

    const aliasProps = {
      ...checkboxDefaultProps,
      ...this.props,
    }

    const { label, value, disabled } = aliasProps;
    return (
      <Tag
        id={this.zId}
        class={ns.b("group")}
        role="group"
        ariaLabel={
          !this.isLabeledByFormItem()
            ? this.ariaLabel || "checkbox-group"
            : undefined
        }
        ariaLabelledby={
          this.isLabeledByFormItem() ? this.formItemContext?.value.labelId : undefined
        }
      >
        <slot>
          {this.options?.map((option, index) => {
            return (
              <OptionComponent
                key={index}
                size={this.size}
                validateEvent={this.validateEvent}
                label={option[label]}
                value={option[value]}
                disabled={option[disabled]}
                {
                  ...omit(option, [label, value, disabled])
                }
              />
            );
          })}
        </slot>
      </Tag>
    );
  }
}
