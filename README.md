[![npm version](https://badge.fury.io/js/submerge.svg)](http://badge.fury.io/js/submerge)
[![Build Status](https://travis-ci.org/konfirm/node-submerge.svg?branch=master)](https://travis-ci.org/konfirm/node-submerge)
[![Coverage Status](https://coveralls.io/repos/konfirm/node-submerge/badge.svg?branch=master)](https://coveralls.io/r/konfirm/node-submerge?branch=master)
[![Codacy Badge](https://www.codacy.com/project/badge/f57067be710047c9baf8a74037cf247b)](https://www.codacy.com/app/rogier/node-submerge)

# node-submerge
Recursively merge various objects into a single new object, optionally capable of reflecting changes on the merged object

## Install
```
npm install --save submerge
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

## License
GPLv2 © [Konfirm](https://konfirm.eu)
