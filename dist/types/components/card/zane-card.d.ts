export declare class ZaneCard {
    bodyClass: string;
    bodyStyle: Record<string, string>;
    el: HTMLElement;
    footer: string;
    footerClass: string;
    hasFooterContent: boolean;
    hasHeaderContent: boolean;
    header: string;
    headerClass: string;
    shadow?: 'always' | 'hover' | 'never';
    checkSlotContent(): void;
    componentWillLoad(): void;
    render(): any;
}
