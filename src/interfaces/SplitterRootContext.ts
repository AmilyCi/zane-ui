import type { ZaneSplitterPanel } from '../components/splitter/zane-splitter-panel';

export interface SplitterRootContext {
  containerEl: HTMLElement;
  get containerSize();
  getPanelIndex(el: HTMLElement): number;
  get layout();
  get lazy();
  get lazyOffset();
  set lazyOffset(val: number);
  get movingIndex();
  set movingIndex(val: { confirmed: boolean; index: number });
  onCollapse(index: number, type: 'end' | 'start');
  onCollapseCallback: (index: number, type: 'end' | 'start') => void;
  onMoveEnd(index: number);
  onMoveEndCallback: (index: number) => void;
  onMoveStart(index: number);
  onMoveStartCallback: (index: number) => void;
  onMoving(index: number, offset: number);
  onMovingCallback: (index: number) => void;
  get pxSizes();
  registerPanel(panel: ZaneSplitterPanel);
  unregisterPanel(panel: ZaneSplitterPanel);
}
