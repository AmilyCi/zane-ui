import type { ZaneSplitterPanel } from './zane-splitter-panel';

import { buildUUID, nextFrame } from '../../utils';
import { SplitterRootContext as ISplitterRootContext } from './../../interfaces';
import { getPct, getPx, isPct, isPx } from './utils';

export class SplitterRootContext implements ISplitterRootContext {
  containerEl: HTMLElement;

  onCollapseCallback: (index: number, type: 'end' | 'start') => void;

  onMoveEndCallback: (index: number) => void;

  onMoveStartCallback: (index: number) => void;

  onMovingCallback: (index: number) => void;

  get containerSize() {
    return this.layout === 'horizontal'
      ? (this.containerEl?.offsetWidth ?? 0)
      : (this.containerEl?.offsetHeight ?? 0);
  }

  get layout() {
    return this._layout;
  }

  set layout(val: 'horizontal' | 'vertical') {
    this._layout = val;
    this.updatePercentSizes();
  }

  get lazy() {
    return this._lazy;
  }

  set lazy(val: boolean) {
    this._lazy = val;
  }

  get lazyOffset() {
    return this._lazyOffset;
  }

  set lazyOffset(val: number) {
    if (this._lazyOffset !== val) {
      this._lazyOffset = val;
      this._lazyOffsetChangeListeners?.forEach((listener) => listener(val));
    }
  }

  get limitSizes() {
    return this.panels.map((item) => [item.min, item.max]);
  }

  get movingIndex() {
    return this._movingIndex;
  }

  set movingIndex(val: null | { confirmed: boolean; index: number }) {
    if (this._movingIndex !== val) {
      this._movingIndex = val;
      this._movingIndexChangeListeners?.forEach((listener) => listener(val));
    }
  }

  get panels() {
    return this._panels;
  }

  get percentSizes() {
    return this._percentSizes;
  }

  set percentSizes(val: number[]) {
    this._percentSizes = val;
    this._percentSizesChangeListeners?.forEach((listener) => listener());
  }

  get pxSizes() {
    return this._percentSizes.map((item) => this.ptg2px(item));
  }

  get uuid() {
    return this._uuid;
  }

  private _cacheCollapsedSize: number[] = [];

  private _cachePxSizes: number[];

  private _layout: 'horizontal' | 'vertical';

  private _lazy: boolean = false;

  private _lazyOffset: number = 0;

  private _lazyOffsetChangeListeners: ((val: number) => void)[] = [];

  private _movingIndex: { confirmed: boolean; index: number } = null;

  private _movingIndexChangeListeners: ((
    val: null | { confirmed: boolean; index: number },
  ) => void)[] = [];

  private _panels: ZaneSplitterPanel[] = [];

  private _percentSizes: number[] = [];

  private _percentSizesChangeListeners: (() => void)[] = [];

  private _planeIndexMap: Map<HTMLElement, number> = new Map();

  private _uuid: string;

  constructor() {
    this._uuid = buildUUID();
  }

  addLazyOffsetChangeListener = (listener: (val: number) => void) => {
    this._lazyOffsetChangeListeners.push(listener);
  };

  addMovingIndexChangeListener = (
    listener: (val: null | { confirmed: boolean; index: number }) => void,
  ) => {
    this._movingIndexChangeListeners.push(listener);
  };

  addPercentSizesChangeListener = (listener: () => void) => {
    this._percentSizesChangeListeners.push(listener);
  };

  clearPanel = () => {
    this._panels = [];
  };

  getPanelIndex = (el: HTMLElement) => {
    return this._planeIndexMap.get(el);
  };

