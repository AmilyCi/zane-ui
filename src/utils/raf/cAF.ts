import { isClient } from "../is";

export const cAF = (handle: number) => isClient
  ? window.cancelAnimationFrame(handle)
  : clearTimeout(handle)
