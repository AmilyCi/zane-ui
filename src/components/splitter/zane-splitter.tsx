import type { EventEmitter } from "@stencil/core";

import {
  Component,
  Element,
  Event,
  h,
  Host,
  Prop,
  State,
  Watch,
} from "@stencil/core";

import { splitterRootContexts } from "./constants";
import { useNamespace } from "../../hooks";
import { ReactiveObject } from "../../utils";
import type { PanelItemState, SplitterRootContext } from "./types";
import { getPct, getPx, isPct, isPx } from "./utils";
import { nextTick } from "@zanejs/utils";

const ns = useNamespace("splitter");

@Component({
  styleUrl: "zane-splitter.scss",
  tag: "zane-splitter",
})
export class ZaneSplitter {
  @Event({ eventName: "collapse", bubbles: false })
  collapseEvent: EventEmitter<{
    index: number;
    type: "end" | "start";
    pxSizes: number[];
  }>;

  @Element() el: HTMLElement;

  @Prop() layout: "horizontal" | "vertical" = "horizontal";

  @Prop() lazy: boolean = false;

  @State() lazyOffset: number = 0;

  @State() movingIndex: { confirmed: boolean; index: number } = null;

  @Event({ eventName: "zResizeEnd", bubbles: false })
  resizeEndEvent: EventEmitter<{
    index: number;
    pxSizes: number[];
  }>;

  @Event({ eventName: "zResize", bubbles: false })
  resizeEvent: EventEmitter<{
    index: number;
    pxSizes: number[];
  }>;

  @Event({ eventName: "zResizeStart", bubbles: false })
  resizeStartEvent: EventEmitter<{
    index: number;
    pxSizes: number[];
  }>;

  @State() panels: Record<number, ReactiveObject<PanelItemState>> = {};

  @State() orderedPanels: ReactiveObject<PanelItemState>[] = [];

  @State() percentSizes: number[] = [];

  @State() pxSizes: number[] = [];

  @State() limitSizes: (number | string)[][] = [];

  @State() containerSize: number = 0;

  private resizeObserver: ResizeObserver;

  private cachePxSizes: number[] = [];

  private cacheCollapsedSize: number[] = [];

  private context: ReactiveObject<SplitterRootContext>;

  private updatePanelSizes: () => void = () => {};

  private registerPanel = (panel: ReactiveObject<PanelItemState>) => {
    this.panels = {
      ...this.panels,
      [panel.value.uuid]: panel,
    }
  };

  private unregisterPanel = (panel: ReactiveObject<PanelItemState>) => {
    const panels = { ...this.panels };
    delete panels[panel.value.uuid];
    this.panels = panels;
  }

  private handleResize = () => {
    this.containerSize =
      this.layout === "horizontal"
        ? this.el.offsetWidth
        : this.el.offsetHeight;
  }

  private onResizeStart = (index: number) => {
    this.onMoveStart(index);
    this.resizeStartEvent.emit({ index, pxSizes: this.pxSizes });
  }

  private onMoveStart = (index: number) => {
    this.lazyOffset = 0;
    this.movingIndex = { index, confirmed: false };
    this.cachePxSizes = [...this.pxSizes];
  }

  private onResize = (index: number, offset: number) => {
    this.onMoving(index, offset)

    if (!this.lazy) {
      this.resizeEvent.emit({ index, pxSizes: this.pxSizes });
    }
  }

