import type { ButtonType, ComponentSize } from '../../types';
import { ButtonGroupContext as IButtonGroupContext } from '../../interfaces';
export declare class ButtonGroupContext implements IButtonGroupContext {
    get size(): "" | "small" | "default" | "large";
    get type(): "" | "info" | "default" | "success" | "primary" | "warning" | "danger";
    private _size;
    private _sizeChangeListeners;
    private _type;
    private _typeChangeListeners;
    addSizeChangeListener(listener: () => void): void;
    addTypeChangeListener(listener: () => void): void;
    removeSizeChangeListener(listener: () => void): void;
    removeTypeChangeListener(listener: () => void): void;
    updateSize(size: ComponentSize): void;
    updateType(type: ButtonType): void;
}
