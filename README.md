# Streamly.js

A very small functional reactive programming lib for JavaScript.

Turns your asynchronous callback-hell into declarative code heaven, by switching from imperative to functional. Instead of working with uncounted event callbacks you will work with precise and easy to follow event streams.

Here is all you need to get started:

- [Homepage](http://github.com/webmatze/Streamly.js)
- [JavaScript Source](https://github.com/webmatze/Streamly.js/blob/master/dist/streamlyjs.js)
- [Specs](https://github.com/webmatze/Streamly.js/blob/master/test/streamlyjs.spec.js)

## Examples

Here you can find multiple [examples](https://github.com/webmatze/Streamly.js/tree/master/examples)

## Build

Check out the Streamly.js repository and run `npm install`.

Then build the minified sources by running

	./grunt dist

The resulting JavaScript files will be generated in the `dist` directory.

## Test

Run all unit tests:

	./grunt test

## Dependencies

Runtime: jQuery (optional for jQuery bindings)
Build/test: node.js, npm, grunt

## Inspiration

This lib is inspired by the great functional reactive library [Bacon.js](https://github.com/baconjs/bacon.js) and [RxJS](https://github.com/Reactive-Extensions/RxJS).

## License

The MIT License (MIT)

Copyright (c) 2015 Mathias Karstädt

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
