'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Base class for Barcode 1D and 2D
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var Color = require('./Color');
var Label = require('./Label');
var ArgumentException = require('./ArgumentException');
var DrawException = require('./DrawException');
var draw = require('./draw');

/**
 * Constructor.
 */
function Barcode() {
    this._labels = [];
    this._pushLabel = [0, 0];
    
    this.setOffsetX(0);
    this.setOffsetY(0);
    this.setForegroundColor(0x000000);
    this.setBackgroundColor(0xffffff);
    this.setScale(1);
}

Barcode.COLOR_BG = 0;
Barcode.COLOR_FG = 1;

/**
 * Parses the text before displaying it.
 *
 * @param mixed text
 */
Barcode.prototype.parse = function(text) {
};

/**
 * Gets the foreground color of the barcode.
 *
 * @return Color
 */
Barcode.prototype.getForegroundColor = function() {
    return this._colorFg;
};

/**
 * Sets the foreground color of the barcode. It could be a Color
 * value or simply a language code (white, black, yellow...) or hex value.
 *
 * @param mixed code
 */
Barcode.prototype.setForegroundColor = function(code) {
    if (code instanceof Color) {
        this._colorFg = code;
    } else {
        this._colorFg = new Color(code);
    }
};

/**
 * Gets the background color of the barcode.
 *
 * @return Color
 */
Barcode.prototype.getBackgroundColor = function() {
    return this._colorBg;
};

/**
 * Sets the background color of the barcode. It could be a Color
 * value or simply a language code (white, black, yellow...) or hex value.
 *
 * @param mixed code
 */
Barcode.prototype.setBackgroundColor = function(code) {
    var that = this;

    if (code instanceof Color) {
        this._colorBg = code;
    } else {
        this._colorBg = new Color(code);
    }
};

/**
 * Sets the color.
 *
 * @param mixed fg
 * @param mixed bg
 */
Barcode.prototype.setColor = function(fg, bg) {
    this.setForegroundColor(fg);
    this.setBackgroundColor(bg);
};

/**
 * Gets the scale of the barcode.
 *
 * @return int
 */
Barcode.prototype.getScale = function() {
    return this._scale;
};

/**
 * Sets the scale of the barcode in pixel.
 * If the scale is lower than 1, an exception is raised.
 *
 * @param int scale
 */
Barcode.prototype.setScale = function(scale) {
    var scale = parseInt(scale, 10);
    if (scale <= 0) {
        throw new ArgumentException('The scale must be larger than 0.', 'scale');
    }

    this._scale = scale;
};

Barcode.prototype.draw = function(im) {};

/**
 * Returns the maximal size of a barcode.
 * [0].width
 * [1].height
 *
 * @param int w
 * @param int h
 * @return int[]
 */
Barcode.prototype.getDimension = function(w, h) {
    var labels = this.__getBiggestLabels(false);
    var pixelsAround = [0, 0, 0, 0]; // TRBL
    var dimension;

    if (labels[Label.POSITION_TOP]) {
        dimension = labels[Label.POSITION_TOP].getDimension();
        pixelsAround[0] += dimension[1];
    }

    if (labels[Label.POSITION_RIGHT]) {
        dimension = labels[Label.POSITION_RIGHT].getDimension();
        pixelsAround[1] += dimension[0];
    }

    if (labels[Label.POSITION_BOTTOM]) {
        dimension = labels[Label.POSITION_BOTTOM].getDimension();
        pixelsAround[2] += dimension[1];
    }

    if (labels[Label.POSITION_LEFT]) {
        dimension = labels[Label.POSITION_LEFT].getDimension();
        pixelsAround[3] += dimension[0];
    }

    var finalW = (w + this._offsetX) * this._scale;
    var finalH = (h + this._offsetY) * this._scale;

    // This section will check if a top/bottom label is too big for its width and left/right too big for its height
    var reversedLabels = this.__getBiggestLabels(true);
    reversedLabels.forEach(function(label) {
        var dimension = label.getDimension();
        var alignment = label.getAlignment();
        if (label.getPosition() === Label.POSITION_LEFT || label.getPosition() === Label.POSITION_RIGHT) {
            if (alignment === Label.ALIGN_TOP) {
                pixelsAround[2] = Math.max(pixelsAround[2], dimension[1] - finalH);
            } else if (alignment === Label.ALIGN_CENTER) {
                temp = Math.ceil((dimension[1] - finalH) / 2);
                pixelsAround[0] = Math.max(pixelsAround[0], temp);
                pixelsAround[2] = Math.max(pixelsAround[2], temp);
            } else if (alignment === Label.ALIGN_BOTTOM) {
                pixelsAround[0] = Math.max(pixelsAround[0], dimension[1] - finalH);
            }
        } else {
            if (alignment === Label.ALIGN_LEFT) {
                pixelsAround[1] = Math.max(pixelsAround[1], dimension[0] - finalW);
            } else if (alignment === Label.ALIGN_CENTER) {
                var temp = Math.ceil((dimension[0] - finalW) / 2);
                pixelsAround[1] = Math.max(pixelsAround[1], temp);
                pixelsAround[3] = Math.max(pixelsAround[3], temp);
            } else if (alignment === Label.ALIGN_RIGHT) {
                pixelsAround[3] = Math.max(pixelsAround[3], dimension[0] - finalW);
            }
        }
    });

    this._pushLabel[0] = pixelsAround[3];
    this._pushLabel[1] = pixelsAround[0];

    finalW = (w + this._offsetX) * this._scale + pixelsAround[1] + pixelsAround[3];
    finalH = (h + this._offsetY) * this._scale + pixelsAround[0] + pixelsAround[2];

    return [finalW, finalH];
};

