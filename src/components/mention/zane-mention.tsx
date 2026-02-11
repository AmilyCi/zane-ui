import { Component, h, Element, Prop, State, Watch, Event, type EventEmitter } from '@stencil/core';
import type { Placement } from '@popperjs/core';
import type { ComponentSize } from '../../types';
import type { InputAutoSize, InputMode, InputModelModifiers, InputType } from '../input/types';
import type { MentionCtx, MentionOption, MentionOptionProps } from './types';
import { filterOption, getCursorPosition, getMentionCtx } from './utils';
import type { PopperOptions, PopperRect } from '../tooltip/types';
import { useNamespace } from '../../hooks';
import { getEventCode, isFocusable, isFunction, nextFrame, type ReactiveObject } from '../../utils';
import { EVENT_CODE } from '../../constants';
import type { FormContext } from '../form/types';
import { getFormContext } from '../form/utils';

const ns = useNamespace('mention');

@Component({
  tag: 'zane-mention',
  styleUrl: 'zane-mention.scss'
})
export class ZaneMention {
  @Element() el: HTMLElement;

  @Prop({ attribute: 'id' }) zId: string = undefined;

  @Prop() size: ComponentSize;

  @Prop() disabled: boolean = undefined;

  @Prop({ mutable: true }) value: string;

  @Prop() modelModifiers: InputModelModifiers = {};

  @Prop() maxLength: string | number;

  @Prop() minLength: string | number;

  @Prop() type: InputType = 'text';

  @Prop() resize: 'none' | 'both' | 'horizontal' | 'vertical';

  @Prop() autosize: InputAutoSize = false;

  @Prop() autocomplete: HTMLInputElement['autocomplete'] = "off";

  @Prop() formatter: Function;

  @Prop() parser: Function;

  @Prop() placeholder: string;

  @Prop() form: string;

  @Prop() readonly: boolean;

  @Prop() clearable: boolean;

  @Prop() clearIcon: string = 'close-circle-line';

  @Prop() showPassword: boolean;

  @Prop() showWordLimit: boolean;

  @Prop() wordLimitPosition: 'inside' | 'outside' = 'inside';

  @Prop() suffixIcon: string;

  @Prop() prefixIcon: string;

  @Prop() containerRole: string = undefined;

  @Prop({ attribute: 'tabindex' }) zTabindex: string | number = 0;

  @Prop() validateEvent: boolean = true;

  @Prop() inputStyle: Record<string, string> = {};

  @Prop() autofocus: boolean;

  @Prop() rows: number = 2;

  @Prop() ariaLabel: string;

  @Prop({ attribute: 'inputmode' }) zInputmode: InputMode = undefined;

  @Prop() name: string;

  @Prop() options: MentionOption[] = [];

  @Prop({ attribute: 'prefix' }) zPrefix: string | string[] = '@';

  @Prop() split: string = ' ';

  @Prop() filterOption: (typeof filterOption) = filterOption;

  @Prop() placement: 'bottom' | 'top' = 'bottom';

  @Prop() showArrow: boolean = false;

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

  @Prop() whole: boolean;

  @Prop() checkIsWhole: (pattern: string, prefix: string) => boolean;

  @Prop() loading: boolean;

  @Prop() popperTheme: string;

  @Prop() popperOptions: Partial<PopperOptions> = {};

  @Prop() props: MentionOptionProps = {
    value: 'value',
    label: 'label',
    disabled: 'disabled'
  };

  @Event({ eventName: 'zInput' }) inputEvent: EventEmitter<string>;

  @Event({ eventName: 'zSelect'}) selectEvent: EventEmitter<{
    item: MentionOption,
    prefix: string,
  }>;

  @Event({ eventName: 'zSearch' }) searchEvent: EventEmitter<{
    pattern: string;
    prefix: string;
  }>;

  @Event({ eventName: 'zWholeRemove' }) wholeRemoveEvent: EventEmitter<{
    pattern: string;
    prefix: string;
  }>

  @Event({ eventName: 'zFocus'}) focusEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zBlur' }) blurEvent: EventEmitter<FocusEvent>;

  @State() mentionDisabled: boolean = false;

  @State() computedPlacement: Placement;

  @State() cursorStyle: Record<string, string>;

  @State() mentionCtx: MentionCtx;

  @State() filteredOptions: MentionOption[];

  @State() aliasOptions: MentionOption[];

  @State() visible: boolean = false;

  @State() dropdownVisible: boolean;

  @State() aliasProps: MentionOptionProps;

