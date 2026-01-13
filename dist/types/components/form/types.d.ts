import type { RuleItem, ValidateFieldsError } from 'async-validator';
import type { Arrayable, FieldPath } from '../../types';
import type { formItemValidateStates } from './constants';
export type FormValidationResult = Promise<boolean>;
export type FormValidateCallback = (isValid: boolean, invalidFields?: ValidateFieldsError) => Promise<void> | void;
export type FormItemValidateState = (typeof formItemValidateStates)[number];
export interface FormItemRule extends RuleItem {
    trigger?: Arrayable<string>;
}
export type FormRules<T extends Record<string, any> | string = string> = Partial<Record<T extends string ? T : FieldPath<T>, Arrayable<FormItemRule>>>;
