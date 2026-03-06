export type TransferKey = string | number;

export type TransferDirection = 'left' | 'right';

export type TransferDataItem = Record<string, any>;

export interface TransferFormat {
  noChecked?: string;
  hasChecked?: string;
};

export interface TransferPropsAlias {
  label?: string;
  key?: string;
  disabled?: string;
};

export interface TransferCheckedState {
  leftChecked: TransferKey[];
  rightChecked: TransferKey[];
};

export interface TransferPanelState {
  checked: TransferKey[];
  allChecked: boolean;
  query: string;
  checkChangeByUser: boolean;
}
