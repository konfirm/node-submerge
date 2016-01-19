[![npm version](https://badge.fury.io/js/submerge.svg)](http://badge.fury.io/js/submerge)
[![Build Status](https://travis-ci.org/konfirm/node-submerge.svg?branch=master)](https://travis-ci.org/konfirm/node-submerge)
[![Coverage Status](https://coveralls.io/repos/konfirm/node-submerge/badge.svg?branch=master)](https://coveralls.io/r/konfirm/node-submerge?branch=master)
[![dependencies](https://david-dm.org/konfirm/node-submerge.svg)](https://david-dm.org/konfirm/node-submerge#info=dependencies)
[![dev-dependencies](https://david-dm.org/konfirm/node-submerge/dev-status.svg)](https://david-dm.org/konfirm/node-submerge#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/f57067be710047c9baf8a74037cf247b)](https://www.codacy.com/app/rogier/node-submerge)

# node-submerge
Recursively merge various objects into a single new object, optionally capable of reflecting changes on the merged object

## Install
```
npm install --save submerge
```

As of version 1.1.0 `Submerge` (mostly its dependencies) requires NodeJS 4 or higher. If you are 'stuck' on NodeJS 0.10 - 0.12, you will need to specify the version (the latest is 1.0.9).
```
$ npm install --save submerge@^1.0.9
```

### Usage
There are three ways of creating merged objects, all of which are based on the 'first come, first serve'-principle, the first key encountered will be on the merged object.
There is one exception, nested object, if a key holds an object and it can inherit one or more properties from another object, it will.

#### `submerge(object A, object B, ...)`
This creates a merged object which contains all keys/values encountered in all provided objects. The merged object is fully enumarable and mutable, but changes will only affect the merged object itself

#### `submerge.locked(object A, object B, ...)`
This creates a merged object which contains all keys/values encountered in all provided objects. The merged object is enumerable but will have `[Getter/Setter]` at all keys, any change to existing keys will not be honered. New keys, however, cannot (yet) be prevented.

#### `submerge.live(object A, object B, ...)`
This creates a merged object which contains all keys/values encountered in all provided objects. The merged object is enumerable but will have `[Getter/Setter]` at all keys, any change to existing keys will not only be honered but also persisted in the originating object.

### Events
When using the `submerge.live` method, you may want to know which variables are being changed, this can be done using the event mechanism (which is only available for `live` merges).

#### `change`
Live submerged objects have the `change` event, this was designed to work from the object returned by `submerge.live(...)`.
```js
var submerge = require('submerge'),
    live = submerge.live({a:'this is a'}, {b:'this is b'});

live.on('change', function(key, newValue, oldValue) {
	console.log('live changed key', key, 'new', newValue, 'was', oldValue);
});

live.a = 'still a, but different';

```
Do note that as the change handler was designed to be used on the object returned by `submerge.live` the key will actually use the object dot notation for nested keys, e.g. `live.my.object.value` will have the key `'my.object.value'` in the `change`-event.


## License
GPLv2 © [Konfirm ![Open](https://kon.fm/open.svg)](//kon.fm/site)
