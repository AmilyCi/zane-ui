import type { ComponentSize } from "../../types";

export type RadioProps = {
  label?: string | number | boolean;
  value?: string | number | boolean;
  size: ComponentSize;
  disabled?: boolean;
  name?: string;
  border?: boolean;
}

export type RadioOption = RadioProps & Record<string, any>;

export type RadioOptionProp = {
  value?: string
  label?: string
  disabled?: string
}

export type RadioGroupProps = {
  value?: string | number | boolean;
  name?: string;
  disabled?: boolean;
  size?: ComponentSize;
  onChange?: (val: string | number | boolean) => void;
}

export type RadioGroupContext =  {
  value: string | number | boolean;
  name?: string;
  disabled?: boolean;
  size?: ComponentSize;
  changeEvent: (val?: string | number | boolean) => void;
}
