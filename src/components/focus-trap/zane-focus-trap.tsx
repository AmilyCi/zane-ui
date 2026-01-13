import type { FocusLayer } from '../../interfaces';
import type { FocusStack } from '../../types';

import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  Watch,
} from '@stencil/core';

import { FOCUS_AFTER_RELEASED, FOCUS_AFTER_TRAPPED } from '../../constants';
import { useFocusReason } from '../../hooks';
import { getVisibleElement, obtainAllFocusableElements } from '../../utils';

const createFocusOutPreventedEvent = (detail: any) => {
  return new CustomEvent('focusout-prevented', {
    bubbles: false,
    cancelable: true,
    detail,
  });
};

function removeFromStack<T>(list: T[], item: T) {
  const copy = [...list];
  const idx = list.indexOf(item);
  if (idx !== -1) {
    copy.splice(idx, 1);
  }
  return copy;
}

const createFocusableStack = () => {
  let stack: FocusStack = [];

  const push = (layer: FocusLayer) => {
    const currentLayer = stack[0];

    if (currentLayer && layer !== currentLayer) {
      currentLayer.pause();
    }

    stack = removeFromStack(stack, layer);
    stack.unshift(layer);
  };

  const remove = (layer: FocusLayer) => {
    stack = removeFromStack(stack, layer);
    stack[0]?.resume?.();
  };

  return { push, remove };
};

const getEdges = (container: HTMLElement) => {
  const focusable = obtainAllFocusableElements(container);
  const first = getVisibleElement(focusable, container);
  const last = getVisibleElement(focusable.reverse(), container);
  return [first, last];
};

const focusableStack = createFocusableStack();

@Component({
  shadow: false,
  styleUrl: 'zane-focus-trap.scss',
  tag: 'zane-focus-trap',
})
export class ElFocusTrap {
  @Element() el: HTMLElement;

  @Prop() focusStartEl: 'container' | 'first' | HTMLElement = 'first';

  @Prop() focusTrapEl: HTMLElement;

  @Prop() loop: boolean = false;

  @Prop() trapOnFocusIn: boolean = true;

  @Prop() trapped: boolean = false;

  @Event({ eventName: 'zFocusAfterReleased' })
  zaneFocusAfterReleased: EventEmitter<Event>;

  @Event({ eventName: 'zFocusAfterTrapped' })
  zaneFocusAfterTrapped: EventEmitter<Event>;

  @Event({ eventName: 'zFocusIn' }) zaneFocusin: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zFocusOut' }) zaneFocusout: EventEmitter<FocusEvent>;

  @Event({ eventName: 'zFocusOutPrevented' })
  zaneFocusoutPrevented: EventEmitter<CustomEvent>;

  @Event({ eventName: 'zReleaseRequested' })
  zaneReleaseRequested: EventEmitter<Event>;

  private focusLayer: FocusLayer = {
    pause: () => {
      this.focusLayer.paused = true;
    },
    paused: false,
    resume: () => {
      this.focusLayer.paused = false;
    },
  };

  private focusReason = useFocusReason();

  private lastFocusAfterTrapped: HTMLElement | null = null;

  private lastFocusBeforeTrapped: HTMLElement | null = null;

  componentDidLoad() {
    this.initializeFocusTrap();
    this.focusReason.connect();
  }

  disconnectedCallback() {
    this.cleanupEventListeners();
    this.focusReason.disconnect();
    if (this.trapped) {
      this.stopTrap();
    }
  }