  private onMoving = (index: number, offset: number) => {
    let confirmedIndex: number | null = null

    if ((!this.movingIndex || !this.movingIndex.confirmed) && offset !== 0) {
      if (offset > 0) {
        confirmedIndex = index
        this.movingIndex = { index, confirmed: true }
      } else {
        for (let i = index; i >= 0; i -= 1) {
          if (this.cachePxSizes[i]! > 0) {
            confirmedIndex = i
            this.movingIndex = { index: i, confirmed: true }
            break
          }
        }
      }
    }
    const mergedIndex = confirmedIndex ?? this.movingIndex?.index ?? index

    const numSizes = [...this.cachePxSizes]
    const nextIndex = mergedIndex + 1

    const startMinSize = this.getLimitSize(this.limitSizes[mergedIndex]![0], 0)
    const endMinSize = this.getLimitSize(this.limitSizes[nextIndex]![0], 0)
    const startMaxSize = this.getLimitSize(
      this.limitSizes[mergedIndex]![1],
      this.containerSize || 0
    )
    const endMaxSize = this.getLimitSize(
      this.limitSizes[nextIndex]![1],
      this.containerSize || 0
    )

    let mergedOffset = offset

    if (numSizes[mergedIndex]! + mergedOffset < startMinSize) {
      mergedOffset = startMinSize - numSizes[mergedIndex]!
    }
    if (numSizes[nextIndex]! - mergedOffset < endMinSize) {
      mergedOffset = numSizes[nextIndex]! - endMinSize
    }
    if (numSizes[mergedIndex]! + mergedOffset > startMaxSize) {
      mergedOffset = startMaxSize - numSizes[mergedIndex]!
    }
    if (numSizes[nextIndex]! - mergedOffset > endMaxSize) {
      mergedOffset = numSizes[nextIndex]! - endMaxSize
    }

    numSizes[mergedIndex]! += mergedOffset
    numSizes[nextIndex]! -= mergedOffset
    this.lazyOffset = mergedOffset

    this.updatePanelSizes = () => {
      this.orderedPanels.forEach((panel, index) => {
        panel.value.size = numSizes[index]
      })
      this.handleContainerSizeChange();
      this.updatePanelSizes = () => {};
    }

    if (!this.lazy) {
      this.updatePanelSizes()
    }
  }

  private onResizeEnd = async (index: number) => {
    this.onMoveEnd();
    await nextTick();
    this.resizeEndEvent.emit({ index, pxSizes: this.pxSizes });
  }

  private onMoveEnd = () => {
    if (this.lazy) {
      this.updatePanelSizes()
    }

    this.lazyOffset = 0;
    this.movingIndex = null;
    this.cachePxSizes = [];
  }

  private onCollapsible = (index: number, type: 'start' | 'end') => {
    this.onCollapse(index, type);
    this.collapseEvent.emit({ index, type, pxSizes: this.pxSizes });
  }

  private onCollapse = (index: number, type: 'start' | 'end') => {
    if (!this.cacheCollapsedSize.length) {
      this.cacheCollapsedSize.push(...this.pxSizes);
    }

    const currentSizes = this.pxSizes;
    const currentIndex = type === 'start' ? index : index + 1;
    const targetIndex = type === 'start' ? index + 1 : index;

    const currentSize = currentSizes[currentIndex];
    const targetSize = currentSizes[targetIndex];

    if (currentSize !== 0 && targetSize !== 0) {
      currentSizes[currentIndex] = 0
      currentSizes[targetIndex]! += currentSize
      this.cacheCollapsedSize[index] = currentSize
    } else {
      const totalSize = currentSize + targetSize

      const targetCacheCollapsedSize = this.cacheCollapsedSize[index]
      const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize

      currentSizes[targetIndex] = targetCacheCollapsedSize
      currentSizes[currentIndex] = currentCacheCollapsedSize
    }

    this.orderedPanels.forEach((panel, index) => {
      panel.value.size = currentSizes[index]
    })
  }

