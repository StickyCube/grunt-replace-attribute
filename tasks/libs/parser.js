"use strict";

var
    fs      = require('fs'),
    trumpet = require('trumpet');

function isValue (v) {
    return v !== null && v !== undefined;
}

function isUndefined (v) {
    return v === undefined;
}

function isObject (v) {
    return isValue(v) && v.constructor === Object;
}

function isFunction (v) {
    return isValue(v) && v.constructor === Function;
}

function isArray (v) {
    return isValue(v) && v.constructor === Array;
}

function isRegExp (v) {
    return isValue(v) && v.constructor === RegExp;
}

function isString (v) {
    return isValue(v) && v.constructor === String;
}

function isRegExpOrString (v) {
    return isString(v) || isRegExp(v);
}


function Parser (grunt, options) {
    this.grunt      = grunt;
    this.options    = options;
    this.selectors  = [];
    this.pipeline   = [];

    this.createSelectors();
    this.createPipeline();
}

Parser.prototype = {
    constructor:    Parser,
    grunt:          null,
    options:        null,
    selectors:      null,
    pipeline:       null
};

Parser.prototype.createSelectors = function () {
    var data = this.options.replace,
        tagNames = Object.keys(data);

    if (!tagNames.length) {
        return this.grunt.log.warn('No target replacement data was provided.');
    }

    // build an array element for each tag/attribute combination
    tagNames.forEach(function (tag) {
        var attrNames = Object.keys(data[tag]);
        attrNames.forEach(function (attr) {
            this.selectors.push({ tag: tag, attr: attr, value: data[tag][attr] });
        }, this);
    }, this);
};

Parser.prototype.shouldUpsertOn = function (elem) {
    if (!isObject(this.options.upsert)) {
        return this.options.upsert === true;
    }
    // this needs to be smarter to account for deeper attribute matching
    return !!this.options.upsert[elem.name];
};

Parser.prototype.getNewAttribute = function (tag, value, attr) {

    // if the given replacement is a string, we replace the current attribute
    if (isString(value)) {
        return value.replace(this.options.placeholder, attr || '', 'g').trim();
    }

    // if the given replacement is an array, replace the content specified by the string or regex
    // in the 0th element with the new content in the 1st element
    else if (isArray(value)) {
        if (!isRegExpOrString(value[0])) {
            this.grunt.log.warn('Processing ' + tag + ':' + attr + ' - Invalid value in replacement, expected string or regexp but found' + this.grunt.kindOf(value[0]));
            return attr || '';
        }
        return String.prototype.replace.apply(attr, value);
    }

    // if the given replacement is a funtion, use the return value and pass in the current value
    else if (isFunction(value)) {
        return value(attr);
    }
};

Parser.prototype.createPipeline = function () {
    var self = this;

    this.selectors.forEach(function (selector) {
        var tr = trumpet();
        tr.selectAll(selector.tag, function (elem) {
            var currentAttr = elem.getAttribute(selector.attr),
                newAttr;

            // if there is no current attribute and upsert option is not set, ignore and continue
            if (isUndefined(currentAttr) && !self.shouldUpsertOn(elem)) {
                return;
            }

            newAttr = self.getNewAttribute(selector.tag, selector.value, currentAttr);
            // set the new attribute

            elem.setAttribute(selector.attr, newAttr);
        });

        tr.on('error', function (e) {
            self.grunt.log.warn('Error Parsing html - ' + e);
        });

        self.pipeline.push(tr);
    });
};

Parser.prototype.process = function (file, done) {
    var src = file.src,
        dest = file.dest,
        istream,
        ostream;

    // validate the file source and destination

    if (!src || src.length !== 1) {
        if (!src) {
            return this.grunt.fail.warn('No source files provided');
        } else {
            return this.grunt.fail.warn('Expected 1 source file but found ' + src.length + ': ' + src.join(', '));
        }
    }

    // add handling for no destination here

    if (!this.grunt.file.exists(dest)) {
        this.grunt.file.write(dest, '');
    }

    istream = fs.createReadStream(src[0]);
    ostream = fs.createWriteStream(dest);

    ostream.on('close', done);

    this.pipeline.reduce(function (p, e) {
        return p.pipe(e);
    }, istream).pipe(ostream);
};

module.exports = Parser;