/**
 * Gets the X offset.
 *
 * @return int
 */
Barcode.prototype.getOffsetX = function() {
    return this._offsetX;
};

/**
 * Sets the X offset.
 *
 * @param int offsetX
 */
Barcode.prototype.setOffsetX = function(offsetX) {
    var offsetX = parseInt(offsetX, 10);
    if (offsetX < 0) {
        throw new ArgumentException('The offset X must be 0 or larger.', 'offsetX');
    }

    this._offsetX = offsetX;
};

/**
 * Gets the Y offset.
 *
 * @return int
 */
Barcode.prototype.getOffsetY = function() {
    return this._offsetY;
};

/**
 * Sets the Y offset.
 *
 * @param int offsetY
 */
Barcode.prototype.setOffsetY = function(offsetY) {
    var offsetY = parseInt(offsetY, 10);
    if (offsetY < 0) {
        throw new ArgumentException('The offset Y must be 0 or larger.', 'offsetY');
    }

    this._offsetY = offsetY;
};

/**
 * Adds the label to the drawing.
 *
 * @param Label label
 */
Barcode.prototype.addLabel = function(label) {
    this._labels.push(label);
};

/**
 * Removes the label from the drawing.
 *
 * @param Label label
 */
Barcode.prototype.removeLabel = function(label) {
    var remove = -1;
    var c = this._labels.length;
    for (var i = 0; i < c; i++) {
        if (this._labels[i] === label) {
            remove = i;
            break;
        }
    }

    if (remove > -1) {
        this._labels.splice(remove, 1);
    }
};

/**
 * Clears the labels.
 */
Barcode.prototype.clearLabels = function() {
    this._labels = [];
};

/**
 * Draws the text.
 * The coordinate passed are the positions of the barcode.
 * x1 and y1 represent the top left corner.
 * x2 and y2 represent the bottom right corner.
 *
 * @param resource im
 * @param int x1
 * @param int y1
 * @param int x2
 * @param int y2
 */
Barcode.prototype._drawText = function(im, x1, y1, x2, y2) {
    var that = this;
    this._labels.forEach(function(label) {
        label.draw(im,
            (x1 + that._offsetX) * that._scale + that._pushLabel[0],
            (y1 + that._offsetY) * that._scale + that._pushLabel[1],
            (x2 + that._offsetX) * that._scale + that._pushLabel[0],
            (y2 + that._offsetY) * that._scale + that._pushLabel[1]);
    });
};

/**
 * Draws 1 pixel on the resource at a specific position with a determined color.
 *
 * @param resource im
 * @param int x
 * @param int y
 * @param int color
 */
Barcode.prototype._drawPixel = function(im, x, y, color) {
    if (typeof color === 'undefined') {
        color = Barcode.COLOR_FG;
    }

    var xR = (x + this._offsetX) * this._scale + this._pushLabel[0];
    var yR = (y + this._offsetY) * this._scale + this._pushLabel[1];

    // We always draw a rectangle
    draw.imagefilledrectangle(im,
        xR,
        yR,
        xR + this._scale - 1,
        yR + this._scale - 1,
        this._getColor(im, color));
};

