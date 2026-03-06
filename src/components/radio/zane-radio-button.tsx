import { Component, Element, Event, h, Prop, State, Watch, type EventEmitter } from "@stencil/core";
import type { ComponentSize } from "../../types";
import { useNamespace } from "../../hooks";
import { nextFrame, type ReactiveObject } from "../../utils";
import type { FormContext, FormItemContext } from "../form/types";
import type { ConfigProviderContext } from "../config-provider/types";
import type { RadioGroupContext } from "./types";
import { getFormContext, getFormItemContext } from "../form/utils";
import { getConfigProviderContext } from "../config-provider/utils";
import { getRadioGroupContext } from "./utils";
import { isPropAbsent } from "../../utils/is/isPropAbsent";
import classNames from "classnames";

const ns = useNamespace('radio')

@Component({
  styleUrl: "zane-radio-button.scss",
  tag: "zane-radio-button",
})
export class ZaneRadio {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) value: string | number | boolean = undefined;

  @Prop() size: ComponentSize = "";

  @Prop() disabled: boolean = undefined;

  @Prop() label: string | number | boolean;

  @Prop({ mutable: true }) name: string = undefined;

  @Prop() border: boolean = undefined;

  @Event({ eventName: "zChange", bubbles: false })
  changeEvent: EventEmitter<
    string | number | boolean | undefined
  >;

  @State() actualDisabled: boolean = this.disabled;

  @State() actualSize: string = this.size;

  @State() actualValue: string | number | boolean | undefined;

  @State() modelValue: string | number | boolean | undefined;

  @State() focus: boolean = false;

  @State() fill: boolean;

  @State() textColor: string;

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
  }

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

    const activeStyle: any = {
      backgroundColor: this.fill || '',
      borderColor: this.fill || '',
      boxShadow: this.fill ? `-1px 0 0 0 ${this.fill}` : '',
      color: this.textColor || '',
    };

    return (
      <label
        class={classNames(
          ns.b('button'),
          ns.is('active', this.modelValue === this.actualValue),
          ns.is('disabled', this.actualDisabled),
          ns.is('focus', this.focus),
          ns.bm('button', this.actualSize),
        )}
      >
        <input
          ref={(el) => (this.radioRef = el)}
          class={ns.be('button', 'original-radio')}
          type="radio"
          value={this.actualValue as any}
          name={this.name}
          disabled={this.actualDisabled}
          onFocus={() => this.focus = true}
          onBlur={() => this.focus = false}
          onClick={(e) => e.stopPropagation()}
          onChange={this.handleChange}
        />
        <span
          class={ns.be('button', 'inner')}
          style={this.modelValue === this.actualValue ? activeStyle : {}}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <slot>
            {this.label}
          </slot>
        </span>
      </label>
    );
  }
}
