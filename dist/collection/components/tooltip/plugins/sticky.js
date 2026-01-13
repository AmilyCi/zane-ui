const sticky = {
    defaultValue: false,
    fn(instance) {
        const { popper, reference } = instance;
        function getReference() {
            return instance.popperInstance
                ? instance.popperInstance.state.elements.reference
                : reference;
        }
        function shouldCheck(value) {
            return instance.props.sticky === true || instance.props.sticky === value;
        }
        let prevRefRect = null;
        let prevPopRect = null;
        function updatePosition() {
            const currentRefRect = shouldCheck('reference')
                ? getReference().getBoundingClientRect()
                : null;
            const currentPopRect = shouldCheck('popper')
                ? popper.getBoundingClientRect()
                : null;
            if (((currentRefRect && areRectsDifferent(prevRefRect, currentRefRect)) ||
                (currentPopRect && areRectsDifferent(prevPopRect, currentPopRect))) &&
                instance.popperInstance) {
                instance.popperInstance.update();
            }
            prevRefRect = currentRefRect;
            prevPopRect = currentPopRect;
            if (instance.state.isMounted) {
                requestAnimationFrame(updatePosition);
            }
        }
        return {
            onMount() {
                if (instance.props.sticky) {
                    updatePosition();
                }
            },
        };
    },
    name: 'sticky',
};
export default sticky;
function areRectsDifferent(rectA, rectB) {
    if (rectA && rectB) {
        return (rectA.top !== rectB.top ||
            rectA.right !== rectB.right ||
            rectA.bottom !== rectB.bottom ||
            rectA.left !== rectB.left);
    }
    return true;
}
