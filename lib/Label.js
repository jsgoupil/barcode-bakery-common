'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Class for Label
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var ArgumentException = require('./ArgumentException');
var Font = require('./Font');
var Color = require('./Color');
var Utility = require('./Utility');

/**
 * Constructor.
 *
 * @param string text
 * @param Font font
 * @param int position
 * @param int alignment
 */
function Label(text, font, position, alignment) {
    text = text || '';
    font = font || null;
    position = typeof position === 'undefined' ? Label.POSITION_BOTTOM : position;
    alignment = typeof alignment === 'undefined' ? Label.ALIGN_CENTER : alignment;

    var font = font === null ? new Font() : font;
    this.setFont(font);
    this.setText(text);
    this.setPosition(position);
    this.setAlignment(alignment);
    this.setSpacing(4);
    this.setOffset(0);
    this.setRotationAngle(0);
    this.setForegroundColor(new Color('black'));
}

Label.POSITION_TOP = 0;
Label.POSITION_RIGHT = 1;
Label.POSITION_BOTTOM = 2;
Label.POSITION_LEFT = 3;

Label.ALIGN_LEFT = 0;
Label.ALIGN_TOP = 0;
Label.ALIGN_CENTER = 1;
Label.ALIGN_RIGHT = 2;
Label.ALIGN_BOTTOM = 2;

/**
 * Gets the text.
 *
 * @return string
 */
Label.prototype.getText = function() {
    return this.__font.getText();
};

/**
 * Sets the text.
 *
 * @param string text
 */
Label.prototype.setText = function(text) {
    this.__text = text;
    this.__font.setText(this.__text);
};

/**
 * Gets the font.
 *
 * @return Font
 */
Label.prototype.getFont = function() {
    return this.__font;
};

/**
 * Sets the font.
 *
 * @param Font font
 */
Label.prototype.setFont = function(font) {
    if (font === null) {
        throw new ArgumentException('Font cannot be null.', 'font');
    }

    this.__font = Utility.clone(font);
    this.__font.setText(this.__text);
    this.__font.setRotationAngle(this.__rotationAngle);
    this.__font.setForegroundColor(this.__foregroundColor);
};

/**
 * Gets the text position for drawing.
 *
 * @return int
 */
Label.prototype.getPosition = function() {
    return this.__position;
};

/**
 * Sets the text position for drawing.
 *
 * @param int position
 */
Label.prototype.setPosition = function(position) {
    var position = parseInt(position, 10);
    if (position !== Label.POSITION_TOP && position !== Label.POSITION_RIGHT && position !== Label.POSITION_BOTTOM && position !== Label.POSITION_LEFT) {
        throw new ArgumentException('The text position must be one of a valid constant.', 'position');
    }

    this.__position = position;
};

/**
 * Gets the text alignment for drawing.
 *
 * @return int
 */
Label.prototype.getAlignment = function() {
    return this.__alignment;
};

/**
 * Sets the text alignment for drawing.
 *
 * @param int alignment
 */
Label.prototype.setAlignment = function(alignment) {
    var alignment = parseInt(alignment, 10);
    if (alignment !== Label.ALIGN_LEFT && alignment !== Label.ALIGN_TOP && alignment !== Label.ALIGN_CENTER && alignment !== Label.ALIGN_RIGHT && alignment !== Label.ALIGN_BOTTOM) {
        throw new ArgumentException('The text alignment must be one of a valid constant.', 'alignment');
    }

    this.__alignment = alignment;
};

/**
 * Gets the offset.
 *
 * @return int
 */
Label.prototype.getOffset = function() {
    return this.__offset;
};

/**
 * Sets the offset.
 *
 * @param int offset
 */
Label.prototype.setOffset = function(offset) {
    this.__offset = parseInt(offset, 10);
};

/**
 * Gets the spacing.
 *
 * @return int
 */
Label.prototype.getSpacing = function() {
    return this.__spacing;
};

/**
 * Sets the spacing.
 *
 * @param int spacing
 */
Label.prototype.setSpacing = function(spacing) {
    this.__spacing = Math.max(0, parseInt(spacing, 10));
};

/**
 * Gets the rotation angle in degree.
 *
 * @return int
 */
Label.prototype.getRotationAngle = function() {
    return this.__font.getRotationAngle();
};

/**
 * Sets the rotation angle in degree.
 *
 * @param int rotationAngle
 */
Label.prototype.setRotationAngle = function(rotationAngle) {
    this.__rotationAngle = parseInt(rotationAngle, 10);
    this.__font.setRotationAngle(this.__rotationAngle);
};

/**
 * Gets the foreground color.
 *
 * @return Color
 */
Label.prototype.getForegroundColor = function() {
    return this.__foregroundColor;
};

/**
 * Sets the foreground color.
 *
 * @param Color foregroundColor
 */
Label.prototype.setForegroundColor = function(foregroundColor) {
    this.__foregroundColor = foregroundColor;
    this.__font.setForegroundColor(this.__foregroundColor);
};

/**
 * Gets the dimension taken by the label, including the spacing and offset.
 * [0]: width
 * [1]: height
 *
 * @return int[]
 */
Label.prototype.getDimension = function() {
    var w = 0;
    var h = 0;

    var dimension = this.__font.getDimension();
    w = dimension[0];
    h = dimension[1];

    if (this.__position === Label.POSITION_TOP || this.__position === Label.POSITION_BOTTOM) {
        h += this.__spacing;
        w += Math.max(0, this.__offset);
    } else {
        w += this.__spacing;
        h += Math.max(0, this.__offset);
    }

    return [w, h];
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
Label.prototype.draw = function(im, x1, y1, x2, y2) {
    var x = 0;
    var y = 0;

    var fontDimension = this.__font.getDimension();

    if (this.__position === Label.POSITION_TOP || this.__position === Label.POSITION_BOTTOM) {
        if (this.__position === Label.POSITION_TOP) {
            y = y1 - this.__spacing - fontDimension[1];
        } else if (this.__position === Label.POSITION_BOTTOM) {
            y = y2 + this.__spacing;
        }

        if (this.__alignment === Label.ALIGN_CENTER) {
            x = (x2 - x1) / 2 + x1 - fontDimension[0] / 2 + this.__offset;
        } else if (this.__alignment === Label.ALIGN_LEFT)  {
            x = x1 + this.__offset;
        } else {
            x = x2 + this.__offset - fontDimension[0];
        }
    } else {
        if (this.__position === Label.POSITION_LEFT) {
            x = x1 - this.__spacing - fontDimension[0];
        } else if (this.__position === Label.POSITION_RIGHT) {
            x = x2 + this.__spacing;
        }

        if (this.__alignment === Label.ALIGN_CENTER) {
            y = (y2 - y1) / 2 + y1 - fontDimension[1] / 2 + this.__offset;
        } else if (this.__alignment === Label.ALIGN_TOP)  {
            y = y1 + this.__offset;
        } else {
            y = y2 + this.__offset - fontDimension[1];
        }
    }

    this.__font.setText(this.__text);
    this.__font.draw(im, x, y);
};

module.exports = Label;