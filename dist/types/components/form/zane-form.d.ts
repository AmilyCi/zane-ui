import type { ComponentSize } from '../../types';
import type { FormRules } from './types';
export declare class ZaneForm {
    disabled: boolean;
    el: HTMLElement;
    hideRequiredAsterisk: boolean;
    inline: boolean;
    inlineMessage: boolean;
    labelPosition: 'left' | 'right' | 'top';
    labelSuffix: string;
    labelWidth: number | string;
    model: Record<string, any>;
    requireAsteriskPosition: 'left' | 'right';
    rules: FormRules;
    scrollIntoViewOptions: boolean | ScrollIntoViewOptions;
    scrollToError: boolean;
    showMessage: boolean;
    size: ComponentSize;
    statusIcon: boolean;
    validateOnRuleChange: boolean;
    render(): any;
}
