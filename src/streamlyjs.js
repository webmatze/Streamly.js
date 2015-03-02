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
        exports['streamlyjs'] = factory();
    }
    else {
        // Global
        root['streamlyjs'] = factory();
    }
}(this, function () {
    "use strict";

    var Streamly = {
      toString: function toString() {
        return "Streamly.js by Mathias Karstädt";
      }
    };

    Streamly.EventStream = function EventStream(initialValue) {
      this.isProperty = false;
      this.isActivated = false;
      this.value = initialValue;
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
      var filteredStream = new Streamly.EventStream();
      filteredStream.isProperty = this.isProperty;
      this.onValue(function(data) {
        if (filterCallback(data)) {
          filteredStream.emit(data);
        }
      });
      return filteredStream;
    };

    Streamly.EventStream.prototype.map = function map(mapCallback) {
      var mappedStream = new Streamly.EventStream();
      mappedStream.isProperty = this.isProperty;
      this.onValue(function(data) {
        mappedStream.emit(mapCallback(data));
      });
      return mappedStream;
    };

    Streamly.EventStream.prototype.merge = function merge(otherStream) {
      var mergedStream = new Streamly.EventStream();
      mergedStream.isProperty = this.isProperty || otherStream.isProperty;
      this.onValue(mergedStream.emit.bind(mergedStream));
      otherStream.onValue(mergedStream.emit.bind(mergedStream));
      return mergedStream;
    };

    Streamly.EventStream.prototype.toProperty = function toProperty(initialValue) {
      var propertyStream = new Streamly.EventStream(initialValue);
      propertyStream.isProperty = true;
      this.onValue(propertyStream.emit.bind(propertyStream));
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
      var scanStream = new Streamly.EventStream(inital);
      scanStream.isProperty = this.isProperty;
      this.onValue(function(value) {
        scanStream.emit(scanFunction(scanStream.value, value));
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
        Streamly.timed(0, function() {theStream.emit(value);});
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
