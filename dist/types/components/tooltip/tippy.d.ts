import type { HideAll, Instance, Props, Targets } from './types';
export declare const hideAll: HideAll;
declare function tippy(targets: Targets, optionalProps?: Partial<Props>): Instance | Instance[];
declare namespace tippy {
    var defaultProps: import("./types").DefaultProps;
    var setDefaultProps: (partialProps: Partial<import("./types").DefaultProps>) => void;
    var currentInput: {
        isTouch: boolean;
    };
}
export default tippy;
