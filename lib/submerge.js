'use strict';

/**
 *  Recursively merge various objects into a single new object
 *  @package    submerge
 *  @copyright  Konfirm ⓒ 2015-2016
 *  @author     Rogier Spieker (rogier+npm@konfirm.eu)
 *  @license    GPLv2
 */
function SubMerge() {
	var submerge = this,
		EventEmitter = require('events').EventEmitter;

	/**
	 *  Determine if given value is an object (and not an array)
	 *  @name    isObject
	 *  @access  internal
	 *  @param   mixed  variable
	 *  @return  bool   object
	 */
	function isObject(o) {
		return Object(o) === o && !(o instanceof Array);
	}

	/**
	 *  Deterine if given key exists in the object and is `true`-ish
	 *  @name    isTrue
	 *  @access  internal
	 *  @param   object  collection
	 *  @param   string  key
	 *  @return  bool    exists and true-ish
	 */
	function isTrue(collection, key) {
		return key in collection && collection[key];
	}

	/**
	 *  Wrap all modifying array methods, so change-emisions can be triggered
	 *  @name    monitorArray
	 *  @access  internal
	 *  @param   Array     a
	 *  @param   function  emitter
	 *  @return  Array     a
	 */
	function monitorArray(a, emit) {
		['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']
			.forEach(function (key) {
				var original = a[key];

				a[key] = function () {
					var result = original.apply(a, arguments);

					emit();

					return result;
				};
			});

		return a;
	}

	/**
	 *  Inherit the value at key of one object from a single other object
	 *  @name    inherit
	 *  @access  internal
	 *  @param   object options {live:bool, locked:bool}
	 *  @param   object destination
	 *  @param   object source
	 *  @param   string key
	 *  @return  void
	 */
	function inherit(options, destination, source, key) {
		var define, override, path;

		if (key in destination) {
			if (isObject(destination[key]) && isObject(source[key])) {
				//  live up to the name and merge the sub objects
				Object.keys(source[key]).forEach(function (k) {
					inherit(options, destination[key], source[key], k);
				});
			}

			return;
		}

		options.path.push(key);
		define = { enumerable: true };

		if (isObject(source[key])) {
			override = combine(options, [source[key]]);
		}
		else if (source[key] instanceof Array) {
			override = monitorArray(source[key], function () {
				options.emitter.emit('change', path, source[key], source[key]);
			});
		}

		if (isTrue(options, 'live')) {
			path = options.path.join('.');

			define.get = function () {
				return override || source[key];
			};

			define.set = function (value) {
				if (isTrue(options, 'locked') || value === destination[key]) {
					return;
				}

				if (isObject(value)) {
					options.path = path.split('.');
					value = combine(options, [value, source[key]]);
				}

				override = null;
				options.emitter.emit('change', path, value, source[key]);
				source[key] = value;
			};
		}
		else {
			define.value = override || source[key];
			define.writable = !isTrue(options, 'locked');
		}

		Object.defineProperty(destination, key, define);

		options.path.pop();
	}

	/**
	 *  Combine the objects in a list into a new object (first come, first server)
	 *  @name    combine
	 *  @access  internal
	 *  @param   object options {live:bool, locked:bool}
	 *  @param   array  objects
	 *  @return  object combined
	 */
	function combine(options, list) {
		var result = Object.create(null);

		if (isTrue(options, 'live') && !isTrue(options, 'locked') && !('emitter' in options)) {
			options.emitter = new EventEmitter();

			['on', 'once', 'off'].forEach(function (key) {
				Object.defineProperty(result, key, {
					enumerable: false,
					get: function () {
						return function () {
							var emitter = options.emitter,
								call = key !== 'off' ? key : (arguments.length > 1 ? 'removeListener' : 'removeAllListeners');

							return emitter[call].apply(emitter, arguments);
						};
					}
				});
			});
		}

		if (!('path' in options)) {
			options.path = [];
		}

		list
			.filter(function (object) {
				return isObject(object);
			})
			.forEach(function (object) {
				Object.keys(object).forEach(function (key) {
					inherit(options, result, object, key);
				});
			});

		return result;
	}

	/**
	 *  Cast given Array(-like) structure into a true (or new) array
	 *  @name    castArray
	 *  @access  internal
	 *  @param   array(-ish) list
	 *  @return  array
	 */
	function castArray(list) {
		return Array.from(list);
	}

	/**
	 *  Create the exported functions
	 *  @name    exports
	 *  @access  public
	 *  @return  function
	 */
	submerge.exports = function () {
		var result = function () {
			return combine({}, castArray(arguments));
		};

		result.live = function () {
			return combine({ live: true }, castArray(arguments));
		};

		result.locked = function () {
			return combine({ live: true, locked: true }, castArray(arguments));
		};

		return result;
	};
}

module.exports = new SubMerge().exports();
