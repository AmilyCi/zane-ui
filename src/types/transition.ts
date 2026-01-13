import type { TRANSITION } from '../constants';

export type TransitionHooks = {
  onAfterAppear?: (el: HTMLElement) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onAfterLeave?: (el: HTMLElement) => void;
  onAppear?: (el: HTMLElement, done: () => void) => void;
  onAppearCancelled?: (el: HTMLElement) => void;
  // appear
  onBeforeAppear?: (el: HTMLElement) => void;
  // Hooks. Using camel case for easier usage in render functions & JSX.
  // In templates these can be written as @before-enter="xxx" as prop names
  // are camelized.
  onBeforeEnter?: (el: HTMLElement) => void;
  // leave
  onBeforeLeave?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement, done: () => void) => void;
  onEnterCancelled?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement, done: () => void) => void;
  onLeaveCancelled?: (el: HTMLElement) => void; // only fired in persisted mode
};

export type StylePropertiesKey =
  | `${AnimationType}${AnimationProperties}`
  | `${typeof TRANSITION}Property`;

export type AnimationProperties = 'Delay' | 'Duration';

export type AnimationType = 'animation' | 'transition';

// in-out：新元素先进入，当前元素再离开
// out-in：当前元素先离开，新元素再进入
// default：同时进行
export type TransitionMode = 'default' | 'in-out' | 'out-in';

export type CSSTransitionInfo = {
  hasTransform: boolean;
  propCount: number;
  timeout: number;
  type: AnimationType | null;
};

export type PendingCallback = (cancelled?: boolean) => void;
