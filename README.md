# grunt-replace-attribute

> Replace the attribute of any html tag

## Getting Started
> This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-replace-attribute --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-replace-attribute');
```

## The "replace_attribute" task

### Overview
In your project's Gruntfile, add a section named `replace_attribute` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      upsert: true
    },
    your_target: {
      options: {
        replace: {
          'div.batman': { class: '%value% > superman' }
        }
      }
      files: {
          'destination.html': 'source.html'
      }
    },
  },
});
```

### Options

#### options.upsert
Type: `Object|Boolean`
Default value: `false`

Determines whether to add a new attribute to an element if it is not already present.

Either set the option globally, for all selectors:

```js
upsert: true|false // always|never insert a new attribute
```

or for individual tags:

```js
upsert: { div: false, input: true }
```
#### options.placeholder
Type `String`
Default value: `'%value%'`

This is the placeholder for the current attribute value. See the examples below for more detail.

#### options.replace
Type: `Object`

An Object containing the configuration for your target selectors.

`grunt-replace-attribute` uses [node-trumpet](https://github.com/substack/node-trumpet), so any of the following selectors should work:

* *
* E
* E F
* E > F
* E + F
* E.class
* E#id
* E[attr=value]
* E[attr~=search]
* E[attr|=prefix]
* E[attr^=prefix]
* E[attr$=suffix]
* E[attr*=search]

#### options.replace.{tag name}
Type: `Object`

An Object which maps attribute names to their replacements.
Each attribute name can be one of the following types:
***
###### Type: `String`
The new attribute value. The current attribute value can be referenced using the syntax `%value%`. (See options.placeholder to change this).
###### Type `Array`
An array containing a regular expression and a string to be passed as arguments to String's `replace` method.
###### Type `Function`
A function which returns the new attribute value. The current attribute is available as the first argument.
***

### Usage Examples

#### Basic example using Strings
In this example, we replace all the `class` attributes on each `span` element with the value `text-center`. `options.upsert` is omitted, so only elements which already have a `class` attribute will be modified.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      replace: {
        span: { class: 'text-center' }
      }
    },
    files: {
      'path/to/destination.html': 'path/to/source.html'
    }
  }
});
```

```html
<!-- source.html -->
<div class="container">
    <span class="text-left">My class will be modified</span>
    <span>My class will not be modified</span>
</div>

<!-- destination.html -->
<div class="container">
    <span class="text-center">My class will be modified</span>
    <span>My class will not be modified</span>
</div>
```

#### Using Strings with `%value%`
In this example, we append `pull-right` on to the value of all the `class` attributes of each `div` element. `options.upsert` is set to `true`, so all div elements will be modified.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      upsert: true,
      replace: {
        div: { class: '%value% pull-right' }
      }
    },
    files: {
      'path/to/destination.html': 'path/to/source.html'
    }
  }
});
```

```html
<!-- source.html -->
<div class="label">
    <div>My class will be modified</div>
</div>

<!-- destination.html -->
<div class="label pull-right">
    <div class="pull-right">My class will be modified</div>
</div>
```

#### Using Regular Expressions
In this example, we use a regex to modify each `li`'s `class` attribute, appending `-banana` onto the match.
The two arguments are given to `String.replace` so we can use the `$1, $2, $3 ...` syntax to reference each match.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      replace: {
        li: { class: [/(one|two|three)/g, '$1-banana'] }
      }
    },
    files: {
      'path/to/destination.html': 'path/to/source.html'
    }
  }
});
```

```html
<!-- source.html -->
<li class="one"></li>
<li class="two"></li>
<li class="three"></li>
<li class="four"></li>

<!-- destination.html -->
<li class="one-banana"></li>
<li class="two-banana"></li>
<li class="three-banana"></li>
<li class="four"></li>
```

#### Using Functions
In this example we reverse the path of the `src` value on all `img` elements using a function.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      replace: {
        img: {
          src: function (original) {
              return original.split('/').reverse().join('/');
          }
        }
      }
    },
    files: {
      'path/to/destination.html': 'path/to/source.html'
    }
  }
});
```

```html
<!-- source.html -->
<img src="path/to/an/img" >

<!-- destination.html -->
<img src="img/an/to/path" >
```

#### Using more complex selectors
In this example, we use a more complex selector to add a `style="opacicty:0.5;"` attribute to `span`s within `li` elements which have the class `disabled` and all other elements which have the attribute `data-fade="true"`.

```js
grunt.initConfig({
  replace_attribute: {
    options: {
      upsert: { h1: true, span: true },
      replace: {
        '*[data-fade=true], li.disabled > span': { style: 'opacicty:0.5;' }
      }
    },
    files: {
      'path/to/destination.html': 'path/to/source.html'
    }
  }
});
```

```html
<!-- source.html -->
<div class="heading">
    <h1 data-fade="true" >Heading</h1>
    <span>Description</span>
</div>
<ul class="list-group">
    <li class="list-group-item disabled">
        <span>Item 1</span>
    </li>
    <li class="list-group-item">
        <span>Item 2</span>
    </li>
    <li class="list-group-item disabled">
        <span>Item 3</span>
    </li>
</ul>

<!-- destination.html -->
<div class="heading">
    <h1 data-fade="true" style="opacicty:0.5;">Heading</h1>
    <span>Description</span>
</div>
<ul class="list-group">
    <li class="list-group-item disabled" style="opacicty:0.5;">
        <span>Item 1</span>
    </li>
    <li class="list-group-item">
        <span>Item 2</span>
    </li>
    <li class="list-group-item disabled" style="opacicty:0.5;">
        <span>Item 3</span>
    </li>
</ul>
```

## Known Issues
* self-closing tags

if an input tag which closes itself is modified, the output tag is stripped of the forward slash. This may pose a problem if it conflicts with your htmlhint options.
```html
<input class="foo" />
<!-- becomes -->
<input class="bar">
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* v 1.0.0 - Initial Release
