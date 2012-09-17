/*
  Underscore-Awesomer.js 1.2.4
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/underscore-awesomer/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function() {
  return (function(factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
      return define('underscore-awesomer', ['underscore'], factory);
    }
    // CommonJS/NodeJS or No Loader
    else {
      return factory.call(this);
    }
  })(function() {'__REPLACE__'; return _;});
}).call(this);