'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Draw Exception
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

var util = require('util');

/**
 * Constructor with specific message.
 *
 * @param string $message
 */
function DrawException(message) {
    Error.call(this);
    this.message = message;
    this.number = 30000;
}

util.inherits(DrawException, Error);

module.exports = DrawException;