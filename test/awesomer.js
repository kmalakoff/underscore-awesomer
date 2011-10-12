var root = this;

$(document).ready(function() {
  module("Awesome Underscore extensions");

  // Modifications to Underscore
  // --------------------

  test('collections: pluck', function() {
    var people = [{name : 'moe', age : 30}, {name : 'curly', age : 50}];
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'pulls names out of objects');
    ok(_.isEqual(people, [{name : 'moe', age : 30}, {name : 'curly', age : 50}]), 'does not alter the original');

    equals(_.pluck(people, 'name', true).join(', '), 'moe, curly', 'pulls names out of objects');
    ok(_.isEqual(people, [{age : 30}, {age : 50}]), 'removes the plucked values from the original');
  });

  test("objects: isEqual for classes", function() {
    LocalizedString = (function() {
      function LocalizedString(id) { this.id = id; this.string = (this.id===10)? 'Bonjour': ''; }
      LocalizedString.prototype.isEqual = function(that) {
        if (_.isString(that)) return this.string == that;
        else if (that instanceof LocalizedString) return this.id == that.id;
        return false;
      };
      return LocalizedString;
    })();

    var localized_string1 = new LocalizedString(10), localized_string2 = new LocalizedString(10), localized_string3 = new LocalizedString(11);

    ok(_.isEqual(localized_string1, localized_string2), 'comparing same typed instances with same ids');
    ok(!_.isEqual(localized_string1, localized_string3), 'comparing same typed instances with different ids');
    ok(!_.isEqual(localized_string2, localized_string3), 'comparing same typed instances with different ids');
    ok(_.isEqual(localized_string1, 'Bonjour'), 'comparing different typed instances with same values');
    ok(_.isEqual('Bonjour', localized_string1), 'comparing different typed instances with same values');
    ok(!_.isEqual('Bonjour', localized_string3), 'comparing two localized strings with different ids');
    ok(!_.isEqual(localized_string1, 'Au revoir'), 'comparing different typed instances with different values');
    ok(!_.isEqual('Au revoir', localized_string1), 'comparing different typed instances with different values');

    Date.prototype.toJSON = function() {
      return {
        _type:'Date',
        year:this.getUTCFullYear(),
        month:this.getUTCMonth(),
        day:this.getUTCDate(),
        hours:this.getUTCHours(),
        minutes:this.getUTCMinutes(),
        seconds:this.getUTCSeconds()
      };
    };
    Date.prototype.isEqual = function(that) {
      var this_date_components = this.toJSON();
      var that_date_components = (that instanceof Date) ? that.toJSON() : that;
      delete this_date_components['_type']; delete that_date_components['_type']
      return _.isEqual(this_date_components, that_date_components);
    };

    var date = new Date();
    var date_json = {
      _type:'Date',
      year:date.getUTCFullYear(),
      month:date.getUTCMonth(),
      day:date.getUTCDate(),
      hours:date.getUTCHours(),
      minutes:date.getUTCMinutes(),
      seconds:date.getUTCSeconds()
    };

    ok(_.isEqual(date_json, date), 'serialized date matches date');
    ok(_.isEqual(date, date_json), 'date matches serialized date');
  });

  // Collection Functions
  // --------------------

  test('collections: getValue', function() {
    var person = {name : 'moe', age : 30}, result;

    result = _.getValue(person, 'name', 'curly');
    equals(result, 'moe', 'gets the value when it exists');
    result = _.getValue(person, 'first_name', 'curly');
    equals(result, 'curly', 'gets the default value when it does not exist');
  });

  Person = (function() {
    function Person(name,age) {
      this.name=name; this.age=age;
    }
    Person.prototype.compare = function(that) {
      var result = _.compare(this.age, that.age);
      if (result!=_.COMPARE_EQUAL) return result;
      return _.compare(this.name, that.name, 'localeCompare');
    };
    Person.prototype.compareByName = function(that) {
      var result = _.compare(this.name, that.name, 'localeCompare')
      if (result!=_.COMPARE_EQUAL) return result;
      return _.compare(this.age, that.age);
    };
    return Person;
  })();

  test('collections: sortBy', function() {
    var people = [{name : 'curly', age : 50}, {name : 'moe', age : 30}];
    people = _.sortBy(people, function(person){ return person.age; });
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'stooges sorted by age');

    people.push({name : 'larry', age : 30});
    people = _.sortBy(people, function(obj) {
      return new Person(obj.name, obj.age);
    });
    equals(_.pluck(people, 'name').join(', '), 'larry, moe, curly', 'stooges sorted by age then name');
  });

  test('collections: sortedIndex', function() {
    var numbers = [10, 20, 30, 40, 50], num = 35;
    var index = _.sortedIndex(numbers, num);
    equals(index, 3, '35 should be inserted at index 3');
  });

  test('collections: compare', function() {
    var people = [new Person('curly',50), new Person('moe',30), new Person('larry', 30)];
    equals(_.compare(people[0].name, people[0].name), _.COMPARE_EQUAL, 'curly is curly');
    equals(_.compare(people[0].name, people[1].name), _.COMPARE_ASCENDING, 'curly is before moe');
    equals(_.compare(people[1].name, people[0].name), _.COMPARE_DESCENDING, 'moe is after curly');

    equals(_.compare(people[0].age, people[0].age), _.COMPARE_EQUAL, 'curly is curly');
    equals(_.compare(people[0].age, people[1].age), _.COMPARE_DESCENDING, 'curly is after moe');
    equals(_.compare(people[1].age, people[0].age), _.COMPARE_ASCENDING, 'moe is before curly');

    equals(_.compare(people[0], people[0]), _.COMPARE_EQUAL, 'curly as old as curly');
    equals(_.compare(people[0], people[1]), _.COMPARE_DESCENDING, 'curly is older than moe');
    equals(_.compare(people[1], people[0]), _.COMPARE_ASCENDING, 'moe is younger than curly');
    equals(_.compare(people[1], people[2]), _.COMPARE_DESCENDING, "moe is the same age as larry, but larry's name is before moe");

    equals(_.compare(people[0], people[0], 'compareByName'), _.COMPARE_EQUAL, 'curly is curly');
    equals(_.compare(people[0], people[1], 'compareByName'), _.COMPARE_ASCENDING, 'curly before moe');
    equals(_.compare(people[1], people[2], 'compareByName'), _.COMPARE_DESCENDING, 'moe is after larry');
  });

  test('collections: copyProperties', function() {
    var person1;
    var person2;

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1);
    ok(_.isEqual(person1, {name : 'curly', age : 50}), 'no change to person1');
    ok(_.isEqual(person2, person1), 'copies everything over');

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, ['name']);
    ok(_.isEqual(person1, {name : 'curly', age : 50}), 'no change to person1');
    ok(_.isEqual(person2, {name : 'curly'}), 'copies only name over');

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, undefined, true);
    ok(_.isEqual(person1, {}), 'person1 loses all of its properties');
    ok(_.isEqual(person2, {name : 'curly', age : 50}), 'moves everything over');

    person1 = {name : 'curly', age : 50}; person2 = {}
    _.copyProperties(person2, person1, ['name'], true);
    ok(_.isEqual(person1, {age : 50}), 'person1 loses name property');
    ok(_.isEqual(person2, {name : 'curly'}), 'person1 gets name property');

    person1 = {name : 'curly', age : 50}; person2 = {gender: 'male'}
    _.copyProperties(person2, person1, ['name'], true);
    ok(_.isEqual(person1, {age : 50}), 'person1 loses name property');
    ok(_.isEqual(person2, {name : 'curly', gender: 'male'}), 'person1 gets name property and retains gender');
  });

  test('collections: remove', function() {
    var a, o, result;
    var callback_count, callback = function() {callback_count++;}

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 2, callback);
    ok(result==2, '2 returned');
    ok(_.isEqual(a,[1,3,5]), '[1,3,5] remaining');
    ok(callback_count==2, '2 removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 0, callback);
    ok(!result, 'none returned');
    ok(_.isEqual(a,[1,2,3,2,5]), '[1,2,3,2,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [2,5], {callback: callback});
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(a,[1,4]), '[1,3,4] remaining');
    ok(callback_count==3, '[2,5] removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [0], {callback: callback});
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(a,[1,2,2,4,5]), '[1,2,2,4,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,2,4,5]; callback_count = 0;
    result = _.remove(a, [0,2], {callback: callback});
    ok(_.isEqual(result,[2]), '[2] returned');
    ok(_.isEqual(a,[1,4,5]), '[1,4,5] remaining');
    ok(callback_count==2, '[2] removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, function(item) { return item % 2 == 0; }, callback);
    ok(_.isEqual(result,[2,4]), '[2,4] returned');
    ok(_.isEqual(a,[1,3,5]), '[1,3,5] remaining');
    ok(callback_count==2, '[2,4] removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, function() { return false; }, callback);
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(a,[1,2,3,4,5]), '[1,3,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, undefined, {callback: callback});
    ok(_.isEqual(result,[1,2,3,4,5]), '[1,2,3,4,5] returned');
    ok(_.isEqual(a,[]), '[] remaining');
    ok(callback_count==5, '[1,2,3,4,5] removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 2, {callback:callback,first_only:true});
    ok(result==2, '2 returned');
    ok(_.isEqual(a,[1,3,2,5]), '[1,3,2,5] remaining');
    ok(callback_count==1, '2 removed count');

    a = [1,2,3,2,5]; callback_count = 0;
    result = _.remove(a, 0, {callback:callback,first_only:true});
    ok(!result, 'none returned');
    ok(_.isEqual(a,[1,2,3,2,5]), '[1,2,3,2,5] remaining');
    ok(callback_count==0, 'none removed count');

    a = [1,2,3,4,5]; callback_count = 0;
    result = _.remove(a, [2,5], {callback: callback});
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(a,[1,3,4]), '[1,3,4] remaining');
    ok(callback_count==2, '[2,5] removed count');

    a = [1,2,5,4,5]; callback_count = 0;
    var a_preclear_callback = function() { ok(_.isEqual(a,[]), 'cleared before remove'); callback_count++; }
    result = _.remove(a, 2, {callback:a_preclear_callback, preclear:true});
    ok(result==2, '2 removed');
    ok(callback_count==1, '2 removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 'two', callback);
    ok(_.isEqual(result,2), '2 returned');
    ok(_.isEqual(o,{one:1,three:3,four:4,five:5}), '{one:1,three:3,four:4,five:5} remaining');
    ok(callback_count==1, '{two:2} removed');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 'zero', callback);
    ok(_.isUndefined(result), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 3, {values:true, callback: callback});
    ok(_.isEqual(result,{three:3}), '{three:3} returned');
    ok(_.isEqual(o,{one:1,two:2,four:4,five:5}), '{one:1,two:2,four:4,five:5} remaining');
    ok(callback_count==1, '{three:3} removed');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, 2, {callback:callback});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,five:5} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,two_too:2} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, 0, {values:true, callback: callback});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, ['two','five'], callback);
    ok(_.isEqual(result,[2,5]), '[2,5] returned');
    ok(_.isEqual(o,{one:1,three:3,two_too:2}), '{one:1,three:3,two_too:2} remaining');
    ok(callback_count==2, '{two:2,five:5} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, ['zero'], callback);
    ok(_.isEqual(result,[]), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,two_too:2,five:5}), '{one:1,two:2,three:3,two_too:2,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, [2,5], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,five:5}), '{two:2,five:5} returned');
    ok(_.isEqual(o,{one:1,three:3,four:4}), '{one:1,three:3,four:4} remaining');
    ok(callback_count==2, '{two:2,five:5} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [2], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,two_too:2} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,two_too:2} removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [0], {callback:callback,values:true});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,two_too:2,five:5}), '{one:1,two:2,three:3,two_too:2,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,two_too:2,five:5}; callback_count = 0;
    result = _.remove(o, [0,2], {callback:callback,values:true});
    ok(_.isEqual(result,{two:2,two_too:2}), '{two:2,two_too:2} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, function(value,key) { return value % 2 == 0; }, {callback: callback});
    ok(_.isEqual(result,{two:2,four:4}), '{two:2,four:4} returned');
    ok(_.isEqual(o,{one:1,three:3,five:5}), '{one:1,three:3,five:5} remaining');
    ok(callback_count==2, '{two:2,four:4} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, function() { return false; }, {callback: callback});
    ok(_.isEqual(result,{}), 'none returned');
    ok(_.isEqual(o,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} remaining');
    ok(callback_count==0, 'none removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    result = _.remove(o, undefined, callback);
    ok(_.isEqual(result,{one:1,two:2,three:3,four:4,five:5}), '{one:1,two:2,three:3,four:4,five:5} returned');
    ok(_.isEmpty(o), 'all removed');
    ok(callback_count==5, '{one:1,two:2,three:3,four:4,five:5} removed count');

    o = {one:1,two:2,three:3,four:4,five:5}; callback_count = 0;
    var o_preclear_callback = function() { ok(_.isEqual(o,{}), 'cleared before remove'); callback_count++; }
    result = _.remove(o, 'two', {callback:a_preclear_callback, preclear:true});
    ok(_.isEqual(result,2), '2 returned');
    ok(_.isEqual(o,{}), '{} remaining');
    ok(callback_count==1, '{two:2} removed');
  });

  // Array Functions
  // ---------------

  test("arrays: findIndex", function() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9], result;

    result = _.findIndex(numbers, function(number) {return number==5;});
    equals(result, 4, 'finds the index using a function');

    result = _.findIndex(numbers, function(number) {return number==10;});
    equals(result, -1, 'does not find that which does not exist');
  });

  // Object Functions
  // ----------------

  test("objects: keypathExists", function() {
    var object = {follow: {me: {down: {the: 'road'} } } };

    ok(_.hasKeypath(object, 'follow'), 'follow exists');
    ok(_.hasKeypath(object, 'follow.me'), 'follow.me exists');
    ok(_.hasKeypath(object, ['follow','me']), 'follow.me as array exists');
    ok(_.hasKeypath(object, 'follow.me.down.the'), 'follow.me.down.the exists');
    ok(_.hasKeypath(object, ['follow','me','down','the']), 'follow.me.down.the as array exists');
    ok(!_.hasKeypath(object, 'follow.me.down.the.road'), 'follow.me.down.the.road does not exist');
    ok(!_.hasKeypath(object, ['follow','me','down','the','road']), 'follow.me.down.the.road as array does not exist');
  });

  test("objects: keypathValueOwner", function() {
    var object = {follow: {me: {down: {the: 'road'} } } };

    ok(object.follow === _.keypathValueOwner(object, 'follow.me'), 'follow.me owner as expected');
    ok(object.follow === _.keypathValueOwner(object, ['follow','me']), 'follow.me as array owner as expected');
    ok(object.follow.me.down === _.keypathValueOwner(object, 'follow.me.down.the'), 'follow.me.down.the owner as expected');
    ok(object.follow.me.down === _.keypathValueOwner(object, ['follow','me','down','the']), 'follow.me.down.the as array owner as expected');
    ok(!_.keypathValueOwner(object, 'follow.me.down.the.road'), 'follow.me.down.the.road owner does not exist');
    ok(!_.keypathValueOwner(object, ['follow','me','down','the','road']), 'follow.me.down.the.road owner as array does not exist');
  });

  test("objects: keypath", function() {
    var object = {follow: {me: {down: {the: 'road'} } } }, result;

    // get
    result = _.keypath(object, 'follow.me');
    ok(_.isEqual(result,{down: {the: 'road'} }), 'follow.me value as expected');
    result = _.keypath(object, ['follow','me']);
    ok(_.isEqual(result,{down: {the: 'road'} }), 'follow.me value as expected');
    result = _.keypath(object, 'follow.me.down.the');
    ok(_.isEqual(result,'road'), 'follow.me.down.the value as expected');
    result = _.keypath(object, ['follow','me','down','the']);
    ok(_.isEqual(result,'road'), 'follow.me.down.the value as array as expected');
    result = _.keypath(object, 'follow.me.down.the.road');
    ok(!result, 'follow.me.down.the.road does not exist');
    result = _.keypath(object, ['follow','me','down','the','road']);
    ok(!result, 'follow.me.down.the.road owner as array does not exist');

    // set
    object = {follow: {me: {down: {the: 'road'} } } }; _.keypath(object, 'follow.me', 'if you want to live');
    ok(_.isEqual(object.follow.me,'if you want to live'), 'follow.me value as expected');
    object = {follow: {me: {down: {the: 'road'} } } }; _.keypath(object, ['follow','me'], 'and hold this big bag of money');
    ok(_.isEqual(object.follow.me,'and hold this big bag of money'), 'follow.me value as expected');
    object = {follow: {me: {down: {the: 'road'} } } }; _.keypath(object, 'follow.me.down.the', 'rabbit hole');
    ok(_.isEqual(object.follow.me.down.the,'rabbit hole'), 'follow.me.down.the value as expected');
    object = {follow: {me: {down: {the: 'road'} } } }; _.keypath(object, ['follow','me','down','the'], '...damn, we are surrounded');
    ok(_.isEqual(object.follow.me.down.the,'...damn, we are surrounded'), 'follow.me.down.the value as array as expected');
    object = {follow: {me: {down: {the: 'road'} } } }; result = _.keypath(object, 'follow.me.down.the.road', 'nevermind');
    ok(!result, 'follow.me.down.the.road not set');
    object = {follow: {me: {down: {the: 'road'} } } }; result = _.keypath(object, ['follow','me','down','the','road'], 'bleach');
    ok(!result, 'follow.me.down.the.road as array not set');
  });

  test("objects: clone", function() {
    var clone, moe = {name : 'moe', lucky : [13, 27, 34]};

    // clone of a non-object
    clone = _.clone(1);
    equals(clone, 1, '1 is cloned');
    clone = _.clone('hello');
    equals(clone, 'hello', 'hello is cloned');

    // depth 0 - should behave exactly like clone
    clone = _.clone(moe);
    equals(clone.name, 'moe', 'the clone as the attributes of the original');

    clone.name = 'curly';
    ok(clone.name == 'curly' && moe.name == 'moe', 'clones can change shallow attributes without affecting the original');

    clone.lucky.push(101);
    equals(_.last(moe.lucky), 101, 'changes to deep attributes are shared with the original');

    // depth 1
    clone = _.clone(moe, 1);

    clone.name = 'curly';
    ok(clone.name == 'curly' && moe.name == 'moe', 'clones can change shallow attributes without affecting the original');

    clone.lucky.push(102);
    ok(_.last(moe.lucky)!=102, 'changes to deep attributes are not shared with the original');

    Clonable = (function() {
      function Clonable(value) {this.value = value;}
      Clonable.prototype.clone = function() { return new Clonable(this.value+1); };
      return Clonable;
    })();

    var original = new Clonable(1);
    clone = _.clone(original);
    ok(clone instanceof Clonable, 'clone is a clone by class');
    equal(clone.value, 2, 'clone has a side effect. Whoops!');

    var now = new Date();
    clone = _.clone(now);
    ok(clone instanceof Date, 'clone is a clone by class');
    ok((now.getFullYear()==clone.getFullYear()) && (now.getMonth()==clone.getMonth()) && (now.getDate()==clone.getDate()), 'clone is a clone by date components');
    ok((now.getHours()==clone.getHours()) && (now.getMinutes()==clone.getMinutes()) && (now.getSeconds()==clone.getSeconds()) && (now.getMilliseconds()==clone.getMilliseconds()), 'clone is a clone by time components');
  });

  test("objects: functionExists", function() {
    SomeClass = (function() {
      function SomeClass() {}
      SomeClass.prototype.callMe = function() {};
      return SomeClass;
    })();

    var some_instance = new SomeClass();
    ok(_.functionExists(some_instance, 'callMe'), 'callMe exists');
    ok(!_.functionExists(some_instance, 'dontCallMe'), 'dontCallMe does not exist');
  });

  test("objects: callIfExists", function() {
    SomeClass = (function() {
      function SomeClass() { this.phone_number = null; }
      SomeClass.prototype.callMe = function(phone_number) { this.phone_number = phone_number; return this.phone_number; };
      return SomeClass;
    })();

    var some_instance = new SomeClass(), result;
    ok(!some_instance.phone_number, 'no phone number');
    result = _.callIfExists(some_instance, 'callMe', '555-555-5555');
    ok(result==='555-555-5555', 'callMe made the change');
    ok(some_instance.phone_number=='555-555-5555', 'callMe made the change');

    result = _.callIfExists(some_instance, 'dontCallMe');
    ok(!result, 'silently ignored');
  });

  var __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };

  test("objects: getSuperFunction", function() {
    Superclass = (function() {
      function Superclass() { this.useful_count=0; }
      Superclass.prototype.usefulFunction = function() { return ++this.useful_count; }
      return Superclass;
    })();

    Subclass = (function() {
      __extends(Subclass, Superclass);
      function Subclass() {_.superApply(this, 'constructor', arguments);}
      Subclass.prototype.callUsefulFunction = function() { return _.getSuperFunction(this, 'usefulFunction').apply(this); }
      return Subclass;
    })();

    var subclass = new Subclass(), result;
    ok(subclass.useful_count===0, 'not useful yet');
    subclass.callUsefulFunction(); result = subclass.callUsefulFunction();
    ok(result===2, 'very useful result');
    ok(subclass.useful_count===2, 'very useful');
  });

  test("objects: superCall", function() {
    Superclass = (function() {
      function Superclass() {}
      Superclass.prototype.usefulFunction = function(usefulness) { this.usefulness=usefulness; }
      return Superclass;
    })();

    Subclass = (function() {
      __extends(Subclass, Superclass);
      function Subclass() {_.superApply(this, 'constructor', arguments);}
      Subclass.prototype.callUsefulFunction = function(usefulness) { _.superCall(this, 'usefulFunction', usefulness); }
      return Subclass;
    })();

    var subclass = new Subclass();
    ok(_.isUndefined(subclass.usefulness), 'not useful yet');
    subclass.callUsefulFunction(42);
    ok(subclass.usefulness===42, 'very meaningful');
  });

  test("objects: superApply", function() {
    Superclass = (function() {
      function Superclass() {}
      Superclass.prototype.usefulFunction = function(usefulness) { this.usefulness=usefulness; }
      return Superclass;
    })();

    Subclass = (function() {
      __extends(Subclass, Superclass);
      function Subclass() {_.superApply(this, 'constructor', arguments);}
      Subclass.prototype.applyUsefulFunction = function() { _.superApply(this, 'usefulFunction', arguments); }
      return Subclass;
    })();

    var subclass = new Subclass();
    ok(_.isUndefined(subclass.usefulness), 'not useful yet');
    subclass.applyUsefulFunction(42);
    ok(subclass.usefulness===42, 'very meaningful');
  });

  test("objects: classOf", function() {
    Superclass = (function() {
      function Superclass() {}
      return Superclass;
    })();
    var superclass = new Superclass();
    equal(_.classOf(superclass), 'Superclass', 'it is a Superclass');

    Subclass = (function() {
      __extends(Subclass, Superclass);
      function Subclass() {}
      return Subclass;
    })();
    var subclass = new Subclass();
    equal(_.classOf(subclass), 'Subclass', 'it is a Subclass');
    equal(_.classOf(function(){}), 'Function', 'function is a Function class');
    equal(_.classOf({}), 'Object', 'it is an object');
    equal(_.classOf(12), 'Number', '12 is a Number');
    equal(_.classOf(Subclass), 'Function', 'constructor is a Function class');
  });

  test("objects: isConstructor", function() {
    ok(!_.isConstructor(function() {}), 'a plain old function is not a constructor');

    SomeClass1 = (function() {
      function SomeClass1() {}
      return SomeClass1;
    })();
    ok(_.isConstructor(SomeClass1), 'a constructor');
    ok(!_.isConstructor('SomeClass1'), 'not a constructor name');

    root.SomeNamespace || (root.SomeNamespace = {});
    SomeNamespace.SomeClass2 = (function() {
      function SomeClass2() {}
      return SomeClass2;
    })();

    ok(_.isConstructor(SomeNamespace.SomeClass2), 'a namespaced constructor');
    ok(!_.isConstructor('SomeNamespace.SomeClass2'), 'not a namespaced constructor name');
    ok(!_.isConstructor('SomeClass2'), 'not a namespaced constructor name');
  });

  var __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };

  test("objects: resolveConstructor", function() {
    var constructor, result;
    root.SomeNamespace || (root.SomeNamespace = {});

    ok(!_.resolveConstructor('a'), 'a is not a constructor');

    constructor = _.resolveConstructor('String'); result = new constructor();
    ok(!!constructor, 'String is a constructor');
    ok(result instanceof String, 'String was created by string');
    constructor = _.resolveConstructor(String); result = new constructor();
    ok(!!constructor, 'String is a constructor');
    ok(result instanceof String, 'String was created by function');

    constructor = _.resolveConstructor('Array'); result = new constructor();
    ok(!!constructor, 'Array is a constructor');
    ok(result instanceof Array, 'Array was created by string');
    constructor = _.resolveConstructor(Array); result = new constructor();
    ok(!!constructor, 'Array is a constructor');
    ok(result instanceof Array, 'Array was created by function');

    constructor = _.resolveConstructor('Object'); result = new constructor();
    ok(!!constructor, 'Object is a constructor');
    ok(result instanceof Object, 'Object was created by string');
    constructor = _.resolveConstructor(Object); result = new constructor();
    ok(!!constructor, 'Object is a constructor');
    ok(result instanceof Object, 'Object was created by function');

    SomeObject = {};
    ok(!_.resolveConstructor('SomeObject'), 'SomeObject is not a constructor');
    ok(!_.resolveConstructor(SomeObject), 'SomeObject is not a constructor');
    SomeNamespace.SomeObject = {};
    ok(!_.resolveConstructor('SomeNamespace.SomeObject'), 'SomeNamespace.SomeObject is not a constructor');
    ok(!_.resolveConstructor(SomeNamespace.SomeObject), 'SomeNamespace.SomeObject is not a constructor');

    SomeClass1 = (function() {
      function SomeClass1() {}
      return SomeClass1;
    })();
    ok(_.isConstructor(SomeClass1), 'a constructor');
    ok(!_.isConstructor('SomeClass1'), 'not a constructor name');
    constructor = _.resolveConstructor('SomeClass1'); result = new constructor();
    ok(!!constructor, 'SomeClass1 is a constructor');
    ok(result instanceof SomeClass1, 'SomeClass1 was created by string');
    constructor = _.resolveConstructor(SomeClass1); result = new constructor();
    ok(!!constructor, 'SomeClass1 is a constructor');
    ok(result instanceof SomeClass1, 'SomeClass1 was created by constructor function');

    SomeNamespace.SomeClass2 = (function() {
      function SomeClass2() {}
      return SomeClass2;
    })();
    constructor = _.resolveConstructor('SomeClass2');
    ok(!constructor, 'SomeClass2 cannot be resolved without its namespace');
    constructor = _.resolveConstructor('SomeNamespace.SomeClass2'); result = new constructor();
    ok(!!constructor, 'SomeNamespace.SomeClass2 is a constructor');
    ok(result instanceof SomeNamespace.SomeClass2, 'SomeNamespace.SomeClass2 was created by string');
    constructor = _.resolveConstructor(SomeNamespace.SomeClass2); result = new constructor();
    ok(!!constructor, 'SomeNamespace.SomeClass2 is a constructor');
    ok(result instanceof SomeNamespace.SomeClass2, 'SomeNamespace.SomeClass2 was created by constructor function');
  });

  test("objects: isConvertible", function() {
    root.SomeNamespace || (root.SomeNamespace = {});
    var instance;

    SomeNamespace.SuperClass = (function() {
      function SuperClass() {}
      return SuperClass;
    })();

    SomeSubClass = (function() {
       __extends(SomeSubClass, SomeNamespace.SuperClass);
      function SomeSubClass() {}
      return SomeSubClass;
    })();

    SomeUnrelatedClass1 = (function() {
      function SomeUnrelatedClass1() { this.super_instance = new SomeNamespace.SuperClass(); }
      SomeUnrelatedClass1.prototype.toSuperClass = function() { return this.super_instance; }
      return SomeUnrelatedClass1;
    })();

    instance = new SomeNamespace.SuperClass();
    ok(_.isConvertible(instance, 'SomeNamespace.SuperClass'), 'SomeNamespace.SuperClass can convert to SomeNamespace.SuperClass by string');
    ok(_.isConvertible(instance, SomeNamespace.SuperClass), 'SomeNamespace.SuperClass can convert to SomeNamespace.SuperClass by constructor');
    ok(!_.isConvertible(instance, 'SuperClass'), 'SomeNamespace.SuperClass cannot convert to SuperClass by string');

    instance = new SomeSubClass();
    ok(_.isConvertible(instance, 'SomeNamespace.SuperClass'), 'SomeSubClass can convert to SomeNamespace.SuperClass by string');
    ok(_.isConvertible(instance, SomeNamespace.SuperClass), 'SomeSubClass can convert to SomeNamespace.SuperClass by constructor');
    ok(!_.isConvertible(instance, 'SuperClass'), 'SomeSubClass cannot convert to SuperClass by string');

    instance = new SomeUnrelatedClass1();
    ok(_.isConvertible(instance, 'SomeNamespace.SuperClass'), 'SomeUnrelatedClass1 can convert to SomeNamespace.SuperClass by string');
    ok(_.isConvertible(instance, SomeNamespace.SuperClass), 'SomeUnrelatedClass1 can convert to SomeNamespace.SuperClass by constructor');
    ok(_.isConvertible(instance, 'SuperClass'), 'SomeUnrelatedClass1 can convert to SuperClass by string (because it has a toSuperClass method)');
  });

  test("objects: toType", function() {
    root.SomeNamespace || (root.SomeNamespace = {});
    var instance, result;

    SuperClass = (function() {
      function SuperClass() {}
      return SuperClass;
    })();

    SomeClass1 = (function() {
       __extends(SomeClass1, SuperClass);
      function SomeClass1() {}
      return SomeClass1;
    })();
    instance = new SomeClass1();
    result = _.toType(instance, 'String');
    ok(!!result, 'All classes have a toString conversion by string');
    result = _.toType(instance, String);
    ok(!!result, 'All classes have a toString conversion constructor function');
    result = _.toType(instance, 'SomeClass1');
    ok(result instanceof SomeClass1, 'is a SomeClass1 by string');
    result = _.toType(instance, SomeClass1);
    ok(result instanceof SomeClass1, 'is a SomeClass1 by constructor function');
    result = _.toType(instance, 'SuperClass');
    ok(result instanceof SuperClass, 'is a SuperClass by string');
    result = _.toType(instance, SuperClass);
    ok(result instanceof SuperClass, 'is a SuperClass by constructor function');

    SomeNamespace.SomeClass2 = (function() {
      __extends(SomeClass2, SuperClass);
      function SomeClass2() {}
      return SomeClass2;
    })();

    instance = new SomeNamespace.SomeClass2();
    result = _.toType(instance, 'SomeClass2');
    ok(!result, 'SomeClass1 is not a SomeClass2 by string without the namespace');
    result = _.toType(instance, 'SomeNamespace.SomeClass2');
    ok(result instanceof SomeNamespace.SomeClass2, 'is a SomeNamespace.SomeClass2 by string');
    result = _.toType(instance, SomeNamespace.SomeClass2);
    ok(result instanceof SomeNamespace.SomeClass2, 'is a SomeNamespace.SomeClass2 by constructor function');

    LocalizedString = (function() {
      function LocalizedString(id) { this.id = id; this.string = 'Bonjour'; }
      LocalizedString.prototype.toString = function() { return this.string; }
      return LocalizedString;
    })();
    instance = new LocalizedString();
    result = _.toType(instance, 'Array');
    ok(!result, 'SomeClass1 is not an Array by string');
    result = _.toType(instance, Array);
    ok(!result, 'SomeClass1 is not an Array by constructor function');

    result = _.toType(instance, 'String');
    ok(!(result instanceof LocalizedString), 'is not a LocalizedString by string');
    ok(_.isString(result), 'is a String by string');
    result = _.toType(instance, String);
    ok(!(result instanceof LocalizedString), 'is not a LocalizedString by constructor function');
    ok(_.isString(result), 'is a String by constructor function');
  });

  test('collections: own and disown', function() {
    var original, original_again, copy;

    original = null;
    copy = _.own(original);
    ok(copy==null, 'no instance');
    _.disown(original); _.disown(copy);

    CloneDestroy = (function() {
      CloneDestroy.instance_count = 0;
      function CloneDestroy() { CloneDestroy.instance_count++; }
      CloneDestroy.prototype.clone = function() { return new CloneDestroy() };
      CloneDestroy.prototype.destroy = function() { CloneDestroy.instance_count--; };
      return CloneDestroy;
    })();

    CloneDestroy.instance_count = 0; original = new CloneDestroy();
    ok(CloneDestroy.instance_count==1, 'cd: 1 instance');
    copy = _.own(original);
    ok(CloneDestroy.instance_count==2, 'cd: 2 instances');
    _.disown(original);
    ok(CloneDestroy.instance_count==1, 'cd: 1 instance');
    _.disown(copy);
    ok(CloneDestroy.instance_count==0, 'cd: 0 instances');

    CloneDestroy.instance_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    ok(CloneDestroy.instance_count==3, 'cd: 3 instances');
    original_again = _.own(original, {share_collection:true});
    ok(original_again===original, 'cd: retained existing');
    ok(CloneDestroy.instance_count==6, 'cd: 6 instances');
    copy = _.clone(original_again)
    _.disown(original); _.disown(copy);
    ok(CloneDestroy.instance_count==0, 'cd: 0 instances');

    CloneDestroy.instance_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    ok(CloneDestroy.instance_count==3, 'cd: 3 instances');
    copy = _.own(original);
    ok(copy!==original, 'cd: retained existing');
    ok(CloneDestroy.instance_count==6, 'cd: 6 instances');
    _.disown(original); _.disown(copy);
    ok(CloneDestroy.instance_count==0, 'cd: 0 instances');

    CloneDestroy.instance_count = 0; original = {one:new CloneDestroy(), two:new CloneDestroy(), three:new CloneDestroy()};
    ok(CloneDestroy.instance_count==3, 'cd: 3 instances');
    copy = _.own(original, {properties:true});
    ok(CloneDestroy.instance_count==6, 'cd: 6 instances');
    _.disown(original, {properties:true}); _.disown(copy, {properties:true});
    ok(CloneDestroy.instance_count==0, 'cd: 0 instances');

    CloneDestroy.instance_count = 0; original = [new CloneDestroy(), new CloneDestroy(), new CloneDestroy()];
    _.disown(original, {clear_values:true});
    ok(original.length==3, 'cd: 3 instances');

    RetainRelease = (function() {
      RetainRelease.instance_count = 0;
      function RetainRelease() { this.retain_count=1; RetainRelease.instance_count++ }
      RetainRelease.prototype.retain = function() { this.retain_count++; };
      RetainRelease.prototype.release = function() { this.retain_count--; if (this.retain_count==0) RetainRelease.instance_count--; };
      return RetainRelease;
    })();

    RetainRelease.instance_count = 0; original = new RetainRelease();
    ok(RetainRelease.instance_count==1, 'rr: 1 instance');
    ok(original.retain_count==1, 'rr: 1 retain');
    original_retained = _.own(original);
    ok(RetainRelease.instance_count==1, 'rr: 1 instances');
    ok(original_retained==original, 'rr: same object');
    ok(original.retain_count==2, 'rr: 2 retains');
    _.disown(original); _.disown(original_retained);
    ok(RetainRelease.instance_count==0, 'rr: 0 instances');
    ok(original.retain_count==0, 'rr: 0 retains');

    RetainRelease.instance_count = 0; original = [new RetainRelease(), new RetainRelease(), new RetainRelease()];
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original[0].retain_count==1, 'rr: 1 retain');
    original_retained = _.own(original);
    ok(original_retained!==original, 'rr: different object');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original[0].retain_count==2, 'rr: 2 retains');
    _.disown(original, {clear_values:false});
    ok(original.length===0, 'rr: 0 values');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original_retained[0].retain_count==1, 'rr: 1 retain');
    _.disown(original_retained);
    ok(RetainRelease.instance_count==0, 'rr: 0 instances');

    RetainRelease.instance_count = 0; original = [new RetainRelease(), new RetainRelease(), new RetainRelease()];
    _.disown(original, {clear_values:true});
    ok(original.length===3, 'rr: 3 values');

    RetainRelease.instance_count = 0; original = {one:new RetainRelease(), two:new RetainRelease(), three:new RetainRelease()};
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original.one.retain_count==1, 'rr: 1 retain');
    original_again = _.own(original, {share_collection:true, properties:true});
    ok(original_again===original, 'rr: different object');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    copy = _.clone(original_again);
    _.disown(original, {properties:true, clear_values:false})
    ok(_.size(original)==0, 'rr: 0 key/values');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    _.disown(copy, {properties:true});
    ok(RetainRelease.instance_count==0, 'rr: 0 instances');

    RetainRelease.instance_count = 0; original = {one:new RetainRelease(), two:new RetainRelease(), three:new RetainRelease()};
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original.one.retain_count==1, 'rr: 1 retain');
    original_retained = _.own(original, {share_collection:false, properties:true});
    ok(original_retained!==original, 'rr: same object');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    _.disown(original, {properties:true, clear_values:true})
    ok(_.size(original)==3, 'rr: 3 key/values');
    ok(RetainRelease.instance_count==3, 'rr: 3 instances');
    ok(original_retained.one.retain_count==1, 'rr: 1 retain');
    _.disown(original_retained, {properties:true});
    ok(RetainRelease.instance_count==0, 'rr: 0 instances');

    RetainRelease.instance_count = 0; original = {one:new RetainRelease(), two:new RetainRelease(), three:new RetainRelease()};
    _.disown(original, {properties:true, clear_values:true});
    ok(_.size(original)==3, 'rr: 3 instances');

    RetainReleaseWithClone = (function() {
      RetainReleaseWithClone.instance_count = 0;
      function RetainReleaseWithClone() { this.retain_count=1; RetainReleaseWithClone.instance_count++; }
      RetainReleaseWithClone.prototype.clone = function() { return new RetainReleaseWithClone(); };
      RetainReleaseWithClone.prototype.retain = function() { this.retain_count++; };
      RetainReleaseWithClone.prototype.release = function() { this.retain_count--; if (this.retain_count==0) RetainReleaseWithClone.instance_count--; };
      return RetainReleaseWithClone;
    })();

    RetainReleaseWithClone.instance_count = 0; original = new RetainReleaseWithClone();
    ok(RetainReleaseWithClone.instance_count==1, 'rr: 1 instance');
    ok(original.retain_count==1, 'rrc: 1 retain');
    copy = _.own(original, {prefer_clone:true});   // a clone exists in addition to retain so use it instead of retain
    ok(RetainReleaseWithClone.instance_count==2, 'rrc: 2 instances');
    ok(copy!=original, 'rrc: diferent objects');
    ok(original.retain_count==1, 'rrc: 1 retains');
    ok(copy.retain_count==1, 'rrc: 1 retains');
    _.disown(original); _.disown(copy);
    ok(RetainReleaseWithClone.instance_count==0, 'rrc: 0 instances');
    ok(original.retain_count==0, 'rrc: 0 retains');
    ok(copy.retain_count==0, 'rrc: 0 retains');

    // prefering retain is default, expect same result as RetainRelease
    RetainReleaseWithClone.instance_count = 0; original = new RetainReleaseWithClone();
    ok(RetainReleaseWithClone.instance_count==1, 'rrc: 1 instance');
    ok(original.retain_count==1, 'rrc: 1 retain');
    original_retained = _.own(original);
    ok(RetainReleaseWithClone.instance_count==1, 'rrc: 1 instances');
    ok(original_retained==original, 'rrc: same object');
    ok(original.retain_count==2, 'rrc: 2 retains');
    _.disown(original); _.disown(original_retained);
    ok(RetainReleaseWithClone.instance_count==0, 'rrc: 0 instances');
    ok(original.retain_count==0, 'rrc: 0 retains');
  });

  // JSON Functions
  // -----------------

  Date.prototype.toJSON = function() {
    return {
      _type:'Date',
      year:this.getUTCFullYear(),
      month:this.getUTCMonth(),
      day:this.getUTCDate(),
      hours:this.getUTCHours(),
      minutes:this.getUTCMinutes(),
      seconds:this.getUTCSeconds()
    };
  };
  Date.prototype.isEqual = function(that) {
    var this_date_components = this.toJSON();
    var that_date_components = (that instanceof Date) ? that.toJSON() : that;
    delete this_date_components['_type']; delete that_date_components['_type']
    return _.isEqual(this_date_components, that_date_components);
  };

  Date.parseJSON = function(json) {
    if (json._type!='Date') return null;
    return new Date(Date.UTC(json.year, json.month, json.day, json.hours, json.minutes, json.seconds));
  };

  root.SomeNamespace || (root.SomeNamespace = {});
  SomeNamespace.SomeClass = (function() {
    function SomeClass(int_value, string_value, date_value) {
      this.int_value = int_value;
      this.string_value = string_value;
      this.date_value = date_value;
    }
    SomeClass.prototype.toJSON = function() {
      return {
        _type:'SomeNamespace.SomeClass',
        int_value:this.int_value,
        string_value:this.string_value,
        date_value:this.date_value
      };
    };
    SomeClass.parseJSON = function(json) {
      if (json._type!='SomeNamespace.SomeClass') return null;
      return new SomeClass(json.int_value, json.string_value, Date.parseJSON(json.date_value));
    };
    return SomeClass;
  })();

  CouchClass = (function() {
    function CouchClass(key, value) { this.key = key; this.value = value; }
    CouchClass.prototype.toJSON = function() {
      return { type:'couch_class', key:this.key, value:this.value };
    };
    CouchClass.parseJSON = function(json) {
      if (json.type!='couch_class') return null;
      return new CouchClass(json.key, json.value);
    };
    return CouchClass;
  })();

  test("extensions: toJSON", function() {
    var int_value = 123456, string_value = 'Hello', date_value = new Date(), result;
    var object = {
      _type:'SomeNamespace.SomeClass',
      int_value:int_value,
      string_value:string_value,
      date_value: {
        _type:'Date',
        year:date_value.getUTCFullYear(),
        month:date_value.getUTCMonth(),
        day:date_value.getUTCDate(),
        hours:date_value.getUTCHours(),
        minutes:date_value.getUTCMinutes(),
        seconds:date_value.getUTCSeconds()
      }
    };

    result = _.toJSON(date_value);
    ok(result._type==='Date', 'Date serialized');
    ok(_.isEqual(result, date_value), 'date matches');

    var some_class = new SomeNamespace.SomeClass(int_value, string_value, date_value);
    result = _.toJSON(some_class);
    ok(_.isEqual(result,object), 'serialized object isEqual');

    var array = [some_class, some_class, some_class];
    result = _.toJSON(array);
    ok(result.length===3, 'serialized array length');
    ok(_.isEqual(result[0],object), 'serialized object 1 isEqual');
    ok(_.isEqual(result[1],object), 'serialized object 2 isEqual');
    ok(_.isEqual(result[2],object), 'serialized object 3 isEqual');

    result = _.toJSON(array, {excluded: [some_class]});
    ok(result.length===0, 'everything excluded');
    result = _.toJSON(array, {excluded: [null]});
    ok(result.length===3, 'nothing excluded');

    result = _.toJSON(object, {properties: true, excluded: ['int_value', 'date_value']});
    ok(_.size(result)===2, 'two excluded');
    ok(!result.hasOwnProperty('int_value'), 'int_value excluded');
    ok(!result.hasOwnProperty('date_value'), 'date_value excluded');

    result = _.toJSON(object, {properties: true, included: ['int_value', 'date_value']});
    ok(_.size(result)===2, 'two included');
    ok(result.hasOwnProperty('int_value'), 'int_value included');
    ok(result.hasOwnProperty('date_value'), 'date_value included');

    result = _.toJSON(object, {properties: true, included: ['int_value', 'date_value'], excluded: ['date_value', 'bob']});
    ok(_.size(result)===1, 'two included but one excluded == 1');
    ok(result.hasOwnProperty('int_value'), 'int_value included');
    ok(!result.hasOwnProperty('date_value'), 'date_value excluded');
  });

  test("extensions: parseJSON", function() {
    var int_value = 123456, string_value = 'Hello', date_value = new Date(), result;
    var object = {
      _type:'SomeNamespace.SomeClass',
      int_value:int_value,
      string_value:string_value,
      date_value: {
        _type:'Date',
        year:date_value.getUTCFullYear(),
        month:date_value.getUTCMonth(),
        day:date_value.getUTCDate(),
        hours:date_value.getUTCHours(),
        minutes:date_value.getUTCMinutes(),
        seconds:date_value.getUTCSeconds()
      }
    };

    var result = _.parseJSON(object.date_value);
    ok(result instanceof Date, 'Date deserialized');
    ok(result.isEqual(date_value), 'date matches');

    result = _.parseJSON(object);
    ok(result instanceof SomeNamespace.SomeClass, 'deserialized is SomeNamespace.SomeClass');
    ok(result.int_value===int_value, 'int_value deserialized');
    ok(result.string_value===string_value, 'string_value deserialized');
    ok(result.date_value instanceof Date, 'date_value deserialized');
    ok(result.date_value.isEqual(date_value), 'date matches');

    var array = [object, object, object];
    result = _.parseJSON(array);
    ok(result.length===3, 'serialized array length');
    ok(result[0] instanceof SomeNamespace.SomeClass, 'serialized object 1 correct type');
    ok(result[0].date_value instanceof Date, 'serialized object date 1 correct type');
    ok(result[1] instanceof SomeNamespace.SomeClass, 'serialized object 2 correct type');
    ok(result[1].date_value instanceof Date, 'serialized object date 2 correct type');
    ok(result[2] instanceof SomeNamespace.SomeClass, 'serialized object 3 correct type');
    ok(result[2].date_value instanceof Date, 'serialized object date 3 correct type');

    var embedded_objects = {
      date_value1: {
        _type:'Date',
        year:date_value.getUTCFullYear(),
        month:date_value.getUTCMonth(),
        day:date_value.getUTCDate(),
        hours:date_value.getUTCHours(),
        minutes:date_value.getUTCMinutes(),
        seconds:date_value.getUTCSeconds()
      },
      date_value2: {
        _type:'Date',
        year:date_value.getUTCFullYear(),
        month:date_value.getUTCMonth(),
        day:date_value.getUTCDate(),
        hours:date_value.getUTCHours(),
        minutes:date_value.getUTCMinutes(),
        seconds:date_value.getUTCSeconds()
      },
      date_value3: {
        _type:'Date',
        year:date_value.getUTCFullYear(),
        month:date_value.getUTCMonth(),
        day:date_value.getUTCDate(),
        hours:date_value.getUTCHours(),
        minutes:date_value.getUTCMinutes(),
        seconds:date_value.getUTCSeconds()
      },
    };
    result = _.parseJSON(embedded_objects, {properties: true});
    ok(_.size(result)===3, 'serialized property count');
    ok(result.date_value1 instanceof Date, 'serialized object date 1 correct type');
    ok(result.date_value2 instanceof Date, 'serialized object date 2 correct type');
    ok(result.date_value3 instanceof Date, 'serialized object date 3 correct type');

    root.couch_class = CouchClass;  // register the constructor on root
    var previous_json_field = _.PARSE_JSON_TYPE_FIELD;
    _.PARSE_JSON_TYPE_FIELD = 'type';
    var couch_class_instance_json = { type:'couch_class', key: 42, value: 'meaning'};
    var couch_class_instance = _.parseJSON(couch_class_instance_json);
    ok(couch_class_instance instanceof CouchClass, 'deserialized with type instead of _type identifier');

    // get rid of the constructor from global namespace and put in local 'Constructors' namespace
    // (like if you were using CommonJS and don't want to pollute global namespace)
    root.Constructors || (root.Constructors = {}); _.PARSE_JSON_CONSTRUCTOR_ROOTS.unshift(root.Constructors);
    root.Constructors.couch_class = CouchClass;
    delete root['couch_class'];

    couch_class_instance = _.parseJSON(couch_class_instance_json);
    ok(couch_class_instance instanceof CouchClass, 'deserialized with type instead of _type identifier using root.Constructors instead of global namespace');

    // cleanup
    _.PARSE_JSON_TYPE_FIELD = previous_json_field;
    _.PARSE_JSON_CONSTRUCTOR_ROOTS.shift();
  });
});