  @State() isFocused: boolean = false;

  private formContext: ReactiveObject<FormContext>;

  private wrapperRef: HTMLDivElement;

  private inputRef: HTMLZaneInputElement;

  private tooltipRef: HTMLZaneTooltipElement;

  private dropdownRef: HTMLZaneMentionDropdownElement;

  private hasPrependSlot: boolean;

  private hasPrefixSlot: boolean;

  private hasAppendSlot: boolean;

  private hasSuffixSlot: boolean;

  private hasHeaderSlot: boolean;

  private hasFooterSlot: boolean;

  private hasLoadingSlot: boolean;

  @Watch("disabled")
  handleUpdateDisabled() {
    this.mentionDisabled =
      this.disabled ?? this.formContext?.value.disabled ?? false;
  }

  @Watch('props', { immediate: true })
  handleWatchProps() {
    this.aliasProps = {
      value: 'value',
      label: 'label',
      disabled: 'disabled',
      ...this.props,
    }
  }

  @Watch('options', { immediate: true })
  handleWatchOptions() {
    this.handleWatchProps();
    this.aliasOptions = this.options.map(this.mapOption);
  }

  @Watch('placement')
  @Watch('showArrow')
  handleUpdateComputedPlacement() {
    this.computedPlacement = this.showArrow ? this.placement : `${this.placement}-start`;
  }

  @Watch('filterOption')
  @Watch('mentionCtx')
  @Watch('options')
  handleUpdateFilteredOptions() {
    if (!this.mentionCtx || !this.filterOption) {
      this.filteredOptions = this.options;
      return;
    }

    this.filteredOptions = this.options.filter((option) => {
      return this.filterOption(this.mentionCtx.pattern, option);
    });
  }

  @Watch('visible')
  @Watch('filteredOptions')
  @Watch('loading')
  handleUpdateDropdownVisible() {
    this.dropdownVisible = this.visible && (!!this.filteredOptions.length || this.loading);
  }

  @Watch('dropdownVisible')
  handleWatchDropdownVisible() {
    if (this.dropdownVisible) {
      this.tooltipRef?.show();
    } else {
      this.tooltipRef?.hide();
    }
  }

  @Watch('disabled')
  handleWatchDisabled() {
    if (this.disabled) {
      this.wrapperRef?.removeAttribute('tabindex');
    } else {
      this.wrapperRef?.setAttribute('tabindex', '-1');
    }
  }

  private mapOption = (option: MentionOption) => {
    const base = {
      label: option[this.aliasProps.label],
      value: option[this.aliasProps.value],
      disabled: option[this.aliasProps.disabled]
    }
    return {
      ...option,
      ...base,
    }
  }

  private getInputEl = async () => {
    if (this.type === 'textarea') {
      return await this.inputRef?.getTextarea();
    }
    return await this.inputRef?.getInput();
  }

  private getOriginalOption = (item: MentionOption) => {
    return this.options.find((option: MentionOption) => {
      return item.value === option[this.aliasProps.value];
    });
  }

  private handleFocus = (event: FocusEvent | CustomEvent<FocusEvent>) => {
    if (this.mentionDisabled || this.isFocused) {
      return;
    }
    const e: FocusEvent = event instanceof CustomEvent ? event.detail : event;
    this.isFocused = true;
    this.focusEvent.emit(e);
    this.syncAfterCursorMove();
  }

  private handleBlur = async (event: FocusEvent | CustomEvent<FocusEvent>) => {
    const e: FocusEvent = event instanceof CustomEvent ? event.detail : event;
    const cancelBlur = await this.tooltipRef?.isFocusInsideContent(e);
    if (this.mentionDisabled || 
      (e.relatedTarget && this.wrapperRef?.contains(e.relatedTarget as Node)) ||
      cancelBlur
    ) {
      return;
    }

    this.isFocused = false;
    this.blurEvent.emit(e);
    this.visible = false;
  }

  private handleClick = (event: MouseEvent) => {
    if (
      this.mentionDisabled || 
      isFocusable(event.target as HTMLElement) ||
      (this.wrapperRef?.contains(document.activeElement) && this.wrapperRef !== document.activeElement)
    ) {
      return;
    }

    this.inputRef.zFocus();
  }

