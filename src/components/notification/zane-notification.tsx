import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import classNames from 'classnames';

import { useNamespace } from '../../hooks';
import { useTimeout } from '../../hooks/useTimeout';

import type { NotificationPosition, NotificationType } from './types';

const ns = useNamespace('notification');

/** 通知间距（相邻两条之间的间隔） */
const GAP = 6;

/** 全局实例队列 */
const instances: ZaneNotification[] = [];

/** 全局排队的重算标记 */
let reflowScheduled = false;

/** 最大重试次数（防止无限循环） */
const MAX_REFLOW_RETRIES = 3;

/** 当前重试计数 */
let reflowRetryCount = 0;

/**
 * 安全读取元素渲染高度 — 多策略兜底。
 * Stencil shadow DOM 可能延迟渲染，offsetHeight 在首帧时常为 0。
 */
function measureHeight(el: HTMLElement, inst: ZaneNotification): number {
  // 策略 1: offsetHeight（标准布局高度）
  let h = el.offsetHeight;
  if (h > 0) return h;

  // 策略 2: scrollHeight（overflow:hidden 下等于内容真实高度）
  h = el.scrollHeight;
  if (h > 0) return h;

  // 策略 3: getBoundingClientRect（返回渲染盒尺寸）
  const rect = el.getBoundingClientRect();
  if (rect.height > 0) return rect.height;

  // 策略 4: 基于内容特征估算
  // 有标题+内容的"手动关闭"类型约 ~80px，纯消息约 ~56px
  const hasTitle = !!inst.notificationTitle;
  const msgLen = (inst.message || '').length;
  return hasTitle ? Math.max(80, 56 + Math.ceil(msgLen / 20) * 24) : Math.max(56, 40 + Math.ceil(msgLen / 25) * 22);
}

/**
 * 统一调度全局重排。
 * 三阶段策略：
 *   Phase 1 — 给所有通知设初始定位（让它们进入可测量状态）
 *   等待浏览器布局 + Stencil 渲染完成
 *   Phase 2 — 多策略读取每条通知的真实高度，精算位置后统一显示
 *   如果存在高度为 0 的实例 → 自动重试（最多 MAX_REFLOW_RETRIES 次）
 */
function scheduleGlobalReforce(): void {
  if (reflowScheduled) return;
  reflowScheduled = true;
  reflowRetryCount = 0;

  doReflowPhase();
}

function doReflowPhase(): void {
  requestAnimationFrame(() => {
    // Phase 1：先让所有新通知获得 position 样式（进入文档流可被测量）
    assignInitialPositions();

    // 多等待一帧确保 Stencil shadow DOM 完成渲染
    requestAnimationFrame(() => {
      // 强制触发浏览器回流，确保布局数据是最新的
      void document.body.offsetHeight;

      // Phase 2：基于真实高度精确计算最终位置
      const allValid = calculatePrecisePositions();

      if (!allValid && reflowRetryCount < MAX_REFLOW_RETRIES) {
        // 存在高度仍为 0 的实例，延迟后重试
        reflowRetryCount++;
        setTimeout(() => doReflowPhase(), 16 * reflowRetryCount);
        return; // 不重置 reflowScheduled，继续重试
      }

      reflowScheduled = false;
    });
  });
}

// ========== Phase 1：赋予初始定位（使 offsetHeight 可读）==========

function assignInitialPositions(): void {
  const positions = new Set<NotificationPosition>(instances.map((inst) => inst.position));

  positions.forEach((pos) => {
    const sameDir = instances.filter((inst) => inst.position === pos);
    const hPos = pos.endsWith('right') ? 'right' : 'left';
    const vPos = pos.startsWith('top') ? 'top' : 'bottom';

    sameDir.forEach((inst, idx) => {
      // 先用临时位置占位（具体值不重要，目的是让元素有 position 值）
      inst.positionStyle = {
        [hPos]: '16px',
        [vPos]: `${idx * 80}px`,     // 临时值，仅保证各元素错开避免重叠
        zIndex: String(inst.zIndex + idx),
      };
    });
  });
}

// ========== Phase 2：基于真实高度精确计算最终位置 ==========

/**
 * 计算精确位置。
 * @returns 是否所有实例都读到了有效高度（>0），false 表示存在需要重试的实例
 */
