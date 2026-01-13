/**
 * 检查钩子函数是否需要一个回调函数（第二个参数），这表示用户希望能够手动控制过渡动画的结束时机。
 */
export const hasExplicitCallback = (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  hook: Function | Function[] | undefined,
): boolean => {
  if (hook) {
    return Array.isArray(hook)
      ? hook.some((h) => h.length > 1)
      : hook.length > 1;
  }
  return false;
};
