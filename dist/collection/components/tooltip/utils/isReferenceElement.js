export function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
}
