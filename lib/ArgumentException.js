'use strict';

/**
 *--------------------------------------------------------------------
 *
 * Argument Exception
 *
 *--------------------------------------------------------------------
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

var util = require('util');

/**
 * Constructor with specific message for a parameter.
 *
 * @param string $message
 * @param string $param
 */
function ArgumentException(message, param) {
    Error.call(this);
    this.message = message;
    this.number = 20000;
    this._param = param;
}

util.inherits(ArgumentException, Error);

module.exports = ArgumentException;