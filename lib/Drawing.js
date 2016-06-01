'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Holds the drawing canvas.
 * You can use getCanvas() to add other kind of form not held into these classes.
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

var draw = require('./draw');
var Color = require('./Color');
var DrawException = require('./DrawException');
var Barcode = require('./Barcode');
var DrawPNG = draw.DrawPNG;

/**
 * Constructor.
 *
 * @param barcode barcode or exception
 * @param Color optional background color
 */
function Drawing(barcode, color) {
    this.__barcode = barcode || null;

    this.__im = null;
    this.__color = color;
    this.__dpi = null;
    this.__rotateDegree = 0.0;
}

Drawing.IMG_FORMAT_PNG = 1;
Drawing.IMG_FORMAT_JPEG = 2;
Drawing.IMG_FORMAT_GIF = 3;
Drawing.IMG_FORMAT_WBMP = 4;

/**
 * Destructor.
 */
Drawing.prototype.__destruct = function() {
    this.destroy();
};

/**
 * @return resource.
 */
Drawing.prototype.getCanvas = function() {
    return this.__im;
};

/**
 * Sets the image.
 *
 * @param resource canvas
 */
Drawing.prototype.setCanvas = function(canvas) {
    this.__im = canvas;
};

/**
 * Gets barcode for drawing.
 *
 * @return Barcode
 */
Drawing.prototype.getBarcode = function() {
    return this.__barcode;
};

/**
 * Gets the DPI for supported filetype.
 *
 * @return int
 */
Drawing.prototype.getDPI = function() {
    return this.__dpi;
};

/**
 * Sets the DPI for supported filetype.
 *
 * @param float dpi
 */
Drawing.prototype.setDPI = function(dpi) {
    this.__dpi = dpi;
};

/**
 * Gets the rotation angle in degree.
 *
 * @return float
 */
Drawing.prototype.getRotationAngle = function() {
    return this.__rotateDegree;
};

/**
 * Sets the rotation angle in degree.
 *
 * @param float degree
 */
Drawing.prototype.setRotationAngle = function(degree) {
    this.__rotateDegree = parseFloat(degree);
};

Drawing.prototype.toBuffer = function(format, callback) {
    this._draw();
    var drawer = getDrawerFromFormat(format, this.__im, this.__dpi);
    return drawer.toBuffer(callback);
};

Drawing.prototype.toBufferSync = function(format) {
    return this.toBuffer(format);
};

Drawing.prototype.save = function(filename, format, callback) {
    if (typeof format === 'function') {
        callback = format;
        format = undefined;
    }

    if (format === undefined) {
        format = getFormatFromFilename(filename);
    }

    this._draw();
    var drawer = getDrawerFromFormat(format, this.__im, this.__dpi);
    return drawer.toFile(filename, callback);
};

/**
 * Draws the barcode in a file asynchronously
 */
Drawing.prototype.saveSync = function(filename, format) {
    return this.save(filename, format);
};

Drawing.prototype._draw = function () {
    function internalDraw() {
        if (this.__barcode instanceof Barcode) {
            this.__barcode.draw(this.__im);
        }
    }

    var size = this.__barcode.getDimension(0, 0);
    this.__w = Math.max(1, size[0]);
    this.__h = Math.max(1, size[1]);
    this.__init();

    if (this.__rotateDegree > 0.0) {
        throw new Exception('Not yet implemented.');
    } else {
        internalDraw.call(this);
    }
};

/**
 * Free the memory of PHP (called also by destructor).
 */
Drawing.prototype.destroy = function() {
    draw.imagedestroy(this.__im);
};

/**
 * Init Image and color background.
 */
Drawing.prototype.__init = function() {
    if (this.__im === null) {
        this.__im = draw.imagecreatetruecolor(this.__w, this.__h);
        draw.imagefilledrectangle(this.__im, 0, 0, this.__w - 1, this.__h - 1, this.__color.allocate(this.__im));
    }
};

function getDrawerFromFormat(format, im, dpi) {
    var drawer;
    switch (format) {
        case Drawing.IMG_FORMAT_PNG:
            drawer = new DrawPNG(im);
            break;
        /*
        case Drawing.IMG_FORMAT_JPEG:
            drawer = new DrawJPG(im, 100);
            break;
        case Drawing.IMG_FORMAT_GIF:
            drawer = new DrawGIF(im);
            break;
        */
    }

    if (drawer) {
        drawer.setDPI(dpi);
        return drawer;
    }

    throw new DrawException('There are no drawer for this format.');
}

function getFormatFromFilename(filename) {
    var extension = getExtension(filename).toUpperCase();
    switch (extension) {
        case 'PNG':
            return Drawing.IMG_FORMAT_PNG;
        case 'JPG':
        case 'JPEG':
            return { name: Drawing.IMG_FORMAT_JPG, quality: 100 };
        case 'GIF':
            return Drawing.IMG_FORMAT_GIF;
    }

    throw new DrawException('The format cannot be found based on the filename, specify a format.');
}

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

module.exports = Drawing;