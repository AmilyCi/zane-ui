import type { ComponentSize } from "../../types";

export type ButtonConfig = {
  autoInsertSpace?: boolean;
  plain?: boolean;
  round?: boolean;
  text?: boolean;
  type?: string;
}

export type CardConfig = {
  shadow?: string;
}

export type ConfigProviderContext = {
  button?: ButtonConfig;
  card?: CardConfig;
  locale?: string;
  size?: ComponentSize;
  valueOnClear?: string | number | boolean | Function | null;
}
