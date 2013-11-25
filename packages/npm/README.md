[![Build Status](https://secure.travis-ci.org/kmalakoff/underscore-awesomer.png)](http://travis-ci.org/kmalakoff/underscore-awesomer)

````
Underscore-Awesomer* provides some (ahem) awesome extensions to the Underscore utility-belt library for JavaScript.
````

See below for all the awesome stuff you can do and check out my blog for the latest examples: http://braincode.tumblr.com/

Enjoy!

#Download Latest (1.2.4):

Please see the [release notes](https://github.com/kmalakoff/underscore-awesomer/blob/master/RELEASE_NOTES.md) for upgrade pointers.

* [Development version](https://raw.github.com/kmalakoff/underscore-awesomer/1.2.4/underscore-awesomer.js)
* [Production version](https://raw.github.com/kmalakoff/underscore-awesomer/1.2.4/underscore-awesomer.min.js)


###Module Loading

Underscore-Awesomer.js is compatible with RequireJS, CommonJS, Brunch and AMD module loading. Module names:

* 'underscore-awesomer' - underscore-awesomer.js.

### Dependencies

* [Underscore.js](http://documentcloud.github.com/underscore/)

OR

* [Lo-Dash](http://lodash.com/)


For Docs, License, Tests, and pre-packed downloads of Underscore, see: http://documentcloud.github.com/underscore/

*Underscore is already awesome, so something that improves it must make
Underscore 'awesomer'!


# API Highlights:

## Keypaths (_.hasKeypath, _.keypath, _.keypathValueOwner)
Rather than just using simple keys to reference properties, you can use keypaths (dot-delimited strings or arrays of strings) to traverse you object.

### Examples:

````
_.keypath({hello: {world: ‘!’} }, ‘hello.world’); // returns ‘!’
_.keypathValueOwner({hello: {world: ‘!’} }, ‘hello.world’); // returns hello
````

## Type Conversions (_.resolveConstructor, _.toType)
_.toType introduces a convention of _.to{SomeType} and complies with underscore’s _.is{SomeType} convention if the constructor name or instanceof don’t find a match. Useful if you wrap a class inside another.

### Examples:

````
var constructor = _.resolveConstructor(‘SomeNamespace.SomeClass’), instance = new constructor();
var actual_date = _.toType(wrapped_date, ‘Date’);
````

## Removal (_.remove)
Provides many variants on how to remove something from an array or object collection.

### Examples:

````
var removed = _.remove([2,4,2], 2); _.isEqual(removed, 2);
var removed = _.remove({bob: 1, fred: 3, george: 5}, [‘bob’, ‘george’]); _.isEqual(removed, [1,5]);
````

## JSON serialization (_.toJSON, _.fromJSON)

**Note**: this functionality has been renamed to JSONS.serialize and JSONS and been moved to: https://github.com/kmalakoff/json-serialize

or you can play with it live on [jsfiddle](http://jsfiddle.net/kmalakoff/VkNaa/)

## Object Lifecycle (_.own, _.disown)

**Note**: this functionality has been renamed to LC.own and LC.disown and been move to: https://github.com/kmalakoff/lifecycle

## Compare for the rest of us (_.compare)
Wraps built in compare with self-evident return types (_.COMPARE_EQUAL, _.COMPARE_ASCENDING, _.COMPARE_DESCENDING) and allows objects to provide custom compare methods.

### Examples:

````
if (_.compare(‘x’, ‘y’) === _.COMPARE_ASCENDING) return ‘y’
if (_.compare(‘こんにちは’, ‘さようなら’, ‘localeCompare’) === _.COMPARE_ASCENDING) return ‘さようなら’;
if (_.compare(custom_compare_instance, ‘a string’) === _.COMPARE_ASCENDING) return custom_compare_instance;
````

## Super helpers (_.getSuperFunction/_.superCall/_.superApply)
Useful if you don’t know what the super class will be ahead of time (To put this in context, take a look at Mixin.js: https://github.com/kmalakoff/mixin):

````
local_backbone_collection_mixin { _add: function(model) { if (!model.id) model.id = model.cid;); _.superApply(this, ‘_add’, arguments); } };
````

## And more: _.cloneToDepth, _pluck with remove, _.findIndex, _.functionExists/_.callIfExists, and _.getValue with default if missing, and _.className.


Building, Running and Testing the library
-----------------------

###Installing:

1. install node.js: http://nodejs.org
2. install node packages: 'npm install'

###Commands:

Look at: https://github.com/kmalakoff/easy-bake