function calculatePrecisePositions(): boolean {
  const positions = new Set<NotificationPosition>(instances.map((inst) => inst.position));
  let allValid = true;

  positions.forEach((pos) => {
    const sameDir = instances.filter((inst) => inst.position === pos);
    let acc = 0;
    const vPos = pos.startsWith('top') ? 'top' : 'bottom';

    sameDir.forEach((inst, idx) => {
      // 距离屏幕边缘的间距
      acc += GAP;

      // 多策略读取渲染高度（应对 Stencil 延迟渲染场景）
      const height = measureHeight(inst.el, inst);

      // offsetHeight 为 0 说明 Stencil 尚未完成渲染，标记需重试
      if (inst.el.offsetHeight <= 0) {
        allValid = false;
      }

      inst.offset = acc;

      // 写入最终精确位置
      inst.positionStyle = {
        ...inst.positionStyle,
        [vPos]: `${acc}px`,
        zIndex: String(inst.zIndex + idx),
      };

      // 累加自身高度 + 间距，供下一条使用
      acc += height + GAP;

      // 显示通知（位置已确定）
      requestAnimationFrame(() => {
        inst.visible = true;
      });
    });

    // 缓存此方向的 vPos，close() 时需要知道是 top 还是 bottom
    sameDir.forEach((inst) => {
      (inst as any).__vPos = vPos;
    });
  });

  return allValid;
}

/** 内联 SVG 图标 — 根据类型返回对应的 VNode */
function renderTypeIcon(type: string) {
  const size = 24;
  switch (type) {
    case 'success':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#67c23a" />
          <path d="M8 12l2.5 2.5L16 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 20h20L12 2z" fill="#e6a23c" />
          <path d="M12 9v4" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="17" r="1" fill="#fff" />
        </svg>
      );
    case 'error':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#f56c6c" />
          <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    case 'info':
    case 'primary':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#409eff" />
          <path d="M12 8v1M12 11v6" stroke="#fff" stroke-width="2" stroke-linecap="round" />
        </svg>
      );
  }
}

/** 渲染关闭按钮 SVG（每次调用返回全新节点，避免 Stencil 缓存冲突） */
function renderCloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
      <path d="M1 1l12 12M13 1l-12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  );
}

@Component({
  styleUrl: 'zane-notification.scss',
  tag: 'zane-notification',
})
export class ZaneNotification {
  @Element() el!: HTMLElement;

  /** 自定义类名 */
  @Prop() customClass: string = '';

  /** 是否将 message 作为 HTML 字符串渲染 */
  @Prop() dangerouslyUseHTMLString: boolean = false;

  /** 自动关闭延迟时间（毫秒），设为 0 则不自动关闭 */
  @Prop({ mutable: true }) duration: number = 4500;

  /** 自定义图标 */
  @Prop() icon: string = '';

  /** 通知 DOM id */
  @Prop({ mutable: true }) notificationId: string = '';

  /** 描述文本 */
  @Prop({ mutable: true }) message: string = '';

  /** 距离屏幕边缘的基础偏移量（由外部动态覆盖） */
  @Prop({ mutable: true }) offset: number = 0;

  /** 标题文字 */
  @Prop({ mutable: true }) notificationTitle: string = '';

  /** 通知类型 */
  @Prop({ mutable: true }) type: NotificationType = '';

  /** 是否显示关闭按钮 */
  @Prop({ mutable: true }) showClose: boolean = true;

  /** 初始 z-index 层级 */
  @Prop() zIndex: number = 2000;

  /** 通知位置 */
  @Prop({ mutable: true }) position: NotificationPosition = 'top-right';

  /** 自定义关闭图标 */
  @Prop({ mutable: true }) closeIcon: string = 'close';

  /** 销毁事件 */
  @Event({ eventName: 'destroy' }) destroyEvent: EventEmitter<void>;

  /** 可见状态 — 默认不可见，等位置计算完成后显示 */
  @State() visible: boolean = false;

  /** 定位内联样式 */
  @State() positionStyle: { [key: string]: string } = {};

  private timeoutHelper = useTimeout(this);

  // ========== 生命周期 ==========

  componentWillLoad() {
    this.startTimer();
    // 注册到全局队列
    instances.push(this);
  }

