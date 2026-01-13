export class CollapseContext {
    constructor() {
        this._activeNames = [];
        this._activeNamesChangeListeners = [];
    }
    get activeNames() {
        return this._activeNames;
    }
    addActiveNamesChangeListener(listener) {
        this._activeNamesChangeListeners.push(listener);
    }
    removeActiveNamesChangeListener(listener) {
        const index = this._activeNamesChangeListeners.indexOf(listener);
        if (index !== -1) {
            this._activeNamesChangeListeners.splice(index, 1);
        }
    }
    updateActiveNames(activeNames) {
        this._activeNames = activeNames;
        this._activeNamesChangeListeners.forEach((callback) => callback());
    }
}
