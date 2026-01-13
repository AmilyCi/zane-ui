export function actualContains(parent: Element, child: Element): boolean {
  let target = child;
  while (target) {
    if (parent.contains(target)) {
      return true;
    }
    target = (target.getRootNode?.() as any)?.host;
  }
  return false;
}
