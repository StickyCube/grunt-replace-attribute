/*
* grunt-replace-attribute
* https://github.com/will/grunt-replace-attribute
*
* Copyright (c) 2015 will
* Licensed under the MIT license.
*/

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/results']
        },

        // Configuration to be run (and then tested).
        replace_attribute: {
            options: { upsert: false },
            test_options_1: {
                options: {
                    upsert: true,
                    replace: {
                        div: { class: '%value% foo' },
                        li: { 'data-id': '123' }
                    }
                },
                files: {
                    'test/results/options-1.html': 'test/fixtures/source.html'
                }
            },
            test_options_2: {
                options: {
                    upsert: { li: true, input: false },
                    replace: {
                        li: { 'data-id': '123' },
                        input: { 'data-id': '456' }
                    }
                },
                files: {
                    'test/results/options-2.html': 'test/fixtures/source.html'
                }
            },
            test_options_3: {
                options: {
                    upsert: { textarea: false, input: true, div: true },
                    replace: {
                        'form > *': { 'data-id': '123' }
                    }
                },
                files: {
                    'test/results/options-3.html': 'test/fixtures/source.html'
                }
            },
            test_options_4: {
                options: {
                    placeholder: '{value}',
                    replace: {
                        div: { class: '{value} foo' },
                        li: { 'data-id': '123' }
                    }
                },
                files: {
                    'test/results/options-4.html': 'test/fixtures/source.html'
                }
            },
            test_strings_only: {
                options: {
                    replace: {
                        html: { lang: 'en' },
                        body: { class: 'this-shouldnt-appear' },
                        div: { class: 'foo' },
                        span: { class: 'text-left' },
                        li: { class: 'heading-item-small' }
                    }
                },
                files: {
                    'test/results/strings-only.html': 'test/fixtures/source.html'
                }
            },
            test_strings_with_replace_attr: {
                options: {
                    replace: {
                        html: { lang: 'en' },
                        body: { class: 'this-shouldnt-appear' },
                        div: { class: 'foo %value%' },
                        span: { class: 'text-left' },
                        li: { class: 'heading-item-small' }
                    }
                },
                files: {
                    'test/results/strings-with-replace-attr.html': 'test/fixtures/source.html'
                }
            },
            test_regexp_only: {
                options: {
                    replace: {
                        input: { name: [/(one|two|three)/, 'foobar-$1'] },
                        li: { class: [/item/g, 'baz'] }
                    }
                },
                files: {
                    'test/results/regexp-only.html': 'test/fixtures/source.html'
                }
            },
            test_function_only: {
                options: {
                    upsert: true,
                    replace: {
                        img: {
                            src: function (attr) {
                                return attr.split('/').reverse().join('/');
                            }
                        }
                    }
                },
                files: {
                    'test/results/function-only.html': 'test/fixtures/source.html'
                }
            },
            test_complex_selector_1: {
                options: {
                    replace: {
                        'form div': { class: 'foobar' }
                    }
                },
                files: {
                    'test/results/complex-selector-1.html': 'test/fixtures/source.html'
                }
            },
            test_complex_selector_2: {
                options: {
                    replace: {
                        '*[name=three]': { name: 'four' }
                    }
                },
                files: {
                    'test/results/complex-selector-2.html': 'test/fixtures/source.html'
                }
            },
            test_complex_selector_3: {
                options: {
                    upsert: true,
                    replace: {
                        'div, *[name=my-form] > input': { 'data-id': '999' }
                    }
                },
                files: {
                    'test/results/complex-selector-3.html': 'test/fixtures/source.html'
                }
            },
            test_multi_file_1: {
                options: {
                    upsert: true,
                    replace: {
                        div: { class: '%value% foo' },
                        li: { 'data-id': '123' }
                    }
                },
                files: {
                    'test/results/multi-file-1.html': 'test/fixtures/source.html',
                    'test/results/multi-file-2.html': 'test/fixtures/source-2.html'
                },
            },
            test_multi_file_2: {
                options: {
                    upsert: true,
                    replace: {
                        div: { class: '%value% foo' },
                        li: { 'data-id': '123' }
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'test/fixtures',
                        src: '*.html',
                        ext: '.processed.html',
                        dest: 'test/results'
                    }
                ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [
        'clean',
        'replace_attribute:test_options_1',
        'replace_attribute:test_options_2',
        'replace_attribute:test_options_3',
        'replace_attribute:test_options_4',
        'replace_attribute:test_strings_only',
        'replace_attribute:test_strings_with_replace_attr',
        'replace_attribute:test_regexp_only',
        'replace_attribute:test_function_only',
        'replace_attribute:test_complex_selector_1',
        'replace_attribute:test_complex_selector_2',
        'replace_attribute:test_complex_selector_3',
        'replace_attribute:test_multi_file_1',
        'replace_attribute:test_multi_file_2',
        'nodeunit'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
