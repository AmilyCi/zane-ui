import type { ButtonType, ComponentSize } from '../types';
export interface ButtonGroupContext {
    addSizeChangeListener(listener: () => void): void;
    addTypeChangeListener(listener: () => void): void;
    removeSizeChangeListener(listener: () => void): void;
    removeTypeChangeListener(listener: () => void): void;
    readonly size?: ComponentSize;
    readonly type?: ButtonType;
    updateSize(size: ComponentSize): void;
    updateType(type: ButtonType): void;
}
