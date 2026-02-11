import { Component, Element, Event, Fragment, h, Method, Prop, State, Watch, type EventEmitter } from '@stencil/core';
import type { OptionType, Props, SelectStates, Option, SelectContext } from './types';
import type { PopperOptions, PopperRect } from '../tooltip/types';
import type { ComponentSize } from '../../types';
import type { Placement } from '@popperjs/core';
import type { FormContext, FormItemContext } from '../form/types';
import type { ConfigProviderContext } from '../config-provider/types';
import { useNamespace, useResizeObserver } from '../../hooks';
import classNames from 'classnames';
import { getFormContext, getFormItemContext } from '../form/utils';
import { getConfigProviderContext } from '../config-provider/utils';
import { debugWarn, getEventCode, inLabel, isFocusable, isFunction, isKorean, isNumber, isObject, isUndefined, nextFrame } from '../../utils';
import { DEFAULT_EMPTY_VALUES, EVENT_CODE, MINIMUM_INPUT_WIDTH } from '../../constants';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import debounce from 'lodash-es/debounce';
import findLastIndex from 'lodash-es/findLastIndex';
import { ReactiveObject } from '../../utils/reactive/ReactiveObject';
import { escapeStringRegexp } from './utils';
import state from '../../global/store';
import { ValidateComponentsMap } from '../../constants/validate';
import { selectContexts } from  './constants';
import { BORDER_HORIZONTAL_WIDTH } from '../../constants/form';

const ns = useNamespace('select');
const nsInput = useNamespace('input');

@Component({
  tag: 'zane-select',
  styleUrl: 'zane-select.scss'
})
export class ZaneSelect {
  @Element() el: HTMLElement;

  @Prop() allowCreate: boolean;

  @Prop() autocomplete: 'none' | 'list' | 'both' | 'inline' = 'none';

  @Prop() automaticDropdown: boolean;

  @Prop() clearable: boolean;

  @Prop() clearIcon: string = 'close-circle-line';

  @Prop() popperTheme: string;

  @Prop() collapseTags: boolean;

  @Prop() collapseTagsTooltip: boolean;

  @Prop() maxCollapseTags: number = 1;

  @Prop() defaultFirstOption: boolean;

  @Prop() disabled: boolean = undefined;

  @Prop() estimatedOptionHeight: number = undefined;

  @Prop() filterable: boolean;

  @Prop() filterMethod: (query: string) => boolean;

  @Prop() height: number = 274;

  @Prop() itemHeight: number = 34;

  @Prop({ mutable: true }) zId: string;

  @Prop() loading: boolean;

  @Prop() loadingText: string;

  @Prop({ mutable: true }) value: any[] | string | number | Record<string, any> | any = undefined;

  @Prop() multiple: boolean;

  @Prop() multipleLimit: number = 0;

  @Prop() name: string;

  @Prop() noDataText: string;

  @Prop() noMatchText: string;

  @Prop() remoteMethod: (query: string) => any;

  @Prop() reserveKeyword: boolean = true;

  @Prop() options: OptionType[];

  @Prop() placeholder: string;

  @Prop() popperOptions: Partial<PopperOptions> = {};

  @Prop() remote: boolean;

  @Prop() debounce: number = 300;

  @Prop() size: ComponentSize;

