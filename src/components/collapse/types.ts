import type { Arrayable } from './../../types';

export type CollapseActiveName = number | string;

export type CollapseModelValue = Arrayable<CollapseActiveName>;

export type CollapseIconPositionType = 'left' | 'right';

export type CollapseContext = {
  handleItemClick: (name: CollapseActiveName) => Promise<void>;
  activeNames: CollapseActiveName[];
}
