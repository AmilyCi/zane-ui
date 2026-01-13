import type { ButtonType, ComponentSize } from '../../types';

import { ButtonGroupContext as IButtonGroupContext } from '../../interfaces';

export class ButtonGroupContext implements IButtonGroupContext {
  get size() {
    return this._size;
  }

  get type() {
    return this._type;
  }

  private _size: ComponentSize;

  private _sizeChangeListeners: (() => void)[] = [];

  private _type: ButtonType;

  private _typeChangeListeners: (() => void)[] = [];

  addSizeChangeListener(listener: () => void) {
    this._sizeChangeListeners.push(listener);
  }

  addTypeChangeListener(listener: () => void) {
    this._typeChangeListeners.push(listener);
  }

  removeSizeChangeListener(listener: () => void) {
    const index = this._sizeChangeListeners?.indexOf(listener);
    if (index !== -1) {
      this._sizeChangeListeners?.splice(index, 1);
    }
  }

  removeTypeChangeListener(listener: () => void) {
    const index = this._typeChangeListeners?.indexOf(listener);
    if (index !== -1) {
      this._typeChangeListeners?.splice(index, 1);
    }
  }

  updateSize(size: ComponentSize) {
    this._size = size;
    this._sizeChangeListeners?.forEach((listener) => listener());
  }

  updateType(type: ButtonType) {
    this._type = type;
    this._typeChangeListeners?.forEach((listener) => listener());
  }
}
