// Generated by CoffeeScript 1.3.3

/*
  Underscore-Awesomer.js 1.2.3
  (c) 2011, 2012 Kevin Malakoff.
  Underscore-Awesomer is freely distributable under the MIT license.
  https:#github.com/kmalakoff/underscore-awesomer

  Underscore-Awesomer provides extensions to the Underscore library: http:#documentcloud.github.com/underscore

  Note: some code from Underscore.js is repeated in this file.
  Please see the following for details on Underscore.js and its licensing:
    https:#github.com/documentcloud/underscore
    https:#github.com/documentcloud/underscore/blob/master/LICENSE
*/


(function() {
  var root, _;

  root = this;

  if (typeof require !== 'undefined') {
    try {
      _ = require('lodash');
    } catch (e) {
      _ = require('underscore');
    }
  } else {
    _ = this._;
  }

  if (typeof root.exports !== 'undefined') {
    root.exports = _;
  }

  _.AWESOMENESS = "1.2.3";

  _.pluck = function(obj, key, remove) {
    if (remove) {
      return _.map(obj, function(value) {
        var val;
        val = value[key];
        delete value[key];
        return val;
      });
    } else {
      return _.map(obj, function(value) {
        return value[key];
      });
    }
  };

  _.remove = function(obj, matcher, options) {
    var index, key, matcher_key, matcher_value, ordered_keys, original_object, removed, single_value, value, values, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r;
    if (options == null) {
      options = {};
    }
    if (_.isEmpty(obj)) {
      return (!matcher || _.isFunction(matcher) ? [] : void 0);
    }
    if (_.isFunction(options)) {
      options = {
        callback: options
      };
    }
    if (options.preclear) {
      original_object = obj;
      obj = _.clone(obj);
      if (_.isArray(original_object)) {
        original_object.length = 0;
      } else {
        for (key in original_object) {
          delete original_object[key];
        }
      }
    }
    removed = [];
    single_value = false;
    if (_.isArray(obj)) {
      if (_.isUndefined(matcher)) {
        removed = _.keys(obj);
      } else if (_.isFunction(matcher)) {
        if (options.first_only) {
          single_value = true;
          _.find(obj, function(value, index) {
            if (matcher(value)) {
              removed.push(index);
              return true;
            }
            return false;
          });
        } else {
          _.each(obj, function(value, index) {
            if (matcher(value)) {
              return removed.push(index);
            }
          });
        }
      } else if (_.isArray(matcher)) {
        if (options.first_only) {
          single_value = true;
          for (_i = 0, _len = matcher.length; _i < _len; _i++) {
            matcher_value = matcher[_i];
            for (index in obj) {
              value = obj[index];
              if (matcher_value === value) {
                removed.push(index);
                break;
              }
            }
          }
        } else {
          for (_j = 0, _len1 = matcher.length; _j < _len1; _j++) {
            matcher_value = matcher[_j];
            for (index in obj) {
              value = obj[index];
              if (matcher_value === value) {
                removed.push(index);
              }
            }
          }
        }
      } else {
        if (options.first_only) {
          single_value = true;
          index = _.indexOf(obj, matcher);
          if (index >= 0) {
            removed.push(index);
          }
        } else {
          single_value = true;
          for (index in obj) {
            value = obj[index];
            if (matcher === value) {
              removed.push(index);
            }
          }
        }
      }
      if (single_value) {
        if (!removed.length) {
          return void 0;
        }
        value = obj[removed[0]];
        removed = removed.sort(function(left, right) {
          return _.compare(right, left);
        });
        for (_k = 0, _len2 = removed.length; _k < _len2; _k++) {
          index = removed[_k];
          obj.splice(index, 1);
        }
        if (options.callback) {
          for (_l = 0, _len3 = removed.length; _l < _len3; _l++) {
            index = removed[_l];
            options.callback(value);
          }
        }
        return value;
      } else {
        if (!removed.length) {
          return [];
        }
        values = [];
        removed = removed.sort(function(left, right) {
          return _.compare(right, left);
        });
        for (_m = 0, _len4 = removed.length; _m < _len4; _m++) {
          index = removed[_m];
          values.unshift(obj[index]);
          obj.splice(index, 1);
        }
        if (options.callback) {
          for (_n = 0, _len5 = values.length; _n < _len5; _n++) {
            value = values[_n];
            options.callback(value);
          }
        }
        return _.uniq(values);
      }
    } else {
      if (_.isUndefined(matcher)) {
        removed = _.keys(obj);
      } else if (_.isFunction(matcher)) {
        for (key in obj) {
          value = obj[key];
          if (matcher(value, key)) {
            removed.push(key);
          }
        }
      } else if (_.isArray(matcher)) {
        if (options.values) {
          for (_o = 0, _len6 = matcher.length; _o < _len6; _o++) {
            matcher_value = matcher[_o];
            if (options.first_only) {
              for (key in obj) {
                value = obj[key];
                if (matcher_value === value) {
                  removed.push(key);
                  break;
                }
              }
            } else {
              for (key in obj) {
                value = obj[key];
                if (matcher_value === value) {
                  removed.push(key);
                }
              }
            }
          }
        } else {
          ordered_keys = matcher;
          for (_p = 0, _len7 = matcher.length; _p < _len7; _p++) {
            matcher_key = matcher[_p];
            if (obj.hasOwnProperty(matcher_key)) {
              removed.push(matcher_key);
            }
          }
        }
      } else if (_.isString(matcher) && !options.values) {
        single_value = true;
        ordered_keys = [];
        if (obj.hasOwnProperty(matcher)) {
          ordered_keys.push(matcher);
          removed.push(matcher);
        }
      } else {
        for (key in obj) {
          value = obj[key];
          if (matcher === value) {
            removed.push(key);
          }
        }
      }
      if (ordered_keys) {
        if (!ordered_keys.length) {
          if (single_value) {
            return void 0;
          } else {
            return [];
          }
        }
        values = [];
        for (_q = 0, _len8 = removed.length; _q < _len8; _q++) {
          key = removed[_q];
          values.push(obj[key]);
          delete obj[key];
        }
        if (options.callback) {
          for (index in values) {
            value = values[index];
            options.callback(value, ordered_keys[index]);
          }
        }
        if (single_value) {
          return values[0];
        } else {
          return values;
        }
      } else {
        if (!removed.length) {
          return {};
        }
        values = {};
        for (_r = 0, _len9 = removed.length; _r < _len9; _r++) {
          key = removed[_r];
          values[key] = obj[key];
          delete obj[key];
        }
        if (options.callback) {
          for (key in values) {
            value = values[key];
            options.callback(value, key);
          }
        }
        return values;
      }
    }
  };

  _.findIndex = function(array, fn) {
    var index, value;
    for (index in array) {
      value = array[index];
      if (fn(array[index])) {
        return index;
      }
    }
    return -1;
  };

  _.hasKeypath = _.keypathExists = function(object, keypath) {
    return !!_.keypathValueOwner(object, keypath);
  };

  _.keypathValueOwner = function(object, keypath) {
    var components, current_object, index, key, length;
    components = _.isString(keypath) ? keypath.split('.') : keypath;
    current_object = object;
    length = components.length;
    for (index in components) {
      key = components[index];
      if (!(key in current_object)) {
        break;
      }
      if (++index === length) {
        return current_object;
      }
      current_object = current_object[key];
      if (!current_object || (!(current_object instanceof Object))) {
        break;
      }
    }
    return void 0;
  };

  _.keypath = function(object, keypath, value) {
    var components, value_owner;
    components = (_.isString(keypath) ? keypath.split(".") : keypath);
    value_owner = _.keypathValueOwner(object, components);
    if (arguments.length === 2) {
      if (!value_owner) {
        return void 0;
      }
      return value_owner[components[components.length - 1]];
    } else {
      if (!value_owner) {
        return;
      }
      value_owner[components[components.length - 1]] = value;
      return value;
    }
  };

  _.cloneToDepth = _.containerClone = _.clone = function(obj, depth) {
    var clone, key;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (_.isArray(obj)) {
      clone = Array.prototype.slice.call(obj);
    } else if (obj.constructor !== {}.constructor) {
      return obj;
    } else {
      clone = _.extend({}, obj);
    }
    if (!_.isUndefined(depth) && (depth > 0)) {
      for (key in clone) {
        clone[key] = _.clone(clone[key], depth - 1);
      }
    }
    return clone;
  };

  _.deepClone = function(obj, depth) {
    var clone, key;
    if (!obj || (typeof obj !== "object")) {
      return obj;
    }
    if (_.isString(obj)) {
      return String.prototype.slice.call(obj);
    }
    if (_.isDate(obj)) {
      return new Date(obj.valueOf());
    }
    if (_.isFunction(obj.clone)) {
      return obj.clone();
    }
    if (_.isArray(obj)) {
      clone = Array.prototype.slice.call(obj);
    } else if (obj.constructor !== {}.constructor) {
      return obj;
    } else {
      clone = _.extend({}, obj);
    }
    if (!_.isUndefined(depth) && (depth > 0)) {
      for (key in clone) {
        clone[key] = _.deepClone(clone[key], depth - 1);
      }
    }
    return clone;
  };

  _.isConstructor = function(obj) {
    return _.isFunction(obj) && obj.name;
  };

  _.resolveConstructor = function(key) {
    var components, constructor;
    components = (_.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0));
    if (components) {
      constructor = components.length === 1 ? root[components[0]] : _.keypath(root, components);
      if (constructor && _.isConstructor(constructor)) {
        return constructor;
      } else {
        return void 0;
      }
    } else if (_.isFunction(key) && _.isConstructor(key)) {
      return key;
    }
    return void 0;
  };

  _.CONVERT_NONE = 0;

  _.CONVERT_IS_TYPE = 1;

  _.CONVERT_TO_METHOD = 2;

  _.conversionPath = function(obj, key) {
    var check_name, components, construtor, obj_type;
    components = _.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0);
    obj_type = typeof obj;
    check_name = components ? components[components.length - 1] : void 0;
    obj_type = typeof obj;
    check_name = components ? components[components.length - 1] : void 0;
    if (components && (obj_type === check_name)) {
      return _.CONVERT_IS_TYPE;
    }
    construtor = _.resolveConstructor(components ? components : key);
    if (construtor && (obj_type === 'object')) {
      try {
        if (obj instanceof construtor) {
          return _.CONVERT_IS_TYPE;
        }
      } catch (_e) {
        ({});
      }
    }
    check_name = construtor && construtor.name ? construtor.name : check_name;
    if (!check_name) {
      return _.CONVERT_NONE;
    }
    if (_['is' + check_name] && _['is' + check_name](obj)) {
      return _.CONVERT_IS_TYPE;
    }
    if ((obj_type === 'object') && obj['to' + check_name]) {
      return _.CONVERT_TO_METHOD;
    }
    return _.CONVERT_NONE;
  };

  _.isConvertible = function(obj, key) {
    return _.conversionPath(obj, key) > 0;
  };

  _.toType = function(obj, key) {
    var components, constructor;
    components = _.isArray(key) ? key : (_.isString(key) ? key.split(".") : void 0);
    switch (_.conversionPath(obj, (components ? components : key))) {
      case 1:
        return obj;
      case 2:
        if (components) {
          return obj["to" + components[components.length - 1]]();
        } else {
          constructor = _.resolveConstructor(key);
          return (constructor && constructor.name ? obj["to" + constructor.name]() : void 0);
        }
    }
    return void 0;
  };

  _.functionExists = function(object, function_name) {
    return (object instanceof Object) && object[function_name] && _.isFunction(object[function_name]);
  };

  _.callIfExists = function(object, function_name) {
    if (_.functionExists(object, function_name)) {
      return object[function_name].apply(object, Array.prototype.slice.call(arguments, 2));
    } else {
      return void 0;
    }
  };

  _.getSuperFunction = function(object, function_name) {
    var value_owner;
    value_owner = _.keypathValueOwner(object, ["constructor", "__super__", function_name]);
    if (value_owner && _.isFunction(value_owner[function_name])) {
      return value_owner[function_name];
    } else {
      return void 0;
    }
  };

  _.superCall = function(object, function_name) {
    var super_function;
    super_function = _.getSuperFunction(object, function_name);
    if (super_function) {
      return super_function.apply(object, Array.prototype.slice.call(arguments, 2));
    } else {
      return void 0;
    }
  };

  _.superApply = function(object, function_name, args) {
    var super_function;
    super_function = _.getSuperFunction(object, function_name);
    if (super_function) {
      return super_function.apply(object, args);
    } else {
      return void 0;
    }
  };

  _.classOf = function(obj) {
    return ((obj != null) && Object.getPrototypeOf(Object(obj)).constructor.name) || void 0;
  };

  _.copyProperties = function(destination, source, keys, remove) {
    var copied_something, key, source_keys, _i, _len;
    source_keys = keys || _.keys(source);
    copied_something = false;
    for (_i = 0, _len = source_keys.length; _i < _len; _i++) {
      key = source_keys[_i];
      if (!hasOwnProperty.call(source, key)) {
        continue;
      }
      destination[key] = source[key];
      copied_something = true;
      if (remove) {
        delete source[key];
      }
    }
    return copied_something;
  };

  _.getValue = function(obj, key, missing_value, remove) {
    var value;
    if (hasOwnProperty.call(obj, key)) {
      if (!remove) {
        return obj[key];
      }
      value = obj[key];
      delete obj[key];
      return value;
    } else {
      return missing_value;
    }
  };

  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a, b;
      a = left.criteria;
      b = right.criteria;
      return _.compare(a, b);
    }), 'value');
  };

  _.sortedIndex = function(array, obj, iterator) {
    var high, low, mid;
    iterator || (iterator = _.identity);
    low = 0;
    high = array.length;
    while (low < high) {
      mid = (low + high) >> 1;
      if (_.compare(iterator(array[mid]), iterator(obj)) === _.COMPARE_ASCENDING) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };

  _.COMPARE_EQUAL = 0;

  _.COMPARE_ASCENDING = -1;

  _.COMPARE_DESCENDING = 1;

  _.compare = function(value_a, value_b, function_name) {
    var result;
    if (typeof value_a !== "object") {
      return (value_a === value_b ? _.COMPARE_EQUAL : (value_a < value_b ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING));
    }
    if (!function_name) {
      function_name = "compare";
    }
    if (value_a[function_name] && _.isFunction(value_a[function_name])) {
      result = value_a[function_name](value_b);
      return (result === 0 ? _.COMPARE_EQUAL : (result < 0 ? _.COMPARE_ASCENDING : _.COMPARE_DESCENDING));
    } else if (value_b[function_name] && _.isFunction(value_b[function_name])) {
      result = value_b[function_name](value_a);
      return (result === 0 ? _.COMPARE_EQUAL : (result < 0 ? _.COMPARE_DESCENDING : _.COMPARE_ASCENDING));
    } else {
      if (value_a === value_b) {
        return _.COMPARE_EQUAL;
      } else {
        if (value_a < value_b) {
          return _.COMPARE_ASCENDING;
        } else {
          return _.COMPARE_DESCENDING;
        }
      }
    }
  };

}).call(this);
