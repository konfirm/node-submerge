'use strict';

function isObject(o) {
	return typeof o === 'object' && !(o instanceof Array);
}

function isTrue(options, key) {
	return key in options && options[key];
}

function submerge() {
	var arg = Array.prototype.slice.call(arguments),
		options = arg.shift(),
		result = {};

	arg.forEach(function(object) {
		Object.keys(object).forEach(function(key) {
			inherit(options, result, object, key);
		});
	});

	return result;
}

function inherit(options, destination, source, key) {
	var define, override;

	if (!(key in destination)) {
		define = {enumerable: true};

		if (isObject(source[key])) {
			override = submerge(options, source[key]);
		}

		if (isTrue(options, 'live')) {
			define.get = function() {
				return override || source[key];
			};

			define.set = function(value) {
				if (isTrue(options, 'locked')) {
					return;
				}

				if (isObject(value)) {
					value = submerge(options, value);
				}

				override = null;
				source[key] = value;
			};
		}
		else {
			define.value = override || source[key];
			define.writable = !isTrue(options, 'locked');
		}

		Object.defineProperty(destination, key, define);
	}
	else if (isObject(destination[key]) && isObject(source[key])) {
		//  live up to the name and merge the sub objects
		Object.keys(source[key]).forEach(function(k) {
			inherit(options, destination[key], source[key], k);
		});
	}
}

module.exports = function() {
	return submerge.apply(null, [{}].concat(Array.prototype.slice.call(arguments)));
};

module.exports.live = function() {
	return submerge.apply(null, [{live: true}].concat(Array.prototype.slice.call(arguments)));
};

module.exports.locked = function() {
	return submerge.apply(null, [{live: true, locked: true}].concat(Array.prototype.slice.call(arguments)));
};
