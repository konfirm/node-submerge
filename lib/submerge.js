'use strict';

function SubMerge() {
	var submerge = this,
		EventEmitter = require('events').EventEmitter;

	function isObject(o) {
		return typeof o === 'object' && !(o instanceof Array);
	}

	function isTrue(options, key) {
		return key in options && options[key];
	}

	function castArray(list) {
		return Array.prototype.slice.call(list);
	}

	function combine(options, list) {
		var result = {};

		if (isTrue(options, 'live') && !isTrue(options, 'locked') && !('emitter' in options)) {
			options.emitter = new EventEmitter();

			['on', 'once', 'off'].forEach(function(key) {
				Object.defineProperty(result, key, {
					enumerable: false,
					get: function() {
						return function() {
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

		list.forEach(function(object) {
			Object.keys(object).forEach(function(key) {
				inherit(options, result, object, key);
			});
		});

		return result;
	}

	function inherit(options, destination, source, key) {
		var define, override, path;

		if (key in destination) {
			if (isObject(destination[key]) && isObject(source[key])) {
				//  live up to the name and merge the sub objects
				Object.keys(source[key]).forEach(function(k) {
					inherit(options, destination[key], source[key], k);
				});
			}

			return;
		}

		options.path.push(key);
		define = {enumerable: true};

		if (isObject(source[key])) {
			override = combine(options, [source[key]]);
		}

		if (isTrue(options, 'live')) {
			path = options.path.join('.');

			define.get = function() {
				return override || source[key];
			};

			define.set = function(value) {
				var tmp;

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

	submerge.exports = function() {
		var result = function() {
				return combine({}, castArray(arguments));
			};

		result.live = function() {
			return combine({live:true}, castArray(arguments));
		};

		result.locked = function() {
			return combine({live:true, locked:true}, castArray(arguments));
		};

		return result;
	};
}

module.exports = new SubMerge().exports();
