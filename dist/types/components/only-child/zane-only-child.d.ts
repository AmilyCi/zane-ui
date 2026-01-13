export declare class OnlyChild {
    /**
     * 是否启用调试模式，启用后会输出警告信息
     */
    debug: boolean;
    el: HTMLElement;
    /**
     * 是否启用严格模式，启用后如果有多个有效子节点会抛出错误
     */
    strict: boolean;
    private get forwardRefContext();
    componentDidLoad(): void;
    componentDidUpdate(): void;
    render(): any;
    private findFirstLegitChild;
    private processChildren;
    /**
     * 包装文本内容
     */
    private wrapTextContent;
}
