###
  Underscore-Awesomer.js 1.2.1
  (c) 2011, 2012 Kevin Malakoff.
  Underscore-Awesomer is freely distributable under the MIT license.
  https:#github.com/kmalakoff/underscore-awesomer

  Underscore-Awesomer provides extensions to the Underscore library: http:#documentcloud.github.com/underscore

  Note: some code from Underscore.js is repeated in this file.
  Please see the following for details on Underscore.js and its licensing:
    https:#github.com/documentcloud/underscore
    https:#github.com/documentcloud/underscore/blob/master/LICENSE
###
root = if typeof(window) == 'undefined' then global else window

# import Underscore
_ = if not @_ and (typeof(require) != 'undefined') then require('underscore')._ else @_
_ = {} unless _ # no underscore

root.exports = _ if (typeof(root.exports) != 'undefined') # export Underscore namespace
_.AWESOMENESS = "1.2.1"

# Modifications to Underscore
# --------------------

# Convenience version of a common use case of `map`: fetching a property.
# Optionally removes all copied values from the source if you provide a remove parameter.
_.pluck = (obj, key, remove) ->
  return if remove then _.map(obj, (value) -> val = value[key]; delete value[key]; return val) else _.map(obj, (value) -> value[key])

# Collection Functions
# --------------------

# Removes an value from a collection (array or object).
# If the matcher is a function, it removes and returns all values that match.
# If the matcher is an array, it removes and returns all values that match.
# If the matcher is undefined, it removes and returns all values.
# If the collection is an object and the matcher is a key, it removes and return the value for that key (unless the 'is\_value' option is provided).
# Otherwise, it removes and return the value if it finds it.
# <br/>**Options:**<br/>
# * `callback` - if you provide a callback, it calls it with the removed value after the value is removed from the collection. Note: if the options are a function, it is set as the callback.<br/>
# * `values` - used to disambigate between a key or value when removing from a collection that is an object.<br/>
# * `first_only` - if you provide a first_only flag, it will stop looking for an value when it finds one that matches.<br/>
# * `preclear` - if you provide a preclear flag, it will clone the passed object, remove all the values, and then remove from the cloned object.
_.remove = (obj, matcher, options={}) ->
  return (if (not matcher or _.isFunction(matcher)) then [] else undefined) if _.isEmpty(obj)
  options = {callback:options} if _.isFunction(options)

  # Clone and clear the passed collection before removing. Useful if a callback uses the passed collection.
  if options.preclear
    original_object = obj; obj = _.clone(obj)
    if _.isArray(original_object)
      original_object.length=0
    else
      delete original_object[key] for key of original_object

  removed = []; single_value=false
  # Array collection
  if _.isArray(obj)
    # Array: remove and return all values (returns: array of values)
    if _.isUndefined(matcher)
        removed = _.keys(obj)

    # Array: remove and return all values passing matcher function test (returns: array of values) or if first_only option, only the first one (returns: value or undefined)
    else if _.isFunction(matcher)
      if (options.first_only)
        single_value = true; _.find(obj, (value, index) -> (removed.push(index); return true) if matcher(value); return false)
      else
        _.each(obj, (value, index) -> removed.push(index) if matcher(value))

    # Array: remove and return all values in the matcher array (returns: array of values)
    else if _.isArray(matcher)
      if (options.first_only)
        single_value = true
        ((removed.push(index); break) if (matcher_value==value)) for index, value of obj for matcher_value in matcher

      else
        ((removed.push(index) if (matcher_value==value)) for index, value of obj) for matcher_value in matcher

    # Array: remove all matching values (returns: array of values) or if first_only option, only the first one (returns: value or undefined).
    else
      if (options.first_only)
        single_value = true
        index = _.indexOf(obj, matcher); removed.push(index) if (index>=0)

      # Array: remove all matching values (array return type).
      else
        single_value = true
        (removed.push(index) if (matcher==value)) for index, value of obj

    # Process the removed values if they exist
    if single_value
      return undefined unless removed.length

      value = obj[removed[0]]
      removed = removed.sort((left, right) -> return _.compare(right, left)) # sort indices to remove from highest to lowest
      obj.splice(index, 1) for index in removed # remove
      (options.callback(value) for index in removed) if options.callback # callback

      return value

    else
      return [] unless removed.length

      values = [];
      removed = removed.sort((left, right) -> return _.compare(right, left)) # sort indices to remove from highest to lowest
      (values.unshift(obj[index]); obj.splice(index, 1)) for index in removed # remove
      (options.callback(value) for value in values) if options.callback # callback

      return _.uniq(values);

  # Object collection
  else
    # Object: remove all values (returns: object with keys and values)
    if _.isUndefined(matcher)
      removed = _.keys(obj)

    # Object: remove and return all values passing matcher function test (returns: object with keys and values)
    else if _.isFunction(matcher)
      (removed.push(key) if matcher(value, key)) for key, value of obj

    # Object: remove and return all values by key or by value
    else if _.isArray(matcher)
      # The matcher array contains values (returns: object with keys and values)
      if options.values
        for matcher_value in matcher
          if options.first_only
            ((removed.push(key); break) if matcher_value==value) for key, value of obj
          else
            (removed.push(key) if matcher_value==value) for key, value of obj

      # The matcher array contains keys (returns: array of values)
      else
        ordered_keys = matcher
        (removed.push(matcher_key) if obj.hasOwnProperty(matcher_key)) for matcher_key in matcher

    # Object: remove value matching a key (value or undefined return type)
    else if _.isString(matcher) and not options.values
      single_value = true;ordered_keys = []
      (ordered_keys.push(matcher); removed.push(matcher)) if (obj.hasOwnProperty(matcher))

    # Object: remove matching value (array return type)
    else
      (removed.push(key) if (matcher==value)) for key, value of obj

    # Process the removed values if they exist
    if ordered_keys
      (return if single_value then undefined else []) unless ordered_keys.length

      values = [];
      (values.push(obj[key]); delete obj[key]) for key in removed # remove
      (options.callback(value, ordered_keys[index]) for index, value of values) if options.callback # callback

      return if single_value then values[0] else values

    else
      return {} unless removed.length

      values = {}
      (values[key] = obj[key]; delete obj[key]) for key in removed # remove
      (options.callback(value, key) for key, value of values) if options.callback # callback

      return values;

