import { getOwnerDocument, isMouseEvent } from "../../../utils";
let mouseCoords = { clientX: 0, clientY: 0 };
let activeInstances = [];
function storeMouseCoords({ clientX, clientY }) {
    mouseCoords = { clientX, clientY };
}
function addMouseCoordsListener(doc) {
    doc.addEventListener('mousemove', storeMouseCoords);
}
function removeMouseCoordsListener(doc) {
    doc.removeEventListener('mousemove', storeMouseCoords);
}
const followCursor = {
    defaultValue: false,
    fn(instance) {
        const reference = instance.reference;
        const doc = getOwnerDocument(instance.props.triggerTarget || reference);
        let isInternalUpdate = false;
        let wasFocusEvent = false;
        let isUnmounted = true;
        let prevProps = instance.props;
        function getIsInitialBehavior() {
            return (instance.props.followCursor === 'initial' && instance.state.isVisible);
        }
        function addListener() {
            doc.addEventListener('mousemove', onMouseMove);
        }
        function removeListener() {
            doc.removeEventListener('mousemove', onMouseMove);
        }
        function unsetGetReferenceClientRect() {
            isInternalUpdate = true;
            instance.setProps({ getReferenceClientRect: null });
            isInternalUpdate = false;
        }
        function onMouseMove(event) {
            // If the instance is interactive, avoid updating the position unless it's
            // over the reference element
            const isCursorOverReference = event.target
                ? reference.contains(event.target)
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
        function create() {
            if (instance.props.followCursor) {
                activeInstances.push({ doc, instance });
                addMouseCoordsListener(doc);
            }
        }
        function destroy() {
            activeInstances = activeInstances.filter((data) => data.instance !== instance);
            if (activeInstances.filter((data) => data.doc === doc).length === 0) {
                removeMouseCoordsListener(doc);
            }
        }
        return {
            onAfterUpdate(_, { followCursor }) {
                if (isInternalUpdate) {
                    return;
                }
                if (followCursor !== undefined &&
                    prevProps.followCursor !== followCursor) {
                    destroy();
                    if (followCursor) {
                        create();
                        if (instance.state.isMounted &&
                            !wasFocusEvent &&
                            !getIsInitialBehavior()) {
                            addListener();
                        }
                    }
                    else {
                        removeListener();
                        unsetGetReferenceClientRect();
                    }
                }
            },
            onBeforeUpdate() {
                prevProps = instance.props;
            },
            onCreate: create,
            onDestroy: destroy,
            onHidden() {
                if (instance.props.followCursor) {
                    unsetGetReferenceClientRect();
                    removeListener();
                    isUnmounted = true;
                }
            },
            onMount() {
                if (instance.props.followCursor && !wasFocusEvent) {
                    if (isUnmounted) {
                        onMouseMove(mouseCoords);
                        isUnmounted = false;
                    }
                    if (!getIsInitialBehavior()) {
                        addListener();
                    }
                }
            },
            onTrigger(_, event) {
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
