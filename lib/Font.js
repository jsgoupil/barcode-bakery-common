'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Interface for a font.
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var Canvas = require('canvas');
var Utility = require('./Utility');
var Color = require('./Color');
var setFont = Utility.setFont;
var setColor = Utility.setColor;

/**
 * Constructor.
 *
 * @param string $font font
 * @param int $size size in point
 */
function Font(font, size) {
    this.__font = font;
    this.__size = typeof size === 'number' ? size + 'pt' : size;
    this.__text = '';
    this.__foregroundColor = new Color('black');
    this.__box = null;
    
    this.setRotationAngle(0);
}

/**
 * Gets the text associated to the font.
 *
 * @return string
 */
Font.prototype.getText = function() {
    return this.__text;
};


/**
 * Sets the text associated to the font.
 *
 * @param string text
 */
Font.prototype.setText = function(text) {
    this.__text = text;
    this.__box = null;
};

/**
 * Gets the rotation in degree.
 *
 * @return int
 */
Font.prototype.getRotationAngle = function() {
    return this.__rotationAngle % 360;
};

/**
 * Sets the rotation in degree.
 *
 * @param int
 */
Font.prototype.setRotationAngle = function(rotationDegree) {
    this.__rotationAngle = parseInt(rotationDegree, 10);
    if (this.__rotationAngle !== 90 && this.__rotationAngle !== 180 && this.__rotationAngle !== 270) {
        this.__rotationAngle = 0;
    }

    this.__rotationAngle = this.__rotationAngle % 360;

    this.__box = null;
};

/**
 * Gets the foreground color.
 *
 * @return Color
 */
Font.prototype.getForegroundColor = function() {
    return this.__foregroundColor;
};

/**
 * Sets the foregroung color.
 *
 * @param Color $foregroundColor
 */
Font.prototype.setForegroundColor = function(foregroundColor) {
    this.__foregroundColor = foregroundColor;
};

/**
 * Returns the width and height that the text takes to be written.
 *
 * @return int[]
 */
Font.prototype.getDimension = function() {
    var w = 0.0, h = 0.0,
        minX, maxX, minY, maxY,
        box = this.__getBox();

    w = box.actualBoundingBoxRight - box.actualBoundingBoxLeft + 1;
    h = box.actualBoundingBoxAscent + box.actualBoundingBoxDescent + 1;
    
    var rotationAngle = this.getRotationAngle();
    if (rotationAngle === 90 || rotationAngle === 270) {
        return [h, w];
    } else {
        return [w, h];
    }
};

/**
 * Draws the text on the image at a specific position.
 * $x and $y represent the left bottom corner.
 *
 * @param resource $im
 * @param int $x
 * @param int $y
 */
Font.prototype.draw = function(im, x, y) {
    var drawingPosition = this.__getDrawingPosition(x, y);
    setFont(im, this.__font, this.__size);
    setColor(im, this.__foregroundColor.allocate(im));

    im.save();
    im.translate(drawingPosition[0], drawingPosition[1]);
    var rotationAngle = this.getRotationAngle();
    im.rotate(-rotationAngle * Math.PI / 180);
    im.fillText(this.__text, 0, 0);
    im.restore();
};

Font.prototype.__getDrawingPosition = function(x, y) {
    var dimension = this.getDimension(),
        box = this.__getBox(),
        rotationAngle = this.getRotationAngle();
    if (rotationAngle === 0) {
        y += box.actualBoundingBoxAscent;
    } else if (rotationAngle === 90) {
        x += box.actualBoundingBoxAscent;
        y += dimension[1];
    } else if (rotationAngle === 180) {
        x += dimension[0];
        y += box.actualBoundingBoxDescent;
    } else if (rotationAngle === 270) {
        x += box.actualBoundingBoxDescent;
    }

    return [x, y];
};

Font.prototype.__getBox = function() {
    if (!this.__box) {
        var canvas = new Canvas(1, 1),
            ctx = canvas.getContext('2d');

        setFont(ctx, this.__font, this.__size);
        this.__box = ctx.measureText(this.__text);
    }
    
    return this.__box;
};

module.exports = Font;