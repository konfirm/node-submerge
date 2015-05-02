'use strict';
var submerge = require('./lib/submerge'),
	a = {a:1},
	b = {b:2},
	c = {c:3, sub: {
		a: 2,
		b: 3
	}},
	d = {d: 4, sub: {
		b: 4,
		c: 5
	}},
	merger = submerge(a, b, c, d),
	locked = submerge.locked(a, b, c, d),
	live = submerge.live(a, b, c, d);

console.log('--=[merger]=--');
console.log(merger);
merger.a = 7;
merger.sub.a = 7;
merger.sub.c = 7;
console.log(merger, a, b, c, d);


console.log('--=[locked]=--');
console.log(locked);
locked.a = 7;
locked.sub.a = 7;
locked.sub.c = 7;
console.log(locked, a, b, c, d);


console.log('--=[live]=--');
console.log(live);
live.a = 7;
live.sub.a = 7;
live.sub.c = 7;
console.log(live, a, b, c, d);
