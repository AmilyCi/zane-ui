import type { ComponentSize } from '../../types';

export interface FormContext {
  disabled: boolean;
  model: Record<string, any>;
  size: ComponentSize;
}
