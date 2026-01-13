import type { AnyNormalFunction, ComponentSize } from '../../types';
import type { FormContext } from '../form/FormContext';

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { useCursor, useNamespace } from '../../hooks';
import { mutable } from '../../types';
import {
  calcTextareaHeight,
  isClient,
  isKorean,
  isObject,
  nextFrame,
  normalizeStyle,
} from '../../utils';
import { formContexts } from '../form/constants';

type TargetElement = HTMLInputElement | HTMLTextAreaElement;

const nsInput = useNamespace('input');
const nsTextarea = useNamespace('textarea');

@Component({
  styleUrl: 'zane-input.scss',
  tag: 'zane-input',
})
export class ZaneInput {
  @Prop() ariaLabel: string;

  @Prop() autocomplete: AutoFill = 'off';

  @Prop() autofocus: boolean;

  @Prop() autosize: boolean | { maxRows?: number; minRows?: number } = false;

  @Event({ eventName: 'zBlur' }) blurEvent: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zChange' }) changeEvent: EventEmitter<number | string>;

  @Prop() clearable: boolean = false;

  @Event({ eventName: 'zClear' }) clearEvent: EventEmitter<void>;

  @Prop() clearIcon: string = 'circle-close';

  @Event({ eventName: 'zCompositionEnd' })
  compositionendEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: 'zCompositionStart' })
  compositionstartEvent: EventEmitter<CompositionEvent>;

  @Event({ eventName: 'zCompositionUpdate' })
  compositionupdateEvent: EventEmitter<CompositionEvent>;

  @Prop() containerRole: string;

  @Prop() containerStyle: Record<string, string> | string;

  @State() countStyle: any = {};

  @Prop() disabled: boolean = undefined;

  @Element() el: HTMLElement;

  @Event({ eventName: 'zFocus' }) focusEvent: EventEmitter<FocusEvent>;

  @Prop() form: string;

  @Prop() formatter: AnyNormalFunction<any, string>;

  @State() hovering: boolean = false;

  @Event({ eventName: 'zInput' }) inputEvent: EventEmitter<string>;

  @Prop() inputStyle: Record<string, string> | string = mutable({} as const);

  @Prop({ mutable: true }) isComposing: boolean = false;

  @State() isFocused: boolean = false;

  @Event({ eventName: 'zKeyDown' }) keydownEvent: EventEmitter<KeyboardEvent>;

  @Prop() max: number;

  @Prop() maxLength: number | string;

  @Prop() min: number;

  @Prop() minLength: number | string;

  @Event({ eventName: 'zMouseEnter' })
  mouseEnterEvent: EventEmitter<MouseEvent>;

  @Event({ eventName: 'zMouseLeave' })
  mouseLeaveEvent: EventEmitter<MouseEvent>;

  @Prop() name: string;

  @Prop() parser: AnyNormalFunction<any, any>;

  @State() passwordVisible: boolean = false;

  @Prop() placeholder: string;

  @Prop() prefixIcon: string;

  @Prop() readonly: boolean;

  @Prop() resize: 'both' | 'horizontal' | 'none' | 'vertical';

  @Prop() rows: number = 2;

  @Prop() showPassword: boolean;

  @Prop() showWordLimit: boolean;

  @Prop() size: ComponentSize;

  @Prop() step: number;

  @Prop() suffixIcon: string;

  @State() textareaCalcStyle: Record<string, string> = {};

  @Prop() type: string = 'text';

  @Prop() validateEvent: boolean = true;

  @Prop({ mutable: true }) value: null | number | string | undefined = '';

  @Prop() wordLimitPosition: 'inside' | 'outside' = 'inside';

  @Prop({ attribute: 'id' }) zId: string;

  @Prop({ attribute: 'inputmode' }) zInputMode:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';

  @Prop({ attribute: 'tabindex' }) zTabindex: number | string = 0;

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

  private hasAppend: boolean;

  private hasPrefix: boolean;

  private hasPrepend: boolean;

  private hasSuffix: boolean;

  private inputRef: HTMLInputElement;

  private recordCursor: () => void;

  private setCursor: () => void;

  private textareaRef: HTMLTextAreaElement;

  private wrapperRef: HTMLDivElement;

  @Method()
  async clear() {
    this.value = '';
    this.setNativeInputValue();
    this.changeEvent.emit('');
    this.clearEvent.emit();
    this.inputEvent.emit('');
  }

  componentDidLoad() {
    const [recordCursor, setCursor] = useCursor(this.inputRef);
    this.recordCursor = recordCursor;
    this.setCursor = setCursor;

    this.setNativeInputValue();
    nextFrame(() => {
      this.resizeTextarea();
    });
  }

  componentWillLoad() {
    this.hasAppend = !!this.el.querySelector('[slot="append"]');
    this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
    this.hasPrepend = !!this.el.querySelector('[slot="prepend"]');
    this.hasSuffix = !!this.el.querySelector('[slot="suffix"]');

    this.textareaCalcStyle = normalizeStyle(this.inputStyle);
  }

  @Method()
  async getInput() {
    return this.inputRef;
  }

  getInputDisabled(): boolean {
    return this.disabled ?? this.formContext?.disabled ?? false;
  }

  getInputExceed(): boolean {
    return (
      !!this.getIsWordLimitVisible() &&
      this.getTextLength() > Number(this.maxLength)
    );
  }

  getInputSize(): string {
    return this.size || this.formContext?.size || 'default';
  }

  getInputType(): string {
    if (this.showPassword) {
      return this.passwordVisible ? 'text' : 'password';
    }
    return this.type;
  }

  getIsWordLimitVisible(): boolean {
    return (
      this.showWordLimit &&
      !!this.maxLength &&
      (this.type === 'text' || this.type === 'textarea') &&
      !this.getInputDisabled() &&
      !this.readonly &&
      !this.showPassword
    );
  }

  getNativeInput(): HTMLInputElement | HTMLTextAreaElement {
    return this.inputRef || this.textareaRef;
  }

  getNativeInputValue(): string {
    return this.value === null ? '' : String(this.value);
  }

  getShowClear(): boolean {
    return (
      this.clearable &&
      !this.getInputDisabled() &&
      !this.readonly &&
      !!this.getNativeInputValue() &&
      (this.isFocused || this.hovering)
    );
  }

  getShowPwdVisible(): boolean {
    return (
      this.showPassword &&
      !this.getInputDisabled() &&
      !!this.getNativeInputValue()
    );
  }

  getSuffixVisible(): boolean {
    return (
      !!this.hasSuffix ||
      !!this.suffixIcon ||
      this.getShowClear() ||
      this.showPassword ||
      this.getIsWordLimitVisible()
    );
  }

  getTextareaStyle() {
    return {
      ...normalizeStyle(this.inputStyle),
      ...this.textareaCalcStyle,
      resize: this.resize,
    };
  }

  getTextLength(): number {
    return this.getNativeInputValue().length;
  }

  @Watch('type')
  onTypeChange() {
    setTimeout(() => {
      this.setNativeInputValue();
      this.resizeTextarea();
    });
  }

  @Watch('value')
  onValueChange() {
    this.inputRef.value = this.value as string;
    this.resizeTextarea();
    if (this.validateEvent) {
      // elFormItem?.validate?.('change').catch((err) => debugWarn(err))
    }
  }

  render() {
    const isTextarea = this.type === 'textarea';

    const containerClasses = {
      [nsInput.b('group')]: this.hasPrepend || this.hasAppend,
      [nsInput.b('hidden')]: this.type === 'hidden',
      [nsInput.b()]: !isTextarea,
      [nsInput.bm('group', 'append')]: this.hasAppend,
      [nsInput.bm('group', 'prepend')]: this.hasPrepend,
      [nsInput.bm('suffix', 'password-clear')]:
        this.getShowClear() && this.getShowPwdVisible(),
      [nsInput.is('disabled', this.getInputDisabled())]: true,
      [nsInput.is('exceed', this.getInputExceed())]: true,
      [nsInput.m('prefix')]: this.hasPrefix || !!this.prefixIcon,
      [nsInput.m('suffix')]:
        this.hasSuffix ||
        !!this.suffixIcon ||
        this.clearable ||
        this.showPassword,
      [nsInput.m(this.getInputSize())]: true,
      [nsTextarea.b()]: isTextarea,
    };

    return (
      <Host
        class={containerClasses}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.type === 'textarea' ? this.renderTextarea() : this.renderInput()}
      </Host>
    );
  }

  resizeTextarea = () => {
    if (!isClient || this.type !== 'textarea' || !this.textareaRef) return;

    if (this.autosize) {
      const minRows = isObject(this.autosize)
        ? this.autosize.minRows
        : undefined;
      const maxRows = isObject(this.autosize)
        ? this.autosize.maxRows
        : undefined;
      const textareaStyle = calcTextareaHeight(
        this.textareaRef,
        minRows,
        maxRows,
      );

      // If the scrollbar is displayed, the height of the textarea needs more space than the calculated height.
      // If set textarea height in this case, the scrollbar will not hide.
      // So we need to hide scrollbar first, and reset it in next tick.
      // see https://github.com/element-plus/element-plus/issues/8825
      this.textareaCalcStyle = {
        overflowY: 'hidden',
        ...textareaStyle,
      };

      nextFrame(() => {
        // NOTE: Force repaint to make sure the style set above is applied.
        this.textareaRef.offsetHeight;
        this.textareaCalcStyle = textareaStyle;
      });
    } else {
      this.textareaCalcStyle = {
        minHeight: calcTextareaHeight(this.textareaRef).minHeight,
      };
    }
  };

  @Method()
  async select() {
    this.getNativeInput()?.select();
  }

  setNativeInputValue = () => {
    const input = this.inputRef || this.textareaRef;
    const formatterValue = this.formatter
      ? this.formatter(this.getNativeInputValue())
      : this.getNativeInputValue();
    if (!input || input.value === formatterValue) return;
    input.value = formatterValue;
  };

  @Method()
  async zBlur() {
    this.getNativeInput()?.blur();
  }

  @Method()
  async zFocus() {
    this.getNativeInput()?.focus();
  }

  private handleAfterBlur = () => {
    if (this.validateEvent) {
      // elFormItem?.validate?.('blur').catch((error) => debugWarn(error));
    }
  };

  private handleBlur = (event: FocusEvent) => {
    if (
      this.getInputDisabled() ||
      (event.relatedTarget &&
        this.wrapperRef?.contains(event.relatedTarget as Node))
    ) {
      return;
    }
    this.isFocused = false;
    this.blurEvent.emit(event);
    this.handleAfterBlur();
  };

  private handleChange = (event: Event) => {
    let { value } = event.target as TargetElement;

    if (this.formatter && this.parser) {
      value = this.parser(value);
    }

    this.changeEvent.emit(value);
  };

  private handleClear = () => {
    this.clear();
  };

  private handleCompositionEnd = (event: CompositionEvent) => {
    this.compositionendEvent.emit(event);
    if (this.isComposing) {
      this.isComposing = false;
      nextFrame(() => {
        this.handleInput(event);
      });
    }
  };

  private handleCompositionStart = (event: CompositionEvent) => {
    this.compositionstartEvent.emit(event);
    this.isComposing = true;
  };

  private handleCompositionUpdate = (event: CompositionEvent) => {
    this.compositionupdateEvent.emit(event);
    const text = (event.target as HTMLInputElement)?.value;
    const lastCharacter = text[text.length - 1] || '';
    this.isComposing = !isKorean(lastCharacter);
  };

  private handleFocus = (event: FocusEvent) => {
    if (this.getInputDisabled() || this.isFocused) return;

    this.isFocused = true;
    this.focusEvent.emit(event);
  };

  private handleInput = async (event: Event) => {
    this.recordCursor();

    let { value } = event.target as TargetElement;

    if (this.formatter && this.parser) {
      value = this.parser(value);
    }

    // should not emit input during composition
    // see: https://github.com/ElemeFE/element/issues/10516
    if (this.isComposing) return;

    // hack for https://github.com/ElemeFE/element/issues/8548
    // should remove the following line when we don't support IE
    if (value === this.getNativeInputValue()) {
      this.setNativeInputValue();
      return;
    }

    this.value = value;
    this.inputEvent.emit(value);

    nextFrame(() => {
      this.setNativeInputValue();
      this.setCursor();
    });
  };

  private handleKeydown = (evt: KeyboardEvent) => {
    this.keydownEvent.emit(evt);
  };

  private handleMouseEnter = (evt: MouseEvent) => {
    this.hovering = true;
    this.mouseEnterEvent.emit(evt);
  };

  private handleMouseLeave = (evt: MouseEvent) => {
    this.hovering = false;
    this.mouseLeaveEvent.emit(evt);
  };

  private handlePasswordVisible = () => {
    this.recordCursor();
    this.passwordVisible = !this.passwordVisible;
    // The native input needs a little time to regain focus
    setTimeout(this.setCursor);
  };

  private renderInput = () => {
    const wrapperClasses = {
      [nsInput.e('wrapper')]: true,
      [nsInput.is('focus', this.isFocused)]: true,
    };

    return (
      <Fragment>
        {this.hasPrepend && (
          <div class={nsInput.be('group', 'prepend')}>
            <slot name="prepend" />
          </div>
        )}

        <div class={wrapperClasses} ref={(el) => (this.wrapperRef = el)}>
          {(this.hasPrefix || this.prefixIcon) && (
            <span class={nsInput.e('prefix')}>
              <span class={nsInput.e('prefix-inner')}>
                <slot name="prefix"></slot>
                {this.prefixIcon && (
                  <zane-icon
                    class={nsInput.e('icon')}
                    name={this.prefixIcon}
                  ></zane-icon>
                )}
              </span>
            </span>
          )}

          <input
            aria-label={this.ariaLabel}
            autocomplete={this.autocomplete}
            autofocus={this.autofocus}
            class={nsInput.e('inner')}
            disabled={this.getInputDisabled()}
            form={this.form}
            inputmode={this.zInputMode as any}
            max={this.max}
            maxlength={this.maxLength}
            min={this.min}
            minlength={this.minLength}
            name={this.name}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onCompositionend={this.handleCompositionEnd}
            onCompositionstart={this.handleCompositionStart}
            onCompositionupdate={this.handleCompositionUpdate}
            onFocus={this.handleFocus}
            onInput={this.handleInput}
            onKeyDown={this.handleKeydown}
            placeholder={this.placeholder}
            readonly={this.readonly}
            ref={(el) => (this.inputRef = el)}
            step={this.step}
            tabindex={this.zTabindex}
            type={this.getInputType()}
          />

          {this.getSuffixVisible() && (
            <span class={nsInput.e('suffix')}>
              <span class={nsInput.e('suffix-inner')}>
                {(!this.getShowClear() ||
                  !this.getShowPwdVisible() ||
                  !this.getIsWordLimitVisible()) && (
                  <Fragment>
                    <slot name="suffix"></slot>
                    {this.suffixIcon && (
                      <zane-icon
                        class={nsInput.e('icon')}
                        name={this.suffixIcon}
                      ></zane-icon>
                    )}
                  </Fragment>
                )}
                {this.getShowClear() && (
                  <zane-icon
                    class={{
                      [nsInput.e('clear')]: true,
                      [nsInput.e('icon')]: true,
                    }}
                    name={this.clearIcon}
                    onClick={this.handleClear}
                  ></zane-icon>
                )}
                {this.getShowPwdVisible() && (
                  <zane-icon
                    class={{
                      [nsInput.e('icon')]: true,
                      [nsInput.e('password')]: true,
                    }}
                    name="view"
                    onClick={this.handlePasswordVisible}
                  ></zane-icon>
                )}
                {this.getIsWordLimitVisible() && (
                  <span
                    class={{
                      [nsInput.e('count')]: true,
                      [nsInput.is(
                        'outside',
                        this.wordLimitPosition === 'outside',
                      )]: true,
                    }}
                  >
                    <span class={nsInput.e('count-inner')}>
                      {this.getTextLength()} / {this.maxLength}
                    </span>
                  </span>
                )}
              </span>
            </span>
          )}
        </div>

        {this.hasAppend && (
          <div class={nsInput.be('group', 'append')}>
            <slot name="append" />
          </div>
        )}
      </Fragment>
    );
  };

  private renderTextarea = () => {
    return (
      <Fragment>
        <textarea
          aria-label={this.ariaLabel}
          autocomplete={this.autocomplete}
          autofocus={this.autofocus}
          class={{
            [nsInput.is('focus', this.isFocused)]: true,
            [nsTextarea.e('inner')]: true,
          }}
          disabled={this.getInputDisabled()}
          form={this.form}
          maxlength={this.maxLength}
          minlength={this.minLength}
          name={this.name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onCompositionend={this.handleCompositionEnd}
          onCompositionstart={this.handleCompositionStart}
          onCompositionupdate={this.handleCompositionUpdate}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          onKeyDown={this.handleKeydown}
          placeholder={this.placeholder}
          readonly={this.readonly}
          ref={(el) => (this.textareaRef = el)}
          rows={this.rows}
          style={this.getTextareaStyle()}
          tabindex={this.zTabindex}
        />
        {this.getIsWordLimitVisible() && (
          <span
            class={{
              [nsInput.e('count')]: true,
              [nsInput.is('outside', this.wordLimitPosition === 'outside')]:
                true,
            }}
            style={this.countStyle}
          >
            {this.getTextLength()} / {this.maxLength}
          </span>
        )}
      </Fragment>
    );
  };
}
