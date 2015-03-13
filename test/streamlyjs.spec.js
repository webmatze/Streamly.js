describe("streamlyjs", function() {
    "use strict";

    var Streamly = window.Streamly;

    it("should create a Streamly.EventStream", function() {
      var stream = new Streamly.EventStream();
      expect(stream instanceof Streamly.EventStream).toBe(true);
    });

    describe("with stream", function() {
      var stream = null;
      beforeEach(function() {
        stream = new Streamly.EventStream();
      });
      it("should have no inital listener", function() {
        var listener = function(value) {};
        expect(stream.listeners.length).toBe(0);
      });
      it("should register listener", function() {
        var listener = function(value) {};
        stream.onValue(listener);
        expect(stream.listeners.length).toBe(1);
      });
      it("should not have a value", function() {
        expect(stream.value).toBeNull();
      });
      it("should not be activated", function() {
        expect(stream.isActivated).toBe(false);
      });

      describe('stream.plug', function() {
        it('should be able to plug other streams', function() {
          var other_stream = new Streamly.EventStream();
          stream.plug(other_stream);
          var values = [];
          stream.onValue(function(value) { values.push(value); });
          other_stream.emit(1);
          expect(values).toEqual([1]);
        });
      });

      describe('stream.flatMap', function() {
        it("should flattedn a stream of streams", function() {
          var flatStream = Streamly.once(1).flatMap(function(value) {
            return Streamly.once("Hello World");
          });
          var values = [];
          flatStream.onValue(function(value) {
            values.push(value);
          });
          expect(values).toEqual(["Hello World"]);
        });
      });

    });

    describe('Streamly.once', function() {
      it("should send single event", function() {
        var stream = Streamly.once(1);
        var values = [];
        stream.onValue(function(value){ values.push(value); });
        expect(values).toEqual([1]);
        stream.onValue(function(value){ values.push(value); });
        expect(values).toEqual([1]);
      });
    });

    describe('Streamly.combineWith', function() {
      it("should combine both streams to one using a callback function", function() {
        var stream_a = Streamly.once(1);
        var stream_b = Streamly.once(2);
        function add (a, b) { return a + b; }
        var combinedStream = Streamly.combineWith(add, stream_a, stream_b);
        var returnValue = null;
        combinedStream.onValue(function(value){ returnValue = value; });
        expect(returnValue).toEqual(3);
      });
    });
});
