export const isFocusable = (element) => {
    if (element.tabIndex > 0 ||
        (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }
    if (element.tabIndex < 0 ||
        element.hasAttribute('disabled') ||
        element.getAttribute('aria-disabled') === 'true') {
        return false;
    }
    switch (element.nodeName) {
        case 'A': {
            // casting current element to Specific HTMLElement in order to be more type precise
            return (!!element.href &&
                element.rel !== 'ignore');
        }
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA': {
            return true;
        }
        case 'INPUT': {
            return !(element.type === 'hidden' ||
                element.type === 'file');
        }
        default: {
            return false;
        }
    }
};