  focusFirstDescendant = (elements: HTMLElement[], shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      this.focusReason.tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement) return;
    }
  };

  @Watch('focusTrapEl')
  onFocusTrapElChange() {
    this.cleanupEventListeners();
    this.initializeFocusTrap();
  }

  @Watch('trapped')
  onTrappedChange(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (newValue) {
        this.startTrap();
      } else {
        this.stopTrap();
      }
    }
  }

  render() {
    return <slot></slot>;
  }

  @Method()
  async updateFocusTrap() {
    if (this.trapped) {
      this.startTrap();
    }
  }

  private cleanupEventListeners() {
    const trapContainer = this.getTrapContainer();
    if (trapContainer) {
      trapContainer.removeEventListener('keydown', this.onKeydown);
      trapContainer.removeEventListener('focusin', this.onFocusIn);
      trapContainer.removeEventListener('focusout', this.onFocusOut);
    }
  }

  private getTrapContainer(): HTMLElement | null {
    return this.focusTrapEl || this.el;
  }

  private initializeFocusTrap() {
    const trapContainer = this.getTrapContainer();
    if (trapContainer) {
      trapContainer.addEventListener('keydown', this.onKeydown);
      trapContainer.addEventListener('focusin', this.onFocusIn);
      trapContainer.addEventListener('focusout', this.onFocusOut);
    }

    if (this.trapped) {
      this.startTrap();
    }
  }

  private onFocusIn = (e: FocusEvent) => {
    const trapContainer = this.getTrapContainer();
    if (!trapContainer) return;

    const target = e.target as HTMLElement | null;
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const isFocusedInTrap = target && trapContainer.contains(target);

    if (!this.trapped) {
      const isPrevFocusedInTrap =
        relatedTarget && trapContainer.contains(relatedTarget);
      if (!isPrevFocusedInTrap) {
        this.lastFocusBeforeTrapped = relatedTarget;
      }
    }

    if (isFocusedInTrap) {
      this.zaneFocusin.emit(e);
    }

    if (this.focusLayer.paused) return;

    if (this.trapped) {
      if (isFocusedInTrap) {
        this.lastFocusAfterTrapped = target;
      } else {
        this.focusReason.tryFocus(this.lastFocusAfterTrapped, true);
      }
    }
  };

  private onFocusOut = (e: FocusEvent) => {
    const trapContainer = this.getTrapContainer();
    if (this.focusLayer.paused || !trapContainer) return;

    if (this.trapped) {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (relatedTarget && !trapContainer.contains(relatedTarget)) {
        setTimeout(() => {
          if (!this.focusLayer.paused && this.trapped) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: this.focusReason.getFocusReason(),
            });
            this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              this.focusReason.tryFocus(this.lastFocusAfterTrapped, true);
            }
          }
        }, 0);
      }
    } else {
      const target = e.target as HTMLElement | null;
      const isFocusedInTrap = target && trapContainer.contains(target);
      if (!isFocusedInTrap) {
        this.zaneFocusout.emit(e);
      }
    }
  };

  private onKeydown = (e: KeyboardEvent) => {
    if (!this.loop && !this.trapped) return;
    if (this.focusLayer.paused) return;

    const { altKey, ctrlKey, currentTarget, metaKey, shiftKey } = e;
    const { loop } = this;
    const code = e.code || e.key;
    const isTabbing = code === 'Tab' && !altKey && !ctrlKey && !metaKey;

    const currentFocusingEl = document.activeElement as HTMLElement;
    if (isTabbing && currentFocusingEl) {
      const container = currentTarget as HTMLElement;
      const [first, last] = getEdges(container);
      const isTabbable = first && last;

      if (isTabbable) {
        if (!shiftKey && currentFocusingEl === last) {
          const focusoutPreventedEvent = createFocusOutPreventedEvent({
            focusReason: this.focusReason.getFocusReason(),
          });
          this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
          if (!focusoutPreventedEvent.defaultPrevented) {
            e.preventDefault();
            if (loop) this.focusReason.tryFocus(first, true);
          }
        } else if (shiftKey && [container, first].includes(currentFocusingEl)) {
          const focusoutPreventedEvent = createFocusOutPreventedEvent({
            focusReason: this.focusReason.getFocusReason(),
          });
          this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
          if (!focusoutPreventedEvent.defaultPrevented) {
            e.preventDefault();
            if (loop) this.focusReason.tryFocus(last, true);
          }
        }
      } else {
        if (currentFocusingEl === container) {
          const focusoutPreventedEvent = createFocusOutPreventedEvent({
            focusReason: this.focusReason.getFocusReason(),
          });
          this.zaneFocusoutPrevented.emit(focusoutPreventedEvent);
          if (!focusoutPreventedEvent.defaultPrevented) {
            e.preventDefault();
          }
        }
      }
    }

    // Handle Escape key for release requested
    if (code === 'Escape' && this.trapped && !this.focusLayer.paused) {
      this.zaneReleaseRequested.emit(e);
    }
  };

  private async startTrap() {
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for next tick

    const trapContainer = this.getTrapContainer();
    if (trapContainer) {
      focusableStack.push(this.focusLayer);

      const prevFocusedElement = trapContainer.contains(document.activeElement)
        ? this.lastFocusBeforeTrapped
        : document.activeElement;

      this.lastFocusBeforeTrapped = prevFocusedElement as HTMLElement | null;
      const isPrevFocusContained = trapContainer.contains(prevFocusedElement);

      if (!isPrevFocusContained) {
        const focusEvent = new CustomEvent(FOCUS_AFTER_TRAPPED, {
          bubbles: false,
          cancelable: true,
        });

        const handleTrapped = (e: Event) => {
          this.zaneFocusAfterTrapped.emit(e);
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, handleTrapped);
        };

        trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, handleTrapped);
        trapContainer.dispatchEvent(focusEvent);

        if (!focusEvent.defaultPrevented) {
          setTimeout(() => {
            let focusStartEl = this.focusStartEl;

            if (typeof focusStartEl !== 'string') {
              this.focusReason.tryFocus(focusStartEl);
              if (document.activeElement !== focusStartEl) {
                focusStartEl = 'first';
              }
            }

            if (focusStartEl === 'first') {
              this.focusFirstDescendant(
                obtainAllFocusableElements(trapContainer),
                true,
              );
            }

            if (
              document.activeElement === prevFocusedElement ||
              focusStartEl === 'container'
            ) {
              this.focusReason.tryFocus(trapContainer);
            }
          }, 0);
        }
      }
    }
  }

  private stopTrap() {
    const trapContainer = this.getTrapContainer();
    if (trapContainer) {
      const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
        bubbles: false,
        cancelable: true,
        detail: {
          focusReason: this.focusReason.getFocusReason(),
        },
      });

      const handleReleased = (e: CustomEvent) => {
        this.zaneFocusAfterReleased.emit(e);
        trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, handleReleased);
      };

      trapContainer.addEventListener(FOCUS_AFTER_RELEASED, handleReleased);
      trapContainer.dispatchEvent(releasedEvent);

      if (!releasedEvent.defaultPrevented) {
        const focusReason = this.focusReason.getFocusReason();
        if (
          focusReason === 'keyboard' ||
          !this.focusReason.isFocusCausedByUserEvent() ||
          trapContainer.contains(document.activeElement)
        ) {
          this.focusReason.tryFocus(
            this.lastFocusBeforeTrapped ?? document.body,
          );
        }
      }

      focusableStack.remove(this.focusLayer);
      this.lastFocusBeforeTrapped = null;
      this.lastFocusAfterTrapped = null;
    }
  }
}
