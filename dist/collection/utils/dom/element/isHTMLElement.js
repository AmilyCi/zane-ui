export const isHTMLElement = (e) => {
    if (typeof Element === 'undefined')
        return false;
    return e instanceof Element;
};
