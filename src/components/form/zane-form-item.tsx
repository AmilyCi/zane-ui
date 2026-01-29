import {
  Component,
  h,
  Prop,
  Element,
  State,
  Watch,
  Method,
} from "@stencil/core";
import type {
  FormContext,
  FormItemContext,
  FormItemProp,
  FormItemRule,
  FormItemValidateState,
  FormValidateCallback,
  FormValidateFailure,
} from "./types";
import type { Arrayable, ComponentSize } from "../../types";
import { formItemContexts } from "./constants";
import { useNamespace } from "../../hooks";
import type { ConfigProviderContext } from "../config-provider/types";
import { getFormContext, getFormItemContext } from "./utils";
import { getConfigProviderContext } from "../config-provider/utils";
import { get, set, clone, castArray } from "lodash-es";
import state from "../../global/store";
import { isFunction, nextFrame, ReactiveObject } from "../../utils";
import type { RuleItem } from "async-validator";
import AsyncValidator from "async-validator";
import classNames from "classnames";

const ns = useNamespace("form-item");

@Component({
  tag: "zane-form-item",
})
export class ZaneFormItem {
  @Element() el: HTMLElement;

  @Prop() label: string;

  @Prop() labelWidth: string | number;

  @Prop() labelPosition: "left" | "right" | "top" | "" = "";

  @Prop() prop: FormItemProp;

  @Prop() required: boolean = undefined;

  @Prop() rules: Arrayable<FormItemRule>;

  @Prop() error: string;

  @Prop() validateStatus: FormItemValidateState;

  @Prop() for: string;

  @Prop() inlineMessage: boolean;

  @Prop() showMessage: boolean;

  @Prop() size: ComponentSize;

  @State() labelId: string;

  @State() hasLabel = false;

  @State() labelFor: string | undefined;

  @State() inputIds: string[] = [];

  @State() isGroup: boolean;

  @State() fieldValue: any;

  @State() validateMessage: string = "";

  @State() validateState: FormItemValidateState = "";

  @State() validateEnabled: boolean;

  @State() propString: string;

  private formItemRef: HTMLDivElement;

  private formContext: ReactiveObject<FormContext>;

  private parentFormItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private context: ReactiveObject<FormItemContext>;

  private isResettingField = false;

  private initialValue: any = undefined;

  private getSize = () => {
    return (
      this.size ||
      this.parentFormItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      ""
    );
  };

  private addInputId = (id: string) => {
    if (!this.inputIds.includes(id)) {
      this.inputIds.push(id);
    }
  };

  private removeInputId = (id: string) => {
    this.inputIds = this.inputIds.filter((listId) => listId !== id);
  };

  @Method()
  async resetField() {
    const model = this.formContext?.value.model;
    if (!model || !this.prop) return;

    this.isResettingField = true;

    set(model, this.prop, clone(this.initialValue));

    nextFrame(() => {
      this.clearValidate();
    });

    this.isResettingField = false;
  }

  @Method()
  async clearValidate() {
    this.validateState = "";
    this.validateMessage = "";
    this.isResettingField = false;
  }

