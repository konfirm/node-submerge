'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Array behaviour', function() {
	lab.test('Arrays do not merge', function(done) {
		var first = {
				a: [1, 2, 3],
				b: [4, 5, 6]
				//  no c
			},
			second = {
				a: [1, 2, 4],
				//  no b
				c: [7, 8, 9]
			},
			merge = submerge(first, second);

		Code.expect(merge.a).to.equal([1, 2, 3]);
		Code.expect(merge.b).to.equal([4, 5, 6]);
		Code.expect(merge.c).to.equal([7, 8, 9]);

		done();
	});

	lab.experiment('methods trigger change emission', function() {
		lab.test('copyWithin', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([4, 5, 3, 4, 5]);

				done();
			});

			live.a.copyWithin(0, 3);
		});

		lab.test('fill', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([1, 3, 3, 3, 3]);

				done();
			});

			live.a.fill(3, 1);
		});

		lab.test('pop', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([1, 2, 3, 4]);

				done();
			});

			live.a.pop();
		});

		lab.test('push', function(done) {
			var first = {
					a: [1, 2, 3]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([1, 2, 3, 7]);

				done();
			});

			live.a.push(7);
		});

		lab.test('reverse', function(done) {
			var first = {
					a: [1, 2, 3]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([3, 2, 1]);

				done();
			});

			live.a.reverse();
		});

		lab.test('shift', function(done) {
			var first = {
					a: [1, 2, 3]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([2, 3]);

				done();
			});

			live.a.shift();
		});

		lab.test('sort', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([1, 3, 5, 2, 4]);

				done();
			});

			live.a.sort(function(a, b) {
				var na = +(a % 2 === 0),
					nb = +(b % 2 === 0);

				return na < nb ? -1 : +(na > nb);
			});
		});

		lab.test('splice', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([1, 7, 8, 5]);

				done();
			});

			live.a.splice(1, 3, 7, 8);
		});

		lab.test('unshift', function(done) {
			var first = {
					a: [1, 2, 3, 4, 5]
				},
				live = submerge.live(first);

			live.on('change', function(key, value) {
				Code.expect(key).to.equal('a');
				Code.expect(value).to.equal(live[key]);
				Code.expect(value).to.equal([7, 1, 2, 3, 4, 5]);

				done();
			});

			live.a.unshift(7);
		});

	});
});
