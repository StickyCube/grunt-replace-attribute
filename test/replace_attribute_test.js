'use strict';

var grunt = require('grunt');

/*
======== A Handy Little Nodeunit Reference ========
https://github.com/caolan/nodeunit

Test methods:
test.expect(numAssertions)
test.done()
Test assertions:
test.ok(value, [message])
test.equal(actual, expected, [message])
test.notEqual(actual, expected, [message])
test.deepEqual(actual, expected, [message])
test.notDeepEqual(actual, expected, [message])
test.strictEqual(actual, expected, [message])
test.notStrictEqual(actual, expected, [message])
test.throws(block, [error], [message])
test.doesNotThrow(block, [error], [message])
test.ifError(value)
*/

exports.replace_attribute = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    options_1: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/options-1.html');
        var expected = grunt.file.read('test/expected/options-1.html');
        test.equal(actual, expected, 'Should fully replace attributes everywhere');

        test.done();
    },
    options_2: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/options-2.html');
        var expected = grunt.file.read('test/expected/options-2.html');
        test.equal(actual, expected, 'Should fully replace attributes everywhere');

        test.done();
    },
    options_3: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/options-3.html');
        var expected = grunt.file.read('test/expected/options-3.html');
        test.equal(actual, expected, 'Should fully replace attributes everywhere');

        test.done();
    },
    strings_only: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/strings-only.html');
        var expected = grunt.file.read('test/expected/strings-only.html');
        test.equal(actual, expected, 'Should fully replace attributes where they are already present');

        test.done();
    },
    strings_with_replace_attr: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/strings-with-replace-attr.html');
        var expected = grunt.file.read('test/expected/strings-with-replace-attr.html');
        test.equal(actual, expected, 'Should replace the ${attr} with the existing attr');

        test.done();
    },
    regexp_only: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/regexp-only.html');
        var expected = grunt.file.read('test/expected/regexp-only.html');
        test.equal(actual, expected, 'Should replace content matching the regexp with the given value');

        test.done();
    },
    function_only: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/function-only.html');
        var expected = grunt.file.read('test/expected/function-only.html');
        test.equal(actual, expected, 'Should replace content with the return value of the given function');

        test.done();
    },
    complex_selector_1: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/complex-selector-1.html');
        var expected = grunt.file.read('test/expected/complex-selector-1.html');
        test.equal(actual, expected, 'Should only replace the class attribute of the div inside the form');

        test.done();
    },
    complex_selector_2: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/complex-selector-2.html');
        var expected = grunt.file.read('test/expected/complex-selector-2.html');
        test.equal(actual, expected, 'Should only replace the name attribute of the textarea inside the form');

        test.done();
    },
    complex_selector_3: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/complex-selector-3.html');
        var expected = grunt.file.read('test/expected/complex-selector-3.html');
        test.equal(actual, expected, 'Should only replace the name attribute of the textarea inside the form');

        test.done();
    },
    options_4: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/options-4.html');
        var expected = grunt.file.read('test/expected/options-4.html');
        test.equal(actual, expected, 'Should use the custom placeholder value');

        test.done();
    }
};
