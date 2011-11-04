````
Underscore-Awesomer* provides some (ahem) awesome extensions to the Underscore utility-belt library for JavaScript.
````

See below for all the awesome stuff you can do and check out my blog for
the latest examples: http://braincode.tumblr.com/

Enjoy!


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
_.toType introduces a convention of _.to{SomeType} and complies with underscore’s _.is{SomeType} convention if the constructor name or instanceof don’t find a match. Useful it you wrap a class inside another.

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
Provides a convention for serializing and deserializing class instances (with a configurable _type property).

### Examples:

````
var plain_old_json = _.toJSON(some_instance), some_instance_copy = _.fromJSON(plain_old_json);
var namespaced_instance = _.fromJSON({_type: ‘SomeNamepace.SomeClass’, prop1: 1, prop2: 2});
````

## Object Lifecycle (_.own, _.disown)
Handles individual objects, arrays, and object properties that comply with some lifecycle conventions:

* clone() and destroy()
* retain() and release()
* clone() and Javascript memory management
* plain old JSON

### Examples:

````
var an_object = new Object(); var owned_copy_object = _.own(an_object); _.disown(an_object);
var an_array = [new Object(), ‘hello’, new Object()]; var owned_copy_array = _.own(an_array); _.disown(an_array);
var an_object = {one: new Object(), two: new Object(), three: ‘there’}; var owned_copy_object = _.own(an_object, {properties:true}); _.disown(an_object);
````

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