  @Prop() props: Props = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
    options: 'options'
  };

  @Prop() valueKey: string = 'value';

  @Prop() scrollbarAlwaysOn: boolean;

  @Prop() validateEvent: boolean = true;

  @Prop() offset:
    | (({
        placement,
        popper,
        reference,
      }: {
        placement: Placement;
        popper: PopperRect;
        reference: PopperRect;
      }) => [number, number])
    | [number, number] = [0, 0];

  @Prop() remoteShowSuffix: boolean;

  @Prop() showArrow: boolean = false;

  @Prop() placement: Placement = 'bottom-start';

  @Prop() tagType: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'info';

  @Prop() tagEffect: 'dark' | 'light' | 'plain' = 'light';

  @Prop({ attribute: 'tabindex' }) zTabindex: number = 0;

  @Prop() fitInputWidth: boolean | number = true;

  @Prop() suffixIcon: string = 'arrow-down-s-line';

  @Prop() emptyValues: any[];

  @Prop() valueOnClear: any = undefined;

  @Prop() label: string;

  @Prop() ariaLabel: string;

  @Prop() tagRender: () => HTMLElement;

  @Prop() tagLabelRender: (label: string, value: string, index: number) => HTMLElement;

  @Event({ eventName: 'zChange' }) changeEvent: EventEmitter<any>;

  @Event({ eventName: 'zRemoveTag' }) removeTagEvent: EventEmitter<any>;

  @Event({ eventName: 'zClear' }) clearEvent: EventEmitter<any>;

  @Event({ eventName: 'zFocus' }) focusEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zBlur' }) blurEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: "zCompositionEnd" })
  compositionendEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionStart" })
  compositionstartEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionUpdate" })
  compositionupdateEvent: EventEmitter<CompositionEvent>;

  @State() inputId: string;

  @State() selectSize: ComponentSize;

  @State() selectDisabled: boolean;

  @State() dropdownMenuVisible: boolean;

  @State() isFocused: boolean = false;

  @State() expanded: boolean = false;

  @State() showTagList: Option[] = [];

  @State() collapseTagList: Option[] = [];

  @State() states: SelectStates = {
    inputValue: '',
    cachedOptions: [],
    createdOptions: [],
    hoveringIndex: -1,
    inputHovering: false,
    selectionWidth: 0,
    collapseItemWidth: 0,
    previousQuery: null,
    previousValue: undefined,
    selectedLabel: '',
    menuVisibleOnFocus: false,
    isBeforeHide: false
  };

  @State() indexRef: number = -1;

  @State() aliasProps: Props = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
    options: 'options'
  };

  @State() collapseTagSize: 'small' | 'default' = 'default';

  @State() allOptions: Option[] = [];

  @State() filteredOptions: Option[] = [];

  @State() allOptionsValueMap: Map<unknown, Option> = new Map();

  @State() createOptionCount: number = 0;

  @State() cachedSelectedOption: Option;

  @State() calculatorWidth = 0;

  @State() debouncing: boolean = false;

  @State() isComposing: boolean = false;

  @State() shouldShowPlaceholder: boolean = false;

  @State() contentId: string;

  @State() popperSize: number = -1;

  private selectRef: HTMLDivElement;

  private wrapperRef: HTMLDivElement;

  private selectionRef: HTMLDivElement;

  private tooltipRef: HTMLZaneTooltipElement;

  private tagTooltipRef: HTMLZaneTooltipElement;

  private inputRef: HTMLInputElement;

  private suffixRef: HTMLDivElement;

  private menuRef: HTMLZaneSelectMenuElement;

  private tagLabelRefs: HTMLElement[] = [];

  private collapseTagLabelRefs: HTMLElement[] = [];

  private calculatorRef: HTMLElement;

  private tagMenuRef: HTMLDivElement;

  private collapseItemRef: HTMLDivElement;

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private hasPrefixSlot: boolean;

  private hasHeaderSlot: boolean;

  private hasFooterSlot: boolean;

  private hasLoadingSlot: boolean;

  private context: ReactiveObject<SelectContext>;

  private unCalculatorResizeObserver: () => void;
  private unSelectResizeObserver: () => void;
  private unWrapperResizeObserver: () => void;
  private unTagMenuResizeObserver: () => void;
  private unCollapseItemResizeObserver: () => void;
  private unSelectionResizeObserver: () => void;

  @Watch('zId')
  handleWatchId() {
    const newId = this.zId ?? `${ns.namespace}-id-${state.idInjection.prefix}-${state.idInjection.current++}`;
    if (this.inputId !== newId) {
      if (this.formItemContext?.value.removeInputId && !inLabel(this.el)) {
        if (this.inputId) {
          this.formItemContext.value.removeInputId(this.inputId);
        }
        this.formItemContext?.value.addInputId(newId);
      }
      this.inputId = newId;
    }
  }

  @Watch('props')
  handleUpdateAliasProps() {
    this.aliasProps = {
      ...this.aliasProps,
      ...this.props
    };
  }

  @Watch('options')
  handleWatchOptions() {
    this.allOptions = this.filterOptions('');
    const optionLabelsSet = new Set(this.options.map((option) => this.getLabel(option)));
    const createdOptions = this.states.createdOptions.filter(
      (option) => !optionLabelsSet.has(this.getLabel(option))
    );
    this.states = {
      ...this.states,
      createdOptions
    };

    if (!this.inputRef || (this.inputRef && document.activeElement !== this.inputRef)) {
      this.initStates();
    }
  }

  @Watch('allOptions')
  handleWatchAllOptions() {
    const valueMap = new Map();
    this.allOptions.forEach((option, index) => {
      valueMap.set(this.getValueKey(this.getValue(option)), { option, index });
    });
    this.allOptionsValueMap = valueMap;
  }

  @Watch("size")
  handleUpdateSize() {
    this.selectSize =
      this.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }

  @Watch('selectSize')
  handleUpdateCollapseTagSize() {
    this.collapseTagSize = this.selectSize === 'small' ? 'small' : 'default';
  }

  @Watch("disabled")
  handleUpdateDisabled() {
    this.selectDisabled =
      this.disabled ?? this.formContext?.value.disabled ?? false;
  }

  @Watch('multiple')
  @Watch('collapseTags')
  @Watch('maxCollapseTags')
  @Watch('states')
  handleUpdateShowTagList() {
    if (!this.multiple) {
      this.showTagList = [];
      return;
    }
    this.showTagList = this.collapseTags
      ? this.states.cachedOptions.slice(0, this.maxCollapseTags)
      : this.states.cachedOptions;
  }

  @Watch('multiple')
  @Watch('collapseTags')
  @Watch('maxCollapseTags')
  @Watch('states')
  handleUpdateCollapseTagList() {
    if (!this.multiple) {
      this.collapseTagList = [];
      return;
    }
    this.collapseTagList = this.collapseTags
      ? this.states.cachedOptions.slice(this.maxCollapseTags)
      : [];
  }

  @Watch('value')
  @Watch('states')
  @Watch('filterable')
  handleUpdateShouldShowPlaceholder() {
    if (Array.isArray(this.value)) {
      this.shouldShowPlaceholder = this.value.length === 0 && !this.states.inputValue;
      return;
    }
    this.shouldShowPlaceholder = this.filterable ? !this.states.inputValue : true;
  }

  @Watch('fitInputWidth')
  handleUpdatePopperSize() {
    this.calculatePopperSize();
  }

  @Watch('expanded')
  handleUpdateExpanded() {
    if (this.expanded) {
      this.calculatePopperSize();
      this.handleQueryChange('');
    } else {
      this.states = {
        ...this.states,
        inputValue: '',
        previousQuery: null,
        isBeforeHide: true,
        menuVisibleOnFocus: false
      };
      this.createNewOption('');
    }

    this.expanded ? this.tooltipRef.show() : this.tooltipRef.hide();
  }

  @Watch('value')
  handleWatchValue(val, oldVal) {
    const isValEmpty = !val || (Array.isArray(val) && val.length === 0);

    if (
      isValEmpty ||
      (this.multiple && !isEqual(val.toString(), this.states.previousValue)) ||
      (!this.multiple && this.getValueKey(val) !== this.getValueKey(this.states.previousValue))
    ) {
      this.initStates(true);
    }
    if (!isEqual(val, oldVal) && this.validateEvent) {
      this.formItemContext?.value.validate?.('change').catch((err) => debugWarn(err));
    }
    this.context.value.value = val;
  }

  @Watch('filteredOptions')
  handleWatchFilteredOptions() {
    this.calculatePopperSize();
    if (this.menuRef) {
      nextFrame(() => {
        this.menuRef.resetScrollTop();
      });
    }
  }

  @Watch('states')
  handleWatchStates(newVal, oldVal) {
    if (this.states.isBeforeHide) {
      return;
    }
    if (newVal.inputValue !== oldVal.inputValue) {
      this.updateOptions();
    }
  }

  private getLabel = (option: Option) => {
    return get(option, this.aliasProps.label);
  }

  private getValue = (option: Option) => {
    return get(option, this.aliasProps.value);
  }

  private getDisabled = (option: Option) => {
    return get(option, this.aliasProps.disabled);
  }

  private getOptions = (option: Option) => {
    return get(option, this.aliasProps.options);
  }

  private getValueKey = (item: unknown) => {
    return isObject(item) ? get(item, this.valueKey) : item;
  }

  private getOption = (value: unknown, cachedOptions?: Option[]) => {
    const selectValue = this.getValueKey(value)
    if (this.allOptionsValueMap.has(selectValue)) {
      const { option } = this.allOptionsValueMap.get(selectValue);
      return option;
    }
    if (cachedOptions && cachedOptions.length > 0) {
      const option = cachedOptions.find(
        (option) => this.getValueKey(this.getValue(option)) === selectValue
      )
      if (option) {
        return option;
      }
    }
    return {
      [this.aliasProps.label]: value,
      [this.aliasProps.value]: value,
    }
  }

  private filterOptions = (query: string) => {
    const regexp = new RegExp(escapeStringRegexp(query), 'i');
    const isFilterMethodValid = this.filterable && isFunction(this.filterMethod);
    const isRemoteMethodValid = this.remote && isFunction(this.remoteMethod);

    const isValidOption = (o: Option): boolean => {
      if (isFilterMethodValid || isRemoteMethodValid) {
        return true;
      }
      return query ? regexp.test(this.getLabel(o) || '') : true;
    }
    if (this.loading) {
      return [];
    }
    return [...this.states.cachedOptions, ...this.options].reduce((all, item) => {
      const options = this.getOptions(item);
      if (Array.isArray(options)) {
        const filtered = options.filter(isValidOption);
        if (filtered.length > 0) {
          all.push(
            {
              label: this.getLabel(item),
              type: 'Group'
            },
            ...filtered,
          )
        }
      } else if (this.remote || isValidOption(item)) {
        all.push(item);
      }

      return all;
    }, []) as OptionType[];
  }

  private getValueIndex(arr: unknown[] = [], value: unknown ) {
    if (!isObject(value)) {
      return arr.indexOf(value);
    }
    const valueKey = this.valueKey;
    let index = -1;
    arr.some((item, i) => {
      if (get(item, valueKey) === get(value, valueKey)) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  }

  private calculatePopperSize = () => {
    if (isNumber(this.fitInputWidth)) {
      this.popperSize = this.fitInputWidth;
      return;
    }
    const width = this.selectionRef?.offsetWidth || 200;
    const hasOptions = this.loading ? false : this.options?.length > 0 || this.states.createdOptions?.length > 0;
    if (!this.fitInputWidth && hasOptions) {
      nextFrame(async () => {
        this.popperSize = Math.max(width, await this.calculateLabelMaxWidth());
      });
    } else {
      this.popperSize = width;
    }
  }

  private calculateLabelMaxWidth = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const selector = ns.be('dropdown', 'item');
    const dom = await this.menuRef?.getListRef();
    const dropdownItemEL = dom?.querySelector(`.${selector}`);
    if (!dropdownItemEL || !ctx) {
      return 0;
    }
    const style = window.getComputedStyle(dropdownItemEL);
    const padding = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
    ctx.font = `bold ${style.font.replace(
      new RegExp(`\\b${style.fontWeight}\\b`),
      ''
    )}`;
    const maxWidth = this.filteredOptions.reduce((max, option) => {
      const metrics = ctx.measureText(this.getLabel(option) || '');
      return Math.max(max, metrics.width);
    }, 0);
    return maxWidth + padding;
  }

  private handleMenuEnter = () => {
    this.states = {
      ...this.states,
      isBeforeHide: false,
    }
    nextFrame(() => {
      if (~this.indexRef) {
        this.scrollToItem(this.indexRef);
      }
    });
  }

  private handleClickOutside = () => {
    this.expanded = false;

    if (this.isFocused) {
      const event = new FocusEvent('blur');
      this.handleWrapperBlur(event);
    }
  };

  private handleTagRender = () => {
    //TODO:
  }

  private handleTagLabelRender = (label: string, value: string, index: number) => {
    if (this.tagLabelRender) {
      nextFrame(() => {
        const result = this.tagLabelRender(label, value, index);
        const parentEl = this.tagLabelRefs[index];
        if (result && parentEl) {
          parentEl.appendChild(result);
        }
      });
    }
  }

  private handleCollapseTagLabelRender = (label: string, value: string, index: number) => {
    if (this.tagLabelRender) {
      nextFrame(() => {
        const result = this.tagLabelRender(label, value, index);
        const parentEl = this.collapseTagLabelRefs[index];
        if (result && parentEl) {
          parentEl.appendChild(result);
        }
      });
    }
  }

  private resetCalculatorWidth = () => {
    this.calculatorWidth = this.calculatorRef?.getBoundingClientRect().width ?? 0;
  }

  private resetSelectionWidth = () => {
    this.states = {
      ...this.states,
      selectionWidth: Number.parseFloat(window.getComputedStyle(this.selectionRef).width) || 0
    }
  }

  private scrollToItem = (index: number) => {
    this.menuRef?.zScrollToItem(index);
  }

  private toggleMenu = (event?: Event) => {
    if (
      this.selectDisabled ||
      (this.filterable && this.expanded && event && !this.suffixRef?.contains(event.target as Node))
    ) {
      return;
    }
    if (this.states.menuVisibleOnFocus) {
      this.states = {
        ...this.states,
        menuVisibleOnFocus: false
      }
    } else {
      this.expanded = !this.expanded;
    }
  }

  private getGapWidth = () => {
    if (!this.selectionRef) {
      return 0;
    }
    const style = window.getComputedStyle(this.selectionRef);
    return Number.parseFloat(style.gap || '6px');
  }

  private emitChange = (val: any) => {
    if (!isEqual(this.value, val)) {
      this.changeEvent.emit(val);
    }
  }

  private isEmptyValue = (value: unknown) => {
    const emptyValues = this.emptyValues || DEFAULT_EMPTY_VALUES;
    let result = true;
    if (Array.isArray(value)) {
      result = emptyValues.some((emptyVal) => {
        return isEqual(value, emptyVal);
      });
    } else {
      result = emptyValues.includes(value);
    }
    return result;
  }

  private initStates = (needUpdateSelectedLabel: boolean = false) => {
    if (this.multiple) {
      if (this.value && (this.value as Array<any>).length > 0) {
        const cachedOptions = this.states.cachedOptions.slice();
        const newCachedOptions = [];
        for (const val of this.value) {
          const option = this.getOption(val, cachedOptions);
          if (option) {
            newCachedOptions.push(option);
          }
        }
        this.states = {
          ...this.states,
          cachedOptions: newCachedOptions,
          previousValue: this.value?.toString()
        }
      } else {
        this.states = {
          ...this.states,
          cachedOptions: [],
          previousValue: undefined
        }
      }
    } else {
      const hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : !this.isEmptyValue(this.value);

      if (hasValue) {
        const options = this.filteredOptions;
        const selectedItemIndex = options.findIndex((option) => {
          return this.getValueKey(this.getValue(option)) === this.getValueKey(this.value);
        });
        let selectedLabel = this.states.selectedLabel;
        if (~selectedItemIndex) {
          selectedLabel = this.getLabel(options[selectedItemIndex]);
        } else {
          if (!this.states.selectedLabel || needUpdateSelectedLabel) {
            selectedLabel = this.getValueKey(this.value);
          }
        }
        this.states = {
          ...this.states,
          previousValue: this.value,
          selectedLabel,
        }
      } else {
        this.states = {
          ...this.states,
          selectedLabel: '',
          previousValue: undefined
        }
      }
    }
    this.clearAllNewOption();
    this.calculatePopperSize();
  }

  private updateOptions = () => {
    this.filteredOptions = this.filterOptions(this.states.inputValue);
  }

  private update = (val: any) => {
    this.emitChange(val);
    this.value = val;
    this.states = {
      ...this.states,
      previousValue: this.multiple ? String(val) : val,
    };

    nextFrame(() => {
      if (this.multiple && Array.isArray(this.value)) {
        const cachedOptions = this.states.cachedOptions.slice();
        const selectedOptions = this.value.map((item) => this.getOption(item, cachedOptions));

        if (!isEqual(this.states.cachedOptions, selectedOptions)) {
          this.states = {
            ...this.states,
            cachedOptions: selectedOptions,
          };
        }
      } else {
        this.initStates(true);
      }
    });
  }

  private deleteTag = (event: MouseEvent, option: Option) => {
    let selectedOptions = (this.value as any[]).slice();
    const index = this.getValueIndex(selectedOptions, this.getValue(option));
    if (index > -1 && !this.selectDisabled) {
      selectedOptions = [
        ...(this.value as Array<unknown>).slice(0, index),
        ...(this.value as Array<unknown>).slice(index + 1),
      ];
      const cachedOptions = this.states.cachedOptions;
      cachedOptions.splice(index, 1);
      this.states = {
        ...this.states,
        cachedOptions,
      };
      this.update(selectedOptions);
      this.removeTagEvent.emit(this.getValue(option));
      this.removeNewOption(option);
    }
    event.stopPropagation();
    this.zFocus();
  }

  private createNewOption = (query: string) => {
    if (this.allowCreate && this.filterable) {
      if (query && query.length > 0) {
        if (this.hasExistingOption(query)) {
          const createdOptions = this.states.createdOptions.filter(
            (option) => this.getLabel(option) !== this.states.previousQuery
          );
          this.states = {
            ...this.states,
            createdOptions,
          }
          return;
        }
        const newOption = {
          [this.aliasProps.value]: query,
          [this.aliasProps.label]: query,
          created: true,
          [this.aliasProps.disabled]: false,
        }
        const createdOptions = [...this.states.createdOptions];
        if (this.states.createdOptions.length >= this.createOptionCount) {
          createdOptions[this.createOptionCount] = newOption;
        } else {
          createdOptions.push(newOption);
        }
        this.states = {
          ...this.states,
          createdOptions,
        }
      } else {
        const createdOptions = [...this.states.createdOptions];
        if (this.multiple) {
          createdOptions.length = this.createOptionCount;
        } else {
          const selectedOption = this.cachedSelectedOption;
          createdOptions.length = 0;
          if (selectedOption && selectedOption.created) {
            createdOptions.push(selectedOption);
          }
        }
        this.states = {
          ...this.states,
          createdOptions,
        }
      }
    }
  }

  private selectNewOption = (option: Option) => {
    if (!(this.allowCreate && this.filterable)) {
      return;
    }

    if (this.multiple && option.created) {
      this.createOptionCount++;
    } else {
      this.cachedSelectedOption = option;
    }
  }

  private removeNewOption = (option: Option) => {
    if (
      !(this.allowCreate && this.filterable) ||
      !option ||
      !option.created ||
      (
        option.created && this.reserveKeyword && this.states.inputValue === this.getLabel(option)
      )
    ) {
      return;
    }
    const idx = this.states.createdOptions.findIndex(
      (it) => this.getValue(it) === this.getValue(option)
    );
    if (~idx) {
      const createdOptions = this.states.createdOptions.slice();
      createdOptions.splice(idx, 1);
      this.states = {
        ...this.states,
        createdOptions,
      };
      this.createOptionCount--;
    }
  }

  private clearAllNewOption = () => {
    if (this.allowCreate && this.filterable) {
      this.states = {
        ...this.states,
        createdOptions: [],
      };
      this.createOptionCount = 0;
    }
  }

  private hasExistingOption = (query: string) => {
    const hasOption = (option) => this.getLabel(option) === query;
    return (
      (this.options && this.options.some(hasOption)) ||
      this.states.createdOptions.some(hasOption)
    )
  }

  private checkDefaultFirstOption = () => {
    const optionsInDropdown = this.filteredOptions.filter(
      (n) => !n.disabled && n.type !== 'Group'
    );
    const useCreatedOption = optionsInDropdown.find((n) => n.created);
    const firstOriginOption = optionsInDropdown[0];
    this.states = {
      ...this.states,
      hoveringIndex: this.getValueIndex(
        this.filteredOptions,
        useCreatedOption || firstOriginOption
      )
    }
  }

  private updateHoveringIndex = () => {
    let hoveringIndex = -1;
    if (this.multiple) {
      const length = this.value?.length ?? 0;
      if (length > 0) {
        const lastValue = this.value[length - 1];
        hoveringIndex = this.filteredOptions.findIndex(
          (item) => this.getValueKey(lastValue) === this.getValueKey(this.getValue(item))
        )
      }
    } else {
      hoveringIndex = this.filteredOptions.findIndex(
        (item) => this.getValueKey(this.getValue(item)) === this.getValueKey(this.value)
      );
    }
    this.states = {
      ...this.states,
      hoveringIndex,
    }
  }

  private handleQueryChange = (val: string) => {
    if (this.states.previousQuery === val || this.isComposing) {
      return;
    }
    this.states= {
      ...this.states,
      previousQuery: val
    }
    if (this.filterable && isFunction(this.filterMethod)) {
      this.filterMethod(val)
    } else if (
      this.filterable && this.remote && isFunction(this.remoteMethod)
    ){
      this.remoteMethod(val);
    }
    if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptions.length) {
      nextFrame(() => {
        this.checkDefaultFirstOption();
      });
    } else {
      nextFrame(() => {
        this.updateHoveringIndex()
      })
    }
  }

  private onInputChange = () => {
    if (this.states.inputValue.length > 0 && !this.expanded) {
      this.expanded = true;
    }
    this.createNewOption(this.states.inputValue);
    nextFrame(() => {
      this.handleQueryChange(this.states.inputValue);
    });
  }

  private debouncedOnInputChange = debounce(() => {
    this.onInputChange();
    this.debouncing = false;
  }, this.debounce);

  private handleInput = (event: Event) => {
    this.states = {
      ...this.states,
      inputValue: (event.target as HTMLInputElement).value
    }
    if (this.remote) {
      this.debouncing = true;
      this.debouncedOnInputChange();
    } else {
      this.onInputChange()
    }
  }

  private handleCompositionStart = (event: CompositionEvent) => {
    this.compositionstartEvent.emit(event);
    this.isComposing = true;
  }

  private handleCompositionEnd = (event: CompositionEvent) => {
    this.compositionendEvent.emit(event);
    if (this.isComposing) {
      this.isComposing = false;
      nextFrame(() => {
        this.handleInput(event);
      });
    }
  }

  private handleCompositionUpdate = (event: CompositionEvent) => {
    this.compositionupdateEvent.emit(event);
    const text = (event.target as HTMLInputElement).value;
    const lastCharacter = text[text.length - 1] || '';
    this.isComposing = !isKorean(lastCharacter);
  }

  private onKeyboardNavigate = (
    direction: 'forward' | 'backward',
    hoveringIndex: number | undefined = undefined
  ) => {
    const options = this.filteredOptions;
    const optionsAllDisabled = options.every((option) => this.getDisabled(option));
    if (
      !['forward', 'backward'].includes(direction) ||
      this.selectDisabled ||
      optionsAllDisabled ||
      this.isComposing
    ) {
      return;
    }
    if (!this.expanded) {
      this.toggleMenu();
      return;
    }
    if (isUndefined(hoveringIndex)) {
      hoveringIndex = this.states.hoveringIndex;
    }
    let newIndex = -1;
    if (direction === 'forward') {
      newIndex = hoveringIndex + 1;
      if (newIndex >= options.length) {
        newIndex = 0;
      }
    } else if (direction === 'backward') {
      newIndex = hoveringIndex - 1;
      if (newIndex < 0 || newIndex >= options.length) {
        newIndex = options.length - 1;
      }
    }
    const option = options[newIndex];
    if (this.getDisabled(option) || option.type === 'Group') {
      this.onKeyboardNavigate(direction, newIndex);
    } else {
      this.states = {
        ...this.states,
        hoveringIndex: newIndex
      }
      this.scrollToItem(newIndex);
    }
  }

  private onSelect = (option: Option) => {
    const optionValue = this.getValue(option);
    if (this.multiple) {
      let selectedOptions = ((this.value ?? []) as any[]).slice();

      const index = this.getValueIndex(selectedOptions, optionValue);
      if (index > -1) {
        selectedOptions = [
          ...selectedOptions.slice(0, index),
          ...selectedOptions.slice(index + 1)
        ];
        this.states.cachedOptions.splice(index, 1);
        this.removeNewOption(option);
      } else if (
        this.multipleLimit <= 0 ||
        selectedOptions.length < this.multipleLimit
      ) {
        selectedOptions = [...selectedOptions, optionValue];
        this.states.cachedOptions.push(option);
        this.selectNewOption(option);
      }
      this.update(selectedOptions);
      if (option.created) {
        this.handleQueryChange('');
      }
      if (this.filterable && !this.reserveKeyword) {
        this.states.inputValue = '';
      }
    } else {
      this.states.selectedLabel = this.getLabel(option);
      if (!isEqual(this.value, optionValue)) {
        this.update(optionValue);
      }
      this.expanded = false;
      this.selectNewOption(option);
      if (!option.created) {
        this.clearAllNewOption();
      }
    }
    this.zFocus();
  }

  private onHover = (idx: number) => {
    this.states = {
      ...this.states,
      hoveringIndex: idx ?? -1,
    }
  }

  private onKeyboardSelect = () => {
    if (!this.expanded) {
      this.toggleMenu();
      return;
    } else if (
      ~this.states.hoveringIndex &&
      this.filteredOptions[this.states.hoveringIndex]
    ) {
      this.onSelect(this.filteredOptions[this.states.hoveringIndex]);
    }
  }

  private handleEsc = () => {
    if (this.states.inputValue.length > 0) {
      this.states = {
        ...this.states,
        inputValue: ''
      }
    } else {
      this.expanded = false;
    }
  }

  private getLastNotDisabledIndex = (value: unknown[]) => {
    return findLastIndex(
      value,
      (it) => !this.states.cachedOptions.some(
        (option) => this.getValue(option) === it && this.getDisabled(option)
      )
    )
  }

  private handleDel = (event: KeyboardEvent) => {
    if (!this.multiple) {
      return;
    }
    const code = getEventCode(event);
    if (code === EVENT_CODE.delete) {
      return;
    }
    if (this.states.inputValue.length === 0) {
      event.preventDefault();
      const selected = (this.value as any[]).slice();
      const lastNotDisabledIndex = this.getLastNotDisabledIndex(selected);
      if (lastNotDisabledIndex < 0) {
        return;
      }
      const removeTagValue = selected[lastNotDisabledIndex];
      selected.splice(lastNotDisabledIndex, 1);
      const option = this.states.cachedOptions[lastNotDisabledIndex];
      this.states.cachedOptions.splice(lastNotDisabledIndex, 1);
      this.removeNewOption(option);
      this.update(selected);
      this.removeTagEvent.emit(removeTagValue);
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const code = getEventCode(event);
    switch(code) {
      case EVENT_CODE.up: {
        event.preventDefault();
        event.stopPropagation();
        this.onKeyboardNavigate('backward');
        break;
      }
      case EVENT_CODE.down: {
        event.preventDefault();
        event.stopPropagation();
        this.onKeyboardNavigate('forward');
        break;
      }
      case EVENT_CODE.enter:
      case EVENT_CODE.numpadEnter: {
        event.preventDefault();
        event.stopPropagation();
        this.onKeyboardSelect();
        break;
      }
      case EVENT_CODE.esc: {
        event.preventDefault();
        event.stopPropagation();
        this.handleEsc();
        break;
      }
      case EVENT_CODE.delete: {
        event.stopPropagation();
        this.handleDel(event)
        break;
      }
    }
  }

  private handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    this.toggleMenu();
  }

  private handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }

  private handleResize = () => {
    this.calculatePopperSize();
  }

  private handleWrapperClick = (event: MouseEvent) => {
    if (this.selectDisabled ||
      isFocusable(event.target as HTMLElement) ||
      (this.wrapperRef.contains(document.activeElement) &&
      this.wrapperRef !== document.activeElement)
    ) {
      return;
    }

    this.inputRef?.focus();
  }

  private handleWrapperFocus = (event: FocusEvent) => {
    if (this.selectDisabled || this.isFocused) {
      return;
    }
    this.isFocused = true;
    this.focusEvent.emit(event);

    if (this.automaticDropdown && !this.expanded) {
      this.expanded = true;
      this.states = {
        ...this.states,
        menuVisibleOnFocus: true
      }
    }
  }

  private handleWrapperBlur = async (event: FocusEvent) => {
    const cancelBlur = await this.tooltipRef.isFocusInsideContent(event) ||
      await this.tagTooltipRef?.isFocusInsideContent(event);

    if (this.selectDisabled ||
      (event.relatedTarget && this.wrapperRef.contains(event.relatedTarget as Node)) ||
      cancelBlur
    ) {
      return;
    }

    this.isFocused = false;
    this.blurEvent.emit(event);

    this.expanded = false;
    this.states = {
      ...this.states,
      menuVisibleOnFocus: false,
    }

    if (this.validateEvent) {
      this.formItemContext?.value.validate?.('blur').catch((err) => debugWarn(err));
    }
  }

  private updateTooltip = () => {
    this.tooltipRef?.updateTippyInstance();
  }

  private updateTagTooltip = () => {
    this.tagTooltipRef?.updateTippyInstance();
  }

  private resetCollapseItemWidth = () => {
    this.states = {
      ...this.states,
      collapseItemWidth: this.collapseItemRef?.getBoundingClientRect().width ?? 0,
    }
  }

  @Method()
  async zFocus() {
    this.inputRef?.focus();
  }

  @Method()
  async zBlur() {
    if (this.expanded) {
      this.expanded = false;
      nextFrame(() => {
        this.inputRef?.blur();
      });
      return;
    }
    this.inputRef?.blur();
  }

  componentWillLoad() {
    this.hasPrefixSlot = !!this.el.querySelector('[slot="prefix"]');

    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);

    this.contentId = `${ns.namespace}-id-${state.idInjection.prefix}-${state.idInjection.current++}`;

    this.context = new ReactiveObject({
      estimatedOptionHeight: this.estimatedOptionHeight,
      multiple: this.multiple,
      multipleLimit: this.multipleLimit,
      expanded: this.expanded,
      disabled: this.selectDisabled,
      tooltipRef: this.tooltipRef,
      contentId: this.contentId,
      scrollbarAlwaysOn: this.scrollbarAlwaysOn,
      itemHeight: this.itemHeight,
      height: this.height,
      value: this.value,
      valueKey: this.valueKey,
      getValue: this.getValue,
      getLabel: this.getLabel,
      getDisabled: this.getDisabled,
      onSelect: this.onSelect,
      onHover: this.onHover,
      onKeyboardNavigate: this.onKeyboardNavigate,
      onKeyboardSelect: this.onKeyboardSelect,
    });

    selectContexts.set(this.el, this.context);

    this.handleWatchId();
    this.handleUpdateAliasProps();
    this.handleUpdateDisabled();
    this.handleUpdateSize();
    this.handleUpdateShowTagList();
    this.handleWatchOptions();
    this.handleUpdateShouldShowPlaceholder();

    this.initStates();
    this.updateOptions();

    this.formContext?.change$.subscribe(({key}) => {
      if (key === 'disabled') {
        this.handleUpdateDisabled();
      }
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });

    this.formItemContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });

    this.configProviderContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });
  }

  componentDidLoad() {
    this.unCalculatorResizeObserver = useResizeObserver(this.calculatorRef, this.resetCalculatorWidth);
    this.unSelectResizeObserver = useResizeObserver(this.selectRef, this.handleResize);
    this.unSelectionResizeObserver = useResizeObserver(this.selectionRef, this.resetSelectionWidth);
    this.unWrapperResizeObserver = useResizeObserver(this.wrapperRef, this.updateTooltip);
    this.unTagMenuResizeObserver = useResizeObserver(this.tagMenuRef, this.updateTagTooltip);
    this.unCollapseItemResizeObserver = useResizeObserver(this.collapseItemRef, this.resetCollapseItemWidth);

    this.wrapperRef.addEventListener('click', this.handleWrapperClick);
    this.wrapperRef.addEventListener('focus', this.handleWrapperFocus);
    this.wrapperRef.addEventListener('blur', this.handleWrapperBlur);
  }

  componentWillRender() {
    this.tagLabelRefs = [];
    this.collapseTagLabelRefs = [];
  }

  disconnectedCallback() {
    selectContexts.delete(this.el);

    this.unCalculatorResizeObserver?.();
    this.unSelectResizeObserver?.();
    this.unWrapperResizeObserver?.();
    this.unTagMenuResizeObserver?.();
    this.unCollapseItemResizeObserver?.();
    this.unSelectionResizeObserver?.();
  }

  render() {
    const { t } = state.i18n;

    const gapWidth = this.getGapWidth();
    const inputSlotWidth = this.filterable ? gapWidth + MINIMUM_INPUT_WIDTH : 0;
    const maxWidth = this.collapseItemRef && this.maxCollapseTags === 1
      ? this.states.selectionWidth - this.states.collapseItemWidth - gapWidth - inputSlotWidth
      : this.states.selectionWidth - inputSlotWidth;

    const hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : !this.isEmptyValue(this.value);

    const tagStyle = { maxWidth: `${maxWidth}px` };

    const collapseTagStyle = { maxWidth: `${this.states.selectionWidth}px` };

    const inputStyle = { minWidth: `${Math.max(this.calculatorWidth, MINIMUM_INPUT_WIDTH)}px` };

    const currentPlaceholder = this.multiple || !hasValue
      ? (this.placeholder ?? t('select.placeholder'))
      : this.states.selectedLabel;

    const iconComponent = this.remote && this.filterable && !this.remoteShowSuffix
      ? ''
      : this.suffixIcon;

    const iconReverse = iconComponent && ns.is('reverse', this.expanded);

    const showClearBtn = this.clearable &&
      !this.selectDisabled &&
      hasValue &&
      (this.isFocused || this.states.inputHovering);

    const needStatusIcon = this.formContext?.value.statusIcon ?? false;

    const validateState = this.formItemContext?.value.validateState || '';

    const validateIcon = validateState ? ValidateComponentsMap[validateState] : undefined;

    let emptyText = '';
    if (this.loading) {
      emptyText = this.loadingText || t('select.loading');
    } else {
      if (
        this.filterable &&
        this.states.inputValue &&
        (this.options.length > 0 || this.states.createdOptions.length > 0) &&
        this.filteredOptions.length === 0
      ) {
        emptyText = this.noMatchText || t('select.noMatch');
      }
      if (this.options.length === 0 && this.states.createdOptions.length === 0) {
        emptyText = this.noDataText || t('select.noData');
      }
    }

    return (
      <div
        ref={(el) => this.selectRef = el}
        class={classNames(ns.b(), ns.m(this.selectSize))}
        onMouseEnter={() => this.states = {...this.states, inputHovering: true}}
        onMouseLeave={() => this.states = {...this.states, inputHovering: false}}
      >
        <zane-tooltip
          ref={(el) => this.tooltipRef = el}
          theme={this.popperTheme}
          popperOptions={this.popperOptions}
          interactive={true}
          arrow={this.showArrow}
          hideOnClick={false}
          placement={this.placement}
          offset={this.offset}
          maxWidth={''}
          trigger='manual'
          onZClickOutside={this.handleClickOutside}
          onZShow={this.handleMenuEnter}
          onZHide={() => this.states = {...this.states, isBeforeHide: false}}
        >
          <div
            ref={(el) => this.wrapperRef = el}
            class={classNames(
              ns.e('wrapper'),
              ns.is('focused', this.isFocused),
              ns.is('hovering', this.states.inputHovering),
              ns.is('filterable', this.filterable),
              ns.is('disabled', this.selectDisabled)
            )}
            onClick={this.toggleMenu}
          >
            {
              this.hasPrefixSlot && (
                <div class={ns.e('prefix')}>
                  <slot name="prefix"></slot>
                </div>
              )
            }
            <div
              ref={(el) => this.selectionRef = el}
              class={classNames(
                ns.e('selection'),
                ns.is('near', this.multiple && !this.hasPrefixSlot && !!this.value?.length),
              )}
            >
              {
                this.multiple && (this.tagRender ? this.handleTagRender() : (<Fragment>
                  {
                    this.showTagList.map((tag, index) => (
                      <div
                        key={this.getValueKey(this.getValue(tag))}
                        class={ns.e('selected-item')}
                      >
                        <zane-tag
                          closeable={!this.selectDisabled && !this.getDisabled(tag)}
                          size={this.collapseTagSize}
                          type={this.tagType}
                          effect={this.tagEffect}
                          style={tagStyle}
                          onZClose={(e) => this.deleteTag(e.detail, tag)}
                        >
                          <span ref={(el) => this.tagLabelRefs[index] = el} class={ns.e('tags-text')}>
                            {
                              this.tagLabelRender
                                ? this.handleTagLabelRender(
                                  this.getLabel(tag),
                                  this.getValue(tag),
                                  index
                                )
                                : this.getLabel(tag)
                            }
                          </span>
                        </zane-tag>
                      </div>
                    ))
                  }
                  {
                    (this.collapseTags && this.value?.length > this.maxCollapseTags) && (
                      <zane-tooltip
                        ref={(el) => this.tagTooltipRef = el}
                        disabled={this.dropdownMenuVisible || !this.collapseTagsTooltip}
                        theme={this.popperTheme}
                        placement="bottom"
                        interactive={true}
                        arrow={false}
                        popperOptions={this.popperOptions}
                      >
                        <div
                          ref={(el) => this.collapseItemRef = el}
                          class={ns.e('selected-item')}
                        >
                          <zane-tag
                            closeable={false}
                            size={this.collapseTagSize}
                            type={this.tagType}
                            effect={this.tagEffect}
                            style={collapseTagStyle}
                          >
                            + { this.value.length - this.maxCollapseTags }
                          </zane-tag>
                        </div>
                        <div slot='content'>
                          <div
                            ref={(el) => this.tagMenuRef = el}
                            class={ns.e('selection')}
                          >
                            {
                              this.collapseTagList.map((tag, index) => (
                                <div
                                  key={this.getValueKey(this.getValue(tag))}
                                  class={ns.e('selected-item')}
                                >
                                  <zane-tag
                                    class="in-tooltip"
                                    closeable={!this.selectDisabled && !this.getDisabled(tag)}
                                    size={this.collapseTagSize}
                                    type={this.tagType}
                                    effect={this.tagEffect}
                                    onZClose={(e) => this.deleteTag(e.detail, tag)}
                                  >
                                    <span
                                      ref={(el) => this.collapseTagLabelRefs[index] = el}
                                      class={ns.e('tags-text')}
                                    >
                                      {
                                        this.tagLabelRender
                                          ? this.handleCollapseTagLabelRender(
                                              this.getLabel(tag),
                                              this.getValue(tag),
                                              index
                                            )
                                          : this.getLabel(tag)
                                      }
                                    </span>
                                  </zane-tag>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </zane-tooltip>
                    )
                  }
                </Fragment>))
              }
              <div
                class={classNames(
                  ns.e('selected-item'),
                  ns.e('input-wrapper'),
                  ns.is('hidden', !this.filterable || this.selectDisabled)
                )}
              >
                <input
                  id={this.inputId}
                  ref={(el) => this.inputRef = el}
                  style={inputStyle}
                  autocomplete={this.autocomplete}
                  tabindex={this.zTabindex}
                  ariaAutocomplete="none"
                  ariaHaspopup="listbox"
                  ariaExpanded={this.expanded}
                  ariaLabel={this.ariaLabel}
                  autoCapitalize='off'
                  role="combobox"
                  disabled={this.selectDisabled}
                  readonly={!this.filterable}
                  type='text'
                  spellcheck="false"
                  name={this.name}
                  class={classNames(
                    ns.e('input'),
                    ns.is(this.selectSize)
                  )}
                  value={this.states.inputValue}
                  onInput={this.handleInput}
                  onCompositionstart={this.handleCompositionStart}
                  onCompositionend={this.handleCompositionEnd}
                  onCompositionupdate={this.handleCompositionUpdate}
                  onKeyDown={this.handleKeyDown}
                  onClick={this.handleClick}
                  onFocus={() => this.isFocused = true}
                  onBlur={() => this.isFocused = false}
                />
                {
                  this.filterable && (
                    <span
                      ref={(el) => this.calculatorRef = el}
                      ariaHidden="true"
                      class={ns.e('input-calculator')}
                    >
                      {this.states.inputValue}
                    </span>
                  )
                }
              </div>
              {
                this.shouldShowPlaceholder && (
                  <div
                    class={classNames(
                      ns.e('selected-item'),
                      ns.e('placeholder'),
                      ns.is('transparent', !hasValue || (this.expanded && !this.states.inputValue))
                    )}
                  >
                    {currentPlaceholder}
                  </div>
                )
              }
            </div>
            <div
              ref={(el) => this.suffixRef = el}
              class={ns.e('suffix')}
            >
              {
                iconComponent && (
                  <zane-icon
                    class={classNames(
                      ns.e('caret'),
                      nsInput.e('icon'),
                      iconReverse,
                    )}
                    style={{
                      display: showClearBtn ? 'none' : undefined
                    }}
                    name={iconComponent}
                  ></zane-icon>
                )
              }
              {
                (showClearBtn && this.clearIcon) && (
                  <zane-icon
                    class={classNames(
                      ns.e('caret'),
                      nsInput.e('icon'),
                      ns.e('clear')
                    )}
                    onClick={this.handleClear}
                    name={this.clearIcon}
                  ></zane-icon>
                )
              }
              {
                (validateState && validateIcon && needStatusIcon) && (
                  <zane-icon
                    class={classNames(
                      nsInput.e('icon'),
                      nsInput.e('validateIcon'),
                      nsInput.is('loading', validateState === 'validating')
                    )}
                    name={validateIcon}
                  ></zane-icon>
                )
              }
            </div>
          </div>
          <div slot='content'>
            <zane-select-menu
              id={this.contentId}
              ref={(el) => this.menuRef = el}
              data={this.filteredOptions}
              width={this.popperSize - BORDER_HORIZONTAL_WIDTH}
              hoveringIndex={this.states.hoveringIndex}
              ariaLabel={this.ariaLabel}
            >
              {
                this.hasHeaderSlot && (
                  <div
                    slot='header'
                    class={ns.be('dropdown', 'header')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <slot name="header"></slot>
                  </div>
                )
              }
              {
                (this.hasLoadingSlot && this.loading) && (
                  <div
                    slot='loading'
                    class={ns.be('dropdown', 'loading')}
                  >
                    <slot name='loading'></slot>
                  </div>
                )
              }
              {
                ((!this.hasLoadingSlot && this.loading) || this.filteredOptions.length === 0) && (
                  <div
                    slot='empty'
                    class={ns.be('dropdown', 'empty')}
                  >
                    <slot name='empty'>
                      { emptyText }
                    </slot>
                  </div>
                )
              }
              {
                this.hasFooterSlot && (
                  <div
                    slot='footer'
                    class={ns.be('dropdown', 'footer')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <slot name="footer"></slot>
                  </div>
                )
              }
            </zane-select-menu>
          </div>
        </zane-tooltip>
      </div>
    );
  }
}
