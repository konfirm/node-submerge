'use strict';

var Code = require('code'),
	Lab = require('lab'),
	util = require('util'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Locked behaviour', function() {

	lab.test('All expected properties', function(done) {
		var first = {
				a: 1,
				b: 2,
				// nope, no c
				d: 4
			},
			second = {
				a: 'a',
				//  nope, no b
				c: 'c',
				d: 'd',
				e: 'e'
			},
			locked = submerge.locked(first, second);

		Code.expect(locked.a).to.equal(1);
		Code.expect(locked.b).to.equal(2);
		Code.expect(locked.c).to.equal('c');
		Code.expect(locked.d).to.equal(4);
		Code.expect(locked.e).to.equal('e');

		done();
	});

	lab.test('Changes to source object are to be persisted into the submerged object', function(done) {
		var first = {
				a: 1,
				b: 2,
				// nope, no c
				d: 4
			},
			second = {
				a: 'a',
				//  nope, no b
				c: 'c',
				d: 'd',
				e: 'e'
			},
			locked = submerge.locked(first, second);

		Code.expect(first.a).to.equal(1);
		Code.expect(locked.a).to.equal(1);
		Code.expect(second.c).to.equal('c');
		Code.expect(locked.c).to.equal('c');

		first.a  = 'a';
		second.c = 3;

		Code.expect(locked.a).to.equal('a');
		Code.expect(first.a).to.equal('a');
		Code.expect(locked.c).to.equal(3);
		Code.expect(second.c).to.equal(3);

		done();
	});

	lab.test('Modification truncates result, source objects unaffected', function(done) {
		var first = {
				a: 1,
				b: 2,
				// nope, no c
				d: 4
			},
			second = {
				a: 'a',
				//  nope, no b
				c: 'c',
				d: 'd',
				e: 'e'
			},
			locked = submerge.locked(first, second);

		Code.expect(locked.a).to.equal(1);
		Code.expect(locked.c).to.equal('c');

		locked.a = 'a';
		locked.c = 3;

		Code.expect(locked.a).to.equal(1);
		Code.expect(locked.c).to.equal('c');

		Code.expect(first.a).to.equal(1);
		Code.expect(second.c).to.equal('c');

		done();
	});

});
