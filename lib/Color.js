'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Holds Color in RGB Format.
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var draw = require('./draw');

/**
 * Save RGB value into the classes.
 *
 * There are 4 way to associate color with this classes :
 *  1. Gives 3 parameters int (R, G, B)
 *  2. Gives 1 parameter string hex value (#ff0000) (preceding with #)
 *  3. Gives 1 parameter int hex value (0xff0000)
 *  4. Gives 1 parameter string color code (white, black, orange...)
 *
 * @param mixed ...
 */
function Color() {
    var args = arguments;
    var c = args.length;
    if (c === 3) {
        this._r = parseInt(args[0], 10);
        this._g = parseInt(args[1], 10);
        this._b = parseInt(args[2], 10);
    } else if (c === 1) {
        if (typeof args[0] === 'string' && args[0].length === 7 && args[0][0] === '#') {        // Hex Value in String
            this._r = parseInt(args[0].substr(1, 2), 16);
            this._g = parseInt(args[0].substr(3, 2), 16);
            this._b = parseInt(args[0].substr(5, 2), 16);
        } else {
            if (typeof args[0] === 'string') {
                args[0] = Color.getColor(args[0]);
            }

            args[0] = parseInt(args[0], 10);
            this._r = (args[0] & 0xff0000) >> 16;
            this._g = (args[0] & 0x00ff00) >> 8;
            this._b = (args[0] & 0x0000ff);
        }
    } else {
        this._r = this._g = this._b = 0;
    }
}

/**
 * Sets the color transparent.
 *
 * @param bool transparent
 */
Color.prototype.setTransparent = function(transparent) {
    this._transparent = transparent;
};

/**
 * Returns Red Color.
 *
 * @return int
 */
Color.prototype.r = function() {
    return this._r;
};

/**
 * Returns Green Color.
 *
 * @return int
 */
Color.prototype.g = function() {
    return this._g;
};

/**
 * Returns Blue Color.
 *
 * @return int
 */
Color.prototype.b = function() {
    return this._b;
};

/**
 * Returns the int value for PHP color.
 *
 * @param resource im
 * @return int
 */
Color.prototype.allocate = function(im) {
    var allocated = draw.imagecolorallocate(im, this._r, this._g, this._b);
    if (this._transparent) {
        return draw.imagecolortransparent(im, allocated);
    } else {
        return allocated;
    }
};

/**
 * Returns class of Color depending of the string color.
 *
 * If the color doens't exist, it takes the default one.
 *
 * @param string code
 * @param string defaultColor
 */
Color.getColor = function(code, defaultColor) {
    defaultColor = defaultColor || 'white';
    switch(code.toLowerCase()) {
        case '':
        case 'white':
            return 0xffffff;
        case 'black':
            return 0x000000;
        case 'maroon':
            return 0x800000;
        case 'red':
            return 0xff0000;
        case 'orange':
            return 0xffa500;
        case 'yellow':
            return 0xffff00;
        case 'olive':
            return 0x808000;
        case 'purple':
            return 0x800080;
        case 'fuchsia':
            return 0xff00ff;
        case 'lime':
            return 0x00ff00;
        case 'green':
            return 0x008000;
        case 'navy':
            return 0x000080;
        case 'blue':
            return 0x0000ff;
        case 'aqua':
            return 0x00ffff;
        case 'teal':
            return 0x008080;
        case 'silver':
            return 0xc0c0c0;
        case 'gray':
            return 0x808080;
        default:
            return Color.getColor(defaultColor, 'white');
    }
};

module.exports = Color;