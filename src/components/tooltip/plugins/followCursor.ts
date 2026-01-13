import type { LifecycleHooks, Props } from '../types';

import { getOwnerDocument, isMouseEvent } from '../../../utils';
import { FollowCursor, Instance } from '../types';

let mouseCoords = { clientX: 0, clientY: 0 };
let activeInstances: Array<{ doc: Document; instance: Instance }> = [];

function storeMouseCoords({ clientX, clientY }: MouseEvent): void {
  mouseCoords = { clientX, clientY };
}

function addMouseCoordsListener(doc: Document): void {
  doc.addEventListener('mousemove', storeMouseCoords);
}

function removeMouseCoordsListener(doc: Document): void {
  doc.removeEventListener('mousemove', storeMouseCoords);
}

const followCursor: FollowCursor = {
  defaultValue: false,
  fn(instance: Instance<Props>): Partial<LifecycleHooks<Props>> {
    const reference = instance.reference;
    const doc = getOwnerDocument(instance.props.triggerTarget || reference);

    let isInternalUpdate = false;
    let wasFocusEvent = false;
    let isUnmounted = true;
    let prevProps = instance.props;

    function getIsInitialBehavior(): boolean {
      return (
        instance.props.followCursor === 'initial' && instance.state.isVisible
      );
    }

    function addListener(): void {
      doc.addEventListener('mousemove', onMouseMove);
    }

    function removeListener(): void {
      doc.removeEventListener('mousemove', onMouseMove);
    }

    function unsetGetReferenceClientRect(): void {
      isInternalUpdate = true;
      instance.setProps({ getReferenceClientRect: null });
      isInternalUpdate = false;
    }

    function onMouseMove(event: MouseEvent): void {
      // If the instance is interactive, avoid updating the position unless it's
      // over the reference element
      const isCursorOverReference = event.target
        ? reference.contains(event.target as Node)
        : true;
      const { followCursor } = instance.props;
      const { clientX, clientY } = event;

      const rect = reference.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.setProps({
          // @ts-ignore - unneeded DOMRect properties
          getReferenceClientRect() {
            const rect = reference.getBoundingClientRect();

            let x = clientX;
            let y = clientY;

            if (followCursor === 'initial') {
              x = rect.left + relativeX;
              y = rect.top + relativeY;
            }

            const top = followCursor === 'horizontal' ? rect.top : y;
            const right = followCursor === 'vertical' ? rect.right : x;
            const bottom = followCursor === 'horizontal' ? rect.bottom : y;
            const left = followCursor === 'vertical' ? rect.left : x;

            return {
              bottom,
              height: bottom - top,
              left,
              right,
              top,
              width: right - left,
            };
          },
        });
      }
    }

    function create(): void {
      if (instance.props.followCursor) {
        activeInstances.push({ doc, instance });
        addMouseCoordsListener(doc);
      }
    }

    function destroy(): void {
      activeInstances = activeInstances.filter(
        (data) => data.instance !== instance,
      );

      if (activeInstances.filter((data) => data.doc === doc).length === 0) {
        removeMouseCoordsListener(doc);
      }
    }

    return {
      onAfterUpdate(_, { followCursor }): void {
        if (isInternalUpdate) {
          return;
        }

        if (
          followCursor !== undefined &&
          prevProps.followCursor !== followCursor
        ) {
          destroy();

          if (followCursor) {
            create();

            if (
              instance.state.isMounted &&
              !wasFocusEvent &&
              !getIsInitialBehavior()
            ) {
              addListener();
            }
          } else {
            removeListener();
            unsetGetReferenceClientRect();
          }
        }
      },
      onBeforeUpdate(): void {
        prevProps = instance.props;
      },
      onCreate: create,
      onDestroy: destroy,
      onHidden(): void {
        if (instance.props.followCursor) {
          unsetGetReferenceClientRect();
          removeListener();
          isUnmounted = true;
        }
      },
      onMount(): void {
        if (instance.props.followCursor && !wasFocusEvent) {
          if (isUnmounted) {
            onMouseMove(mouseCoords as MouseEvent);
            isUnmounted = false;
          }

          if (!getIsInitialBehavior()) {
            addListener();
          }
        }
      },
      onTrigger(_, event): void {
        if (isMouseEvent(event)) {
          mouseCoords = { clientX: event.clientX, clientY: event.clientY };
        }
        wasFocusEvent = event.type === 'focus';
      },
    };
  },
  name: 'followCursor',
};

export default followCursor;
