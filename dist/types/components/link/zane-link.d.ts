import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZaneLink {
    clickEvent: EventEmitter<MouseEvent>;
    disabled: boolean;
    el: HTMLElement;
    href: string;
    icon: string;
    target: '_blank' | '_parent' | '_self' | '_top' | string;
    type: 'danger' | 'default' | 'info' | 'primary' | 'success' | 'warning';
    underline: 'always' | 'hover' | 'never' | boolean;
    render(): any;
    private handleClick;
}
