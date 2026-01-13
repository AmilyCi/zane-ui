import type { CollapseContext as ICollapseContext } from '../../interfaces';
import type { CollapseActiveName } from '../../types';

export class CollapseContext implements ICollapseContext {
  public handleItemClick: (name: CollapseActiveName) => Promise<void>;

  get activeNames() {
    return this._activeNames;
  }

  private _activeNames: string[] = [];

  private _activeNamesChangeListeners: (() => void)[] = [];

  addActiveNamesChangeListener(listener: () => void): void {
    this._activeNamesChangeListeners.push(listener);
  }

  removeActiveNamesChangeListener(listener: () => void): void {
    const index = this._activeNamesChangeListeners.indexOf(listener);
    if (index !== -1) {
      this._activeNamesChangeListeners.splice(index, 1);
    }
  }

  updateActiveNames(activeNames: any): void {
    this._activeNames = activeNames;
    this._activeNamesChangeListeners.forEach((callback) => callback());
  }
}
