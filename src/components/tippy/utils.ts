import { arrayFrom } from "../../utils";
import type { PopperChildren } from "./types";

export function getChildren(popper: HTMLElement): PopperChildren {
  const box = popper.firstElementChild as HTMLDivElement;
  const boxChildren = arrayFrom(box.children);

  return {
    arrow: boxChildren.find(
      (node) =>
        node.classList.contains('tippy-arrow') ||
        node.classList.contains('tippy-svg-arrow'),
    ),
    backdrop: boxChildren.find((node) =>
      node.classList.contains('tippy-backdrop'),
    ),
    box,
    content: boxChildren.find((node) => node.classList.contains('tippy-content')),
  } as PopperChildren;
}