  private handleSelect = async (item: CustomEvent<MentionOption>) => {
    if (!this.mentionCtx) {
      return;
    }
    const inputEL = await this.getInputEl();
    if (!inputEL) {
      return;
    }

    const inputValue = inputEL.value;
    const newEndPart = inputValue.slice(this.mentionCtx.end);
    const alreadySeparated = newEndPart.startsWith(this.split);
    const newMiddlePart = `${item.detail.value}${alreadySeparated ? '' : this.split}`;

    const newValue = inputValue.slice(0, this.mentionCtx.start) + newMiddlePart + newEndPart;

    this.value = newValue;
    this.inputEvent.emit(newValue);
    this.selectEvent.emit({
      item: this.getOriginalOption(item),
      prefix: this.mentionCtx.prefix
    });

    const newSelectionEnd = this.mentionCtx.start + newMiddlePart.length + (alreadySeparated ? 1 : 0);
    nextFrame(() => {
      inputEL.selectionStart = newSelectionEnd;
      inputEL.selectionEnd = newSelectionEnd;
      inputEL.focus();
      this.syncDropdownVisible();
    });
  }

  private handleDropdownClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.inputRef?.zFocus();
  }

  private handleInputChange = (e: CustomEvent<string>) => {
    this.value = e.detail;
    this.inputEvent.emit(e.detail);
    this.syncAfterCursorMove();
  }

  private handleInputKeyDown = async (event: KeyboardEvent | Event) => {
    if (this.inputRef.isComposing) {
      return;
    }

    const code = getEventCode(event as KeyboardEvent);
    switch(code) {
      case EVENT_CODE.left:
      case EVENT_CODE.right:
        this.syncAfterCursorMove();
        break;
      case EVENT_CODE.up:
      case EVENT_CODE.down:
        if (!this.visible) {
          return;
        }
        event.preventDefault();
        this.dropdownRef?.navigateOptions(
          code === EVENT_CODE.up ? 'prev' : 'next'
        );
        break;
      case EVENT_CODE.enter:
      case EVENT_CODE.numpadEnter:
        if (!this.visible) {
          this.type !== 'textarea' && this.syncAfterCursorMove();
          return;
        }
        event.preventDefault();
        if (this.filteredOptions[this.dropdownRef?.hoveringIndex]) {
          this.dropdownRef?.selectHoverOption();
        } else {
          this.visible = false;
        }
        break;
      case EVENT_CODE.esc:
        if (!this.visible) {
          return;
        }
        event.preventDefault();
        this.visible = false;
        break;
      case EVENT_CODE.backspace:
        if (this.whole && this.mentionCtx) {
          const { splitIndex, selectionEnd, pattern, prefixIndex, prefix } = this.mentionCtx;
          const inputEl = await this.getInputEl();
          if (!inputEl) {
            return;
          }

          const inputValue = inputEl.value;
          const matchOption = this.options.find((item) => item.value === pattern);
          const isWhole = isFunction(this.checkIsWhole)
            ? this.checkIsWhole(pattern, prefix)
            : matchOption;

          if (isWhole && splitIndex !== -1 && splitIndex + 1 === selectionEnd) {
            event.preventDefault();
            const newValue = inputValue.slice(0, prefixIndex) + inputValue.slice(splitIndex + 1);
            this.value = newValue;
            this.inputEvent.emit(newValue);
            this.wholeRemoveEvent.emit({
              pattern,
              prefix
            });

            const newSelectionEnd = prefixIndex;
            nextFrame(() => {
              inputEl.selectionStart = newSelectionEnd;
              inputEl.selectionEnd = newSelectionEnd;
              this.syncDropdownVisible();
            });
          }
        }
        break;
    }
  }

  private handleInputMouseDown = () => {
    this.syncAfterCursorMove();
  }

  private syncAfterCursorMove = () => {
    setTimeout(async () => {
      await this.syncCursor();
      await this.syncDropdownVisible();
      nextFrame(() => {
        this.tooltipRef?.updateTippyInstance();
      });
    }, 0);
  }

  private syncCursor = async () => {
    const inputEl = await this.getInputEl();
    if (!inputEl) {
      return;
    }

    const caretPosition = getCursorPosition(inputEl);
    const inputRect = inputEl.getBoundingClientRect();
    const wrapperRect = this.wrapperRef.getBoundingClientRect();

    this.cursorStyle = {
      position: 'absolute',
      width: '0',
      height: `${caretPosition.height}px`,
      left: `${caretPosition.left + inputRect.left - wrapperRect.left}px`,
      top: `${caretPosition.top + inputRect.top - wrapperRect.top}px`
    }
  }

  private syncDropdownVisible = async () => {
    const inputEl = await this.getInputEl();
    if (document.activeElement !== inputEl) {
      this.visible = false;
      return;
    }

    this.mentionCtx = getMentionCtx(inputEl, this.zPrefix, this.split);
    if (this.mentionCtx && this.mentionCtx.splitIndex === -1) {
      this.visible = true;
      this.searchEvent.emit({
        pattern: this.mentionCtx.pattern,
        prefix: this.mentionCtx.prefix,
      });
      return;
    }
    this.visible = false;
  }

  componentWillLoad() {
    this.hasAppendSlot = !!this.el.querySelector('[slot="append"]');
    this.hasPrefixSlot = !!this.el.querySelector('[slot="prefix"]');
    this.hasPrependSlot = !!this.el.querySelector('[slot="prepend"]');
    this.hasSuffixSlot = !!this.el.querySelector('[slot="suffix"]');
    this.hasHeaderSlot = !!this.el.querySelector('[slot="header"]');
    this.hasFooterSlot = !!this.el.querySelector('[slot="footer"]');
    this.hasLoadingSlot = !!this.el.querySelector('[slot="loading"]');

    this.formContext = getFormContext(this.el);

    this.handleUpdateDisabled();
    this.handleUpdateComputedPlacement();
    this.handleUpdateFilteredOptions();
    this.handleUpdateDropdownVisible();
  }

  render() {
    return (
      <div
        ref={(el) => this.wrapperRef = el}
        class={ns.b()}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
      >
        <zane-input
          ref={(el) => this.inputRef = el}
          id={this.zId}
          type={this.type}
          size={this.size}
          value={this.value}
          maxLength={this.maxLength}
          minLength={this.minLength}
          resize={this.resize}
          autosize={this.autosize}
          autocomplete={this.autocomplete}
          formatter={this.formatter}
          parser={this.parser}
          placeholder={this.placeholder}
          form={this.form}
          readonly={this.readonly}
          clearable={this.clearable}
          clearIcon={this.clearIcon}
          showPassword={this.showPassword}
          showWordLimit={this.showWordLimit}
          wordLimitPosition={this.wordLimitPosition}
          suffixIcon={this.suffixIcon}
          prefixIcon={this.prefixIcon}
          containerRole={this.containerRole}
          tabindex={this.zTabindex}
          validateEvent={this.validateEvent}
          inputStyle={this.inputStyle}
          autoFocus={this.autofocus}
          rows={this.rows}
          inputmode={this.zInputmode}
          name={this.name}
          disabled={this.mentionDisabled}
          role={this.dropdownVisible ? 'combobox' : undefined}
          ariaExpanded={this.dropdownVisible || undefined}
          ariaLabel={this.ariaLabel}
          ariaAutocomplete={this.dropdownVisible ? 'none' : undefined}
          ariaHaspopup={this.dropdownVisible ? 'listbox' : undefined}
          onZInput={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          onZFocus={this.handleFocus}
          onZBlur={this.handleBlur}
          onMouseDown={this.handleInputMouseDown}
        >
          {
            this.hasAppendSlot && (<div slot="append"><slot name="append"></slot></div>)
          }
          {
            this.hasPrefixSlot && (<div slot="prefix"><slot name="prefix"></slot></div>)
          }
          {
            this.hasPrependSlot && (<div slot="prepend"><slot name="prepend"></slot></div>)
          }
          {
            this.hasSuffixSlot && (<div slot="suffix"><slot name="suffix"></slot></div>)
          }
        </zane-input>
        <zane-tooltip
          ref={(el) => this.tooltipRef = el}
          theme={this.popperTheme}
          popperOptions={this.popperOptions}
          placement={this.computedPlacement}
          offset={this.offset}
          arrow={this.showArrow}
          hideOnClick={false}
          interactive={true}
          trigger='manual'
        >
          <div style={this.cursorStyle}></div>
          <div slot='content'>
            <zane-mention-dropdown
              ref={(el) => this.dropdownRef = el}
              options={this.filteredOptions}
              disabled={this.disabled}
              loading={this.loading}
              ariaLabel={this.ariaLabel}
              onZSelect={this.handleSelect}
              onClick={this.handleDropdownClick}
            >
              {
                this.hasHeaderSlot && <slot name='header'></slot>
              }
              {
                this.hasFooterSlot && <slot name='footer'></slot>
              }
              {
                this.hasLoadingSlot && <slot name="loading"></slot>
              }
            </zane-mention-dropdown>
          </div>
        </zane-tooltip>
      </div>
    );
  }
}