/**
 * Draws an empty rectangle on the resource at a specific position with a determined color.
 *
 * @param resource im
 * @param int x1
 * @param int y1
 * @param int x2
 * @param int y2
 * @param int color
 */
Barcode.prototype._drawRectangle = function(im, x1, y1, x2, y2, color) {
    if (typeof color === 'undefined') {
        color = Barcode.COLOR_FG;
    }

    if (this._scale === 1) {
        draw.imagefilledrectangle(im,
            (x1 + this._offsetX) + this._pushLabel[0],
            (y1 + this._offsetY) + this._pushLabel[1],
            (x2 + this._offsetX) + this._pushLabel[0],
            (y2 + this._offsetY) + this._pushLabel[1],
            this._getColor(im, color));
    } else {
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * this._scale + this._pushLabel[0], (y1 + this._offsetY) * this._scale + this._pushLabel[1], (x2 + this._offsetX) * this._scale + this._pushLabel[0] + this._scale - 1, (y1 + this._offsetY) * this._scale + this._pushLabel[1] + this._scale - 1, this._getColor(im, color));
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * this._scale + this._pushLabel[0], (y1 + this._offsetY) * this._scale + this._pushLabel[1], (x1 + this._offsetX) * this._scale + this._pushLabel[0] + this._scale - 1, (y2 + this._offsetY) * this._scale + this._pushLabel[1] + this._scale - 1, this._getColor(im, color));
        draw.imagefilledrectangle(im, (x2 + this._offsetX) * this._scale + this._pushLabel[0], (y1 + this._offsetY) * this._scale + this._pushLabel[1], (x2 + this._offsetX) * this._scale + this._pushLabel[0] + this._scale - 1, (y2 + this._offsetY) * this._scale + this._pushLabel[1] + this._scale - 1, this._getColor(im, color));
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * this._scale + this._pushLabel[0], (y2 + this._offsetY) * this._scale + this._pushLabel[1], (x2 + this._offsetX) * this._scale + this._pushLabel[0] + this._scale - 1, (y2 + this._offsetY) * this._scale + this._pushLabel[1] + this._scale - 1, this._getColor(im, color));
    }
};

/**
 * Draws a filled rectangle on the resource at a specific position with a determined color.
 *
 * @param resource im
 * @param int x1
 * @param int y1
 * @param int x2
 * @param int y2
 * @param int color
 */
Barcode.prototype._drawFilledRectangle = function(im, x1, y1, x2, y2, color) {
    if (typeof color === 'undefined') {
        color = Barcode.COLOR_FG;
    }

    if (x1 > x2) { // Swap
        x1 ^= x2 ^= x1 ^= x2;
    }

    if (y1 > y2) { // Swap
        y1 ^= y2 ^= y1 ^= y2;
    }

    draw.imagefilledrectangle(im,
        (x1 + this._offsetX) * this._scale + this._pushLabel[0],
        (y1 + this._offsetY) * this._scale + this._pushLabel[1],
        (x2 + this._offsetX) * this._scale + this._pushLabel[0] + this._scale - 1,
        (y2 + this._offsetY) * this._scale + this._pushLabel[1] + this._scale - 1,
        this._getColor(im, color));
};

/**
 * Allocates the color based on the integer.
 *
 * @param resource im
 * @param int color
 * @return resource
 */
Barcode.prototype._getColor = function(im, color) {
    if (color === Barcode.COLOR_BG) {
        return this._colorBg.allocate(im);
    } else {
        return this._colorFg.allocate(im);
    }
};

/**
 * Returning the biggest label widths for LEFT/RIGHT and heights for TOP/BOTTOM.
 *
 * @param bool reversed
 * @return Label[]
 */
Barcode.prototype.__getBiggestLabels = function(reversed) {
    reversed = !!reversed;

    var searchLR = reversed ? 1 : 0;
    var searchTB = reversed ? 0 : 1;

    var labels = [];
    this._labels.forEach(function(label) {
        var position = label.getPosition();
        if (labels[position]) {
            var savedDimension = labels[position].getDimension();
            var dimension = label.getDimension();
            if (position === Label.POSITION_LEFT || position === Label.POSITION_RIGHT) {
                if (dimension[searchLR] > savedDimension[searchLR]) {
                    labels[position] = label;
                }
            } else {
                if (dimension[searchTB] > savedDimension[searchTB]) {
                    labels[position] = label;
                }
            }
        } else {
            labels[position] = label;
        }
    });

    return labels;
};

module.exports = Barcode;