# Array Functions
# ---------------
_.findIndex = (array, fn) ->
  (return index if (fn(array[index]))) for index, value of array
  return -1

# Object Functions
# ----------------

# Does the dot-delimited or array of keys path to a value exist.
_.hasKeypath = _.keypathExists = (object, keypath) ->
  return !!_.keypathValueOwner(object, keypath)

# Finds the object that has or 'owns' the value if a dot-delimited or array of keys path to a value exists.
_.keypathValueOwner = (object, keypath) ->
  components = if _.isString(keypath) then keypath.split('.') else keypath
  current_object = object
  length = components.length

  for index, key of components
    break unless key of current_object
    return current_object if ++index is length
    current_object = current_object[key]
    break if not current_object or (current_object not instanceof Object)

  return undefined

# Dual purpose function: gets or sets a value if a dot-delimited or array of keys path exists.
_.keypath = (object, keypath, value) ->
  components = (if _.isString(keypath) then keypath.split(".") else keypath)
  value_owner = _.keypathValueOwner(object, components)

  # get
  if arguments.length == 2
    return undefined unless value_owner
    return value_owner[components[components.length-1]]

  # set
  else
    return unless value_owner
    value_owner[components[components.length-1]] = value
    return value

# Create a duplicate of a container of objects to any zero-indexed depth.
_.cloneToDepth = _.containerClone = _.clone = (obj, depth) ->
  return obj if not obj or (typeof obj isnt "object")

  # clone at this level
  if _.isArray(obj)
    clone = Array::slice.call(obj)
  else if obj.constructor isnt {}.constructor
    return obj
  else
    clone = _.extend({}, obj)

  # keep cloning deeper
  ((clone[key] = _.clone(clone[key], depth - 1)) for key of clone) if not _.isUndefined(depth) and (depth > 0)

  return clone

