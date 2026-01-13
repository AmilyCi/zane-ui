import type { CollapseActiveName } from '../types';

export interface CollapseContext {
  readonly activeNames: CollapseActiveName[];
  addActiveNamesChangeListener: (listener: () => void) => void;
  handleItemClick: (name: CollapseActiveName) => void;
  removeActiveNamesChangeListener: (listener: () => void) => void;
  updateActiveNames: (activeNames) => void;
}
