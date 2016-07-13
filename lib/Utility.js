'use strict';

module.exports.arraySearch = function(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            return i;
         }
    }

    return false;
};

module.exports.substrCount = function(haystack, needle) {
    var count = -1,
        previousPos = 0;
    while (previousPos >= 0) {
        previousPos = haystack.indexOf(needle, previousPos);
        count++;
        if (previousPos >= 0) {
            previousPos += needle.length;
        }
    };
    
    return count;
};

module.exports.strRepeat = function(input, multiplier) {
    return Array(multiplier + 1).join(input);
};

module.exports.setColor = function (im, color) {
    im.fillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
};

module.exports.setFont = function(im, font, size) {
    im.font = size + ' ' + font;
};

module.exports.regexpQuote = function(str) {
    return str.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
};

module.exports.strrev = function(str) {
    return (str || '').split('').reverse().join('');
};

module.exports.clone = function clone(obj) {
    var clone = {};

    for (var i in obj) {
        if (typeof obj[i] === 'object') {
            clone[i] = module.exports.clone(obj[i]);
        } else {
            clone[i] = obj[i];
        }
    }

    return clone;
};

module.exports.arraySum = function(array) {
    return array.reduce(function(a, b) {
        return a + b;
    });
};

module.exports.isInt = function(num) {
    return num === (num | 0);
};

module.exports.bindec = function(binary) {
    binary = (binary + '').replace(/[^01]/gi, '');
    return parseInt(binary, 2);
};

module.exports.decbin = function (number) {
    return (number >>> 0).toString(2);
};

module.exports.print_r = function() {
    return '';
};

module.exports.strSplit = function(str, length) {
    if (str == null || !str.toString || length < 1) {
        return false;
    }

    return str.toString().match(new RegExp('.{1,' + (length || '1') + '}', 'g'));
};

module.exports.isNumeric = function(input) {
    return /^[0-9]+[\.,]{0,1}[0-9]*$/i.test(input);
};

module.exports.arrayFill = function (startIndex, num, value) {
    if (startIndex > 0) {
        throw new Error("You cannot use arrayFill with startIndex>0");
    }

    var key, arr = [];

    if (!isNaN(startIndex) && !isNaN(num)) {
        for (key = 0; key < num; key++) {
            arr[(key + startIndex)] = value;
        }
    }

    return arr;
};

module.exports.arrayFlip = function (obj) {
    var key, tmp_ar = {};
    
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            tmp_ar[obj[key]] = key;
        }
    }
    
    return tmp_ar;
};