  onCollapse = (index: number, type: 'end' | 'start') => {
    const currentSizes = this._percentSizes.map((item) => this.ptg2px(item));
    if (!this._cacheCollapsedSize.length) {
      this._cacheCollapsedSize.push(...currentSizes);
    }

    const currentIndex = type === 'start' ? index : index + 1;
    const targetIndex = type === 'start' ? index + 1 : index;

    const currentSize = currentSizes[currentIndex];
    const targetSize = currentSizes[targetIndex];

    if (currentSize !== 0 && targetSize !== 0) {
      currentSizes[currentIndex] = 0;
      currentSizes[targetIndex] += currentSize;
      this._cacheCollapsedSize[index] = currentSize;
    } else {
      const totalSize = currentSize + targetSize;

      const targetCacheCollapsedSize = this._cacheCollapsedSize[index];
      const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize;

      currentSizes[targetIndex] = targetCacheCollapsedSize;
      currentSizes[currentIndex] = currentCacheCollapsedSize;
    }

    this.panels.forEach((panel, index) => {
      panel.size = currentSizes[index];
    });

    this.onCollapseCallback?.(index, type);

    nextFrame(() => {
      this.updatePercentSizes();
    });
  };

  onMoveEnd = (index: number) => {
    if (this.lazy) {
      this._updatePanelSizes();
    }

    this.lazyOffset = 0;
    this.movingIndex = null;
    this._cachePxSizes = [];

    nextFrame(() => {
      this.onMoveEndCallback?.(index);
      this.updatePercentSizes();
    });
  };

  onMoveStart = (index: number) => {
    this.lazyOffset = 0;
    this.movingIndex = { confirmed: false, index };
    this._cachePxSizes = this._percentSizes.map((item) => this.ptg2px(item));
    this.onMoveStartCallback?.(index);
  };

  onMoving = (index: number, offset: number) => {
    let confirmedIndex: null | number = null;

    if ((!this.movingIndex || !this.movingIndex.confirmed) && offset !== 0) {
      if (offset > 0) {
        confirmedIndex = index;
        this.movingIndex = { confirmed: true, index };
      } else {
        for (let i = index; i >= 0; i -= 1) {
          if (this._cachePxSizes[i] > 0) {
            confirmedIndex = i;
            this.movingIndex = { confirmed: true, index: i };
            break;
          }
        }
      }
    }
    const mergedIndex = confirmedIndex ?? this.movingIndex?.index ?? index;

    const numSizes = [...this._cachePxSizes];
    const nextIndex = mergedIndex + 1;

    const startMinSize = this.getLimitSize(this.limitSizes[mergedIndex][0], 0);
    const endMinSize = this.getLimitSize(this.limitSizes[nextIndex][0], 0);
    const startMaxSize = this.getLimitSize(
      this.limitSizes[mergedIndex][1],
      this.containerSize || 0,
    );
    const endMaxSize = this.getLimitSize(
      this.limitSizes[nextIndex][1],
      this.containerSize || 0,
    );

    let mergedOffset = offset;

    if (numSizes[mergedIndex] + mergedOffset < startMinSize) {
      mergedOffset = startMinSize - numSizes[mergedIndex];
    }
    if (numSizes[nextIndex] - mergedOffset < endMinSize) {
      mergedOffset = numSizes[nextIndex] - endMinSize;
    }
    if (numSizes[mergedIndex] + mergedOffset > startMaxSize) {
      mergedOffset = startMaxSize - numSizes[mergedIndex];
    }
    if (numSizes[nextIndex] - mergedOffset > endMaxSize) {
      mergedOffset = numSizes[nextIndex] - endMaxSize;
    }

    numSizes[mergedIndex] += mergedOffset;
    numSizes[nextIndex] -= mergedOffset;
    this.lazyOffset = mergedOffset;

    this._updatePanelSizes = () => {
      this.panels.forEach((panel, index) => {
        panel.size = numSizes[index];
      });
      this._updatePanelSizes = () => {};
    };

    if (this.lazy) {
      this.onMovingCallback?.(index);
    } else {
      this._updatePanelSizes();
    }
  };

  registerPanel = (panel: ZaneSplitterPanel) => {
    this._panels.push(panel);
    this.sortPanels();
    this._planeIndexMap.clear();
    this._panels.forEach((panel, index) => {
      this._planeIndexMap.set(panel.el, index);
    });
    this.updatePercentSizes();
  };

