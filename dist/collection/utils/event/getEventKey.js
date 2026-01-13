import { isAndroid } from "../is";
export const getEventKey = (event) => {
    let key = event.key && event.key !== 'Unidentified' ? event.key : '';
    // On Android, event.key and event.code may not be useful when entering characters or space
    // So here we directly get the last character of the input
    // **only takes effect in the keyup event**
    if (!key && event.type === 'keyup' && isAndroid()) {
        const target = event.target;
        key = target.value.charAt(target.selectionStart - 1);
    }
    return key;
};
