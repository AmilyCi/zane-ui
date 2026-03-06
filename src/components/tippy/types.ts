import type { Props } from "tippy.js";

export interface PopperChildren {
  arrow?: HTMLDivElement;
  backdrop?: HTMLDivElement;
  box: HTMLDivElement;
  content: HTMLDivElement;
}

export type TippyProps = Props & {
  boxClass?: string
  boxStyle?: Record<string, any>
  contentClass?: string
  contentStyle?: Record<string, any>
}
