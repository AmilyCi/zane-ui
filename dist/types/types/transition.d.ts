import type { TRANSITION } from '../constants';
export type TransitionHooks = {
    onAfterAppear?: (el: HTMLElement) => void;
    onAfterEnter?: (el: HTMLElement) => void;
    onAfterLeave?: (el: HTMLElement) => void;
    onAppear?: (el: HTMLElement, done: () => void) => void;
    onAppearCancelled?: (el: HTMLElement) => void;
    onBeforeAppear?: (el: HTMLElement) => void;
    onBeforeEnter?: (el: HTMLElement) => void;
    onBeforeLeave?: (el: HTMLElement) => void;
    onEnter?: (el: HTMLElement, done: () => void) => void;
    onEnterCancelled?: (el: HTMLElement) => void;
    onLeave?: (el: HTMLElement, done: () => void) => void;
    onLeaveCancelled?: (el: HTMLElement) => void;
};
export type StylePropertiesKey = `${AnimationType}${AnimationProperties}` | `${typeof TRANSITION}Property`;
export type AnimationProperties = 'Delay' | 'Duration';
export type AnimationType = 'animation' | 'transition';
export type TransitionMode = 'default' | 'in-out' | 'out-in';
export type CSSTransitionInfo = {
    hasTransform: boolean;
    propCount: number;
    timeout: number;
    type: AnimationType | null;
};
export type PendingCallback = (cancelled?: boolean) => void;