# Create a duplicate of all objects to any zero-indexed depth (more than just storing the same objects in the tree).
_.deepClone = (obj, depth) ->
  return obj if not obj or (typeof obj isnt "object")   # a value
  return String::slice.call(obj) if _.isString(obj)     # a string
  return new Date(obj.valueOf()) if _.isDate(obj)       # a date
  return obj.clone() if _.isFunction(obj.clone)         # a specialized clone function

  if _.isArray(obj)                                     # an array
    clone = Array::slice.call(obj)
  else if obj.constructor isnt {}.constructor           # a reference
    return obj
  else                                                  # an object
    clone = _.extend({}, obj)

  # keep cloning deeper
  ((clone[key] = _.deepClone(clone[key], depth - 1)) for key of clone) if not _.isUndefined(depth) and (depth > 0)

  return clone

# Is a given value a constructor?<br/>
# **Note: this is not guaranteed to work because not all constructors have a name property.**
_.isConstructor = (obj) ->
  _.isFunction(obj) and obj.name

# Returns the class constructor (function return type) using a string, keypath or constructor.
_.resolveConstructor = (key) ->
  components = (if _.isArray(key) then key else (if _.isString(key) then key.split(".") else undefined))

  if components
    constructor = if (components.length is 1) then root[components[0]] else _.keypath(root, components)
    return if constructor and _.isConstructor(constructor) then constructor else undefined
  else if _.isFunction(key) and _.isConstructor(key)
    return key

  return undefined

# Determines whether a conversion is possible checking typeof, instanceof, is{SomeType}(), to{SomeType}() using a string, keypath or constructor..
# Convention for is{SomeType}(), to{SomeType}() with namespaced classes is to remove the namespace (like Javascript does).<br/>
# **Note: if you pass a constructor, the name property may not exist so use a string if you are relying on is{SomeType}(), to{SomeType}().**
_.CONVERT_NONE = 0
_.CONVERT_IS_TYPE = 1
_.CONVERT_TO_METHOD = 2
_.conversionPath = (obj, key) ->
  components = if _.isArray(key) then key else (if _.isString(key) then key.split(".") else undefined)
  obj_type = typeof (obj)
  check_name = if components then components[components.length - 1] else undefined

  # Built-in type
  obj_type = typeof(obj); check_name = if components then components[components.length-1] else undefined
  return _.CONVERT_IS_TYPE if components and (obj_type == check_name)

  # Resolved a constructor and object is an instance of it.
  construtor = _.resolveConstructor(if components then components else key)
  if (construtor and (obj_type == 'object'))
    try
      return _.CONVERT_IS_TYPE if (obj instanceof construtor)
    catch _e
      {}
  check_name = if construtor and construtor.name then construtor.name else check_name
  return _.CONVERT_NONE unless check_name

  # Try the conventions: is{SomeType}(), to{SomeType}()
  return _.CONVERT_IS_TYPE if _['is'+check_name] && _['is'+check_name](obj)
  return _.CONVERT_TO_METHOD if (obj_type == 'object') and obj['to'+check_name]
  return _.CONVERT_NONE

# Helper to checks if a conversion is available including being the actual type
_.isConvertible = (obj, key) ->
  return _.conversionPath(obj, key) > 0

# Converts from one time to another using a string, keypath or constructor if it can find a conversion path.
_.toType = (obj, key) ->
  components = if _.isArray(key) then key else (if _.isString(key) then key.split(".") else undefined)

  switch _.conversionPath(obj, (if components then components else key))
    when 1 then return obj        # _.CONVERT_IS_TYPE
    when 2                        # _.CONVERT_TO_METHOD
      if components
        return obj["to" + components[components.length - 1]]()
      else
        constructor = _.resolveConstructor(key)
        return (if (constructor and constructor.name) then obj["to" + constructor.name]() else undefined)

  return undefined

# Checks if a function exists on an object.
_.functionExists = (object, function_name) ->
  return (object instanceof Object) and object[function_name] and _.isFunction(object[function_name])

