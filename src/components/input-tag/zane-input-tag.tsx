import { Component, h, Element, Prop, State, Watch, Event, type EventEmitter, Method } from '@stencil/core';

import { useNamespace, useResizeObserver } from '../../hooks';
import type { ComponentSize } from '../../types';
import { castArray, debugWarn, getEventCode, inLabel, isAndroid, isFocusable, isKorean, isUndefined, type ReactiveObject } from '../../utils';
import type { FormContext, FormItemContext } from '../form/types';
import type { ConfigProviderContext } from '../config-provider/types';
import { getFormContext, getFormItemContext } from '../form/utils';
import { getConfigProviderContext } from '../config-provider/utils';
import classNames from 'classnames';
import { getElementStyleValue } from '../../utils/dom/style/getElementStyleValue';
import { setElementStyleValue } from '../../utils/dom/style/setElementStyleValue';
import { EVENT_CODE, MINIMUM_INPUT_WIDTH } from '../../constants';
import state from '../../global/store';
import { ValidateComponentsMap } from '../../constants/validate';

const ns = useNamespace('input-tag');
const nsInput = useNamespace('input');

@Component({
  styleUrl: 'zane-input-tag.scss',
  tag: 'zane-input-tag',
})
export class ZaneInputTag {
  @Element() el: HTMLElement;

  @Prop() max: number;

  @Prop() wrapperClass: string;

  @Prop() wrapperStyle: Record<string, string>;

  @Prop() tagType: 'success' | 'primary' | 'info' | 'warning' = 'info';

  @Prop() tagEffect: 'light' | 'dark' | 'plain' = 'light';

  @Prop() trigger: 'Enter' | 'Space' = 'Enter';

  @Prop({ attribute: 'draggable' }) zDraggable: boolean;

  @Prop({ mutable: true }) value: string[];

  @Prop() delimiter: string | RegExp = '';

  @Prop() size: ComponentSize;

  @Prop() clearable: boolean;

  @Prop() clearIcon: string = 'close-circle-line';

  @Prop() disabled: boolean = undefined;

  @Prop() validateEvent: boolean = true;

  @Prop() readonly: boolean;

  @Prop() autofocus: boolean;

  @Prop({ attribute: 'id' }) zId: string;

  @Prop({ attribute: 'tabindex' }) zTabindex: number = 0;

  @Prop() maxLength: number | string;

  @Prop() minLength: number | string;

  @Prop() placeholder: string;

  @Prop() tooltipTheme: string = '';

  @Prop() autocomplete: HTMLInputElement['autocomplete'] = 'off';

  @Prop() saveOnBlur: boolean = true;

  @Prop() collapseTags: boolean;

  @Prop() collapseTagsTooltip: boolean;

  @Prop() maxCollapseTags: number = 1;

  @Prop() ariaLabel: string;

  @State() inputTagDisabled: boolean;

  @State() inputTagSize: ComponentSize = 'default';

  @State() isFocused: boolean = false;

  @State() hovering: boolean = false;

  @State() inputValue: string;

  @State() inputLimit: boolean = false;

  @State() isComposing: boolean = false;

  @State() showClear: boolean;

  @State() showSuffix: boolean;

  @State() needStatusIcon: boolean;

  @State() validateState: string;

  @State() validateIcon: string;

  @State() showTagList: string[] = [];

  @State() tagSize: ComponentSize = 'default';

  @State() closeable: boolean = false;

  @State() tagStyle: Record<string, string>;

  @State() collapseTagList: string[] = [];

  @State() states = {
    innerWidth: 0,
    collapseItemWidth: 0,
  }

  @State() showDropIndicator: boolean = false;

  @State() inputStyle: Record<string, string>;

  @State() calculatorWidth = 0;

  @State() inputId: string;

  @Event({ eventName: 'zFocus', bubbles: false })
  zaneFocus: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zBlur', bubbles: false })
  zaneBlur: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zChange', bubbles: false })
  changeEvent: EventEmitter<string[]>;

  @Event({ eventName: 'zAddTag', bubbles: false })
  addTagEvent: EventEmitter<string | string[]>;

