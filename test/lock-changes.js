'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Nested', function() {
	lab.experiment('Modifications of the locked object', function() {
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

		locked.a      = 'changed';
		locked.c      = 'changed';
		locked.sub.sb = 'changed';

		//  without any modifications, all submerged object should contain the same values
		lab.test('Normal - unaffected', function(done) {
			Code.expect(normal.a).to.equal(1);
			Code.expect(normal.b).to.equal(2);
			Code.expect(normal.c).to.equal('c');
			Code.expect(normal.d).to.equal('d');
			Code.expect(normal.sub.sa).to.equal('a');
			Code.expect(normal.sub.sb).to.equal(2);
			Code.expect(normal.sub.sc).to.equal(3);
			Code.expect(normal.sub.sd).to.equal(4);

			done();
		});

		lab.test('Locked - unaffected', function(done) {
			Code.expect(locked.a).to.equal(1);
			Code.expect(locked.b).to.equal(2);
			Code.expect(locked.c).to.equal('c');
			Code.expect(locked.d).to.equal('d');
			Code.expect(locked.sub.sa).to.equal('a');
			Code.expect(locked.sub.sb).to.equal(2);
			Code.expect(locked.sub.sc).to.equal(3);
			Code.expect(locked.sub.sd).to.equal(4);

			done();
		});

		lab.test('Live - unaffected', function(done) {
			Code.expect(live.a).to.equal(1);
			Code.expect(live.b).to.equal(2);
			Code.expect(live.c).to.equal('c');
			Code.expect(live.d).to.equal('d');
			Code.expect(live.sub.sa).to.equal('a');
			Code.expect(live.sub.sb).to.equal(2);
			Code.expect(live.sub.sc).to.equal(3);
			Code.expect(live.sub.sd).to.equal(4);

			done();
		});

		lab.test('Source objects - unaffected', function(done) {
			Code.expect(first.a).to.equal(1);
			Code.expect(first.b).to.equal(2);
			Code.expect(first.c).to.equal(undefined);
			Code.expect(first.d).to.equal(undefined);
			Code.expect(first.sub.sa).to.equal(undefined);
			Code.expect(first.sub.sb).to.equal(2);
			Code.expect(first.sub.sc).to.equal(3);
			Code.expect(first.sub.sd).to.equal(4);

			Code.expect(second.a).to.equal('a');
			Code.expect(second.b).to.equal(undefined);
			Code.expect(second.c).to.equal('c');
			Code.expect(second.d).to.equal('d');
			Code.expect(second.sub.sa).to.equal('a');
			Code.expect(second.sub.sb).to.equal('b');
			Code.expect(second.sub.sc).to.equal(undefined);
			Code.expect(second.sub.sd).to.equal('d');

			done();
		});
	});
});
