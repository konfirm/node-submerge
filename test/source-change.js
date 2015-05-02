'use strict';

var Code = require('code'),
	Lab = require('lab'),
	submerge = require('../lib/submerge'),
	lab = exports.lab = Lab.script();

lab.experiment('Nested', function() {
	lab.experiment('Modifications to source objects', function() {
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
					sd: 'c'
				}
			},
			normal = submerge(first, second),
			locked = submerge.locked(first, second),
			live = submerge.live(first, second);

		first.a      = 'changed';
		second.c     = 'changed';
		first.sub.sb = 'changed';

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

		lab.test('Locked - reflects changes', function(done) {
			Code.expect(locked.a).to.equal('changed');
			Code.expect(locked.b).to.equal(2);
			Code.expect(locked.c).to.equal('changed');
			Code.expect(locked.d).to.equal('d');
			Code.expect(locked.sub.sa).to.equal('a');
			Code.expect(locked.sub.sb).to.equal('changed');
			Code.expect(locked.sub.sc).to.equal(3);
			Code.expect(locked.sub.sd).to.equal(4);

			done();
		});

		lab.test('Live - reflects changes', function(done) {
			Code.expect(live.a).to.equal('changed');
			Code.expect(live.b).to.equal(2);
			Code.expect(live.c).to.equal('changed');
			Code.expect(live.d).to.equal('d');
			Code.expect(live.sub.sa).to.equal('a');
			Code.expect(live.sub.sb).to.equal('changed');
			Code.expect(live.sub.sc).to.equal(3);
			Code.expect(live.sub.sd).to.equal(4);

			done();
		});
	});
});
