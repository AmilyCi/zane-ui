import type { CollapseContext as ICollapseContext } from '../../interfaces';
import type { CollapseActiveName } from '../../types';
export declare class CollapseContext implements ICollapseContext {
    handleItemClick: (name: CollapseActiveName) => Promise<void>;
    get activeNames(): string[];
    private _activeNames;
    private _activeNamesChangeListeners;
    addActiveNamesChangeListener(listener: () => void): void;
    removeActiveNamesChangeListener(listener: () => void): void;
    updateActiveNames(activeNames: any): void;
}