  componentWillLoad() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === this.el) {
          this.handleResize();
        }
      }
    });

    this.resizeObserver.observe(this.el);

    this.context = new ReactiveObject<SplitterRootContext>({
      panels: this.orderedPanels,
      percentSizes: this.percentSizes,
      pxSizes: this.pxSizes,
      layout: this.layout,
      lazy: this.lazy,
      movingIndex: this.movingIndex,
      containerSize: this.containerSize,
      onMoveStart: this.onResizeStart,
      onMoving: this.onResize,
      onMoveEnd: this.onResizeEnd,
      onCollapse: this.onCollapsible,
      registerPanel: this.registerPanel,
      unregisterPanel: this.unregisterPanel,
    });

    splitterRootContexts.set(this.el, this.context);
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    splitterRootContexts.delete(this.el);
  }

  @Watch('panels')
  handlePanelsChange() {
    this.movingIndex = null;

    const allPanels = this.el.querySelectorAll('zane-splitter-panel') as NodeListOf<HTMLZaneSplitterPanelElement>;
    const uids = Array.from(allPanels).map((n) => n.uuid);
    this.orderedPanels = uids.map((uid) => this.panels[uid]).filter((p) => !!p);
    this.orderedPanels.forEach((instance: ReactiveObject<PanelItemState>, index: number) => {
      instance.value.setIndex(index);
    });
    this.limitSizes = this.orderedPanels.map((panel) => {
      return [
        panel.value.min,
        panel.value.max,
      ];
    });
  }

  @Watch('orderedPanels')
  handleOrderedPanelsChange() {
    this.context.value.panels = this.orderedPanels;
  }

  @Watch('pxSizes')
  handlePxSizesChange() {
    this.context.value.pxSizes = this.pxSizes;
  }

  @Watch('containerSize')
  @Watch('orderedPanels')
  handleContainerSizeChange() {
    const panelCounts = this.orderedPanels.length;

    let ptgList: (number | undefined)[] = [];
    let emptyCount = 0;

    for (let i = 0; i < panelCounts; i += 1) {
      const itemSize = this.orderedPanels[i]?.value.size;

      if (isPct(itemSize)) {
        ptgList[i] = getPct(itemSize);
      } else if (isPx(itemSize)) {
        ptgList[i] = getPx(itemSize) / this.containerSize;
      } else if (itemSize || itemSize === 0) {
        const num = Number(itemSize);

        if (!Number.isNaN(num)) {
          ptgList[i] = num / this.containerSize
        }
      } else {
        emptyCount += 1
        ptgList[i] = undefined
      }
    }

    const totalPtg = ptgList.reduce<number>((acc, ptg) => acc + (ptg || 0), 0)

    if (totalPtg > 1 || !emptyCount) {
      const scale = 1 / totalPtg
      ptgList = ptgList.map((ptg) => (ptg === undefined ? 0 : ptg * scale))
    } else {
      const avgRest = (1 - totalPtg) / emptyCount
      ptgList = ptgList.map((ptg) => (ptg === undefined ? avgRest : ptg))
    }

    this.percentSizes = ptgList as number[];

    this.pxSizes = this.percentSizes.map(this.ptg2px);
  }

  private ptg2px = (ptg: number) => ptg * this.containerSize;

  private getLimitSize = (
    str: string | number | undefined,
    defaultLimit: number
  ) => {
    if (isPct(str)) {
      return this.ptg2px(getPct(str))
    } else if (isPx(str)) {
      return getPx(str)
    }
    return str ?? defaultLimit
  }

  @Watch("layout")
  handleLayoutChange() {
    this.handleResize();
    this.context.value.layout = this.layout;
  }

  @Watch("lazy")
  handleLazyChange() {
    this.context.value.lazy = this.lazy;
    if (this.lazyOffset) {
      const mouseup = new MouseEvent("mouseup", { bubbles: true });
      window.dispatchEvent(mouseup);
    }
  }

  render() {
    const splitterStyles = {
      [ns.cssVarBlockName("bar-offset")]: this.lazy
        ? `${this.lazyOffset}px`
        : undefined,
    };
    return (
      <Host
        class={[ns.b(), ns.e(this.layout)].join(" ")}
        style={splitterStyles}
      >
        <slot />
        {this.movingIndex && (
          <div
            class={[ns.e("mask"), ns.e(`mask-${this.layout}`)].join(" ")}
          ></div>
        )}
      </Host>
    );
  }
}
