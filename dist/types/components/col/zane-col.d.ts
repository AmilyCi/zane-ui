import type { ColSize } from '../../types';
export declare class ZaneRow {
    el: HTMLElement;
    gutter: number;
    lg: ColSize;
    md: ColSize;
    offset: number;
    pull: number;
    push: number;
    sm: ColSize;
    span: number;
    xl: ColSize;
    xs: ColSize;
    get colKls(): string;
    get rowContext(): any;
    get style(): Record<string, string>;
    componentWillLoad(): void;
    render(): any;
}
