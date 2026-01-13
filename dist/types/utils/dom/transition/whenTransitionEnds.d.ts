import type { AnimationType } from '../../../types';
export declare function whenTransitionEnds(el: HTMLElement & {
    _endId?: number;
}, expectedType: AnimationType | undefined, explicitTimeout: null | number, resolve: () => void): void;