  removeLazyOffsetChangeListener = (listener: () => void) => {
    const index = this._lazyOffsetChangeListeners?.indexOf(listener);
    if (index !== -1) {
      this._lazyOffsetChangeListeners?.splice(index, 1);
    }
  };

  removeMovingIndexChangeListener = (listener: () => void) => {
    const index = this._movingIndexChangeListeners?.indexOf(listener);
    if (index !== -1) {
      this._movingIndexChangeListeners?.splice(index, 1);
    }
  };

  removePercentSizesChangeListener = (listener: () => void) => {
    const index = this._percentSizesChangeListeners?.indexOf(listener);
    if (index !== -1) {
      this._percentSizesChangeListeners?.splice(index, 1);
    }
  };

  sortPanels = () => {
    const uuidOrder = Array.from(this.containerEl.children)
      .filter((item) => item.tagName === 'ZANE-SPLITTER-PANEL')
      .map((item: HTMLZaneSplitterPanelElement) => item.uuid);

    const uuidIndexMap = new Map<string, number>();
    uuidOrder.forEach((uuid, index) => {
      uuidIndexMap.set(uuid, index);
    });
    // 使用稳定的排序算法
    this._panels.sort((a, b) => {
      const indexA = uuidIndexMap.get(a.uuid);
      const indexB = uuidIndexMap.get(b.uuid);

      // 如果两个UUID都在顺序列表中，按顺序排序
      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }

      // 如果只有a在顺序列表中，a排在前面
      if (indexA !== undefined) {
        return -1;
      }

      // 如果只有b在顺序列表中，b排在前面
      if (indexB !== undefined) {
        return 1;
      }

      // 如果两个都不在顺序列表中，保持原顺序
      return 0;
    });
  };

  unregisterPanel = (panel: ZaneSplitterPanel) => {
    this._panels.splice(this._panels.indexOf(panel), 1);
    this._planeIndexMap.clear();
    this._panels.forEach((panel, index) => {
      this._planeIndexMap.set(panel.el, index);
    });
    this.updatePercentSizes();
  };

  private _updatePanelSizes: () => void = () => {};

  private getLimitSize = (
    str: number | string | undefined,
    defaultLimit: number,
  ) => {
    if (isPct(str)) {
      return this.ptg2px(getPct(str));
    } else if (isPx(str)) {
      return getPx(str);
    }
    return str ?? defaultLimit;
  };

  private ptg2px = (ptg: number) => {
    return ptg * this.containerSize;
  };

  private updatePercentSizes = () => {
    let ptgList: (number | undefined)[] = [];
    let emptyCount = 0;

    for (let i = 0; i < this.panels.length; i += 1) {
      const itemSize = this.panels[i]?.size;

      if (isPct(itemSize)) {
        ptgList[i] = getPct(itemSize);
      } else if (isPx(itemSize)) {
        ptgList[i] = getPx(itemSize) / this.containerSize;
      } else if (itemSize || itemSize === 0) {
        const num = Number(itemSize);

        if (!Number.isNaN(num)) {
          ptgList[i] = num / this.containerSize;
        }
      } else {
        emptyCount += 1;
        ptgList[i] = undefined;
      }
    }

    const totalPtg = ptgList.reduce<number>((acc, ptg) => acc + (ptg || 0), 0);

    if (totalPtg > 1 || !emptyCount) {
      // If it is greater than 1, the scaling ratio
      const scale = 1 / totalPtg;
      ptgList = ptgList.map((ptg) => (ptg === undefined ? 0 : ptg * scale));
    } else {
      // If it is less than 1, the filling ratio
      const avgRest = (1 - totalPtg) / emptyCount;
      ptgList = ptgList.map((ptg) => (ptg === undefined ? avgRest : ptg));
    }

    this.percentSizes = ptgList as number[];
  };
}
