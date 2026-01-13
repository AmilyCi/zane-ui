import type { CollapseContext } from '../../interfaces';
import type { CollapseActiveName } from '../../types';

import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

import { collapseContexts } from '../../constants';
import state from '../../global/store';
import { useNamespace } from '../../hooks';
import { getTransitionInfo, nextFrame, whenTransitionEnds } from '../../utils';

const ns = useNamespace('collapse');

@Component({
  tag: 'zane-collapse-item',
})
export class ZaneCollapseItem {
  @Prop() disabled: boolean;

  @Element() el: HTMLElement;

  @State() focusing = false;

  @Prop() icon?: string = 'arrow-right';

  @State() isActive: boolean = false;

  @State() isClick = false;

  @Prop({ attribute: 'title' }) label: string = '';

  @Prop() name?: CollapseActiveName;

  @State() wrapperRef: HTMLElement;

  get arrowKls() {
    return [ns.be('item', 'arrow'), ns.is('active', this.isActive)].join(' ');
  }

  get collapseContext(): CollapseContext | null {
    let parent = this.el.parentElement;
    let context = null;
    while (parent) {
      if (parent.tagName === 'ZANE-COLLAPSE') {
        context = collapseContexts.get(parent);
        break;
      }
      parent = parent.parentElement;
    }
    return context;
  }

  get collapseItemName() {
    return (
      this.name ?? `${ns.namespace}-id-${state.idInjection.prefix}-${this.id}`
    );
  }

  get headKls() {
    return [
      ns.be('item', 'header'),
      ns.is('active', this.isActive),
      this.focusing && !this.disabled ? 'focusing' : '',
    ].join(' ');
  }

  get id() {
    return state.idInjection.current++;
  }

  get itemContentKls() {
    return ns.be('item', 'content');
  }

  get itemTitleKls() {
    return ns.be('item', 'title');
  }

  get itemWrapperKls() {
    return ns.be('item', 'wrap');
  }

  get rootKls() {
    return [
      ns.b('item'),
      ns.is('active', this.isActive),
      ns.is('disabled', this.disabled),
    ].join(' ');
  }

  get scopedContentId() {
    return ns.b(`content-${this.id}`);
  }

  get scopedHeadId() {
    return ns.b(`head-${this.id}`);
  }

  private updateCallback: () => void;

  private wrapperHeight: string;

  componentDidLoad() {
    const bodyStyle = getComputedStyle(this.wrapperRef);
    this.wrapperHeight = bodyStyle.height;
    this.isActive ? this.handleShow() : this.handleHidden();
  }

  componentWillLoad() {
    this.updateCallback = () => {
      const context = this.collapseContext;
      if (context) {
        this.isActive = context.activeNames.includes(this.name);
      }
    };
    const context = this.collapseContext;
    if (context) {
      this.isActive = context.activeNames.includes(this.name);
      context.addActiveNamesChangeListener(this.updateCallback);
    }
  }

  disconnectedCallback() {
    this.collapseContext?.removeActiveNamesChangeListener(this.updateCallback);
  }

  handleEnterClick(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target?.closest('input, textarea, select')) return;
    e.preventDefault();
    this.collapseContext?.handleItemClick(this.collapseItemName);
  }

  handleFocus() {
    setTimeout(() => {
      if (this.isClick) {
        this.isClick = false;
      } else {
        this.focusing = true;
      }
    }, 50);
  }

  handleHeaderClick = (e: MouseEvent) => {
    if (this.disabled) return;
    const target = e.target as HTMLElement;
    if (target?.closest('input, textarea, select')) return;
    this.collapseContext?.handleItemClick(this.collapseItemName);
    this.focusing = false;
    this.isClick = true;
  };

  handleHidden() {
    if (this.wrapperRef) {
      const { timeout } = getTransitionInfo(this.wrapperRef, 'transition');
      this.wrapperRef.style.height = '0';
      whenTransitionEnds(this.wrapperRef, 'transition', timeout, () => {
        this.wrapperRef.style.display = 'none';
      });
    }
  }

  handleShow() {
    if (this.wrapperRef) {
      this.wrapperRef.style.display = '';
      nextFrame(() => {
        this.wrapperRef.style.height = this.wrapperHeight;
      });
    }
  }

  render() {
    return (
      <div class={this.rootKls}>
        <div
          class={this.headKls}
          id={this.scopedHeadId}
          onBlur={() => (this.focusing = false)}
          onClick={this.handleHeaderClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleEnterClick}
          role="button"
          tabindex={this.disabled ? -1 : 0}
        >
          <span class={this.itemTitleKls}>
            <slot name="title">{this.label}</slot>
          </span>
          <slot name="icon">
            {this.icon && (
              <zane-icon class={this.arrowKls} name={this.icon}></zane-icon>
            )}
          </slot>
        </div>

        <div
          class={this.itemWrapperKls}
          id={this.scopedContentId}
          ref={(el) => (this.wrapperRef = el)}
        >
          <div class={this.itemContentKls}>
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }

  @Watch('isActive')
  watchIsActiveHandler(val: boolean) {
    val ? this.handleShow() : this.handleHidden();
  }
}
