'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Live behaviour', function() {

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
			live = submerge.live(first, second);

		Code.expect(live.a).to.equal(1);
		Code.expect(live.b).to.equal(2);
		Code.expect(live.c).to.equal('c');
		Code.expect(live.d).to.equal(4);
		Code.expect(live.e).to.equal('e');

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
			live = submerge.live(first, second);

		Code.expect(first.a).to.equal(1);
		Code.expect(live.a).to.equal(1);
		Code.expect(second.c).to.equal('c');
		Code.expect(live.c).to.equal('c');

		first.a  = 'a';
		second.c = 3;

		Code.expect(live.a).to.equal('a');
		Code.expect(first.a).to.equal('a');
		Code.expect(live.c).to.equal(3);
		Code.expect(second.c).to.equal(3);

		done();
	});

	lab.test('Modification persists changes into source objects', function(done) {
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
			live = submerge.live(first, second);

		Code.expect(live.a).to.equal(1);
		Code.expect(live.c).to.equal('c');

		live.a = 'a';
		live.c = 3;

		Code.expect(live.a).to.equal('a');
		Code.expect(live.c).to.equal(3);

		Code.expect(first.a).to.equal('a');
		Code.expect(second.c).to.equal(3);

		done();
	});
});
