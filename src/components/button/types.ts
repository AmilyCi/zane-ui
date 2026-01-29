import type { ComponentSize } from "../../types";
import type { buttonNativeTypes, buttonTypes } from "./constants";

export type ButtonType = (typeof buttonTypes)[number];

export type ButtonNativeType = (typeof buttonNativeTypes)[number];

export interface ButtonGroupContext {
  size?: ComponentSize
  type?: ButtonType
  disabled?: boolean
}
