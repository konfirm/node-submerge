'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Default behaviour', function() {

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
			normal = submerge(first, second);

		Code.expect(normal.a).to.equal(1);
		Code.expect(normal.b).to.equal(2);
		Code.expect(normal.c).to.equal('c');
		Code.expect(normal.d).to.equal(4);
		Code.expect(normal.e).to.equal('e');

		done();
	});

	lab.test('Changes to source object are not persisted into the submerged object', function(done) {
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
			normal = submerge(first, second);

		Code.expect(first.a).to.equal(1);
		Code.expect(normal.a).to.equal(1);
		Code.expect(second.c).to.equal('c');
		Code.expect(normal.c).to.equal('c');

		first.a  = 'a';
		second.c = 3;

		Code.expect(normal.a).to.equal(1);
		Code.expect(first.a).to.equal('a');
		Code.expect(normal.c).to.equal('c');
		Code.expect(second.c).to.equal(3);

		done();
	});

	lab.test('Allowed to modify, source objects unaffected', function(done) {
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
			normal = submerge(first, second);

		Code.expect(normal.a).to.equal(1);
		Code.expect(normal.c).to.equal('c');

		normal.a = 'a';
		normal.c = 3;

		Code.expect(normal.a).to.equal('a');
		Code.expect(normal.c).to.equal(3);

		Code.expect(first.a).to.equal(1);
		Code.expect(second.c).to.equal('c');

		done();
	});

});
