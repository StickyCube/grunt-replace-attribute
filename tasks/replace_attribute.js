/*
 * grunt-replace-attribute
 * https://github.com/will/grunt-replace-attribute
 *
 * Copyright (c) 2015 will
 * Licensed under the MIT license.
 */

'use strict';

var async = require('async');

module.exports = function (grunt) {
    var defaults = { upsert: false, replace: {}, placeholder: '%value%' },
        Parser = require('./libs/parser');

    grunt.registerMultiTask('replace_attribute', 'Replace the attribute of any html tag', function () {
        var options = this.options(defaults),
            complete = this.async();

        if (!this.files) {
            return grunt.fail.warn('No files were specified');
        }

        async.eachSeries(this.files, function (file, done) {
            new Parser(grunt, options).process(file, done);
        }, complete);
    });
};
