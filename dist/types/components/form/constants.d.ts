import type { FormContext } from './FormContext';
import type { FormItemContext } from './FormItemContext';
export declare const formItemValidateStates: readonly ["", "error", "validating", "success"];
export declare const formContexts: WeakMap<HTMLElement, FormContext>;
export declare const formItemContexts: WeakMap<HTMLElement, FormItemContext>;
