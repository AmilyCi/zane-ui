import { isClient } from './isClient';

export const isFirefox = (): boolean =>
  isClient && /firefox/i.test(window.navigator.userAgent);