# Call a function if it exists on an object.
_.callIfExists = (object, function_name) ->
  return if _.functionExists(object, function_name) then object[function_name].apply(object, Array::slice.call(arguments, 2)) else undefined

# Get a specific super class function if it exists. Can be useful when dynamically updating a hierarchy.
_.getSuperFunction = (object, function_name) ->
  value_owner = _.keypathValueOwner(object, [ "constructor", "__super__", function_name ])
  return if (value_owner and _.isFunction(value_owner[function_name])) then value_owner[function_name] else undefined

# Call a specific super class function with trailing arguments if it exists.
_.superCall = (object, function_name) ->
  super_function = _.getSuperFunction(object, function_name)
  return if super_function then super_function.apply(object, Array::slice.call(arguments, 2)) else undefined

# Call a specific super class function with an arguments list if it exists.
_.superApply = (object, function_name, args) ->
  super_function = _.getSuperFunction(object, function_name)
  return if super_function then super_function.apply(object, args) else undefined

# Returns the class of an object, if it exists.<br/>
# **Note: this is not guaranteed to work because not all constructors have a name property.**
_.classOf = (obj) ->
  return (obj? and Object.getPrototypeOf(Object(obj)).constructor.name) or undefined

# Copy selected properties from the source to the destination.
# Optionally removes copied values from the source if you provide a remove parameter.
_.copyProperties = (destination, source, keys, remove) ->
  source_keys = keys or _.keys(source)
  copied_something = false

  for key in source_keys
    continue unless hasOwnProperty.call(source, key)
    destination[key] = source[key]
    copied_something = true
    delete source[key]  if remove

  return copied_something

# Get a value and if it does not exist, return the missing_value.
# Optionally remove the value if you provide a remove parameter.
_.getValue = (obj, key, missing_value, remove) ->
  if hasOwnProperty.call(obj, key)
    return obj[key] unless remove
    value = obj[key]
    delete obj[key]
    return value
  else
    return missing_value

# Sort the object's values by a criterion produced by an iterator.
_.sortBy = (obj, iterator, context) ->
  _.pluck(
    _.map(obj, (value, index, list) -> return {value: value, criteria: iterator.call(context, value, index, list)}).sort((left, right) ->
      a = left.criteria
      b = right.criteria
      _.compare(a, b)
    ), 'value'
  )

# Use a comparator function to figure out at what index an object should
# be inserted so as to maintain order. Uses binary search.
_.sortedIndex = (array, obj, iterator) ->
  iterator or (iterator = _.identity)
  low = 0
  high = array.length
  while low < high
    mid = (low + high) >> 1
    if _.compare(iterator(array[mid]), iterator(obj)) is _.COMPARE_ASCENDING then (low = mid + 1) else (high = mid)
  return low

# Maps simple comparison operators (< or ==) or custom comparison functions
# (such as localeCompare) to standardized comparison results.
_.COMPARE_EQUAL = 0
_.COMPARE_ASCENDING = -1
_.COMPARE_DESCENDING = 1
_.compare = (value_a, value_b, function_name) ->
  # Non-object compare just comparing raw values
  return (if (value_a is value_b) then _.COMPARE_EQUAL else (if (value_a < value_b) then _.COMPARE_ASCENDING else _.COMPARE_DESCENDING))  if typeof (value_a) isnt "object"

  # Use a compare function, if one exists
  function_name = "compare"  unless function_name

  # call compare function of a
  if value_a[function_name] and _.isFunction(value_a[function_name])
    result = value_a[function_name](value_b)
    return (if (result is 0) then _.COMPARE_EQUAL else (if (result < 0) then _.COMPARE_ASCENDING else _.COMPARE_DESCENDING))

  # call compare function of b
  else if value_b[function_name] and _.isFunction(value_b[function_name])
    result = value_b[function_name](value_a)
    return (if (result is 0) then _.COMPARE_EQUAL else (if (result < 0) then _.COMPARE_DESCENDING else _.COMPARE_ASCENDING))

  # value compare
  else
    return if (value_a is value_b) then _.COMPARE_EQUAL else (if (value_a < value_b) then _.COMPARE_ASCENDING else _.COMPARE_DESCENDING)