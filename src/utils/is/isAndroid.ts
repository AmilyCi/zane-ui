import { isClient } from './isClient';

export const isAndroid = (): boolean =>
  isClient && /android/i.test(window.navigator.userAgent);
