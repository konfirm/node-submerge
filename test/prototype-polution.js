'use strict';

var Code = require('code'),
    Lab = require('lab'),
    submerge = require('../lib/submerge'),
    lab = exports.lab = Lab.script();

lab.experiment('Check for prototype pollution', function () {
    lab.test('should not pollute using the reported example', function (done) {
        let obj = {};
        let payload = JSON.parse('{"__proto__":{"polluted":"Yes! Its Polluted"}}');

        Code.expect('polluted' in {}).to.be.false();

        let merged = submerge(obj, payload);

        Code.expect('polluted' in merged).to.be.false();
        Code.expect('polluted' in {}).to.be.false();// up to v1.1.3 this would be true

        Code.expect('__proto__' in merged).to.be.true();
        Code.expect('polluted' in merged.__proto__).to.be.true();

        done();
    });

    lab.test('should not pollute using the reported example', function (done) {
        let obj = {};
        let payload = JSON.parse('{"deeper":{"nested":{"__proto__":{"deepPollution":"Yes! Its Polluted"}}}}');

        Code.expect('deepPollution' in {}).to.be.false();

        let merged = submerge(obj, payload);

        Code.expect('deepPollution' in merged).to.be.false();
        Code.expect('deepPollution' in {}).to.be.false();// up to v1.1.3 this would be true

        Code.expect('__proto__' in merged.deeper.nested).to.be.true();
        Code.expect('deepPollution' in merged.deeper.nested.__proto__).to.be.true();

        done();
    });
});