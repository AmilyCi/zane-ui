import type { RowAlignType, RowJustifyType } from '../../types';
export declare class ZaneRow {
    align?: RowAlignType;
    el: HTMLElement;
    gutter: number;
    justify: RowJustifyType;
    get rowKls(): string;
    get style(): Record<string, string>;
    componentWillLoad(): void;
    render(): any;
}
