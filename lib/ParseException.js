'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Parse Exception
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

var util = require('util');

/**
 * Constructor with specific message for a parameter.
 *
 * @param string $barcode
 * @param string $message
 */
function ParseException(barcode, message) {
    Error.call(this);
    this.message = message;
    this.number = 10000;
    this._barcode = barcode;
}

util.inherits(ParseException, Error);

module.exports = ParseException;