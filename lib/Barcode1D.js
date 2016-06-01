'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Holds all type of barcodes for 1D generation
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
var inherits = require('util').inherits;
var ArgumentException = require('./ArgumentException');
var Barcode = require('./Barcode');
var Font = require('./Font');
var Label = require('./Label');
var Utility = require('./Utility');

function Barcode1D() {
    Barcode.call(this);

    this.setThickness(30);

    this._defaultLabel = new Label();
    this._defaultLabel.setPosition(Label.POSITION_BOTTOM);
    this.setLabel(Barcode1D.AUTO_LABEL);
    this.setFont(new Font());

    this._text = '';
    this._checksumValue = false;
    this._positionX = 0;
}

inherits(Barcode1D, Barcode);

Barcode1D.SIZE_SPACING_FONT = 5;
Barcode1D.AUTO_LABEL = '##!!AUTO_LABEL!!##';

/**
 * Gets the thickness.
 *
 * @return int
 */
Barcode1D.prototype.getThickness = function() {
    return this._thickness;
};

/**
 * Sets the thickness.
 *
 * @param int thickness
 */
Barcode1D.prototype.setThickness = function(thickness) {
    thickness = parseInt(thickness, 10);
    if (thickness <= 0) {
        throw new ArgumentException('The thickness must be larger than 0.', 'thickness');
    }

    this._thickness = thickness;
};

/**
 * Gets the label.
 * If the label was set to Barcode1D::AUTO_LABEL, the label will display the value from the text parsed.
 *
 * @return string
 */
Barcode1D.prototype.getLabel = function() {
    var label = this._label;
    if (this._label === Barcode1D.AUTO_LABEL) {
        label = this._text;
        if (this._displayChecksum === true && (checksum = this._processChecksum()) !== false) {
            label += checksum;
        }
    }

    return label;
};

/**
 * Sets the label.
 * You can use Barcode::AUTO_LABEL to have the label automatically written based on the parsed text.
 *
 * @param string label
 */
Barcode1D.prototype.setLabel = function(label) {
    this._label = label;
};

/**
 * Gets the font.
 *
 * @return Font
 */
Barcode1D.prototype.getFont = function() {
    return this._font;
};

/**
 * Sets the font.
 *
 * @param mixed font Font or int
 */
Barcode1D.prototype.setFont = function(font) {
    this._font = font;
};

/**
 * Parses the text before displaying it.
 *
 * @param mixed text
 */
Barcode1D.prototype.parse = function(text) {
    this._text = text;
    this._checksumValue = false; // Reset checksumValue
    this._validate();

    Barcode.prototype.parse.call(this, text);

    this._addDefaultLabel();
};

/**
 * Gets the checksum of a Barcode.
 * If no checksum is available, return FALSE.
 *
 * @return string
 */
Barcode1D.prototype.getChecksum = function() {
    return this._processChecksum();
};

/**
 * Sets if the checksum is displayed with the label or not.
 * The checksum must be activated in some case to make this variable effective.
 *
 * @param boolean displayChecksum
 */
Barcode1D.prototype.setDisplayChecksum = function(displayChecksum) {
    this._displayChecksum = !!displayChecksum;
};

/**
 * Adds the default label.
 */
Barcode1D.prototype._addDefaultLabel = function() {
    var label = this.getLabel();
    var font = this._font;
    if (label !== null && label !== '' && font !== null && this._defaultLabel !== null) {
        this._defaultLabel.setText(label);
        this._defaultLabel.setFont(font);
        this.addLabel(this._defaultLabel);
    }
};

/**
 * Validates the input
 */
Barcode1D.prototype._validate = function() {
    // No validation in the abstract class.
};

/**
 * Returns the index in keys (useful for checksum).
 *
 * @param mixed val
 * @return mixed
 */
Barcode1D.prototype._findIndex = function(val) {
    return Utility.arraySearch(this._keys, val);
};

/**
 * Returns the code of the char (useful for drawing bars).
 *
 * @param mixed val
 * @return string
 */
Barcode1D.prototype._findCode = function(val) {
    return this._code[this._findIndex(val)];
};

/**
 * Draws all chars thanks to code. if startBar is true, the line begins by a space.
 * if start is false, the line begins by a bar.
 *
 * @param resource im
 * @param string code
 * @param boolean startBar
 */
Barcode1D.prototype._drawChar = function(im, code, startBar) {
    if (typeof startBar === 'undefined') {
        startBar = true;
    }

    var colors = [Barcode.COLOR_FG, Barcode.COLOR_BG];
    var currentColor = startBar ? 0 : 1;
    var c = code.length;
    for (var i = 0; i < c; i++) {
        for (var j = 0; j < parseInt(code[i], 10) + 1; j++) {
            this._drawSingleBar(im, colors[currentColor]);
            this._nextX();
        }

        currentColor = (currentColor + 1) % 2;
    }
};

/**
 * Draws a Bar of color depending of the resolution.
 *
 * @param resource img
 * @param int color
 */
Barcode1D.prototype._drawSingleBar = function(im, color) {
    this._drawFilledRectangle(im, this._positionX, 0, this._positionX, this._thickness - 1, color);
};

/**
 * Moving the pointer right to write a bar.
 */
Barcode1D.prototype._nextX = function() {
    this._positionX++;
};

/**
 * Method that saves FALSE into the checksumValue. This means no checksum
 * but this method should be overriden when needed.
 */
Barcode1D.prototype._calculateChecksum = function() {
    this._checksumValue = false;
};

/**
 * Returns FALSE because there is no checksum. This method should be
 * overriden to return correctly the checksum in string with checksumValue.
 *
 * @return string
 */
Barcode1D.prototype._processChecksum = function() {
    return false;
};

module.exports = Barcode1D;