  private getFilteredRule = (trigger: string) => {
    const rules = this.getNormalizedRules();
    return (
      rules
        .filter((rule) => {
          if (!rule.trigger || !trigger) return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.includes(trigger);
          } else {
            return rule.trigger === trigger;
          }
        })
        // exclude trigger
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ trigger, ...rule }): RuleItem => rule)
    );
  };

  private onValidationSucceeded = () => {
    this.validateState = "success";
    this.formContext?.value.validateEvent?.emit({
      prop: this.prop!,
      isValid: true,
      message: "",
    });
  };

  private onValidationFailed = (error: FormValidateFailure) => {
    const { errors, fields } = error;
    if (!errors || !fields) {
      console.error(error);
    }

    this.validateState = "error";
    this.validateMessage = errors
      ? errors?.[0]?.message ?? `${this.prop} is required`
      : "";

    this.formContext?.value.validateEvent?.emit({
      prop: this.prop!,
      isValid: false,
      message: this.validateMessage,
    });
  };

  private doValidate = async (rules: RuleItem[]): Promise<true> => {
    const modelName = this.propString;
    const validator = new AsyncValidator({
      [modelName]: rules,
    });
    return validator
      .validate({ [modelName]: this.fieldValue }, { firstFields: true })
      .then(() => {
        this.onValidationSucceeded();
        return true as const;
      })
      .catch((err: FormValidateFailure) => {
        this.onValidationFailed(err);
        return Promise.reject(err);
      });
  };

  @Method()
  async validate(trigger: string, callback?: FormValidateCallback) {
    if (this.isResettingField || !this.prop) {
      return false;
    }

    const hasCallback = isFunction(callback);
    if (!this.validateEnabled) {
      callback?.(false);
      return false;
    }

    const rules = this.getFilteredRule(trigger);
    if (rules.length === 0) {
      callback?.(true);
      return true;
    }

    this.validateState = "validating";

    return this.doValidate(rules)
      .then(() => {
        callback?.(true);
        return true as const;
      })
      .catch((err: FormValidateFailure) => {
        const { fields } = err;
        callback?.(false, fields);
        return hasCallback ? false : Promise.reject(fields);
      });
  }

  private getNormalizedRules = () => {
    const rules: FormItemRule[] = [];

    if (this.rules) {
      rules.push(...castArray(this.rules));
    }

    const formRules = this.formContext?.value.rules;
    if (formRules && this.prop) {
      const _rules = get<Arrayable<FormItemRule> | undefined>(
        formRules,
        this.prop
      );
      if (_rules) {
        rules.push(...castArray(_rules));
      }
    }
    const required = this.required;

    if (required !== undefined) {
      const requiredRules = rules
        .map((rule, i) => [rule, i] as const)
        .filter(([rule]) => "required" in rule);

      if (requiredRules.length > 0) {
        for (const [rule, i] of requiredRules) {
          if (rule.required === required) continue;
          rules[i] = { ...rule, required };
        }
      } else {
        rules.push({ required });
      }
    }

    return rules;
  };

  private isRequired() {
    return this.getNormalizedRules().some((rule) => rule.required);
  }

  componentWillLoad() {
    this.formContext = getFormContext(this.el);
    this.parentFormItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);

    const id = state.idInjection.current++;
    this.labelId = `${ns.namespace}-id-${state.idInjection.prefix}-${id}`;

    this.hasLabel = !!(this.label || this.el.querySelector('[slot="label"]'));
    this.labelFor =
      this.for ?? (this.inputIds.length === 1 ? this.inputIds[0] : undefined);
    this.isGroup = !this.labelFor && this.hasLabel;
    this.fieldValue = get(this.formContext?.value.model, this.prop);
    this.validateEnabled = this.getNormalizedRules().length > 0;
    this.propString = this.prop
      ? Array.isArray(this.prop)
        ? (this.prop as string[]).join(".")
        : (this.prop as string)
      : "";

    this.context = new ReactiveObject<FormItemContext>({
      formItemRef: this.formItemRef,
      label: this.label,
      labelWidth: this.labelWidth,
      labelPosition: this.labelPosition,
      prop: this.prop,
      required: this.required,
      rules: this.rules,
      error: this.error,
      validateStatus: this.validateStatus,
      for: this.for,
      inlineMessage: this.inlineMessage,
      showMessage: this.showMessage,
      size: this.getSize(),
      validateMessage: this.validateMessage,
      validateState: this.validateState,
      isGroup: this.isGroup,
      labelId: this.labelId,
      inputIds: [],
      hasLabel: this.hasLabel,
      fieldValue: this.fieldValue,
      propString: this.propString,
      addInputId: this.addInputId,
      removeInputId: this.removeInputId,
      validate: this.validate,
      resetField: this.resetField,
      clearValidate: this.clearValidate,
    });
    formItemContexts.set(this.el, this.context);
  }

  componentDidLoad() {
    if (this.prop) {
      this.formContext?.value.addField(this.context);
      this.initialValue = clone(this.fieldValue);
    }
  }

  disconnectedCallback() {
    formItemContexts.delete(this.el);
  }

  @Watch("error", { immediate: true })
  handleErrorChange(val: string) {
    this.validateMessage = val || "";
    this.validateState = val ? "error" : "";
  }

  @Watch("validateStatus")
  handleValidateStatusChange(val: FormItemValidateState) {
    this.validateState = val || "";
  }

  render() {
    const formItemClasses = classNames(
      ns.b(),
      ns.m(this.getSize()),
      ns.is("error", this.validateState === "error"),
      ns.is("validating", this.validateState === "validating"),
      ns.is("success", this.validateState === "success"),
      ns.is("required", this.isRequired() || this.required),
      ns.is("no-asterisk", this.formContext?.value.hideRequiredAsterisk),
      this.formContext?.value.requireAsteriskPosition === "right"
        ? "asterisk-right"
        : "asterisk-left",
      {
        [ns.m("feedback")]: this.formContext?.value.statusIcon,
        [ns.m(`label-${this.labelPosition}`)]: this.labelPosition,
      }
    );
    return (
      <div
        ref={(el) => (this.formItemRef = el)}
        class={formItemClasses}
        role={this.isGroup ? "group" : undefined}
        ariaLabelledby={this.isGroup ? this.labelId : undefined}
      ></div>
    );
  }
}
