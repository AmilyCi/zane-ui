import type { EventEmitter } from '../../stencil-public-runtime';
import type { ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';
import type { FormItemContext } from '../form/FormItemContext';
export declare class ZaneTag {
    clickEvent: EventEmitter<MouseEvent>;
    closeable: boolean;
    closeEvent: EventEmitter<MouseEvent>;
    color: string;
    effect: 'dark' | 'light' | 'plain';
    el: HTMLElement;
    hit: boolean;
    round: boolean;
    size: ComponentSize;
    type: 'danger' | 'info' | 'primary' | 'success' | 'warning';
    get formContext(): FormContext;
    get formItemContext(): FormItemContext;
    render(): any;
    private getTagSize;
    private handleClick;
    private handleClose;
}
