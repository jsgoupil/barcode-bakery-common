'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Base class for Barcode2D
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var inherits = require('util').inherits;
var Barcode = require('./Barcode');
var Color = require('./Color');
var ArgumnentException = require('./ArgumentException');
var draw = require('./draw');

/**
 * Constructor.
 */
function Barcode2D() {
    Barcode.call(this);

    this._setScaleX(1);
    this._setScaleY(1);
}

inherits(Barcode2D, Barcode);

/**
 * Returns the maximal size of a barcode.
 *
 * @param int w
 * @param int h
 * @return int[]
 */
Barcode2D.prototype.getDimension = function (w, h) {
    return Barcode.prototype.getDimension.call(this, w * this._scaleX, h * this._scaleY);
};

/**
 * Sets the scale of the barcode in pixel for X.
 * If the scale is lower than 1, an exception is raised.
 *
 * @param int scaleX
 */
Barcode2D.prototype._setScaleX = function (scaleX) {
    scaleX = parseInt(scaleX, 10);
    if (scaleX <= 0) {
        throw new ArgumentException('The scale must be larger than 0.', 'scaleX');
    }
    
    this._scaleX = scaleX;
};

/**
 * Sets the scale of the barcode in pixel for Y.
 * If the scale is lower than 1, an exception is raised.
 *
 * @param int scaleY
 */
Barcode2D.prototype._setScaleY = function (scaleY) {
    scaleY = parseInt(scaleY, 10);
    if (scaleY <= 0) {
        throw new ArgumentException('The scale must be larger than 0.', 'scaleY');
    }
    
    this._scaleY = scaleY;
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
Barcode2D.prototype._drawText = function (im, x1, y1, x2, y2) {
    for (var label in this._labels) {
        label.draw(im,
                (x1 + this._offsetX) * this._scale * this._scaleX + this._pushLabel[0],
                (y1 + this._offsetY) * this._scale * this._scaleY + this._pushLabel[1],
                (x2 + this._offsetX) * this._scale * this._scaleX + this._pushLabel[0],
                (y2 + this._offsetY) * this._scale * this._scaleY + this._pushLabel[1]);
    }
};

/**
 * Draws 1 pixel on the resource at a specific position with a determined color.
 *
 * @param resource im
 * @param int x
 * @param int y
 * @param int color
 */
Barcode2D.prototype._drawPixel = function (im, x, y, color) {
    color = typeof color === 'undefined' ? Barcode.COLOR_FG : color;
    
    var scaleX = this._scale * this._scaleX;
    var scaleY = this._scale * this._scaleY;
    
    var xR = (x + this._offsetX) * scaleX + this._pushLabel[0];
    var yR = (y + this._offsetY) * scaleY + this._pushLabel[1];
    
    // We always draw a rectangle
    draw.imagefilledrectangle(im,
        xR,
        yR,
        xR + scaleX - 1,
        yR + scaleY - 1,
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
Barcode2D.prototype._drawRectangle = function (im, x1, y1, x2, y2, color) {
    color = typeof color === 'undefined' ? Barcode.COLOR_FG : color;
    var scaleX = this._scale * this._scaleX;
    var scaleY = this._scale * this._scaleY;
    
    if (this._scale === 1) {
        draw.imagefilledrectangle(im,
                (x1 + this._offsetX) * scaleX + this._pushLabel[0],
                (y1 + this._offsetY) * scaleY + this._pushLabel[1],
                (x2 + this._offsetX) * scaleX + this._pushLabel[0],
                (y2 + this._offsetY) * scaleY + this._pushLabel[1],
                this._getColor(im, color));
    } else {
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * scaleX + this._pushLabel[0], (y1 + this._offsetY) * scaleY + this._pushLabel[1], (x2 + this._offsetX) * scaleX + scaleX - 1 + this._pushLabel[0], (y1 + this._offsetY) * scaleY + scaleY - 1 + this._pushLabel[1], this._getColor(im, color));
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * scaleX + this._pushLabel[0], (y1 + this._offsetY) * scaleY + this._pushLabel[1], (x1 + this._offsetX) * scaleX + scaleX - 1 + this._pushLabel[0], (y2 + this._offsetY) * scaleY + scaleY - 1 + this._pushLabel[1], this._getColor(im, color));
        draw.imagefilledrectangle(im, (x2 + this._offsetX) * scaleX + this._pushLabel[0], (y1 + this._offsetY) * scaleY + this._pushLabel[1], (x2 + this._offsetX) * scaleX + scaleX - 1 + this._pushLabel[0], (y2 + this._offsetY) * scaleY + scaleY - 1 + this._pushLabel[1], this._getColor(im, color));
        draw.imagefilledrectangle(im, (x1 + this._offsetX) * scaleX + this._pushLabel[0], (y2 + this._offsetY) * scaleY + this._pushLabel[1], (x2 + this._offsetX) * scaleX + scaleX - 1 + this._pushLabel[0], (y2 + this._offsetY) * scaleY + scaleY - 1 + this._pushLabel[1], this._getColor(im, color));
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
Barcode2D.prototype._drawFilledRectangle = function (im, x1, y1, x2, y2, color) {
    color = typeof color === 'undefined' ? Barcode.COLOR_FG : color;
    
    if (x1 > x2) { // Swap
        x1 ^= x2 ^= x1 ^= x2;
    }
    
    if (y1 > y2) { // Swap
        y1 ^= y2 ^= y1 ^= y2;
    }
    
    var scaleX = this._scale * this._scaleX;
    var scaleY = this._scale * this._scaleY;
    
    draw.imagefilledrectangle(im,
        (x1 + this._offsetX) * scaleX + this._pushLabel[0],
        (y1 + this._offsetY) * scaleY + this._pushLabel[1],
        (x2 + this._offsetX) * scaleX + scaleX - 1 + this._pushLabel[0],
        (y2 + this._offsetY) * scaleY + scaleY - 1 + this._pushLabel[1],
        this._getColor(im, color));
};

module.exports = Barcode2D;