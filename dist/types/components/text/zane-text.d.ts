import type { ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';
export declare class ZaneText {
    el: HTMLElement;
    lineClamp: string;
    size: ComponentSize;
    truncated: boolean;
    type: '' | 'danger' | 'info' | 'primary' | 'success' | 'warning';
    get formContext(): FormContext;
    get textSize(): "small" | "default" | "large";
    componentDidLoad(): void;
    componentDidUpdate(): void;
    render(): any;
    private bindTitle;
}
