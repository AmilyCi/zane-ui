export type Rule = RuleItem | RuleItem[];

export type Value = any;

export type Values = Record<string, Value>;

export type RuleType =
  | 'any'
  | 'array'
  | 'boolean'
  | 'date'
  | 'email'
  | 'enum'
  | 'float'
  | 'hex'
  | 'integer'
  | 'method'
  | 'number'
  | 'object'
  | 'pattern'
  | 'regexp'
  | 'string'
  | 'url';

export interface ValidateError {
  field?: string;
  fieldValue?: Value;
  message?: string;
}

export type SyncErrorType = Error | string;

export type SyncValidateResult = boolean | SyncErrorType | SyncErrorType[];

type ValidateMessage<T extends any[] = unknown[]> =
  | ((...args: T) => string)
  | string;

type FullField = string | undefined;

type EnumString = string | undefined;

type Pattern = RegExp | string | undefined;

type Range = number | undefined;

type Type = string | undefined;

export interface ValidateMessages {
  array?: {
    len?: ValidateMessage<[FullField, Range]>;
    max?: ValidateMessage<[FullField, Range]>;
    min?: ValidateMessage<[FullField, Range]>;
    range?: ValidateMessage<[FullField, Range, Range]>;
  };
  date?: {
    format?: ValidateMessage;
    invalid?: ValidateMessage;
    parse?: ValidateMessage;
  };
  default?: ValidateMessage;
  enum?: ValidateMessage<[FullField, EnumString]>;
  number?: {
    len?: ValidateMessage<[FullField, Range]>;
    max?: ValidateMessage<[FullField, Range]>;
    min?: ValidateMessage<[FullField, Range]>;
    range?: ValidateMessage<[FullField, Range, Range]>;
  };
  pattern?: {
    mismatch?: ValidateMessage<[FullField, Value, Pattern]>;
  };
  required?: ValidateMessage<[FullField]>;
  string?: {
    len?: ValidateMessage<[FullField, Range]>;
    max?: ValidateMessage<[FullField, Range]>;
    min?: ValidateMessage<[FullField, Range]>;
    range?: ValidateMessage<[FullField, Range, Range]>;
  };
  types?: {
    array?: ValidateMessage<[FullField, Type]>;
    boolean?: ValidateMessage<[FullField, Type]>;
    date?: ValidateMessage<[FullField, Type]>;
    email?: ValidateMessage<[FullField, Type]>;
    float?: ValidateMessage<[FullField, Type]>;
    hex?: ValidateMessage<[FullField, Type]>;
    integer?: ValidateMessage<[FullField, Type]>;
    method?: ValidateMessage<[FullField, Type]>;
    number?: ValidateMessage<[FullField, Type]>;
    object?: ValidateMessage<[FullField, Type]>;
    regexp?: ValidateMessage<[FullField, Type]>;
    string?: ValidateMessage<[FullField, Type]>;
    url?: ValidateMessage<[FullField, Type]>;
  };
  whitespace?: ValidateMessage<[FullField]>;
}

export interface ValidateOption {
  error?: (rule: InternalRuleItem, message: string) => ValidateError;
  first?: boolean;
  firstFields?: boolean | string[];
  /** The name of rules need to be trigger. Will validate all rules if leave empty */
  keys?: string[];
  messages?: Partial<ValidateMessages>;
  suppressValidatorError?: boolean;
  suppressWarning?: boolean;
}

export type ExecuteValidator = (
  rule: InternalRuleItem,
  value: Value,
  callback: (error?: string[]) => void,
  source: Values,
  options: ValidateOption,
) => void;

export interface InternalRuleItem extends Omit<RuleItem, 'validator'> {
  field?: string;
  fullField?: string;
  fullFields?: string[];
  validator?: ExecuteValidator | RuleItem['validator'];
}

export interface RuleItem {
  asyncValidator?: (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: Error | string) => void,
    source: Values,
    options: ValidateOption,
  ) => Promise<void> | void;
  defaultField?: Rule;
  enum?: Array<boolean | null | number | string | undefined>;
  fields?: Record<string, Rule>;
  len?: number;
  max?: number;
  message?: ((a?: string) => string) | string;
  min?: number;
  options?: ValidateOption;
  pattern?: RegExp | string;
  required?: boolean;
  transform?: (value: Value) => Value;
  type?: RuleType;
  validator?: (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: Error | string) => void,
    source: Values,
    options: ValidateOption,
  ) => SyncValidateResult | undefined;
  whitespace?: boolean;
}
