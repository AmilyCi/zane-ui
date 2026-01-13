import type { Instance, PopperElement, Props } from '../types';
export declare function render(instance: Instance): {
    onUpdate?: (prevProps: Props, nextProps: Props) => void;
    popper: PopperElement;
};
export declare namespace render {
    var $$tippy: boolean;
}
