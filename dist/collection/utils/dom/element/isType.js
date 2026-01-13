export function isType(value, type) {
    const str = Object.prototype.toString.call(value);
    return str.indexOf('[object') === 0 && str.includes(`${type}]`);
}
