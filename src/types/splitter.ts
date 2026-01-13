export type PanelItemState = {
  collapsible: { end?: boolean; start?: boolean };
  el: HTMLElement;
  max?: number | string;
  min?: number | string;
  resizable: boolean;
  setIndex: (val: number) => void;
  size?: number | string;
  uid: number;
};
