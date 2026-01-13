import type { DefaultProps, Instance } from './types';
export declare const ROUND_ARROW = "<svg width=\"16\" height=\"6\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z\"></svg>";
export declare const DATASET_PREFIX: string;
export declare const BOX_CLASS: string;
export declare const CONTENT_CLASS: string;
export declare const BACKDROP_CLASS: string;
export declare const ARROW_CLASS: string;
export declare const SVG_ARROW_CLASS: string;
export declare const TOUCH_OPTIONS: {
    capture: boolean;
    passive: boolean;
};
export declare const TIPPY_DEFAULT_APPEND_TO: () => HTMLElement;
export declare const mountedInstances: Instance[];
export declare const pluginProps: {
    animateFill: boolean;
    followCursor: boolean;
    inlinePositioning: boolean;
    sticky: boolean;
};
export declare const renderProps: {
    allowHTML: boolean;
    animation: string;
    arrow: boolean;
    content: string;
    inertia: boolean;
    maxWidth: number;
    role: string;
    theme: string;
    zIndex: number;
};
export declare const defaultProps: DefaultProps;
export declare const defaultKeys: string[];
