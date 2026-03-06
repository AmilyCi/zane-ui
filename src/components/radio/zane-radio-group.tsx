import {
  Component,
  Element,
  Event,
  h,
  Prop,
  Watch,
  type EventEmitter,
} from "@stencil/core";
import type { ComponentSize } from "../../types";
import type { RadioGroupContext, RadioOption, RadioOptionProp } from "./types";
import type { FormItemContext } from "../form/types";
import { debugWarn, nextFrame, ReactiveObject } from "../../utils";
import { radioDefaultProps, radioGroupContexts } from "./constants";
import { useNamespace } from "../../hooks";
import { getFormItemContext } from "../form/utils";
import { isEqual, omit } from "lodash-es";
import state from "../../global/store";

const ns = useNamespace("radio");

@Component({
  styleUrl: "zane-radio-group.scss",
  tag: "zane-radio-group",
})
export class ZaneRadioGroup {
  @Element() el: HTMLElement;

  @Prop({ attribute: "id", mutable: true }) zId: string = undefined;

  @Prop() size: ComponentSize = "";

  @Prop() disabled: boolean = undefined;

  @Prop({ mutable: true }) value: string | number | boolean = undefined;

  @Prop() fill: string = "";

  @Prop() textColor: string = "";

  @Prop() name: string = undefined;

  @Prop() validateEvent: boolean = true;

  @Prop() options: RadioOption[];

  @Prop() props: RadioOptionProp = { ...radioDefaultProps };

  @Prop() type: "radio" | "button" = "radio";

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @Event({ eventName: "zChange", bubbles: false })
  changeEvent: EventEmitter<
    string | number | boolean
  >;

  private formItemContext: ReactiveObject<FormItemContext>;

  private context: ReactiveObject<RadioGroupContext>;

  private radioGroupRef: HTMLDivElement;

  @Watch("name")
  @Watch("zId")
  handleIdChange() {
    this.context.value.name = this.name || this.zId;
  }

  @Watch("value")
  handleValueChange(newVal, oldVal) {
    if (this.validateEvent && !isEqual(newVal, oldVal)) {
      this.formItemContext?.value
        .validate("change")
        .catch((error) => debugWarn(error));
    }

    this.context.value.value = newVal;
  }

  private isLabeledByFormItem = () => {
    return !!(
      !(this.label || this.ariaLabel) &&
      this.formItemContext &&
      this.formItemContext?.value.inputIds &&
      this.formItemContext?.value.inputIds.length <= 1
    );
  };

  private handleChangeEvent = (val: string | number | boolean) => {
    this.value = val;
    nextFrame(() => {
      this.changeEvent.emit(val);
    });
  };

  componentWillLoad() {
    this.formItemContext = getFormItemContext(this.el);

    this.context = new ReactiveObject<RadioGroupContext>({
      value: this.value,
      name: this.name || this.zId,
      disabled: this.disabled,
      size: this.size,
      changeEvent: this.handleChangeEvent,
    });
    radioGroupContexts.set(this.el, this.context);

    if (!this.zId) {
      const id = state.idInjection.current++;
      const prefix = state.idInjection.prefix;
      this.zId = `${ns.namespace}-id-${prefix}-${id}`;
    }
  }

  componentDidLoad() {
    const radios = this.radioGroupRef?.querySelectorAll<HTMLInputElement>("[type=radio]");
    const firstLabel = radios[0];
    if (!Array.from(radios).some((radio) => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  }

  render() {
    const OptionComponent =
      this.type === "button" ? "zane-checkbox-button" : "zane-checkbox";

    const aliasProps = {
      ...radioDefaultProps,
      ...this.props,
    };

    const { label, value, disabled } = aliasProps;

    return (
      <div
        id={this.zId}
        class={ns.b("group")}
        role="radiogroup"
        ariaLabel={
          !this.isLabeledByFormItem()
            ? this.ariaLabel || "radio-group"
            : undefined
        }
        ariaLabelledby={
          this.isLabeledByFormItem()
            ? this.formItemContext?.value.labelId
            : undefined
        }
        ref={(el) => (this.radioGroupRef = el)}
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
                {...omit(option, [label, value, disabled])}
              />
            );
          })}
        </slot>
      </div>
    );
  }
}