  @Event({ eventName: 'zRemoveTag', bubbles: false })
  removeTagEvent: EventEmitter<{index: number, item: string}>;

  @Event({ eventName: 'zDragTag', bubbles: false })
  dragTagEvent: EventEmitter<{
    draggingIndex: number,
    dropIndex: number,
    draggedItem: string
  }>;

  @Event({ eventName: "zInput", bubbles: false })
  inputEvent: EventEmitter<string>;

  @Event({ eventName: "zCompositionEnd", bubbles: false })
  compositionendEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionStart", bubbles: false })
  compositionstartEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zCompositionUpdate", bubbles: false })
  compositionupdateEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: "zClear", bubbles: false })
  clearEvent: EventEmitter<void>;

  private formContext: ReactiveObject<FormContext>;

  private formItemContext: ReactiveObject<FormItemContext>;

  private configProviderContext: ReactiveObject<ConfigProviderContext>;

  private wrapperRef: HTMLElement;

  private innerRef: HTMLElement;

  private dropIndicatorRef: HTMLElement;

  private inputRef: HTMLInputElement;

  private calculatorRef: HTMLSpanElement;

  private tagTooltipRef: HTMLZaneTippyElement;

  private collapseItemRef: HTMLElement;

  private hasPrefixSlot: boolean;

  private draggingIndex: number | undefined;

  private draggingTag: HTMLElement | null;

  private dropIndex: number | undefined;

  private dropType: 'before' | 'after' | undefined;

  private disconnectCalculatorRefSize: Function;

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

  @Watch("size")
  handleUpdateSize() {
    this.inputTagSize =
      this.size ||
      this.formItemContext?.value.size ||
      this.formContext?.value.size ||
      this.configProviderContext?.value.size ||
      "";
  }

  @Watch('inputTagSize')
  handleUpdateTagSize() {
    this.tagSize = ['small'].includes(this.inputTagSize) ? 'small' : 'default';
  }

  @Watch("disabled")
  handleUpdateDisabled() {
    this.inputTagDisabled =
      this.disabled ?? this.formContext?.value.disabled ?? false;
  }

  @Watch('wrapperRef')
  @Watch('inputTagDisabled')
  handleWatchWrapperRef() {
    if (!this.wrapperRef) {
      return;
    }
    if (this.inputTagDisabled) {
      this.wrapperRef.removeAttribute('tabindex');
    } else {
      this.wrapperRef.setAttribute('tabindex', '-1');
    }
  }

  @Watch('clearable')
  @Watch('inputTagDisabled')
  @Watch('readonly')
  @Watch('value')
  @Watch('inputValue')
  @Watch('isFocused')
  @Watch('hovering')
  handleUpdateShowClear() {
    this.showClear = this.clearable &&
      !this.inputTagDisabled &&
      !this.readonly &&
      (this.value?.length || this.inputValue) &&
      (this.isFocused || this.hovering);
  }

  @Watch('showClear')
  @Watch('validateState')
  @Watch('validateIcon')
  @Watch('needStatusIcon')
  handleUpdateShowSuffix() {
    this.showSuffix = this.hasPrefixSlot ||
      this.showClear ||
      (this.validateState && this.validateIcon && this.needStatusIcon)
  }

  @Watch('value')
  @Watch('collapseTags')
  @Watch('maxCollapseTags')
  handleUpdateShowTagList() {
    this.showTagList = this.collapseTags
      ? this.value?.slice(0, this.maxCollapseTags)
      : this.value;
  }

  @Watch('readonly')
  @Watch('inputTagDisabled')
  handleUpdateClosable() {
    this.closeable = !(this.readonly || this.inputTagDisabled);
  }

  @Watch('states')
  @Watch('collapseTags')
  handleUpdateTagStyle() {
    if (!this.collapseTags) {
      this.tagStyle = {};
    } else {
      const gapWidth = this.getGapWidth();
      const inputSlotWidth = gapWidth + MINIMUM_INPUT_WIDTH;
      const maxWidth = this.collapseItemRef && this.maxCollapseTags === 1
        ? this.states.innerWidth - this.states.collapseItemWidth - gapWidth - inputSlotWidth
        : this.states.innerWidth - inputSlotWidth;

      this.tagStyle = {
        maxWidth: `${maxWidth}px`,
      };
    }

  }

  @Watch('calculatorWidth')
  handleUpdateInputStyle() {
    this.inputStyle = {
      minWidth: `${Math.max(this.calculatorWidth, MINIMUM_INPUT_WIDTH)}px`,
    };
  }

  @Watch('max')
  @Watch('value')
  handleUpdateInputLimit() {
    this.inputLimit = isUndefined(this.max) ? false : ((this.value?.length ?? 0) >= this.max);
  }

  @Watch('collapseTags')
  @Watch('value')
  @Watch('maxCollapseTags')
  handleUpdateCollapseTagList() {
    this.collapseTagList = this.collapseTags ? (this.value?.slice(this.maxCollapseTags) ?? []) : [];
  }

  @Method()
  async zFocus() {
    this.inputRef?.focus();
  }

  @Method()
  async zBlur() {
    this.inputRef?.blur();
  }

  @Method()
  async getInput() {
    return this.inputRef;
  }

  private getGapWidth = () => {
    if (!this.innerRef) {
      return 0;
    }
    const style = window.getComputedStyle(this.innerRef);
    return Number.parseFloat(style.gap || '6px');
  }

  private handleFocus = async (event: FocusEvent) => {
    const cancelFocus = (await this.tagTooltipRef?.isFocusInsideContent(event)) ?? false;
    if (this.inputTagDisabled || this.isFocused || cancelFocus) {
      return;
    }
    this.isFocused = true;
    this.zaneFocus.emit(event);
  }

  private handleBlur = async (event: FocusEvent) => {
    const cancelBlur = (await this.tagTooltipRef?.isFocusInsideContent(event)) ?? false;
    if (this.inputTagDisabled || (event.relatedTarget && this.wrapperRef?.contains(event.relatedTarget as Node)) || cancelBlur) {
      return;
    }
    this.isFocused = false;
    this.zaneBlur.emit(event);

    if (this.saveOnBlur) {
      this.handleAddTag();
    } else {
      this.inputValue = undefined;
    }

    if (this.validateEvent) {
      this.formItemContext?.value.validate?.('blur').catch((error) => debugWarn(error));
    }
  }

  private handleClick = (event: Event) => {
    if (
      this.inputTagDisabled ||
      isFocusable(event.target as HTMLElement) ||
      (this.wrapperRef.contains(document.activeElement) && this.wrapperRef !== document.activeElement)
    ) {
      return;
    }

    this.inputRef?.focus();
  }

  private handleMouseEnter = () => {
    this.hovering = true;
  }

  private handleMouseLeave = () => {
    this.hovering = false;
  }

  private addTagsEmit = (value: string | string[]) => {
    const list = [...(this.value ?? []), ...castArray(value)];
    this.value = list;
    this.changeEvent.emit(list);
    this.addTagEvent.emit(value);
    this.inputValue = undefined;
  }

  private handleAddTag = () => {
    const value = this.inputValue?.trim();
    if (!value || this.inputLimit) {
      return;
    }
    this.addTagsEmit(value);
  }

  private getTagClassName = (index: number) => {
    return `.${ns.e('inner')} .${ns.namespace}-tag:nth-child(${index + 1})`;
  }

  private handleRemoveTag = (index: number) => {
    const value = (this.value ?? []).slice();
    const [item] = value.splice(index, 1);

    this.value = value;
    this.changeEvent.emit(value);
    this.removeTagEvent.emit({index, item});
  }

  private handleDragStart = (event: DragEvent, index: number) => {
    this.draggingIndex = index;
    this.draggingTag = this.wrapperRef.querySelector(this.getTagClassName(index));

    if (this.draggingTag) {
      this.draggingTag.style.opacity = '0.5';
    }
    event.dataTransfer.effectAllowed = 'move';
  }

  private handleDragOver = (event: DragEvent, index: number) => {
    this.dropIndex = index;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (isUndefined(this.draggingIndex) || this.draggingIndex === index) {
      this.showDropIndicator = false;
      return;
    }

    const dropPosition = this.wrapperRef.querySelector(this.getTagClassName(index)).getBoundingClientRect();
    const dropPrev = !(this.draggingIndex + 1 === index);
    const dropNext = !(this.draggingIndex - 1 === index);
    const distance = event.clientX - dropPosition.left;
    const prevPercent = dropPrev ? (dropNext ? 0.5 : 1) : -1;
    const nextPercent = dropNext ? (dropPrev ? 0.5 : 0) : 1;

    if (distance <= dropPosition.width * prevPercent) {
      this.dropType = 'before';
    } else if (distance > dropPosition.width * nextPercent) {
      this.dropType = 'after';
    } else {
      this.dropType = undefined;
    }

    const innerEl = this.wrapperRef.querySelector<HTMLElement>(`.${ns.e('inner')}`);
    const innerPosition = innerEl.getBoundingClientRect();
    const gap = Number.parseFloat(getElementStyleValue(innerEl, 'gap')) / 2;

    const indicatorTop = dropPosition.top - innerPosition.top;

    let indicatorLeft = -9999;

    if (this.dropType === 'before') {
      indicatorLeft = Math.max(
        dropPosition.left - innerPosition.left - gap,
        Math.floor(-gap / 2)
      )
    } else if (this.dropType === 'after') {
      const left = dropPosition.right - innerPosition.left;
      indicatorLeft = left + (innerPosition.width === left ? Math.floor(gap / 2) : gap)
    }

    setElementStyleValue(
      this.dropIndicatorRef,
      {
        top: `${indicatorTop}px`,
        left: `${indicatorLeft}px`,
      }
    );

    this.showDropIndicator = !!this.dropType;
  }

  private handleDragged = (
    draggingIndex: number,
    dropIndex: number,
    type: 'before' | 'after'
  ) => {
    const value = (this.value ?? []).slice();
    const [draggedItem] = value.splice(draggingIndex, 1);
    const step = dropIndex > draggingIndex && type === 'before'
      ? -1
      : dropIndex < draggingIndex && type === 'after'
        ? 1
        : 0;

    value.splice(dropIndex + step, 0, draggedItem);
    this.value = value;
    this.changeEvent.emit(value);
    this.dragTagEvent.emit({
      draggingIndex,
      dropIndex: dropIndex + step,
      draggedItem
    });
  }

  private handleDragEnd = (event: DragEvent) => {
    event.preventDefault();

    if (this.draggingTag) {
      this.draggingTag.style.opacity = '';
    }

    if (
      this.dropType &&
      !isUndefined(this.draggingIndex) &&
      !isUndefined(this.dropIndex) &&
      this.draggingIndex !== this.dropIndex
    ) {
      this.handleDragged(this.draggingIndex, this.dropIndex, this.dropType);
    }

    this.showDropIndicator = false;
    this.draggingIndex = undefined;
    this.draggingTag = null;
    this.dropIndex = undefined;
    this.dropType = undefined;
  }

  private handleCompositionStart = (event: CompositionEvent) => {
    this.compositionstartEvent.emit(event);
    this.isComposing = true;
  }

  private handleCompositionUpdate = (event: CompositionEvent) => {
    this.compositionupdateEvent.emit(event);
    const text = (event.target as HTMLInputElement).value;
    const lastCharacter = text[text.length - 1] || '';
    this.isComposing = !isKorean(lastCharacter);
  }

  private handleCompositionEnd = (event: CompositionEvent) => {
    this.compositionendEvent.emit(event);
    if (this.isComposing) {
      this.isComposing = false;
    }
    this.handleInput(event);
  }

  private handleInput = (event: Event) => {
    if (this.inputLimit) {
      this.inputValue = undefined;
      return;
    }

    if (this.isComposing) {
      return;
    }

    const value = (event.target as HTMLInputElement).value;
    this.inputValue = value;
    if (this.delimiter && this.inputValue) {
      const tags = this.getDelimitedTags(this.inputValue);
      if (tags.length) {
        this.addTagsEmit(tags)
      }
    }

    this.inputEvent.emit(value);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.isComposing) {
      return;
    }
    const code = getEventCode(event);

    switch(code) {
      case this.trigger:
        event.preventDefault();
        event.stopPropagation();
        this.handleAddTag();
        break;
      case EVENT_CODE.numpadEnter:
        if (this.trigger === EVENT_CODE.enter) {
          event.preventDefault();
          event.stopPropagation();
          this.handleAddTag();
        }
        break;
      case EVENT_CODE.backspace:
        if (!this.inputValue && this.value?.length) {
          event.preventDefault();
          event.stopPropagation();
          this.handleRemoveTag(this.value.length - 1);
        }
        break;
    }
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    if (this.isComposing || !isAndroid()) {
      return;
    }
    const code = getEventCode(event);

    switch(code) {
      case EVENT_CODE.space: {
        if (this.trigger === EVENT_CODE.space) {
          event.preventDefault();
          event.stopPropagation();
          this.handleAddTag();
        }
        break;
      }
    }
  }

  private handleClear = () => {
    this.inputValue = undefined;
    this.value = undefined;
    this.changeEvent.emit(undefined)
    this.clearEvent.emit();
  }

  private resetCalculatorWidth = () => {
    this.calculatorWidth = this.calculatorRef?.getBoundingClientRect().width ?? 0;
  }

  private getDelimitedTags = (input: string) => {
    const tags = input.split(this.delimiter).filter((val) => val && val !== input);
    if (this.max) {
      const maxInsert = this.max - (this.value?.length || 0);
      tags.splice(maxInsert);
    }
    return tags.length === 1 ? tags[0] : tags;
  }

  componentWillLoad() {
    this.hasPrefixSlot = !!this.el.querySelector('[slot=prefix]');

    this.formContext = getFormContext(this.el);
    this.formItemContext = getFormItemContext(this.el);
    this.configProviderContext = getConfigProviderContext(this.el);

    this.handleWatchId();
    this.handleUpdateDisabled();
    this.handleUpdateSize();
    this.handleUpdateShowTagList();
    this.handleWatchWrapperRef();
    this.handleUpdateShowSuffix();
    this.handleUpdateShowClear();
    this.handleUpdateTagSize();
    this.handleUpdateClosable();
    this.handleUpdateInputLimit();
    this.handleUpdateCollapseTagList();
    this.handleUpdateInputStyle();

    this.needStatusIcon = this.formContext?.value.statusIcon ?? false;
    this.validateState = this.formItemContext?.value.validateState || '';
    this.validateIcon = ValidateComponentsMap[this.validateState] || '';

    this.formContext?.change$.subscribe(({key}) => {
      if (key === 'disabled') {
        this.handleUpdateDisabled();
      }
      if (key === 'size') {
        this.handleUpdateSize();
      }
      if (key === 'statusIcon') {
        this.needStatusIcon = this.formContext?.value.statusIcon ?? false;
      }
    });

    this.formItemContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
      if (key === 'validateState') {
        this.validateState = this.formItemContext?.value.validateState || '';
        this.validateIcon = ValidateComponentsMap[this.validateState] || '';
      }
    });

    this.configProviderContext?.change$.subscribe(({key}) => {
      if (key === 'size') {
        this.handleUpdateSize();
      }
    });
  }

  componentDidLoad() {
    this.disconnectCalculatorRefSize = useResizeObserver(
      this.calculatorRef,
      this.resetCalculatorWidth,
    );
  }

  disconnectedCallback() {
    this.disconnectCalculatorRefSize?.();
  }

  render() {
    const containerKls = classNames(
      ns.b(),
      ns.is('focused', this.isFocused),
      ns.is('hovering', this.hovering),
      ns.is('disabled', this.inputTagDisabled),
      ns.m(this.inputTagSize),
      ns.e('wrapper'),
      this.wrapperClass
    );

    const innerKls = classNames(
      ns.e('inner'),
      ns.is('draggable', this.zDraggable),
      ns.is('left-space', !this.value?.length && !this.hasPrefixSlot),
      ns.is('right-space', !this.value?.length && !this.showSuffix)
    );

    return (
      <div
        class={containerKls}
        style={this.wrapperStyle}
        ref={el => this.wrapperRef = el}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {
          this.hasPrefixSlot && (<div class={ns.e('prefix')}>
            <slot name='prefix'></slot>
          </div>)
        }
        <div
          ref={(el) => this.innerRef = el}
          class={innerKls}
        >
          {
            this.showTagList?.map((tag, index) => (
              <zane-tag
                key={index}
                size={this.tagSize}
                closeable={this.closeable}
                type={this.tagType}
                effect={this.tagEffect}
                draggable={this.closeable && this.zDraggable}
                style={this.tagStyle}
                onZClose={() => this.handleRemoveTag(index)}
                onDragStart={(event: DragEvent) => this.handleDragStart(event, index)}
                onDragOver={(event: DragEvent) => this.handleDragOver(event, index)}
                onDragEnd={this.handleDragEnd}
                onDrop={(e) => e.stopPropagation()}
              >
                {tag}
              </zane-tag>
            ))
          }
          {
            (this.collapseTags && this.value && this.value.length > this.maxCollapseTags) && (
              <zane-tippy
                ref={(el) => this.tagTooltipRef = el}
                disabled={!this.collapseTagsTooltip}
                theme={this.tooltipTheme}
                placement='bottom'
              >
                <div
                  ref={(el) => this.collapseItemRef = el}
                >
                  <zane-tag
                    closeable={false}
                    size={this.tagSize}
                    type={this.tagType}
                    effect={this.tagEffect}
                  >
                    + {this.value.length - this.maxCollapseTags}
                  </zane-tag>
                </div>
                <div slot='content' class={ns.e('input-tag-list')}>
                  {
                    this.collapseTagList.map((tag, index) => (
                      <zane-tag
                        key={index}
                        size={this.tagSize}
                        type={this.tagType}
                        effect={this.tagEffect}
                        closeable={this.closeable}
                        onZClose={() => this.handleRemoveTag(index + this.maxCollapseTags)}
                      >
                        {tag}
                      </zane-tag>
                    ))
                  }
                </div>
              </zane-tippy>
            )
          }
          <div class={ns.e('input-wrapper')}>
            <input
              id={this.inputId}
              type="text"
              ref={(el) => this.inputRef = el}
              value={this.inputValue}
              minlength={this.minLength}
              maxlength={this.maxLength}
              disabled={this.inputTagDisabled}
              readonly={this.readonly}
              autocomplete={this.autocomplete}
              tabindex={this.zTabindex}
              placeholder={this.placeholder}
              autofocus={this.autofocus}
              ariaLabel={this.ariaLabel}
              class={ns.e('input')}
              style={this.inputStyle}
              onCompositionstart={this.handleCompositionStart}
              onCompositionend={this.handleCompositionEnd}
              onCompositionupdate={this.handleCompositionUpdate}
              onInput={this.handleInput}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
            />
            <span ref={(el) => this.calculatorRef = el} aria-hidden="true" class={ns.e('input-calculator')}>
              {this.inputValue}
            </span>
          </div>
          <div
            ref={(el) => this.dropIndicatorRef = el}
            class={ns.e('drop-indicator')}
            style={{display: this.showDropIndicator ? undefined : 'none'}}
          ></div>
        </div>
        {
          this.showSuffix && (<div class={ns.e('suffix')}>
            <slot name="suffix"></slot>
            {
              this.showClear && (
                <zane-icon
                  class={classNames(
                    ns.e('icon'),
                    ns.e('clear')
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={this.handleClear}
                  name={this.clearIcon}
                ></zane-icon>
              )
            }
            {
              this.validateState && this.validateIcon && this.needStatusIcon && (
                <zane-icon
                  class={classNames(
                    nsInput.e('icon'),
                    nsInput.e('validateIcon'),
                    nsInput.is('loading', this.validateState === 'validating')
                  )}
                  name={this.validateIcon}
                ></zane-icon>
              )
            }
          </div>)
        }
      </div>
    );
  }
}
