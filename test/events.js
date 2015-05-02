'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Events', function() {
	var first = {
			a: 1,
			b: 2,
			// nope, no c
			sub: {
				//  nope, no sa
				sb: 2,
				sc: 3,
				sd: 4
			}
		},
		second = {
			a: 'a',
			//  nope, no b
			c: 'c',
			d: 'd',
			sub: {
				sa: 'a',
				sb: 'b',
				//  nope, no sc
				sd: 'd'
			}
		},
		normal = submerge(first, second),
		locked = submerge.locked(first, second),
		live = submerge.live(first, second);

	lab.test('Only live submerges have on, once and off', function(done) {
		Code.expect(normal.on).to.equal(undefined);
		Code.expect(normal.once).to.equal(undefined);
		Code.expect(normal.off).to.equal(undefined);

		Code.expect(locked.on).to.equal(undefined);
		Code.expect(locked.once).to.equal(undefined);
		Code.expect(locked.off).to.equal(undefined);

		Code.expect(live.on).to.be.function();
		Code.expect(live.once).to.be.function();
		Code.expect(live.off).to.be.function();

		done();
	});

	lab.test('Changes to a live submerge trigger events', function(done) {
		var result = {all:0, remove: 0, once:0};

		function all(key, newValue, oldValue) {
			++result.all;
		}

		function remove(key, newValue, oldValue) {
			++result.remove;
		}

		function once(key, newValue, oldValue) {
			++result.once;
		}

		live.on('change', all);
		live.on('change', remove);
		live.once('change', once);

		//  after this: no more once's: result.once be 1
		live.a = 'change';

		live.b = 'change';

		//  after this: no more remove's: result.remove be 2
		live.off('change', remove);
		live.c = 'change';

		//  after this: no more anything: result.all be 3
		live.off('change');
		live.d = 'change';

		setTimeout(function() {
			Code.expect(result.once).to.equal(1);
			Code.expect(result.remove).to.equal(2);
			Code.expect(result.all).to.equal(3);

			Code.expect(live.a).to.equal('change');
			Code.expect(live.b).to.equal('change');
			Code.expect(live.c).to.equal('change');
			Code.expect(live.d).to.equal('change');

			done();
		}, 50);
	});

	lab.test('Deep merge', function(done) {
		var first  = {a:{b:{c:{d:{e:true}}}}},
			second = {b:{c:{d:{e:{f:false}}}}},
			third  = {a:{c:{d:{c:true}}}},
			fourth = {b:{b:{b:false}}},
			live = submerge.live(first, second, third, fourth),
			result = [];

		live.a.b.c.d = {e:true, f:false};
		Code.expect(live.a.b.c.d.e).to.equal(true);
		Code.expect(live.a.b.c.d.f).to.equal(false);

		live.on('change', function(key, newValue, oldValue) {
			result.push({key: key, value: newValue});
		});

		live.a.b.c.d.e = false;
		Code.expect(live.a.b.c.d.e).to.equal(false);
		Code.expect(result.length).to.equal(1);
		Code.expect(result[0].key).to.equal('a.b.c.d.e');
		Code.expect(result[0].value).to.equal(false);

		done();
	});
});
