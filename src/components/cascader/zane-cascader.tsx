import type { EventEmitter } from '@stencil/core';

import type { ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';
import type { FormItemContext } from '../form/FormItemContext';
import type { CascaderNode } from './node';
import type { CascaderOption, Tag } from './types';

import {
  Component,
  Element,
  Event,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import state from '../../global/store';
import { useNamespace } from '../../hooks';
import {
  debugWarn,
  isClient,
  isFocusable,
  isKorean,
  nextFrame,
} from '../../utils';
import { formContexts, formItemContexts } from '../form/constants';

const ns = useNamespace('cascader');
const nsInput = useNamespace('input');

// const SCOPE = 'zane-cascader';

@Component({
  styleUrl: 'zane-cascader.scss',
  tag: 'zane-cascader',
})
export class ZaneCascader {
  @Event({ eventName: 'zBlur' }) blurEvent: EventEmitter<FocusEvent>;

  @Prop() checkOnClickNode: boolean;

  @Prop() clearable: boolean;

  @Event({ eventName: 'zClear' }) clearEvent: EventEmitter<void>;

  @Prop() clearIcon: string = 'circle-close';

  @Prop() collapseTags: boolean;

  @Prop() collapseTagsTooltip: boolean;

  @Event({ eventName: 'zCompositionEnd' })
  compositionendEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: 'zCompositionStart' })
  compositionstartEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: 'zCompositionUpdate' })
  compositionupdateEvent: EventEmitter<CompositionEvent>;

  @Prop() debounce: number = 300;

  @Prop() disabled: boolean = undefined;

  @Element() el: HTMLElement;

  @Prop() filterable: boolean;

  @State() filtering: boolean = false;

  @Prop() filterMethod: (node: CascaderNode, keyword: string) => boolean;

  @Event({ eventName: 'zFocus' }) focusEvent: EventEmitter<FocusEvent>;

  @State() inputHover: boolean = false;

  @State() inputValue: string = '';

  @State() isComposing: boolean = false;

  @State() isFocused: boolean = false;

  @Prop() maxCollapseTags: number = 1;

  @Prop() maxCollapseTagsTooltipHeight: number | string;

  @Prop() multiple: boolean = false;

  @Prop() options: CascaderOption[] = [];

  @Prop() placeholder: string = 'Select';

  @Prop() placement:
    | 'bottom'
    | 'bottom-start'
    | 'left'
    | 'right'
    | 'top'
    | 'top-start' = 'bottom-start';

  @Prop() popperTheme: string = 'cascader';

  @State() popperVisible: boolean = false;

  @State() searchInputValue: string = '';

  @Prop() separator: string = ' / ';

  @Prop() showAllLevels: boolean = true;

  @Prop() showCheckedStrategy: 'child' | 'parent' = 'child';

  @Prop() showPrefix: boolean = true;

  @Prop() size: ComponentSize;

  @State() tags: Tag[] = [];

  @Prop() validateEvent: boolean = true;

  @Event({ eventName: 'visibleChange' })
  visibleChangeEvent: EventEmitter<boolean>;

  @Prop() wrapperStyle: Record<string, string>;

  get formContext(): FormContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-FORM') {
        context = formContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  get formItemContext(): FormItemContext {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-FORM-ITEM') {
        context = formItemContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  private cascaderPanelRef: HTMLZaneCascaderPanelElement;

  private hasPrefix: boolean;

  private inputInitialHeight = 0;

  private inputRef: HTMLZaneInputElement;

  private suggestionPanel: HTMLZaneScrollbarElement;

  private tagTooltipRef: HTMLZaneTooltipElement;

  private tagWrapper: HTMLElement;

  private tooltipRef: HTMLZaneTooltipElement;

  private wrapperRef: HTMLElement;

  @Prop() beforeFilter: (value: string) => boolean | Promise<any> = () => true;

  componentWillLoad() {
    this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
  }

  @Watch('tags')
  handleWatchTags() {
    nextFrame(() => {
      this.updateStyle();
    });
  }

  render() {
    const cascaderKls = [
      ns.b(),
      ns.m(this.getRealSize()),
      ns.is('disabled', this.getIsDisabled()),
      this.el.className,
    ].join(' ');
    return (
      <Host>
        <zane-tooltip
          arrow={false}
          hideOnClick={false}
          interactive={true}
          offset={[0, 1]}
          onZClickOutside={this.handleClickOutside}
          onZHide={this.handleHide}
          placement={this.placement}
          ref={(el) => (this.tooltipRef = el)}
          theme={this.popperTheme}
          trigger="manual"
        >
          <div
            class={cascaderKls}
            onBlur={this.handleBlur}
            onClick={this.handleClick}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            onMouseEnter={() => (this.inputHover = true)}
            onMouseLeave={() => (this.inputHover = false)}
            ref={(el) => (this.wrapperRef = el)}
            style={this.wrapperStyle}
            tabIndex={this.getIsDisabled ? -1 : undefined}
          >
            <zane-input
              class={ns.is('focus')}
              disabled={this.getIsDisabled()}
              onZCompositionEnd={this.handleCompositionEnd}
              onZCompositionStart={this.handleCompositionStart}
              onZCompositionUpdate={this.handleCompositionUpdate}
              placeholder={
                this.searchInputValue ||
                this.tags.length > 0 ||
                this.isComposing
                  ? ''
                  : this.placeholder
              }
              readonly={!this.filterable || this.multiple}
              ref={(el) => (this.inputRef = el)}
              size={this.getRealSize()}
              validateEvent={false}
              value={this.inputValue}
            >
              {this.hasPrefix && <slot name="prefix"></slot>}
              <div slot="suffix">
                {this.getClearBtnVisible() ? (
                  <zane-icon
                    class={[nsInput.e('icon'), 'icon-circle-close'].join(' ')}
                    key="clear"
                    name={this.clearIcon}
                    onClick={this.handleClear}
                  ></zane-icon>
                ) : (
                  <zane-icon
                    class={[
                      nsInput.e('icon'),
                      'icon-arrow-down',
                      ns.is('reverse', this.popperVisible),
                    ].join(' ')}
                    key="arrow-down"
                    name="arrow-down"
                  ></zane-icon>
                )}
              </div>
            </zane-input>

            {this.multiple && (
              <div
                class={[
                  ns.e('tags'),
                  ns.is('validate', !!this.formItemContext?.validateState),
                ].join(' ')}
                ref={(el) => (this.tagWrapper = el)}
              >
                {this.getShowTagList().map((tag: Tag) => (
                  <zane-tag key={tag.key}></zane-tag>
                ))}
              </div>
            )}
          </div>
        </zane-tooltip>
      </Host>
    );
  }

  private getClearBtnVisible() {
    if (
      !this.clearable ||
      this.getIsDisabled() ||
      this.filtering ||
      (!this.inputHover && !this.isFocused)
    ) {
      return false;
    }
    return !!this.cascaderPanelRef.checkedNodes.length;
  }

  private getIsDisabled() {
    return this.disabled ?? this.formContext?.disabled ?? false;
  }

  private getPresentText() {
    if (this.cascaderPanelRef.checkedNodes.length) {
      return this.multiple
        ? ''
        : this.cascaderPanelRef.checkedNodes[0]?.calcText(
            this.showAllLevels,
            this.separator,
          );
    }
    return '';
  }

  private getRealSize() {
    return (
      this.size ||
      this.formItemContext?.size ||
      this.formContext?.size ||
      state.size ||
      ''
    );
  }

  private getShowTagList() {
    if (!this.multiple) {
      return [];
    }

    return this.collapseTags
      ? this.tags.slice(0, this.maxCollapseTags)
      : this.tags;
  }

  private handleBlur = async (event: FocusEvent) => {
    const isFocusInsideTooltipContent =
      await this.tooltipRef.isFocusInsideContent(event);

    const isFocusInsideTagTooltipContent =
      await this.tagTooltipRef.isFocusInsideContent(event);

    const cancelBlur =
      isFocusInsideTooltipContent || isFocusInsideTagTooltipContent;

    if (
      this.getIsDisabled() ||
      (event.relatedTarget &&
        this.wrapperRef.contains(event.relatedTarget as Node)) ||
      cancelBlur
    ) {
      return;
    }

    this.isFocused = false;
    this.blurEvent.emit(event);
    if (this.validateEvent) {
      this.formItemContext?.validate('blur').catch((error) => debugWarn(error));
    }
  };

  private handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    this.cascaderPanelRef.clearCheckedNodes();
    if (!this.popperVisible && this.filterable) {
      this.syncPresentTextValue();
    }
    this.togglePopperVisible(false);
    this.clearEvent.emit();
  };

  private handleClick = (event: Event) => {
    this.togglePopperVisible(
      !this.filterable || this.multiple ? undefined : true,
    );
    if (
      this.getIsDisabled() ||
      isFocusable(event.target as HTMLElement) ||
      (this.wrapperRef.contains(document.activeElement) &&
        this.wrapperRef !== document.activeElement)
    ) {
      return;
    }

    this.inputRef.focus();
  };

  private handleClickOutside = () => {};

  private handleCompositionEnd = (event: CustomEvent<CompositionEvent>) => {
    this.compositionendEvent.emit(event.detail);
    if (this.isComposing) {
      this.isComposing = false;
      nextFrame(() => {
        const text = (event.detail.target as HTMLInputElement)?.value;
        this.handleInput(text);
      });
    }
  };

  private handleCompositionStart = (event: CustomEvent<CompositionEvent>) => {
    this.compositionstartEvent.emit(event.detail);
    this.isComposing = true;
  };

  private handleCompositionUpdate = (event: CustomEvent<CompositionEvent>) => {
    this.compositionupdateEvent.emit(event.detail);
    const text = (event.target as HTMLInputElement)?.value;
    const lastCharacter = text[text.length - 1] || '';
    this.isComposing = !isKorean(lastCharacter);
  };

  private handleFilter = () => {};

  private handleFocus = async (event: FocusEvent) => {
    const isFocusInsideTooltipContent =
      await this.tooltipRef.isFocusInsideContent(event);

    const isFocusInsideTagTooltipContent =
      await this.tagTooltipRef.isFocusInsideContent(event);

    const cancelFocus =
      isFocusInsideTooltipContent || isFocusInsideTagTooltipContent;

    if (this.getIsDisabled() || this.isFocused || cancelFocus) {
      return;
    }

    this.isFocused = true;
    this.focusEvent.emit(event);
    if (this.validateEvent) {
      this.formItemContext?.validate('blur').catch((error) => debugWarn(error));
    }
  };

  private handleHide = () => {};

  private handleInput = (val: string, e?: InputEvent) => {
    this.tooltipRef.isVisible().then((visible: boolean) => {
      if (!visible) {
        this.togglePopperVisible(true);
      }
    });

    if (e?.isComposing) {
      return;
    }

    val ? this.handleFilter() : this.hideSuggestionPanel();
  };

  private handleKeyDown = () => {};

  private hideSuggestionPanel = () => {};

  private syncPresentTextValue = () => {
    const presentText = this.getPresentText();
    this.inputValue = presentText;
    this.searchInputValue = presentText;
  };

  private togglePopperVisible = (visible?: boolean) => {
    if (this.getIsDisabled()) {
      return;
    }

    visible = visible ?? !this.popperVisible;

    if (visible !== this.popperVisible) {
      this.popperVisible = visible;
      this.inputRef.getInput().then((nativeInput: HTMLInputElement) => {
        nativeInput?.setAttribute('aria-expanded', `${visible}`);
      });

      if (visible) {
        this.updatePopperPosition();
        if (this.cascaderPanelRef) {
          nextFrame(() => {
            this.cascaderPanelRef.scrollToExpandingNode();
          });
        }
      } else {
        this.syncPresentTextValue();
      }
    }
  };

  private updatePopperPosition = () => {
    nextFrame(() => {
      this.tooltipRef.show();
    });
  };

  private updateStyle = async () => {
    const inputInner = await this.inputRef?.getInput();
    if (!isClient || !inputInner) {
      return;
    }

    if (this.suggestionPanel) {
      const suggestionList: HTMLElement = this.suggestionPanel.querySelector(
        `.${ns.e('suggestion-list')}`,
      );
      suggestionList.style.minWidth = `${inputInner.offsetWidth}px`;
    }

    if (this.tagWrapper) {
      const { offsetHeight } = this.tagWrapper;
      const height =
        this.tags.length > 0
          ? `${Math.max(offsetHeight, this.inputInitialHeight) - 2}px`
          : `${this.inputInitialHeight}px`;
      inputInner.style.height = height;
      this.updatePopperPosition();
    }
  };
}
