import type { Awaitable, CollapseActiveName, CollapseIconPositionType, CollapseModelValue } from '../../types';
import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZaneCollapse {
    accordion: boolean;
    activeNames: (number | string)[];
    beforeCollapse: (name: CollapseActiveName) => Awaitable<boolean>;
    el: HTMLElement;
    expandIconPosition: CollapseIconPositionType;
    value: CollapseModelValue;
    zaneChange: EventEmitter<(number | string)[] | number | string>;
    zaneUpdate: EventEmitter<(number | string)[] | number | string>;
    get rootKls(): string;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    handleChange: (name: CollapseActiveName) => void;
    handleItemClick: (name: CollapseActiveName) => Promise<void>;
    onModelValueChange(): void;
    render(): any;
    setActiveNames(_activeNames: CollapseActiveName[]): Promise<void>;
}
