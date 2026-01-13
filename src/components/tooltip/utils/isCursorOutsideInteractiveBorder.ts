import type { PopperTreeData } from '../types';

import { getBasePlacement } from './getBasePlacement';

export function isCursorOutsideInteractiveBorder(
  popperTreeData: PopperTreeData[],
  event: MouseEvent,
): boolean {
  const { clientX, clientY } = event;

  return popperTreeData.every(({ popperRect, popperState, props }) => {
    const { interactiveBorder } = props;
    const basePlacement = getBasePlacement(popperState.placement);
    const offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    const topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    const bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    const leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    const rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;

    const exceedsTop =
      popperRect.top - clientY + topDistance > interactiveBorder;
    const exceedsBottom =
      clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    const exceedsLeft =
      popperRect.left - clientX + leftDistance > interactiveBorder;
    const exceedsRight =
      clientX - popperRect.right - rightDistance > interactiveBorder;

    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
