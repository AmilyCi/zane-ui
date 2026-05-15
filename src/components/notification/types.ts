export const notificationTypes = [
  'primary',
  'success',
  'info',
  'warning',
  'error',
] as const;

export type NotificationType = (typeof notificationTypes)[number] | '';

export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface NotificationProps {
  /** 自定义类名 */
  customClass?: string;
  /** 是否将 message 作为 HTML 字符串渲染 */
  dangerouslyUseHTMLString?: boolean;
  /** 自动关闭延迟时间（毫秒），设为 0 则不自动关闭 */
  duration?: number;
  /** 自定义图标组件，会被 type 覆盖 */
  icon?: string;
  /** 通知 DOM id */
  id?: string;
  /** 描述文本 */
  message?: string;
  /** 距离屏幕顶部的偏移量 */
  offset?: number;
  /** 点击通知时的回调函数 */
  onClick?: () => void;
  /** 关闭时的回调函数 */
  onClose: () => void;
  /** 自定义位置 */
  position?: NotificationPosition;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 标题文字 */
  title?: string;
  /** 通知类型 */
  type?: NotificationType;
  /** 初始 z-index 层级 */
  zIndex?: number;
  /** 自定义关闭图标，默认为 Close */
  closeIcon?: string;
}

export interface NotificationOptions extends Omit<NotificationProps, 'id' | 'onClose'> {
  /** 设置通知挂载的根元素，默认为 document.body */
  appendTo?: HTMLElement | string;
  /** 关闭时的回调函数 */
  onClose?(): void;
}

export interface NotificationHandle {
  close: () => void;
}

export type NotificationParams = Partial<NotificationOptions> | string;

export interface NotifyFn {
  (options?: NotificationParams): NotificationHandle;
  closeAll(): void;
  updateOffsets(position?: NotificationPosition): void;
}

export interface Notify extends NotifyFn {
  primary(options?: NotificationParams): NotificationHandle;
  success(options?: NotificationParams): NotificationHandle;
  warning(options?: NotificationParams): NotificationHandle;
  error(options?: NotificationParams): NotificationHandle;
  info(options?: NotificationParams): NotificationHandle;
}

export interface NotificationInstance {
  visible: boolean;
  close: () => void;
  el: HTMLElement;
}
