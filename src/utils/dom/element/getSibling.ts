export const getSibling = (
  el: HTMLElement,
  distance: number,
  elClass: string
) => {
  const { parentNode } = el
  if (!parentNode) return null
  const siblings = parentNode.querySelectorAll(elClass)
  const index = Array.prototype.indexOf.call(siblings, el)
  return siblings[index + distance] || null
}
