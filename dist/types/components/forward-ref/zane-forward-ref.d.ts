import type { ForwardRefSetter } from '../../types';
export declare class ZaneForwardRef {
    el: HTMLElement;
    setForwardRef: ForwardRefSetter;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    render(): any;
}
