import { focusElement } from "./focusElement"
import { isLeaf } from "./isLeaf"

export const focusNode = (el: HTMLElement) => {
  if (!el) return
  focusElement(el)
  !isLeaf(el) && el.click()
}
