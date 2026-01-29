import type { ReactiveObject } from "../../utils/reactive/ReactiveObject";

export type PanelItemState = {
  collapsible: { end?: boolean; start?: boolean };
  el: HTMLElement;
  max?: number | string;
  min?: number | string;
  resizable: boolean;
  setIndex: (val: number) => void;
  size?: number | string;
  uuid: string;
};

export type SplitterRootContext = {
  panels: ReactiveObject<PanelItemState>[];
  layout: 'horizontal' | 'vertical';
  lazy: boolean;
  containerSize: number;
  movingIndex: { index: number; confirmed: boolean } | null;
  percentSizes: number[];
  pxSizes: number[];
  registerPanel: (pane: ReactiveObject<PanelItemState>) => void
  unregisterPanel: (pane: ReactiveObject<PanelItemState>) => void
  onCollapse: (index: number, type: 'start' | 'end') => void
  onMoveEnd: (index: number) => Promise<void>
  onMoveStart: (index: number) => void
  onMoving: (index: number, offset: number) => void
}
