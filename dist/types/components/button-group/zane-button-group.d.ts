import type { ButtonType, ComponentSize } from '../../types';
export declare class ZaneButtonGroup {
    el: HTMLElement;
    size: ComponentSize;
    type: ButtonType;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    handleWatchSize(): void;
    handleWatchType(): void;
    render(): any;
}
