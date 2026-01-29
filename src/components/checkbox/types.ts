import type { ComponentSize } from "../../types";

export type CheckboxValueType = string | number | boolean

export type CheckboxProps = {
  label?: string | boolean | number | Record<string, any>;
  value?: string | boolean | number | Record<string, any>;
  indeterminate: boolean;
  disabled?: boolean;
  checked: boolean;
  name?: string;
  trueValue?: string | number;
  falseValue?: string | number;
  trueLabel?: string | number;
  falseLabel?: string | number;
  id?: string;
  border: boolean;
  size: ComponentSize;
  tabIndex: string | number;
  validateEvent: boolean;
  ariaLabel: string;
  ariaControls: string;
};

export type CheckboxOptionProps = {
  value?: string
  label?: string
  disabled?: string
}

export type CheckboxOption = CheckboxProps & Record<string, any>

export type CheckboxGroupValueType = Exclude<CheckboxValueType, boolean>[]

export type CheckboxGroupContext = {
  value: any,
  disabled?: boolean,
  size?: ComponentSize,
  min?: number,
  max?: number,
  validateEvent?: boolean,
  fill: string,
  textColor: string,
  changeEvent: (value: CheckboxGroupValueType) => void;
}
