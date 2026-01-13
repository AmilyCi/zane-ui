export interface DeepCloneOptions {
    cloneAttributes?: boolean;
    cloneEvents?: boolean;
    cloneStyles?: boolean;
    deepCloneChildren?: boolean;
}
export declare function deepCloneElement<T extends HTMLElement>(element: T, options?: DeepCloneOptions): T;
