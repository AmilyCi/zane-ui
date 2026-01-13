export const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === 'hidden')
        return true;
    let currentElement = element;
    while (currentElement) {
        if (container && currentElement === container)
            return false;
        if (getComputedStyle(currentElement).display === 'none')
            return true;
        currentElement = currentElement.parentElement;
    }
    return false;
};
