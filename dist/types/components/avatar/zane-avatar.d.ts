import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZaneAvatar {
    alt: string;
    el: HTMLElement;
    fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    hasLoadError: boolean;
    icon: string;
    imgError: EventEmitter<Event>;
    shape: 'circle' | 'square';
    size: 'default' | 'large' | 'small' | number;
    src: string;
    srcSet: string;
    get avatarClass(): string;
    get fitStyle(): {
        objectFit: "none" | "fill" | "contain" | "cover" | "scale-down";
    };
    get sizeStyle(): Record<string, string>;
    handleError(e: Event): void;
    render(): any;
    watchSrcHandler(): void;
    private renderContent;
}
