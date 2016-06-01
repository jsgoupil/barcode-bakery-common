'use strict';

var Canvas = require('canvas');
var inherits = require('util').inherits;
var fs = require('fs');
var setColor = require('./Utility').setColor;

module.exports.imagecreatetruecolor = function(width, height) {
    var canvas = new Canvas(width, height);
    return canvas.getContext('2d');
};

module.exports.imagedestroy = function(im) {
    // We don't have to do anything here
};

module.exports.imagesx = function(im) {
    return im.canvas.width;
};

module.exports.imagesy = function(im) {
    return im.canvas.height;
};

module.exports.imagefill = function(im, x, y, color) {
    // We don't use x and y here
    setColor(im, color);
    im.fillRect(0, 0, im.canvas.width, im.canvas.height);
};

module.exports.imagefilledrectangle = function(im, x1, y1, x2, y2, color) {
    setColor(im, color);
    im.fillRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
};

module.exports.imagecolorallocate = function(im, red, green, blue) {
    return { r: red, g: green, b: blue };
};

module.exports.imagecopy = function() {};

module.exports.imagefontwidth = function() {};
module.exports.imagefontheight = function() {};
module.exports.imagestring = function() {};

function Draw(im) {
    this._im = im;
}

Draw.prototype.setDPI = function(dpi) {
    if (!isNaN(parseFloat(dpi)) && isFinite(dpi)) {
        throw new Exception('Not yet implemented');
        this._dpi = Math.max(1, dpi);
    } else {
        this._dpi = null;
    }
};

Draw.prototype.toFile = function() {};
Draw.prototype.toBuffer = function() {};

function DrawPNG(im) {
    Draw.call(this, im);
}

inherits(DrawPNG, Draw);

DrawPNG.prototype.toFile = function(filename, callback) {
    // We are async
    if (callback) {
        this._im.canvas.toBuffer(function(err, buffer) {
            fs.writeFile(filename, buffer, 'utf8', callback);
        });
    } else {
        fs.writeFileSync(filename, this._im.canvas.toBuffer(), 'utf8');
    }
};

DrawPNG.prototype.toBuffer = function(callback) {
    return this._im.canvas.toBuffer(callback);
};

module.exports.DrawPNG = DrawPNG;
