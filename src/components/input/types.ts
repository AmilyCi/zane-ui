export type InputModelModifiers = {
  lazy?: boolean;
  number?: boolean;
  trim?: boolean;
}

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean;

export type InputType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | (string | NonNullable<unknown>)

export type InputMode = 
  | "decimal"
  | "email"
  | "none"
  | "numeric"
  | "search"
  | "tel"
  | "text"
  | "url";