  componentDidLoad() {
    // 加入全局重排队列，等待统一批量计算位置（避免多通知同时创建时堆叠）
    scheduleGlobalReforce();
  }

  disconnectedCallback() {
    this.clearTimer();
    const idx = instances.indexOf(this);
    if (idx > -1) {
      instances.splice(idx, 1);
    }
  }

  // ========== 关闭逻辑 ==========

  @Watch('duration')
  onDurationChange(): void {
    if (this.visible) {
      this.clearTimer();
      this.startTimer();
    }
  }

  private startTimer(): void {
    if (this.duration > 0) {
      this.timeoutHelper.registerTimeout(() => {
        if (this.visible) {
          this.close();
        }
      }, this.duration);
    }
  }

  private clearTimer(): void {
    this.timeoutHelper.cancelTimeout();
  }

  @Listen('clickClose')
  handleClickClose(): void {
    this.close();
  }

  @Method()
  async close(): Promise<void> {
    if (!this.visible) return;

    this.visible = false;
    const myIdx = instances.indexOf(this);
    if (myIdx === -1) return;

    // 从队列移除自己
    instances.splice(myIdx, 1);

    // 全局重排剩余通知的位置（后续通知向上收拢）
    scheduleGlobalReforce();

    // 等待 CSS transition 退场动画完成（约 300ms）后从 DOM 中移除节点
    const transitionDuration = 350; // 略大于 SCSS 中的 0.3s
    setTimeout(() => {
      // 必须在 remove() 之前 emit，Stencil 事件分发器要求元素仍在 DOM 中
      this.destroyEvent.emit();
      this.el.remove();
    }, transitionDuration);

    // 触发外部内部关闭回调（供 notify.ts 等调用方使用）
    const internalClose = (this.el as any)._internalClose;
    if (typeof internalClose === 'function') {
      internalClose();
    }
  }

  // ========== 交互事件 ==========

  private handleMouseEnter(): void {
    this.clearTimer();
  }

  private handleMouseLeave(): void {
    this.startTimer();
  }

  private handleClick(): void {}

  @Listen('keydown', { target: 'document' })
  handleKeydown(event: KeyboardEvent): void {
    if (!this.visible) return;

    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        this.clearTimer();
        break;
      case 'Escape':
        this.close();
        break;
      default:
        this.startTimer();
        break;
    }
  }

  // ========== 辅助方法 ==========

  get horizontalClass(): string {
    return this.position.endsWith('right') ? 'right' : 'left';
  }

  /** 是否显示左侧类型图标（有 type 或自定义 icon 时显示） */
  get hasTypeIcon(): boolean {
    return !!(this.type || this.icon);
  }

  render() {
    return (
      <Host>
        <div
          class={classNames(
            ns.b(),
            this.horizontalClass,
            this.customClass,
            ns.is('visible', this.visible),
            this.type && ns.m(this.type),
          )}
          role="alert"
          style={this.positionStyle}
          onMouseEnter={() => this.handleMouseEnter()}
          onMouseLeave={() => this.handleMouseLeave()}
          onClick={() => this.handleClick()}
        >
          {/* 左侧类型图标 */}
          {this.hasTypeIcon && (
            <div class={classNames(ns.e('icon'), this.type && ns.m(this.type))}>
              {this.icon ? <zane-icon name={this.icon} /> : renderTypeIcon(this.type || '')}
            </div>
          )}

          {/* 内容组（标题 + 消息） */}
          <div class={ns.e('group')}>
            {this.notificationTitle && (
              <h2 class={ns.e('title')}>{this.notificationTitle}</h2>
            )}

            {this.message && (
              <div
                class={ns.e('content')}
                style={
                  !this.notificationTitle
                    ? ({ margin: '0' } as any)
                    : undefined
                }
              >
                {!this.dangerouslyUseHTMLString ? (
                  <p>{this.message}</p>
                ) : (
                  <p innerHTML={this.message} />
                )}
              </div>
            )}
          </div>

          {/* 右上角关闭按钮 — 放在主容器内，相对通知卡片定位 */}
          {this.showClose && (
            <div
              class={ns.e('closeBtn')}
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                this.handleClickClose();
              }}
            >
              {renderCloseIcon()}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
