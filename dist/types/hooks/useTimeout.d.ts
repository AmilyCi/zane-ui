import type { ComponentInterface } from '../stencil-public-runtime';
export declare function useTimeout(component: ComponentInterface): {
    cancelTimeout: () => void;
    registerTimeout: (fn: (...args: any[]) => any, delay: number) => void;
};
