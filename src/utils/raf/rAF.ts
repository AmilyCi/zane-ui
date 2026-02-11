import { isClient } from "../is";

export const rAF = (fn: () => void) => isClient
  ? window.requestAnimationFrame(fn)
  : (setTimeout(fn, 16.67) as unknown as number)
