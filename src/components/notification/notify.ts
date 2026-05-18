import type {
  NotificationInstance,
  NotificationOptions,
  NotificationPosition,
  NotificationParams,
  NotifyFn,
  Notify,
} from './types';
import { notificationTypes } from './types';

// 各方向的通知队列
const notifications: Record<NotificationPosition, NotificationInstance[]> = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};

// 通知之间的间距
const GAP_SIZE = 16;
let seed = 1;
let zIndexCounter = 2000;

const notify: NotifyFn & Partial<Notify> = function (
  options: NotificationParams = {},
) {
  // 参数规范化：字符串自动转为 { message }
  if (typeof options === 'string') {
    options = { message: options };
  }

  const position = options.position || 'top-right';

  // 计算垂直偏移量
  let verticalOffset = options.offset || 0;
  notifications[position].forEach((instance) => {
    verticalOffset += instance.el.offsetHeight + GAP_SIZE;
  });
  verticalOffset += GAP_SIZE;

  const id = `notification_${seed++}`;
  const userOnClose = options.onClose;
  const currentZIndex = ++zIndexCounter;

  // 创建容器
  const container = document.createElement('div');

  // 创建通知元素
  const el = document.createElement('zane-notification');
  el.setAttribute('id', id);
  el.style.position = 'fixed';
  if (options.position?.endsWith('right')) {
    el.classList.add('right');
    el.style.right = '16px';
  } else {
    el.classList.add('left');
    el.style.left = '16px';
  }

  if (position.startsWith('top')) {
    el.style.top = `${verticalOffset}px`;
  } else {
    el.style.bottom = `${verticalOffset}px`;
  }
  el.style.zIndex = `${currentZIndex}`;

  if (options.customClass) {
    el.classList.add(options.customClass);
  }
  if (options.type) {
    el.setAttribute('type', options.type);
  }
  if (options.title !== undefined) {
    el.setAttribute('notification-title', options.title);
  }
  if (options.message !== undefined) {
    el.setAttribute('message', options.message);
  }
  if (options.icon) {
    el.setAttribute('icon', options.icon);
  }
  if (options.closeIcon) {
    el.setAttribute('close-icon', options.closeIcon);
  }
  if (!options.showClose && options.showClose === false) {
    el.setAttribute('show-close', 'false');
  }
  if (options.duration !== undefined) {
    el.setAttribute('duration', String(options.duration));
  }
  if (options.dangerouslyUseHTMLString) {
    el.setAttribute('dangerously-use-html-string', 'true');
  }

  // 设置关闭回调
  const closeCallback = () => {
    close(id, position, userOnClose as () => void);
  };
  el.setAttribute('on-close-callback', '');

  // 监听 destroy 事件
  el.addEventListener('destroy', () => {
    setTimeout(() => {
      container.remove();
    }, 300);
  });

  // 挂载到目标元素
  let appendTo: HTMLElement = document.body;
  if (options.appendTo instanceof HTMLElement) {
    appendTo = options.appendTo;
  } else if (typeof options.appendTo === 'string') {
    const target = document.querySelector(options.appendTo);
    if (target instanceof HTMLElement) {
      appendTo = target;
    }
  }

  container.appendChild(el);
  appendTo.appendChild(container);

  // 等待组件初始化完成
  requestAnimationFrame(() => {
    const component = el as unknown as NotificationInstance;
    notifications[position].push(component);

    // 设置内部关闭方法引用
    (el as any)._internalClose = closeCallback;
    (el as any)._userOnClose = userOnClose;
  });

  return {
    close: () => {
      const component = el as unknown as NotificationInstance;
      if (component.close) {
        component.close();
      }
    },
  };
};

/**
 * 关闭指定通知
 * @param id 通知 ID
 * @param position 位置
 * @param userOnClose 用户传入的关闭回调
 */
function close(
  id: string,
  position: NotificationPosition,
  userOnClose?: () => void,
): void {
  const orientedNotifications = notifications[position];
  const idx = orientedNotifications.findIndex(
    (instance) => instance.el.id === id,
  );
  if (idx === -1) return;

  const instance = orientedNotifications[idx];
  if (!instance) return;

  // 调用用户关闭回调
  userOnClose?.();

  // 在动画结束前获取高度
  const removedHeight = instance.el.offsetHeight;
  const verticalPos = position.split('-')[0];

  orientedNotifications.splice(idx, 1);

  // 更新后续通知的位置
  for (let i = idx; i < orientedNotifications.length; i++) {
    const { el } = orientedNotifications[i];
    const currentValue =
      verticalPos === 'top' ? el.offsetTop : getBottomOffset(el);
    const pos = currentValue - removedHeight - GAP_SIZE;
    if (verticalPos === 'top') {
      el.style.top = `${pos}px`;
    } else {
      el.style.bottom = `${pos}px`;
    }
  }
}

/** 获取元素距离底部的偏移量 */
function getBottomOffset(el: HTMLElement): number {
  return window.innerHeight - el.getBoundingClientRect().bottom;
}

/** 关闭所有通知 */
function closeAll(): void {
  for (const orientedNotifications of Object.values(notifications)) {
    orientedNotifications.forEach((instance) => {
      instance.close();
    });
  }
}

/** 更新指定方向的偏移量 */
function updateOffsets(position: NotificationPosition = 'top-right'): void {
  let verticalOffset =
    notifications[position][0]?.el?.style &&
      (notifications[position][0].el.style.top ||
        notifications[position][0].el.style.bottom)
      ? parseInt(
          notifications[position][0].el.style.top ||
            getBottomOffsetString(notifications[position][0].el),
          10,
        )
      : 0;

  for (const instance of notifications[position]) {
    const { el } = instance;
    if (position.startsWith('top')) {
      el.style.top = `${verticalOffset}px`;
    } else {
      el.style.bottom = `${verticalOffset}px`;
    }
    verticalOffset += el.offsetHeight + GAP_SIZE;
  }
}

function getBottomOffsetString(el: HTMLElement): string {
  return String(getBottomOffset(el));
}

// 注册类型快捷方法
notificationTypes.forEach((type) => {
  (notify as any)[type] = (options: NotificationParams = {}) => {
    if (typeof options === 'string') {
      options = { message: options };
    }
    return notify({ ...options, type } as NotificationOptions);
  };
});

notify.closeAll = closeAll;
notify.updateOffsets = updateOffsets;

export default notify as Notify;
