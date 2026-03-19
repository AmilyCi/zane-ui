type OptionCommon = Record<string, any>;

export type Option = OptionCommon & {
  created?: boolean
}

export type OptionGroup = OptionCommon;

export type OptionType = Option | OptionGroup;

export type OptionItemProps = {
  item: any;
  index: number;
  disabled: boolean;
}

export type SelectStates = {
  inputValue: string;
  cachedOptions: Option[];
  createdOptions: Option[];
  hoveringIndex: number;
  inputHovering: boolean;
  selectionWidth: number;
  collapseItemWidth: number;
  previousQuery: string | null;
  previousValue: unknown;
  selectedLabel: string;
  menuVisibleOnFocus: boolean;
  isBeforeHide: boolean;
}

export type SelectProps = {
  label?: string;
  value?: string;
  disabled?: string;
  options?: string;
}

export type SelectContext = {
  estimatedOptionHeight: number;
  multiple: boolean;
  multipleLimit: number;
  expanded: boolean;
  disabled: boolean;
  tooltipRef: HTMLZaneTippyElement;
  contentId: string;
  scrollbarAlwaysOn: boolean;
  itemHeight: number;
  height: number;
  value: any;
  valueKey: string;
  getValue: (option: Option) => any;
  getLabel: (option: Option) => any;
  getDisabled: (option: Option) => any;
  onSelect: (option: Option) => void;
  onHover: (idx?: number) => void;
  onKeyboardNavigate: (direction: 'forward' | 'backward', hoveringIndex?: number) => void;
  onKeyboardSelect: () => void;
}
