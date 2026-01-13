import { isClient } from './isClient';

export const isIOS = /* #__PURE__ */ getIsIOS();

function getIsIOS() {
  return (
    isClient &&
    window?.navigator?.userAgent &&
    (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) ||
      // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
      // https://github.com/vueuse/vueuse/issues/3577
      (window?.navigator?.maxTouchPoints > 2 &&
        /iPad|Macintosh/.test(window?.navigator.userAgent)))
  );
}
