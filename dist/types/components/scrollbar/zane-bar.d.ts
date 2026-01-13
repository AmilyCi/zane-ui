import type { ScrollbarContext } from '../../interfaces/ScrollbarContext';
export declare class ZaneBar {
    always: boolean;
    el: HTMLElement;
    minSize: number;
    moveX: number;
    moveY: number;
    ratioX: number;
    ratioY: number;
    sizeHeight: string;
    sizeWidth: string;
    get scrollbarContext(): ScrollbarContext;
    handleScroll(wrap: HTMLDivElement): Promise<void>;
    render(): any;
    update(): Promise<void>;
}
