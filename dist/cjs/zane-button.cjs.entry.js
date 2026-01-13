'use strict';

var index = require('./index-ziNpORbs.js');
var button = require('./button-Dwe0a_IM.js');
var uuid = require('./uuid-avdvDRhA.js');
var findAllLegitChildren = require('./findAllLegitChildren-BeFgQwjQ.js');
var useNamespace = require('./useNamespace-BrlW2aGl.js');

function darken(color, amount = 20) {
    return color.mix('#141414', amount).toString();
}

/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    const isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    // Automatically convert percentage into number
    if (isPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    if (max === 360) {
        // If n is a hue given in degrees,
        // wrap around out-of-range values into [0, 360] range
        // then convert into [0, 1].
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        // If n not a hue given in degrees
        // Convert into [0, 1] range if it isn't already.
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function isOnePointZero(n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function convertToPercentage(n) {
    if (Number(n) <= 1) {
        return `${Number(n) * 100}%`;
    }
    return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function rgbToRgb(r, g, b) {
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255,
    };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0; // achromatic
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h, s, l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
        // achromatic
        g = l;
        b = l;
        r = l;
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h, s, v };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color to hex
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255]
 * *Returns:* a 3 or 6 character hex
 */
function rgbToHex(r, g, b, allow3Char) {
    const hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    // Return a 3 character hex if possible
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
 * *Returns:* a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function rgbaToHex(r, g, b, a, allow4Char) {
    const hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a)),
    ];
    // Return a 4 character hex if possible
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts CMYK to RBG
 * Assumes c, m, y, k are in the set [0, 100]
 */
function cmykToRgb(c, m, y, k) {
    const cConv = c / 100;
    const mConv = m / 100;
    const yConv = y / 100;
    const kConv = k / 100;
    const r = 255 * (1 - cConv) * (1 - kConv);
    const g = 255 * (1 - mConv) * (1 - kConv);
    const b = 255 * (1 - yConv) * (1 - kConv);
    return { r, g, b };
}
function rgbToCmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);
    if (k === 1) {
        c = 0;
        m = 0;
        y = 0;
    }
    else {
        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
    }
    k *= 100;
    return {
        c: Math.round(c),
        m: Math.round(m),
        y: Math.round(y),
        k: Math.round(k),
    };
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
    return parseInt(val, 16);
}
function numberInputToObject(color) {
    return {
        r: color >> 16,
        g: (color & 0xff00) >> 8,
        b: color & 0xff,
    };
}

// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
const names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    goldenrod: '#daa520',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavenderblush: '#fff0f5',
    lavender: '#e6e6fa',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * "cmyk(0, 20, 0, 0)" or "cmyk 0 20 0 0"
 * ```
 */
function inputToRGB(color) {
    let rgb = { r: 0, g: 0, b: 0 };
    let a = 1;
    let s = null;
    let v = null;
    let l = null;
    let ok = false;
    let format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        else if (isValidCSSUnit(color.c) &&
            isValidCSSUnit(color.m) &&
            isValidCSSUnit(color.y) &&
            isValidCSSUnit(color.k)) {
            rgb = cmykToRgb(color.c, color.m, color.y, color.k);
            ok = true;
            format = 'cmyk';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = boundAlpha(a);
    return {
        ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a,
    };
}
// <http://www.w3.org/TR/css3-values/#integers>
const CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
const CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')';
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
// eslint-disable-next-line prettier/prettier
const PERMISSIVE_MATCH3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const PERMISSIVE_MATCH4 = 
// eslint-disable-next-line prettier/prettier
'[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    cmyk: new RegExp('cmyk' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}` or `{c, m, y, k}` or `{c, m, y, k, a}`
 */
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    let named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    let match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.cmyk.exec(color);
    if (match) {
        return {
            c: match[1],
            m: match[2],
            y: match[3],
            k: match[4],
        };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function isValidCSSUnit(color) {
    if (typeof color === 'number') {
        return !Number.isNaN(color);
    }
    return matchers.CSS_UNIT.test(color);
}

class TinyColor {
    constructor(color = '', opts = {}) {
        // If input is already a tinycolor, return itself
        if (color instanceof TinyColor) {
            // eslint-disable-next-line no-constructor-return
            return color;
        }
        if (typeof color === 'number') {
            color = numberInputToObject(color);
        }
        this.originalInput = color;
        const rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = opts.format ?? rgb.format;
        this.gradientType = opts.gradientType;
        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    isDark() {
        return this.getBrightness() < 128;
    }
    isLight() {
        return !this.isDark();
    }
    /**
     * Returns the perceived brightness of the color, from 0-255.
     */
    getBrightness() {
        // http://www.w3.org/TR/AERT#color-contrast
        const rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }
    /**
     * Returns the perceived luminance of a color, from 0-1.
     */
    getLuminance() {
        // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        const rgb = this.toRgb();
        let R;
        let G;
        let B;
        const RsRGB = rgb.r / 255;
        const GsRGB = rgb.g / 255;
        const BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    /**
     * Returns the alpha value of a color, from 0-1.
     */
    getAlpha() {
        return this.a;
    }
    /**
     * Sets the alpha value on the current color.
     *
     * @param alpha - The new alpha value. The accepted range is 0-1.
     */
    setAlpha(alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    }
    /**
     * Returns whether the color is monochrome.
     */
    isMonochrome() {
        const { s } = this.toHsl();
        return s === 0;
    }
    /**
     * Returns the object as a HSVA object.
     */
    toHsv() {
        const hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    }
    /**
     * Returns the hsva values interpolated into a string with the following format:
     * "hsva(xxx, xxx, xxx, xx)".
     */
    toHsvString() {
        const hsv = rgbToHsv(this.r, this.g, this.b);
        const h = Math.round(hsv.h * 360);
        const s = Math.round(hsv.s * 100);
        const v = Math.round(hsv.v * 100);
        return this.a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${this.roundA})`;
    }
    /**
     * Returns the object as a HSLA object.
     */
    toHsl() {
        const hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    }
    /**
     * Returns the hsla values interpolated into a string with the following format:
     * "hsla(xxx, xxx, xxx, xx)".
     */
    toHslString() {
        const hsl = rgbToHsl(this.r, this.g, this.b);
        const h = Math.round(hsl.h * 360);
        const s = Math.round(hsl.s * 100);
        const l = Math.round(hsl.l * 100);
        return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.roundA})`;
    }
    /**
     * Returns the hex value of the color.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    toHex(allow3Char = false) {
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    }
    /**
     * Returns the hex value of the color -with a # prefixed.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    toHexString(allow3Char = false) {
        return '#' + this.toHex(allow3Char);
    }
    /**
     * Returns the hex 8 value of the color.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    toHex8(allow4Char = false) {
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    }
    /**
     * Returns the hex 8 value of the color -with a # prefixed.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    toHex8String(allow4Char = false) {
        return '#' + this.toHex8(allow4Char);
    }
    /**
     * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
     * @param allowShortChar will shorten hex value to 3 or 4 char if possible
     */
    toHexShortString(allowShortChar = false) {
        return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    }
    /**
     * Returns the object as a RGBA object.
     */
    toRgb() {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    }
    /**
     * Returns the RGBA values interpolated into a string with the following format:
     * "RGBA(xxx, xxx, xxx, xx)".
     */
    toRgbString() {
        const r = Math.round(this.r);
        const g = Math.round(this.g);
        const b = Math.round(this.b);
        return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.roundA})`;
    }
    /**
     * Returns the object as a RGBA object.
     */
    toPercentageRgb() {
        const fmt = (x) => `${Math.round(bound01(x, 255) * 100)}%`;
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    }
    /**
     * Returns the RGBA relative values interpolated into a string
     */
    toPercentageRgbString() {
        const rnd = (x) => Math.round(bound01(x, 255) * 100);
        return this.a === 1
            ? `rgb(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%)`
            : `rgba(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%, ${this.roundA})`;
    }
    toCmyk() {
        return {
            ...rgbToCmyk(this.r, this.g, this.b),
        };
    }
    toCmykString() {
        const { c, m, y, k } = rgbToCmyk(this.r, this.g, this.b);
        return `cmyk(${c}, ${m}, ${y}, ${k})`;
    }
    /**
     * The 'real' name of the color -if there is one.
     */
    toName() {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        const hex = '#' + rgbToHex(this.r, this.g, this.b, false);
        for (const [key, value] of Object.entries(names)) {
            if (hex === value) {
                return key;
            }
        }
        return false;
    }
    toString(format) {
        const formatSet = Boolean(format);
        format = format ?? this.format;
        let formattedString = false;
        const hasAlpha = this.a < 1 && this.a >= 0;
        const needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        if (format === 'cmyk') {
            formattedString = this.toCmykString();
        }
        return formattedString || this.toHexString();
    }
    toNumber() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }
    clone() {
        return new TinyColor(this.toString());
    }
    /**
     * Lighten the color a given amount. Providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    lighten(amount = 10) {
        const hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    }
    /**
     * Brighten the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    brighten(amount = 10) {
        const rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    }
    /**
     * Darken the color a given amount, from 0 to 100.
     * Providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    darken(amount = 10) {
        const hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    }
    /**
     * Mix the color with pure white, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    tint(amount = 10) {
        return this.mix('white', amount);
    }
    /**
     * Mix the color with pure black, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    shade(amount = 10) {
        return this.mix('black', amount);
    }
    /**
     * Desaturate the color a given amount, from 0 to 100.
     * Providing 100 will is the same as calling greyscale
     * @param amount - valid between 1-100
     */
    desaturate(amount = 10) {
        const hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    }
    /**
     * Saturate the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    saturate(amount = 10) {
        const hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    }
    /**
     * Completely desaturates a color into greyscale.
     * Same as calling `desaturate(100)`
     */
    greyscale() {
        return this.desaturate(100);
    }
    /**
     * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
     * Values outside of this range will be wrapped into this range.
     */
    spin(amount) {
        const hsl = this.toHsl();
        const hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    }
    /**
     * Mix the current color a given amount with another color, from 0 to 100.
     * 0 means no mixing (return current color).
     */
    mix(color, amount = 50) {
        const rgb1 = this.toRgb();
        const rgb2 = new TinyColor(color).toRgb();
        const p = amount / 100;
        const rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a,
        };
        return new TinyColor(rgba);
    }
    analogous(results = 6, slices = 30) {
        const hsl = this.toHsl();
        const part = 360 / slices;
        const ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    }
    /**
     * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
     */
    complement() {
        const hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    }
    monochromatic(results = 6) {
        const hsv = this.toHsv();
        const { h } = hsv;
        const { s } = hsv;
        let { v } = hsv;
        const res = [];
        const modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h, s, v }));
            v = (v + modification) % 1;
        }
        return res;
    }
    splitcomplement() {
        const hsl = this.toHsl();
        const { h } = hsl;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    }
    /**
     * Compute how the color would appear on a background
     */
    onBackground(background) {
        const fg = this.toRgb();
        const bg = new TinyColor(background).toRgb();
        const alpha = fg.a + bg.a * (1 - fg.a);
        return new TinyColor({
            r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
            g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
            b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
            a: alpha,
        });
    }
    /**
     * Alias for `polyad(3)`
     */
    triad() {
        return this.polyad(3);
    }
    /**
     * Alias for `polyad(4)`
     */
    tetrad() {
        return this.polyad(4);
    }
    /**
     * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
     * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
     */
    polyad(n) {
        const hsl = this.toHsl();
        const { h } = hsl;
        const result = [this];
        const increment = 360 / n;
        for (let i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    }
    /**
     * compare color vs current color
     */
    equals(color) {
        const comparedColor = new TinyColor(color);
        /**
         * RGB and CMYK do not have the same color gamut, so a CMYK conversion will never be 100%.
         * This means we need to compare CMYK to CMYK to ensure accuracy of the equals function.
         */
        if (this.format === 'cmyk' || comparedColor.format === 'cmyk') {
            return this.toCmykString() === comparedColor.toCmykString();
        }
        return this.toRgbString() === comparedColor.toRgbString();
    }
}

const zaneButtonCss = () => `zane-button+zane-button{margin-left:12px}.zane-button{--zane-button-font-weight:var(--zane-font-weight-primary);--zane-button-border-color:var(--zane-border-color);--zane-button-bg-color:var(--zane-fill-color-blank);--zane-button-text-color:var(--zane-text-color-regular);--zane-button-disabled-text-color:var(--zane-disabled-text-color);--zane-button-disabled-bg-color:var(--zane-fill-color-blank);--zane-button-disabled-border-color:var(--zane-border-color-light);--zane-button-divide-border-color:rgba(255, 255, 255, 0.5);--zane-button-hover-text-color:var(--zane-color-primary);--zane-button-hover-bg-color:var(--zane-color-primary-light-9);--zane-button-hover-border-color:var(--zane-color-primary-light-7);--zane-button-active-text-color:var(--zane-button-hover-text-color);--zane-button-active-border-color:var(--zane-color-primary);--zane-button-active-bg-color:var(--zane-button-hover-bg-color);--zane-button-outline-color:var(--zane-color-primary-light-5);--zane-button-hover-link-text-color:var(--zane-text-color-secondary);--zane-button-active-color:var(--zane-text-color-primary)}.zane-button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;color:var(--zane-button-text-color);text-align:center;box-sizing:border-box;margin:0;outline:none;transition:0.1s;font-weight:var(--zane-button-font-weight);user-select:none;vertical-align:middle;-webkit-appearance:none;background-color:var(--zane-button-bg-color);border:var(--zane-border);border-color:var(--zane-button-border-color)}.zane-button:hover{color:var(--zane-button-hover-text-color);border-color:var(--zane-button-hover-border-color);background-color:var(--zane-button-hover-bg-color);outline:none}.zane-button:active{color:var(--zane-button-active-text-color);border-color:var(--zane-button-active-border-color);background-color:var(--zane-button-active-bg-color);outline:none}.zane-button:focus-visible{outline:2px solid var(--zane-button-outline-color);outline-offset:1px;transition:outline-offset 0s, outline 0s}.zane-button>span{display:inline-flex;align-items:center}.zane-button{padding:8px 15px;font-size:var(--zane-font-size-base);border-radius:var(--zane-border-radius-base)}.zane-button.is-round{padding:8px 15px}.zane-button::-moz-focus-inner{border:0}.zane-button [class*=zane-icon]+span{margin-left:6px}.zane-button [class*=zane-icon] svg{vertical-align:bottom}.zane-button.is-plain{--zane-button-hover-text-color:var(--zane-color-primary);--zane-button-hover-bg-color:var(--zane-fill-color-blank);--zane-button-hover-border-color:var(--zane-color-primary)}.zane-button.is-active{color:var(--zane-button-active-text-color);border-color:var(--zane-button-active-border-color);background-color:var(--zane-button-active-bg-color);outline:none}.zane-button.is-disabled,.zane-button.is-disabled:hover{color:var(--zane-button-disabled-text-color);cursor:not-allowed;background-image:none;background-color:var(--zane-button-disabled-bg-color);border-color:var(--zane-button-disabled-border-color)}.zane-button.is-loading{position:relative;pointer-events:none}.zane-button.is-loading:before{z-index:1;pointer-events:none;content:"";position:absolute;left:-1px;top:-1px;right:-1px;bottom:-1px;border-radius:inherit;background-color:var(--zane-mask-color-extra-light)}.zane-button.is-round{border-radius:var(--zane-border-radius-round)}.zane-button.is-circle{width:32px;border-radius:50%;padding:8px}.zane-button.is-text{color:var(--zane-button-text-color);border:0 solid transparent;background-color:transparent}.zane-button.is-text.is-disabled{color:var(--zane-button-disabled-text-color);background-color:transparent !important}.zane-button.is-text:not(.is-disabled):hover{background-color:var(--zane-fill-color-light)}.zane-button.is-text:not(.is-disabled):focus-visible{outline:2px solid var(--zane-button-outline-color);outline-offset:1px;transition:outline-offset 0s, outline 0s}.zane-button.is-text:not(.is-disabled):active{background-color:var(--zane-fill-color)}.zane-button.is-text:not(.is-disabled).is-has-bg{background-color:var(--zane-fill-color-light)}.zane-button.is-text:not(.is-disabled).is-has-bg:hover{background-color:var(--zane-fill-color)}.zane-button.is-text:not(.is-disabled).is-has-bg:active{background-color:var(--zane-fill-color-dark)}.zane-button .zane-button__text--expand{letter-spacing:0.3em;margin-right:-0.3em}.zane-button.is-link{border-color:transparent;color:var(--zane-button-text-color);background:transparent;padding:2px;height:auto}.zane-button.is-link:hover{color:var(--zane-button-hover-link-text-color)}.zane-button.is-link.is-disabled{color:var(--zane-button-disabled-text-color);background-color:transparent !important;border-color:transparent !important}.zane-button.is-link:not(.is-disabled):hover{border-color:transparent;background-color:transparent}.zane-button.is-link:not(.is-disabled):active{color:var(--zane-button-active-color);border-color:transparent;background-color:transparent}.zane-button--text{border-color:transparent;background:transparent;color:var(--zane-color-primary);padding-left:0;padding-right:0}.zane-button--text.is-disabled{color:var(--zane-button-disabled-text-color);background-color:transparent !important;border-color:transparent !important}.zane-button--text:not(.is-disabled):hover{color:var(--zane-color-primary-light-3);border-color:transparent;background-color:transparent}.zane-button--text:not(.is-disabled):active{color:var(--zane-color-primary-dark-2);border-color:transparent;background-color:transparent}.zane-button .zane-button__link--expand{letter-spacing:0.3em;margin-right:-0.3em}.zane-button--primary{--zane-button-text-color:var(--zane-color-white);--zane-button-bg-color:var(--zane-color-primary);--zane-button-border-color:var(--zane-color-primary);--zane-button-outline-color:var(--zane-color-primary-light-5);--zane-button-active-color:var(--zane-color-primary-dark-2);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-link-text-color:var(--zane-color-primary-light-5);--zane-button-hover-bg-color:var(--zane-color-primary-light-3);--zane-button-hover-border-color:var(--zane-color-primary-light-3);--zane-button-active-bg-color:var(--zane-color-primary-dark-2);--zane-button-active-border-color:var(--zane-color-primary-dark-2);--zane-button-disabled-text-color:var(--zane-color-white);--zane-button-disabled-bg-color:var(--zane-color-primary-light-5);--zane-button-disabled-border-color:var(--zane-color-primary-light-5)}.zane-button--primary.is-plain,.zane-button--primary.is-text,.zane-button--primary.is-link{--zane-button-text-color:var(--zane-color-primary);--zane-button-bg-color:var(--zane-color-primary-light-9);--zane-button-border-color:var(--zane-color-primary-light-5);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-bg-color:var(--zane-color-primary);--zane-button-hover-border-color:var(--zane-color-primary);--zane-button-active-text-color:var(--zane-color-white)}.zane-button--primary.is-plain.is-disabled,.zane-button--primary.is-plain.is-disabled:hover,.zane-button--primary.is-plain.is-disabled:focus,.zane-button--primary.is-plain.is-disabled:active,.zane-button--primary.is-text.is-disabled,.zane-button--primary.is-text.is-disabled:hover,.zane-button--primary.is-text.is-disabled:focus,.zane-button--primary.is-text.is-disabled:active,.zane-button--primary.is-link.is-disabled,.zane-button--primary.is-link.is-disabled:hover,.zane-button--primary.is-link.is-disabled:focus,.zane-button--primary.is-link.is-disabled:active{color:var(--zane-color-primary-light-5);background-color:var(--zane-color-primary-light-9);border-color:var(--zane-color-primary-light-8)}.zane-button--success{--zane-button-text-color:var(--zane-color-white);--zane-button-bg-color:var(--zane-color-success);--zane-button-border-color:var(--zane-color-success);--zane-button-outline-color:var(--zane-color-success-light-5);--zane-button-active-color:var(--zane-color-success-dark-2);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-link-text-color:var(--zane-color-success-light-5);--zane-button-hover-bg-color:var(--zane-color-success-light-3);--zane-button-hover-border-color:var(--zane-color-success-light-3);--zane-button-active-bg-color:var(--zane-color-success-dark-2);--zane-button-active-border-color:var(--zane-color-success-dark-2);--zane-button-disabled-text-color:var(--zane-color-white);--zane-button-disabled-bg-color:var(--zane-color-success-light-5);--zane-button-disabled-border-color:var(--zane-color-success-light-5)}.zane-button--success.is-plain,.zane-button--success.is-text,.zane-button--success.is-link{--zane-button-text-color:var(--zane-color-success);--zane-button-bg-color:var(--zane-color-success-light-9);--zane-button-border-color:var(--zane-color-success-light-5);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-bg-color:var(--zane-color-success);--zane-button-hover-border-color:var(--zane-color-success);--zane-button-active-text-color:var(--zane-color-white)}.zane-button--success.is-plain.is-disabled,.zane-button--success.is-plain.is-disabled:hover,.zane-button--success.is-plain.is-disabled:focus,.zane-button--success.is-plain.is-disabled:active,.zane-button--success.is-text.is-disabled,.zane-button--success.is-text.is-disabled:hover,.zane-button--success.is-text.is-disabled:focus,.zane-button--success.is-text.is-disabled:active,.zane-button--success.is-link.is-disabled,.zane-button--success.is-link.is-disabled:hover,.zane-button--success.is-link.is-disabled:focus,.zane-button--success.is-link.is-disabled:active{color:var(--zane-color-success-light-5);background-color:var(--zane-color-success-light-9);border-color:var(--zane-color-success-light-8)}.zane-button--warning{--zane-button-text-color:var(--zane-color-white);--zane-button-bg-color:var(--zane-color-warning);--zane-button-border-color:var(--zane-color-warning);--zane-button-outline-color:var(--zane-color-warning-light-5);--zane-button-active-color:var(--zane-color-warning-dark-2);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-link-text-color:var(--zane-color-warning-light-5);--zane-button-hover-bg-color:var(--zane-color-warning-light-3);--zane-button-hover-border-color:var(--zane-color-warning-light-3);--zane-button-active-bg-color:var(--zane-color-warning-dark-2);--zane-button-active-border-color:var(--zane-color-warning-dark-2);--zane-button-disabled-text-color:var(--zane-color-white);--zane-button-disabled-bg-color:var(--zane-color-warning-light-5);--zane-button-disabled-border-color:var(--zane-color-warning-light-5)}.zane-button--warning.is-plain,.zane-button--warning.is-text,.zane-button--warning.is-link{--zane-button-text-color:var(--zane-color-warning);--zane-button-bg-color:var(--zane-color-warning-light-9);--zane-button-border-color:var(--zane-color-warning-light-5);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-bg-color:var(--zane-color-warning);--zane-button-hover-border-color:var(--zane-color-warning);--zane-button-active-text-color:var(--zane-color-white)}.zane-button--warning.is-plain.is-disabled,.zane-button--warning.is-plain.is-disabled:hover,.zane-button--warning.is-plain.is-disabled:focus,.zane-button--warning.is-plain.is-disabled:active,.zane-button--warning.is-text.is-disabled,.zane-button--warning.is-text.is-disabled:hover,.zane-button--warning.is-text.is-disabled:focus,.zane-button--warning.is-text.is-disabled:active,.zane-button--warning.is-link.is-disabled,.zane-button--warning.is-link.is-disabled:hover,.zane-button--warning.is-link.is-disabled:focus,.zane-button--warning.is-link.is-disabled:active{color:var(--zane-color-warning-light-5);background-color:var(--zane-color-warning-light-9);border-color:var(--zane-color-warning-light-8)}.zane-button--danger{--zane-button-text-color:var(--zane-color-white);--zane-button-bg-color:var(--zane-color-danger);--zane-button-border-color:var(--zane-color-danger);--zane-button-outline-color:var(--zane-color-danger-light-5);--zane-button-active-color:var(--zane-color-danger-dark-2);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-link-text-color:var(--zane-color-danger-light-5);--zane-button-hover-bg-color:var(--zane-color-danger-light-3);--zane-button-hover-border-color:var(--zane-color-danger-light-3);--zane-button-active-bg-color:var(--zane-color-danger-dark-2);--zane-button-active-border-color:var(--zane-color-danger-dark-2);--zane-button-disabled-text-color:var(--zane-color-white);--zane-button-disabled-bg-color:var(--zane-color-danger-light-5);--zane-button-disabled-border-color:var(--zane-color-danger-light-5)}.zane-button--danger.is-plain,.zane-button--danger.is-text,.zane-button--danger.is-link{--zane-button-text-color:var(--zane-color-danger);--zane-button-bg-color:var(--zane-color-danger-light-9);--zane-button-border-color:var(--zane-color-danger-light-5);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-bg-color:var(--zane-color-danger);--zane-button-hover-border-color:var(--zane-color-danger);--zane-button-active-text-color:var(--zane-color-white)}.zane-button--danger.is-plain.is-disabled,.zane-button--danger.is-plain.is-disabled:hover,.zane-button--danger.is-plain.is-disabled:focus,.zane-button--danger.is-plain.is-disabled:active,.zane-button--danger.is-text.is-disabled,.zane-button--danger.is-text.is-disabled:hover,.zane-button--danger.is-text.is-disabled:focus,.zane-button--danger.is-text.is-disabled:active,.zane-button--danger.is-link.is-disabled,.zane-button--danger.is-link.is-disabled:hover,.zane-button--danger.is-link.is-disabled:focus,.zane-button--danger.is-link.is-disabled:active{color:var(--zane-color-danger-light-5);background-color:var(--zane-color-danger-light-9);border-color:var(--zane-color-danger-light-8)}.zane-button--info{--zane-button-text-color:var(--zane-color-white);--zane-button-bg-color:var(--zane-color-info);--zane-button-border-color:var(--zane-color-info);--zane-button-outline-color:var(--zane-color-info-light-5);--zane-button-active-color:var(--zane-color-info-dark-2);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-link-text-color:var(--zane-color-info-light-5);--zane-button-hover-bg-color:var(--zane-color-info-light-3);--zane-button-hover-border-color:var(--zane-color-info-light-3);--zane-button-active-bg-color:var(--zane-color-info-dark-2);--zane-button-active-border-color:var(--zane-color-info-dark-2);--zane-button-disabled-text-color:var(--zane-color-white);--zane-button-disabled-bg-color:var(--zane-color-info-light-5);--zane-button-disabled-border-color:var(--zane-color-info-light-5)}.zane-button--info.is-plain,.zane-button--info.is-text,.zane-button--info.is-link{--zane-button-text-color:var(--zane-color-info);--zane-button-bg-color:var(--zane-color-info-light-9);--zane-button-border-color:var(--zane-color-info-light-5);--zane-button-hover-text-color:var(--zane-color-white);--zane-button-hover-bg-color:var(--zane-color-info);--zane-button-hover-border-color:var(--zane-color-info);--zane-button-active-text-color:var(--zane-color-white)}.zane-button--info.is-plain.is-disabled,.zane-button--info.is-plain.is-disabled:hover,.zane-button--info.is-plain.is-disabled:focus,.zane-button--info.is-plain.is-disabled:active,.zane-button--info.is-text.is-disabled,.zane-button--info.is-text.is-disabled:hover,.zane-button--info.is-text.is-disabled:focus,.zane-button--info.is-text.is-disabled:active,.zane-button--info.is-link.is-disabled,.zane-button--info.is-link.is-disabled:hover,.zane-button--info.is-link.is-disabled:focus,.zane-button--info.is-link.is-disabled:active{color:var(--zane-color-info-light-5);background-color:var(--zane-color-info-light-9);border-color:var(--zane-color-info-light-8)}.zane-button--large{--zane-button-size:40px;height:var(--zane-button-size)}.zane-button--large [class*=zane-icon]+span{margin-left:8px}.zane-button--large{padding:12px 19px;font-size:var(--zane-font-size-base);border-radius:var(--zane-border-radius-base)}.zane-button--large.is-round{padding:12px 19px}.zane-button--large.is-circle{width:var(--zane-button-size);padding:12px}.zane-button--small{--zane-button-size:24px;height:var(--zane-button-size)}.zane-button--small [class*=zane-icon]+span{margin-left:4px}.zane-button--small{padding:5px 11px;font-size:12px;border-radius:calc(var(--zane-border-radius-base) - 1px)}.zane-button--small.is-round{padding:5px 11px}.zane-button--small.is-circle{width:var(--zane-button-size);padding:5px}`;

const ns = useNamespace.useNamespace('button');
const ZaneButton = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.clickEvent = index.createEvent(this, "zClick", 7);
        this.autofocus = false;
        this.bg = false;
        this.buttonStyle = {};
        this.circle = false;
        this.dark = false;
        this.disabled = false;
        this.link = false;
        this.loading = false;
        this.nativeType = 'button';
        this.shouldAddSpace = false;
        this.type = '';
        this.handleClick = (evt) => {
            if (this.loading || this.disabled)
                return;
            this.clickEvent.emit(evt);
        };
    }
    get buttonKls() {
        return [
            ns.b(),
            ns.m(this._type),
            ns.m(this._size),
            this.el.className,
            ns.is('disabled', this._disabled),
            ns.is('loading', this.loading),
            ns.is('plain', this._plain),
            ns.is('round', this._round),
            ns.is('circle', this.circle),
            ns.is('text', this._text),
            ns.is('link', this.link),
            ns.is('has-bg', this.bg),
        ].join(' ');
    }
    get groupContext() {
        let parent = this.el.parentElement;
        let context = null;
        while (parent) {
            if (parent.tagName === 'ZANE-BUTTON-GROUP') {
                context = button.buttonGroupContexts.get(parent);
                break;
            }
            parent = parent.parentElement;
        }
        return context;
    }
    componentWillLoad() {
        var _a, _b;
        this.onGroupUpdateSize = () => {
            this.updateInternalState();
        };
        this.onGroupUpdateType = () => {
            this.updateInternalState();
        };
        (_a = this.groupContext) === null || _a === void 0 ? void 0 : _a.addSizeChangeListener(this.onGroupUpdateSize);
        (_b = this.groupContext) === null || _b === void 0 ? void 0 : _b.addTypeChangeListener(this.onGroupUpdateType);
        this.updateInternalState();
        this.updateCustomStyle();
    }
    onPropChange() {
        this.updateInternalState();
        this.updateCustomStyle();
    }
    render() {
        const hasContent = findAllLegitChildren.findAllLegitChildren(this.el).length > 0;
        return (index.h(index.Host, { key: '20349ae578f6e0af983b9224f8461dfdaa907827' }, index.h("button", { key: '705a83ff0ccafbf78a3212a153bc7fbff099ed4d', autofocus: this.autofocus, class: this.buttonKls, disabled: this.disabled, onClick: this.handleClick, style: this.buttonStyle, type: this.nativeType }, this.renderIcon(), hasContent && (index.h("span", { key: 'e708f4f2eb389968334f13592da8ec775dd3c091', class: { [ns.em('text', 'expand')]: this.shouldAddSpace } }, index.h("slot", { key: 'e1332c8127e8b95955dd903487cfcf8c617a789a' }))))));
    }
    renderIcon() {
        const hasIcon = this.icon || this.el.querySelector('[slot="icon"]');
        if (this.loading) {
            return (index.h("slot", { name: "loading" }, index.h("svg", { class: "mr-2", height: "1em", viewBox: "0 0 24 24", width: "1em", xmlns: "http://www.w3.org/2000/svg" }, index.h("path", { d: "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z", fill: "currentColor", opacity: ".25" }), index.h("path", { d: "M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z", fill: "currentColor" }, index.h("animateTransform", { attributeName: "transform", dur: "0.75s", repeatCount: "indefinite", type: "rotate", values: "0 12 12;360 12 12" })))));
        }
        else if (hasIcon) {
            return this.icon ? (index.h("zane-icon", { name: this.icon })) : (index.h("slot", { name: "icon" }));
        }
        return null;
    }
    updateCustomStyle() {
        let styles = {};
        let buttonColor = this.color;
        if (buttonColor) {
            const match = buttonColor.match(/var\((.*?)\)/);
            if (match) {
                buttonColor = window
                    .getComputedStyle(window.document.documentElement)
                    .getPropertyValue(match[1]);
            }
            const color = new TinyColor(buttonColor);
            const activeBgColor = this.dark
                ? color.tint(20).toString()
                : darken(color, 20);
            if (this.plain) {
                styles = ns.cssVarBlock({
                    'active-bg-color': activeBgColor,
                    'active-border-color': activeBgColor,
                    'active-text-color': `var(${ns.cssVarName('color-white')})`,
                    'bg-color': this.dark ? darken(color, 90) : color.tint(90).toString(),
                    'border-color': this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString(),
                    'hover-bg-color': buttonColor,
                    'hover-border-color': buttonColor,
                    'hover-text-color': `var(${ns.cssVarName('color-white')})`,
                    'text-color': buttonColor,
                });
                if (this.disabled) {
                    styles[ns.cssVarBlockName('disabled-bg-color')] = this.dark
                        ? darken(color, 90)
                        : color.tint(90).toString();
                    styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString();
                    styles[ns.cssVarBlockName('disabled-border-color')] = this.dark
                        ? darken(color, 80)
                        : color.tint(80).toString();
                }
            }
            else {
                const hoverBgColor = this.dark
                    ? darken(color, 30)
                    : color.tint(30).toString();
                const textColor = color.isDark()
                    ? `var(${ns.cssVarName('color-white')})`
                    : `var(${ns.cssVarName('color-black')})`;
                styles = ns.cssVarBlock({
                    'active-bg-color': activeBgColor,
                    'active-border-color': activeBgColor,
                    'bg-color': buttonColor,
                    'border-color': buttonColor,
                    'hover-bg-color': hoverBgColor,
                    'hover-border-color': hoverBgColor,
                    'hover-text-color': textColor,
                    'text-color': textColor,
                });
                if (this.disabled) {
                    const disabledButtonColor = this.dark
                        ? darken(color, 50)
                        : color.tint(50).toString();
                    styles[ns.cssVarBlockName('disabled-bg-color')] = disabledButtonColor;
                    styles[ns.cssVarBlockName('disabled-text-color')] = this.dark
                        ? 'rgba(255, 255, 255, 0.5)'
                        : `var(${ns.cssVarName('color-white')})`;
                    styles[ns.cssVarBlockName('disabled-border-color')] =
                        disabledButtonColor;
                }
            }
        }
        this.buttonStyle = Object.assign(Object.assign({}, styles), this.el.style);
    }
    updateInternalState() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const globalButtonConfig = uuid.state.configProviderContext.button;
        const autoInsertSpace = (_b = (_a = this.autoInsertSpace) !== null && _a !== void 0 ? _a : globalButtonConfig.autoInsertSpace) !== null && _b !== void 0 ? _b : false;
        this._size = this.size || ((_c = this.groupContext) === null || _c === void 0 ? void 0 : _c.size) || uuid.state.size || '';
        this._type =
            this.type || ((_d = this.groupContext) === null || _d === void 0 ? void 0 : _d.type) || globalButtonConfig.type || '';
        this._disabled = this.disabled;
        this._plain = (_f = (_e = this.plain) !== null && _e !== void 0 ? _e : globalButtonConfig.plain) !== null && _f !== void 0 ? _f : false;
        this._round = (_h = (_g = this.round) !== null && _g !== void 0 ? _g : globalButtonConfig.round) !== null && _h !== void 0 ? _h : false;
        this._text = (_k = (_j = this.text) !== null && _j !== void 0 ? _j : globalButtonConfig.text) !== null && _k !== void 0 ? _k : false;
        if (autoInsertSpace) {
            const slot = this.el.querySelector('span');
            if (slot) {
                const text = slot.textContent;
                this.shouldAddSpace = /^\p{Unified_Ideograph}{2}$/u.test(text);
            }
        }
        this.shouldAddSpace = false;
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "size": [{
                "onPropChange": 0
            }],
        "type": [{
                "onPropChange": 0
            }],
        "disabled": [{
                "onPropChange": 0
            }],
        "plain": [{
                "onPropChange": 0
            }],
        "round": [{
                "onPropChange": 0
            }],
        "text": [{
                "onPropChange": 0
            }],
        "color": [{
                "onPropChange": 0
            }],
        "dark": [{
                "onPropChange": 0
            }]
    }; }
};
ZaneButton.style = zaneButtonCss();

exports.zane_button = ZaneButton;
