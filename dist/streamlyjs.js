/*!
streamlyjs.js - v0.0.0
Created by Mathias Karstädt on 2015-03-05.

git://github.com/webmatze/streamlyjs.git

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
*/

(function universalModuleDefinition(root, factory) {
    "use strict";

    if(typeof exports === 'object' && typeof module === 'object') {
        // Node module exports
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else if(typeof exports === 'object') {
        // CommonJS style that does not support module.exports
        exports['Streamly'] = factory();
    }
    else {
        // Global
        root['Streamly'] = factory();
    }
}(this, function () {
    "use strict";

    var jQuery = window.jQuery;

    var Streamly = {
      toString: function toString() {
        return "Streamly.js by Mathias Karstädt";
      }
    };

    Streamly.EventStream = function EventStream(initialValue) {
      this.isProperty = false;
      this.isActivated = false;
      this.value = initialValue || null;
      this.listeners = [];
      this.activation_listeners = [];
    };

    Streamly.EventStream.prototype.emit = function emit(data) {
      this.value = data;
      this.notifyListeners();
    };

    Streamly.EventStream.prototype.notifyListeners = function notifyListeners() {
      var _value = this.value;
      this.listeners.forEach(function(listener) {
        listener(_value);
      });
    };

    Streamly.EventStream.prototype.onValue = function onValue(callback) {
      this.listeners.push(callback);
      this.activate();
      if (this.isProperty) {
        callback(this.value);
      }
      return this;
    };

    Streamly.EventStream.prototype.onActivation = function onActivation(callback) {
      this.activation_listeners.push(callback);
      return this;
    };

    Streamly.EventStream.prototype.activate = function activate() {
      var _this = this;
      if (!this.isActivated) {
        this.activation_listeners.forEach(function(listener) {
          listener(_this);
        });
        this.isActivated = true;
      }
    };

    Streamly.EventStream.prototype.filter = function filter(filterCallback) {
      var _this = this;
      var filteredStream = new Streamly.EventStream();
      filteredStream.isProperty = this.isProperty;
      filteredStream.onActivation(function(theStream) {
        _this.onValue(function(data) {
          if (filterCallback(data)) {
            filteredStream.emit(data);
          }
        });
      });
      return filteredStream;
    };

    Streamly.EventStream.prototype.map = function map(mapCallback) {
      var _this = this;
      var mappedStream = new Streamly.EventStream();
      mappedStream.isProperty = this.isProperty;
      mappedStream.onActivation(function(theStream) {
        _this.onValue(function(data) {
          mappedStream.emit(mapCallback(data));
        });
      });
      return mappedStream;
    };

    Streamly.EventStream.prototype.merge = function merge(otherStream) {
      var _this = this;
      var mergedStream = new Streamly.EventStream();
      mergedStream.isProperty = this.isProperty || otherStream.isProperty;
      mergedStream.onActivation(function(theStream) {
        _this.onValue(mergedStream.emit.bind(mergedStream));
        otherStream.onValue(mergedStream.emit.bind(mergedStream));
      });
      return mergedStream;
    };

    Streamly.EventStream.prototype.toProperty = function toProperty(initialValue) {
      var _this = this;
      var propertyStream = new Streamly.EventStream(initialValue);
      propertyStream.isProperty = true;
      propertyStream.onActivation(function(theStream) {
        _this.onValue(propertyStream.emit.bind(propertyStream));
      });
      propertyStream.emit(initialValue);
      return propertyStream;
    };

    Streamly.EventStream.prototype.combine = function combine(stream, combineFunction) {
      var _this = this;
      var combinedStream = new Streamly.EventStream();
      combinedStream.isProperty = this.isProperty || stream.isProperty;
      this.onValue(function(value) {
        combinedStream.emit(combineFunction(stream.value, value));
      });
      stream.onValue(function(value) {
        combinedStream.emit(combineFunction(_this.value, value));
      });
      return combinedStream;
    };

    Streamly.EventStream.prototype.scan = function scan(inital, scanFunction) {
      var _this = this;
      var scanStream = new Streamly.EventStream(inital);
      scanStream.isProperty = this.isProperty;
      scanStream.onActivation(function(theStream) {
        _this.onValue(function(value) {
          scanStream.emit(scanFunction(scanStream.value, value));
        });
      });
      return scanStream;
    };

    Streamly.asEventStream = function asEventStream(element, eventName) {
      var stream = new Streamly.EventStream();
      stream.onActivation(function(theStream) {
        element.on(eventName, theStream.emit.bind(theStream));
      });
      return stream;
    };
    if (jQuery) {
      Streamly.$ = {};
      Streamly.$.asEventStream = function asEventStream(eventName) {
        return Streamly.asEventStream(this, eventName);
      };
      jQuery.fn.asEventStream = Streamly.$.asEventStream;
    }
    Streamly.timed = function timed(milliseconds, callback) {
      var callLater = function() {
        callback();
        clearTimeout(timeout);
      };
      var timeout = setTimeout(callLater, milliseconds);
    };

    Streamly.once = function once(value) {
      var stream = new Streamly.EventStream();
      stream.onActivation(function(theStream) {
        theStream.emit(value);
      });
      return stream;
    };

    Streamly.later = function later(milliseconds, value) {
      var stream = new Streamly.EventStream();
      stream.onActivation(function(theStream) {
        Streamly.timed(milliseconds, function() {theStream.emit(value);});
      });
      return stream;
    };

    return Streamly;
}));