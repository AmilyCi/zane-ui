import type { ComponentSize } from '../../types';
import type {
  FormItemValidateState,
  FormValidateCallback,
  FormValidationResult,
} from './types';

export interface FormItemContext {
  size: ComponentSize;
  validate: (
    trigger: string,
    callback?: FormValidateCallback,
  ) => FormValidationResult;
  validateState: FormItemValidateState;
}
