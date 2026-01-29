import type {
  Content,
  GetReferenceClientRect,
  Instance,
  Placement,
  Plugin,
  PopperElement,
  PopperOptions,
  PopperRect,
  Props,
} from './types';

import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { div } from '../../utils';
import { ROUND_ARROW, TIPPY_DEFAULT_APPEND_TO } from './constants';
import tippy from './tippy';

@Component({
  styleUrl: 'zane-tooltip.scss',
  tag: 'zane-tooltip',
})
export class ZaneTooltip {
  @Prop() allowHTML: boolean = true;

  @Prop() animateFill: boolean = false;

  @Prop() animation: boolean | string = 'fade';

  @Prop() appendTo: 'parent' | ((ref: Element) => Element) | Element =
    TIPPY_DEFAULT_APPEND_TO;

  @Prop() aria: {
    content?: 'auto' | 'describedby' | 'labelledby' | null;
    expanded?: 'auto' | boolean;
  } = { content: 'describedby' };

  @Prop() arrow: boolean | DocumentFragment | string | SVGElement = true;

  @Prop() content: Content = '';

  @Prop() delay: [null | number, null | number] | number = 0;

  @Prop() disabled: boolean = false;

  @Prop() duration: [null | number, null | number] | number = 300;

  @Element() el: HTMLElement;

  @Prop() followCursor: 'horizontal' | 'initial' | 'vertical' | boolean = false;

  @Prop() getReferenceClientRect: GetReferenceClientRect | null = null;

  @Prop() hideOnClick: 'toggle' | boolean = true;

  @Prop() ignoreAttributes: boolean = false;

  @Prop() inertia: boolean = false;

  @Prop() inlinePositioning: boolean = true;

  @Prop() interactive: boolean = false;

  @Prop() interactiveBorder: number = 2;

  @Prop() interactiveDebounce: number = 0;

  @State() isMounted: boolean = false;

  @Prop() maxWidth: number | string = 350;

  @Prop() moveTransition: string = '';

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
    | [number, number] = [0, 10];

  @Prop() placement: Placement = 'top';

  @Prop() plugins: Plugin<unknown>[] = [];

  @Prop() popperOptions: Partial<PopperOptions> = {};

  @Prop() role: string = 'tooltip';

  @Prop() showOnCreate: boolean = false;

  @Prop() sticky: 'popper' | 'reference' | boolean = false;

  @Prop() theme: string = '';

  @Prop() tippyRender:
    | ((instance: Instance) => {
        onUpdate?: (prevProps: Props, nextProps: Props) => void;
        popper: PopperElement;
      })
    | null;

  @Prop() touch: 'hold' | ['hold', number] | boolean = true;

  @Prop() trigger: string = 'mouseenter focus';

  @Prop() triggerTarget: Element | Element[] | null = null;

  @Event({ eventName: 'zClickOutside' }) zaneClickOutside: EventEmitter<
    Instance<Props>
  >;

  // 被完全隐藏并从DOM中卸载，就会调用。
  @Event({ eventName: 'zHidden' }) zaneHidden: EventEmitter<Instance<Props>>;

  // 一旦开始隐藏，就会调用。
  @Event({ eventName: 'zHide' }) zaneHide: EventEmitter<Instance<Props>>;

  // 在将挂载到DOM（并创建 popperInstance）后调用。
  @Event({ eventName: 'zMount' }) zaneMount: EventEmitter<Instance<Props>>;

  // 一旦开始显示，就会调用。
  @Event({ eventName: 'zShow' }) zaneShow: EventEmitter<Instance<Props>>;

  @Prop() zIndex: number = 9999;

  // 用于标记是否已经初始化
  private isInitialized: boolean = false;

  // 用于存储slot内容的引用
  private slotContentRef: HTMLElement | null = null;

  // Tippy实例引用
  private tippyInstance: Instance<Props>;

  // 触发元素引用
  private triggerElement: HTMLElement;

  // 组件加载完成后初始化
  componentDidLoad() {
    // 只执行一次初始化
    if (!this.isInitialized) {
      this.initializeTippy();
      this.isInitialized = true;
    }
  }

  // 公共方法：禁用工具提示
  @Method()
  async disable() {
    if (this.tippyInstance) {
      this.tippyInstance.disable();
    }
  }

  // 组件卸载时清理
  disconnectedCallback() {
    const contentSlot = this.el.querySelector('[slot="content"]');
    if (contentSlot && this.slotContentRef) {
      while (this.slotContentRef.firstChild) {
        contentSlot.append(this.slotContentRef.firstChild);
      }
      this.slotContentRef?.remove();
      this.slotContentRef = null;
    }
    this.destroyTippy();
  }

  // 公共方法：启用工具提示
  @Method()
  async enable() {
    if (this.tippyInstance) {
      this.tippyInstance.enable();
    }
  }

  // 监听属性变化
  @Watch('content')
  @Watch('placement')
  @Watch('trigger')
  @Watch('maxWidth')
  @Watch('arrow')
  @Watch('delay')
  @Watch('disabled')
  handlePropsChange() {
    this.updateTippyInstance();
  }

  // 公共方法：隐藏工具提示
  @Method()
  async hide() {
    if (this.tippyInstance) {
      this.tippyInstance.hide();
    }
  }

  @Method()
  async isFocusInsideContent(event?: FocusEvent) {
    const popperContent: HTMLElement | undefined = this.tippyInstance.popper;
    const activeElement =
      (event?.relatedTarget as Node) || document.activeElement;
    return popperContent?.contains(activeElement);
  }

  @Method()
  async isVisible() {
    return this.tippyInstance.state.isVisible;
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <slot name="content"></slot>
      </Host>
    );
  }

  // 公共方法：显示工具提示
  @Method()
  async show() {
    if (this.tippyInstance && !this.disabled) {
      this.tippyInstance.show();
    }
  }

  // 销毁Tippy实例
  private destroyTippy() {
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
      this.tippyInstance = null;
    }
  }

  // 获取工具提示内容
  private getTooltipContent(): Content {
    if (this.content) {
      return this.content;
    }

    // 如果通过slot传递内容
    const contentSlot = this.el.querySelector('[slot="content"]') as HTMLElement;
    if (contentSlot) {
      this.slotContentRef = div();
      this.slotContentRef.className = contentSlot.className;
      this.slotContentRef.style.cssText = contentSlot.style.cssText;
      // 直接循环 childNodes
      while (contentSlot.firstChild) {
        this.slotContentRef.append(contentSlot.firstChild);
      }
      return this.slotContentRef;
    }

    return '';
  }

  // 初始化Tippy实例
  private initializeTippy() {
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
    }

    if (this.el.children.length === 0) {
      console.warn('Tooltip组件需要一个触发元素作为子元素');
      return;
    }

    this.triggerElement = this.el.children[0] as HTMLElement;

    let arrow = this.arrow;

    if (this.arrow === 'round') {
      arrow = ROUND_ARROW;
    }

    // 配置Tippy选项
    const options: Partial<Props> = {
      allowHTML: this.allowHTML,
      animateFill: this.animateFill,
      animation: this.animation,
      appendTo: this.appendTo,
      aria: this.aria,
      arrow,
      content: this.getTooltipContent(),
      delay: this.delay,
      duration: this.duration,
      followCursor: this.followCursor,
      getReferenceClientRect: this.getReferenceClientRect,
      hideOnClick: this.hideOnClick,
      ignoreAttributes: this.ignoreAttributes,
      inertia: this.inertia,
      inlinePositioning: this.inlinePositioning,
      interactive: this.interactive,
      interactiveBorder: this.interactiveBorder,
      interactiveDebounce: this.interactiveDebounce,
      maxWidth: this.maxWidth,
      moveTransition: this.moveTransition,
      offset: this.offset,
      onClickOutside: (instance: Instance<Props>) => {
        this.zaneClickOutside.emit(instance);
      },
      onHidden: (instance: Instance<Props>) => {
        this.zaneHidden.emit(instance);
      },
      onHide: (instance: Instance<Props>) => {
        this.zaneHide.emit(instance);
        return undefined;
      },
      onMount: (instance: Instance<Props>) => {
        this.isMounted = true;
        this.zaneMount.emit(instance);
      },
      onShow: (instance: Instance<Props>) => {
        this.zaneShow.emit(instance);
        return undefined;
      },
      placement: this.placement,
      plugins: this.plugins,
      popperOptions: this.popperOptions,
      role: this.role,
      showOnCreate: this.showOnCreate,
      sticky: this.sticky,
      theme: this.theme,
      touch: this.touch,
      trigger: this.trigger,
      triggerTarget: this.triggerTarget,
      zIndex: this.zIndex,
    };

    if (this.tippyRender) {
      (this.tippyRender as any).$$tippy = true;
      options.render = this.tippyRender;
    }

    // 创建Tippy实例
    this.tippyInstance = tippy(this.triggerElement, options) as Instance<Props>;

    // 禁用状态处理
    if (this.disabled) {
      this.tippyInstance.disable();
    }
  }

  // 更新Tippy实例
  @Method()
  async updateTippyInstance() {
    if (!this.tippyInstance) return;

    // 更新其他属性
    const props: Partial<Props> = {
      animation: this.animation,
      arrow: this.arrow,
      delay: this.delay,
      interactive: this.interactive,
      maxWidth: this.maxWidth,
      offset: this.offset,
      placement: this.placement,
      theme: this.theme,
      trigger: this.trigger,
    };

    this.tippyInstance.setProps(props);

    // 更新禁用状态
    if (this.disabled) {
      this.tippyInstance.disable();
    } else {
      this.tippyInstance.enable();
    }
  }
}
